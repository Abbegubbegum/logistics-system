import { Router } from "express";
import { getAllOrders } from "../controllers/orderController.js";
import { getProductIDByName } from "../controllers/productController.js";

const router = Router();

router.get("/", (req, res) => {
	getAllOrders()
		.then((orders) => {
			res.status(200).json(orders);
			return;
		})
		.catch((err) => {
			res.sendStatus(500);
			return;
		});
});

router.post("/", (req, res) => {
	let productsWithNames: Array<any> = req.body.products;

	if (typeof productsWithNames !== "object") {
		return res
			.status(400)
			.send("Bad request, Order Products must be an array");
	}

	if (productsWithNames.length === 0) {
		return res
			.status(400)
			.send("Bad request, Order needs at least one product");
	}
	let error = false;
	productsWithNames.forEach((product, index) => {
		if (typeof product !== "object") {
			error = true;
			return res
				.status(400)
				.send(
					`Bad request at index ${index}, Product must be an object`
				);
		}

		if (typeof product.name !== "string") {
			error = true;
			return res
				.status(400)
				.send(
					`Bad request at Product index ${index}, name must be a string`
				);
		}

		if (typeof product.quantity !== "number") {
			error = true;
			return res
				.status(400)
				.send(
					`Bad request at Product index ${index}, quantity must be a number`
				);
		}
	});

	if (error) return;

	let products = [];

	productsWithNames.forEach((product, index) => {
		let newProduct: any = {
			quantity: product.quantity,
		};
		getProductIDByName(product.name)
			.then((productID) => {
				newProduct.productID = productID;
			})
			.catch((err: Error) => {
				if (err.message === "Product not found") {
					error = true;
					return res
						.status(400)
						.send(`Bad request at ${index}, couldn't find product`);
				} else {
					error = true;
					return res.sendStatus(500);
				}
			});
		products.push(newProduct);
	});

	if (error) return;
});

export default router;
