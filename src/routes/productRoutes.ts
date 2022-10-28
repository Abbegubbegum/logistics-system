import { Router } from "express";
import { createProduct } from "../controllers/productController.js";
import { getWarehousesWithProduct } from "../controllers/warehouseController.js";

const router = Router();

router.get("/:product/stock", async (req, res) => {
	let productName = req.params.product;

	getWarehousesWithProduct(productName)
		.then((warehouses) => {
			res.status(200).json(warehouses);
		})
		.catch((err) => {
			res.sendStatus(500);
		});
});

router.post("/", (req, res) => {
	let name: string = req.body.name;
	let price: number | undefined = req.body.price;
	let weight: number | undefined = req.body.weight;

	if (typeof name !== "string") {
		res.status(400).send("Bad request, name must be a string");
		return;
	}

	if (typeof price !== "number" && price !== undefined) {
		res.status(400).send(
			"Bad request, price must be a number or undefined"
		);
		return;
	}

	if (typeof weight !== "number" && weight !== undefined) {
		return res
			.status(400)
			.send("Bad request, weight must be a number or undefined");
	}

	let product: any = {
		name,
		price,
		weight,
	};

	createProduct(product)
		.then((newDoc) => {
			res.status(201).json(newDoc);
		})
		.catch((err: Error) => {
			if (err.message === "Duplicate product") {
				res.status(400).send("Product with name already exists");
			} else {
				res.sendStatus(500);
			}
		});
});

export default router;
