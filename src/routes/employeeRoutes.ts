import {
	createEmployee,
	deleteEmployeeByName,
	getAllEmployees,
	getEmployeeByName,
} from "../controllers/employeeController.js";
import { Router } from "express";
import { IEmployee } from "../models/Employee";
import { isEmployee } from "../utils/typeChecker.js";

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
				console.log(err);
				res.sendStatus(500);
				return;
			}
		});
});

router.post("/", (req, res) => {
	let employee = req.body as IEmployee;

	if (!isEmployee(employee)) {
		res.status(400).send("Bad Request");
		return;
	}

	createEmployee(employee)
		.then(() => {
			res.sendStatus(201);
			return;
		})
		.catch((err) => {
			res.sendStatus(500);
			return;
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
				console.log(err);
				res.sendStatus(500);
			}
		});
});

export default router;
