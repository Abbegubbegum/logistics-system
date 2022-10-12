import {
	createEmployee,
	deleteAllEmployees,
	deleteEmployeeByName,
	getAllEmployees,
	getEmployeeByName,
} from "../controllers/employeeController.js";
import { Router } from "express";
import { getWarehouseIdByName } from "../controllers/warehouseController.js";
import { getRoleIDByTitle } from "../controllers/roleController.js";

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
