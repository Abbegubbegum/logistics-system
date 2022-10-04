import { IEmployee } from "../models/employee.js";
import { IWarehouse } from "../models/warehouse.js";

export function isEmployee(obj: any): obj is IEmployee {
	return typeof obj.name === "string" && typeof obj.warehouseID === "object";
}

export function isWarehouse(obj: any): obj is IWarehouse {
	return typeof obj.name === "string";
}
