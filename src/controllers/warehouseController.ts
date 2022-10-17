import { Types } from "mongoose";
import { IProduct } from "../models/product.js";
import warehouse from "../models/warehouse.js";
import warehouseModel, {
	IWarehouse,
	IWarehouseProduct,
} from "../models/warehouse.js";

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
			.findOneByName(name)
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
			.findOneByName(name)
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

export function getWarehousesWithProduct(productName: string) {
	return new Promise<IWarehouse[]>((resolve, reject) => {
		warehouseModel
			.find()
			.populate("products.product")
			.then((warehouses) => {
				warehouses = warehouses.filter((warehouse) => {
					warehouse.products = warehouse.products.filter(
						(product) =>
							(product.product as IProduct).name.match(
								productName
							) !== null
					) as any;
					return warehouse.products.length > 0;
				});
				
				resolve(warehouses);
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
				if (err.code === 11000) {
					reject(new Error("Duplicate warehouse"));
				} else {
					reject();
				}
			});
	});
}

export function addProductToWarehouse(
	warehouseName: string,
	product: IWarehouseProduct
) {
	return new Promise<void>((resolve, reject) => {
		warehouseModel
			.findOneByName(warehouseName)
			.then(async (warehouse) => {
				if (warehouse) {
					warehouse.products.push(product);
					try {
						await warehouse.save();
						resolve();
					} catch (err) {
						console.log(err);
						reject();
					}
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
