import { createEmployee } from '../controllers/employeeController.js';
import { Router } from "express";

const employeeRoutes = Router();

employeeRoutes.post("/", createEmployee);

export { employeeRoutes };