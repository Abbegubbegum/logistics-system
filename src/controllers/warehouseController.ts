import { Types } from "mongoose";
import warehouseModel, { IWarehouse } from "../models/warehouse.js";

export function getAllWarehouses() {
	return new Promise<IWarehouse[]>((resolve, reject) => {
		warehouseModel
			.find()
			.then((warehouses) => {
				resolve(warehouses);
			})
			.catch((err) => {
				console.log(err);
				reject();
			});
	});
}

export function getWarehouseIdByName(name: string) {
	return new Promise<Types.ObjectId>((resolve, reject) => {
		warehouseModel
			.findOne({ name: name })
			.then((warehouse) => {
				if (warehouse) {
					resolve(warehouse._id);
				} else {
					reject(new Error("Warehouse not found"));
				}
			})
			.catch((err) => {
				console.log(err);
				reject();
			});
	});
}

export function getWarehouseByName(name: string) {
	return new Promise<IWarehouse>((resolve, reject) => {
		warehouseModel
			.findOne({ name: name })
			.then((warehouse) => {
				if (warehouse) {
					resolve(warehouse);
				} else {
					reject(new Error("Warehouse not found"));
				}
			})
			.catch((err) => {
				console.log(err);
				reject();
			});
	});
}

export function createWarehouse(warehouse: IWarehouse) {
	return new Promise<void>((resolve, reject) => {
		warehouseModel
			.create(warehouse)
			.then(() => {
				resolve();
			})
			.catch((err) => {
				console.log(err);
				reject();
			});
	});
}
