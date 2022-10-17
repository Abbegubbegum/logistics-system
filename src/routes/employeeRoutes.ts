import {
	createEmployee,
	deleteAllEmployees,
	deleteEmployeeByName,
	getAllEmployees,
	getEmployeeByName,
	getEmployeeDocByName,
} from "../controllers/employeeController.js";
import { Router } from "express";
import { getWarehouseIdByName } from "../controllers/warehouseController.js";
import { getRoleIDByTitle } from "../controllers/roleController.js";
import { request } from "http";
import { HydratedDocument } from "mongoose";
import { IEmployee } from "../models/employee.js";

const router = Router();

router.get("/", (req, res) => {
	getAllEmployees()
		.then((employees) => {
			res.status(200).json(employees);
			return;
		})
		.catch((err) => {
			res.sendStatus(500);
			return;
		});
});

router.get("/:name", (req, res) => {
	let name = req.params.name;

	getEmployeeByName(name)
		.then((employee) => {
			res.status(200).json(employee);
			return;
		})
		.catch((err: Error) => {
			if (err.message === "Employee not found") {
				res.status(404).send("Employee not found");
			} else {
				res.sendStatus(500);
				return;
			}
		});
});

router.post("/", async (req, res) => {
	let name = req.body.name;
	let warehouseName = req.body.warehouse;
	let roleTitle = req.body.role;

	if (typeof name !== "string") {
		res.status(400).send("Bad request, Name must be a string");
		return;
	}
	if (typeof warehouseName !== "string") {
		res.status(400).send("Bad request, Warehouse must be a string");
		return;
	}
	if (typeof roleTitle !== "string") {
		res.status(400).send("Bad request, Role must be a string");
		return;
	}

	let error;

	let warehouse;

	try {
		warehouse = await getWarehouseIdByName(warehouseName);
	} catch (err) {
		error = true;
		if (err instanceof Error) {
			res.status(404).send("Warehouse not found");
			return;
		}
		res.sendStatus(500);
		return;
	}

	if (error) return;

	let role;

	try {
		role = await getRoleIDByTitle(roleTitle);
	} catch (err) {
		error = true;
		if (err instanceof Error) {
			res.status(404).send("Warehouse not found");
			return;
		}
		res.sendStatus(500);
		return;
	}

	if (error) return;

	let newEmployee: any = {
		name,
		warehouse,
		role,
	};

	createEmployee(newEmployee)
		.then(() => {
			res.sendStatus(201);
			return;
		})
		.catch((err) => {
			if (err.message === "Duplicate employee") {
				res.status(400).send("Employee with name already exists");
			}
			res.sendStatus(500);
			return;
		});
});

router.post("/:name/schedule", async (req, res) => {
	let schedule = {
		mon: req.body.mon,
		tue: req.body.tue,
		wed: req.body.wed,
		thu: req.body.thu,
		fri: req.body.fri,
		sat: req.body.sat,
		sun: req.body.sun,
	};

	let name = req.params.name;

	let employee: HydratedDocument<IEmployee>;

	let error;

	try {
		employee = await getEmployeeDocByName(name);
	} catch (err) {
		error = true;
		if (err instanceof Error) {
			res.status(404).send("Employee not found");
			return;
		} else {
			res.sendStatus(500);
			return;
		}
	}

	if (error) return;

	let parsedSchedule = parseScheduleEntries(Object.entries(schedule));

	console.log(parsedSchedule);
});

function parseScheduleEntries(entries: [string, any][]) {
	let parsed = [];

	for (let i = 0; i < entries.length; i++) {
		const value = entries[i][1];

		if (value === undefined) {
			continue;
		}

		if (typeof value.start !== "string" || typeof value.end !== "string") {
			continue;
		}

		let regex = /([0-2][0-9]):([03]0)/;

		let startMatch = value.start.match(regex);
		let endMatch = value.end.match(regex);

		if (!startMatch || !endMatch) {
			continue;
		}

		let startHour = parseInt(startMatch[1]);
		let startMinute = parseInt(startMatch[2]);

		let endHour = parseInt(endMatch[1]);
		let endMinute = parseInt(endMatch[2]);

		if (
			startHour < 24 &&
			startMinute < 60 &&
			endHour < 24 &&
			endMinute < 60
		) {
			parsed.push({
				key: entries[i][0],
				startHour,
				startMinute,
				endHour,
				endMinute,
			});
		}
	}

	return parsed;
}

router.delete("/", (req, res) => {
	deleteAllEmployees()
		.then((count) => {
			res.status(200).send(`Successfully deleted ${count} employees`);
		})
		.catch((err) => {
			res.sendStatus(500);
		});
});

router.delete("/:name", (req, res) => {
	let name = req.params.name;

	deleteEmployeeByName(name)
		.then(() => {
			res.sendStatus(200);
		})
		.catch((err: Error) => {
			if (err.message === "Employee not found") {
				res.status(404).send("Employee not found");
			} else {
				res.sendStatus(500);
			}
		});
});

export default router;
