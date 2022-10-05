import { Router } from "express";
import { createProduct } from "../controllers/productController.js";

const router = Router();

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
		res.status(400).send(
			"Bad request, weight must be a number or undefined"
		);
		return;
	}

	let product: any = {
		name,
		price,
		weight,
	};

	createProduct(product)
		.then(() => {
			res.sendStatus(201);
		})
		.catch((err: Error) => {
			if (err.message === "Duplicate product") {
				res.status(400).send("Bad request, duplicate product name");
			} else {
				res.sendStatus(500);
			}
		});
});

export default router;
