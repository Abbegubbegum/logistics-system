import { IEmployee } from "../models/employee.js";
import { IWarehouse, IWarehouseProduct } from "../models/warehouse.js";

export function isEmployee(obj: any): obj is IEmployee {
	return typeof obj.name === "string" && typeof obj.warehouseID === "object";
}

export function isWarehouse(obj: any): obj is IWarehouse {
	obj.products.forEach((element: any) => {
		if (!isWarehouseProduct(element)) {
			return false;
		}
	});
	return typeof obj.name === "string" && typeof obj.products === "object";
}

export function isWarehouseProduct(obj: any): obj is IWarehouseProduct {
	return (
		typeof obj.productID === "object" &&
		typeof obj.quantity === "number" &&
		typeof obj.shelfID === "string"
	);
}
