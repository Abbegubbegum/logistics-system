import { Router } from "express";
import {
	createWarehouse,
	getAllWarehouses,
	getWarehouseByName,
} from "../controllers/warehouseController.js";
import { isWarehouse, isWarehouseProduct } from "../utils/typeChecker.js";
import { Types } from "mongoose";

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
	let warehouse = {
		name: name,
		products: [],
	};

	if (!isWarehouse(warehouse)) {
		res.status(400).send("Bad request");
		return;
	}

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

	// Getproductidfromname(productName)

	let productID = new Types.ObjectId(3221123);

	let product = {
		productID,
		quantity,
		shelfID,
	};

	if (!isWarehouseProduct(product)) {
		res.sendStatus(400);
	}

	getWarehouseByName(warehouseName)
		.then((warehouse) => {
			warehouse.products.push(product);
		})
		.catch((err: Error) => {
			if (err.message === "Warehouse not found") {
				res.status(404).send("Warehouse not found");
				return;
			} else {
				res.sendStatus(500);
				return;
			}
		});
});

export default router;
