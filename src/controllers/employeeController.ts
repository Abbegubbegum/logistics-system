import employee from "../schemas/employeeSchema.js";
import { Request, Response } from "express";

export async function createEmployee(req: Request, res: Response) {
	employee.create(req.body);
	res.status(200).send("Good");
}
