import {
	createEmployee,
	deleteAllEmployees,
	deleteEmployeeByName,
	getAllEmployees,
	getEmployeeByName,
} from "../controllers/employeeController.js";
import { Router } from "express";
import { isEmployee } from "../utils/typeChecker.js";
import {
	getWarehouseIdByName,
} from "../controllers/warehouseController.js";

const router = Router();

router.all("/:name", (req, res, next) => {
	let name = req.params.name;

	if (typeof name !== "string") {
		res.status(400).send("Bad Request, Parameter name must be a string");
		return;
	}

	next();
});

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

	if (typeof name !== "string") {
		res.status(400).send("Bad request, Name must be a string");
		return;
	}
	if (typeof warehouseName !== "string") {
		res.status(400).send("Bad request, Warehouse must be a string");
		return;
	}

	let warehouseID = await getWarehouseIdByName(warehouseName).catch((err) => {
		res.status(404).send("Warehouse not found");
		return;
	});

	let newEmployee = {
		name,
		warehouseID,
	};

	if (!isEmployee(newEmployee)) {
		res.status(400).send("Bad Request");
		return;
	}

	createEmployee(newEmployee)
		.then(() => {
			res.sendStatus(201);
			return;
		})
		.catch((err) => {
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
