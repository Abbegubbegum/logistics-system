import { Router } from "express";
import {
	addProductToWarehouse,
	createWarehouse,
	getAllWarehouses,
	getWarehouseByName,
} from "../controllers/warehouseController.js";
import { Types } from "mongoose";
import { getProductIDByName } from "../controllers/productController.js";
import { request } from "http";
import { IWarehouse } from "../models/warehouse.js";

const router = Router();

router.get("/", (req, res) => {
	getAllWarehouses()
		.then((warehouses) => {
			res.status(200).json(warehouses);
			return;
		})
		.catch((err) => {
			res.sendStatus(500);
			return;
		});
});

router.post("/", (req, res) => {
	let name = req.body.name;

	if (typeof name !== "string") {
		res.status(400).send("Bad request, name must be a string");
		return;
	}

	let warehouse: any = {
		name: name,
		products: [],
	};

	createWarehouse(warehouse)
		.then(() => {
			res.sendStatus(201);
		})
		.catch((err) => {
			res.sendStatus(500);
		});
});

router.post("/:warehouse/products", async (req, res) => {
	let warehouseName = req.params.warehouse;
	let productName = req.body.product;
	let quantity = req.body.quantity;
	let shelfID = req.body.shelfID;

	if (typeof productName !== "string") {
		res.status(400).send("Bad request, Product must be a string");
		return;
	}

	if (typeof quantity !== "number") {
		res.status(400).send("Bad request, Quantity must be a number");
		return;
	}

	if (typeof shelfID !== "string") {
		res.status(400).send("Bad request, ShelfID must be a string");
		return;
	}

	let productID;

	try {
		productID = await getProductIDByName(productName);
	} catch (err) {
		if (err instanceof Error) {
			res.status(404).send("Product not found");
		} else {
			res.sendStatus(500);
		}
		return;
	}

	let product: any = {
		productID,
		quantity,
		shelfID,
	};

	addProductToWarehouse(warehouseName, product)
		.then(() => {
			res.sendStatus(201);
		})
		.catch((err: Error) => {
			if (err.message === "Warehouse not found") {
				res.status(404).send("Warehouse not found");
			} else if (err.message === "Duplicate product") {
				res.status(400).send("Bad request, duplicate product name");
			} else { 
				res.sendStatus(500);
			}
		});
});

export default router;
