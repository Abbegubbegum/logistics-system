import { createOrder, getAllOrders } from "../controllers/orderController.js";
import { Router } from "express";
import { getProductIDByName } from "../controllers/productController.js";
import { isValidObjectId, Types } from "mongoose";
import { getGrabberIDByName } from "../controllers/employeeController.js";

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

router.post("/", async (req, res) => {
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

	let products: any[] = [];

	for (let i = 0; i < productsWithNames.length; i++) {
		let product = productsWithNames[i];
		await getProductIDByName(product.name)
			.then((productID) => {
				products.push({
					product: productID,
					quantity: product.quantity,
				});
			})
			.catch((err: Error) => {
				if (err.message === "Product not found") {
					error = true;
					res.status(400).send(
						`Bad request at ${i}, couldn't find product`
					);
					return;
				} else {
					error = true;
					res.sendStatus(500);
					return;
				}
			});
	}

	if (error) return;

	let order: any = {
		products,
	};

	createOrder(order)
		.then(() => {
			return res.sendStatus(201);
		})
		.catch((err) => {
			return res.sendStatus(500);
		});
});

router.put("/:orderID/grabber", async (req, res) => {
	let orderIDString = req.params.orderID;
	let grabberName = req.body.name;

	if (!isValidObjectId(orderIDString)) {
		return res.status(400).send("Bad Request, invalid order ID");
	}

	if (typeof grabberName !== "string") {
		return res.status(400).send("Bad Request, invalid name");
	}

	let orderID = new Types.ObjectId(orderIDString);

	let error = false;

	let grabber;
	try {
		grabber = await getGrabberIDByName(grabberName);
	} catch (err) {
		if (err instanceof Error) {
			if (err.message === "Employee not found") {
				error = true;
				return res.status(400).send("Bad Request, Employee not found");
			} else {
				error = true;
				return res
					.status(400)
					.send("Bad Request, Employee not a grabber");
			}
		} else {
			error = true;
			return res.sendStatus(500);
		}
	}

	if (error) return;
});

router.put("/:orderID/packed", (req, res) => {
	let orderIDString = req.params.orderID;
	let grabberName = req.body.name;

	if (!isValidObjectId(orderIDString)) {
		return res.status(400).send("Bad Request, invalid order ID");
	}

	if (typeof grabberName !== "string") {
		return res.status(400).send("Bad Request, invalid grabber ID");
	}

	let orderID = new Types.ObjectId(orderIDString);
});

export default router;
