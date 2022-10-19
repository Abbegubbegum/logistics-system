import {
	addDriverToOrder,
	addGrabberToOrder,
	createOrder,
	getAllOrders,
	getAllPackedOrders,
	getAllUnpackedOrders,
	getOldestPackedOrder,
	getOldestUnpackedOrder,
	getOrderById,
	getOrderPriceByID,
	getOrdersFromMonth,
	setOrderAsDelivered,
	setOrderAsPacked,
} from "../controllers/orderController.js";
import { Router, Request, Response, NextFunction } from "express";
import { getProductIDByName } from "../controllers/productController.js";
import { isValidObjectId, Types } from "mongoose";
import {
	getDriverIDByName,
	getGrabberIDByName,
} from "../controllers/employeeController.js";
import { request } from "http";

const router = Router();

router.get("/", (req, res) => {
	if (typeof req.query.month === "string") {
		let month = parseInt(req.query.month);

		if (month > 0 && month <= 12) {
			getOrdersFromMonth(month)
				.then((orders) => {
					res.status(200).json(orders);
					return;
				})
				.catch((err) => {
					res.sendStatus(500);
					return;
				});
		} else {
			getAllOrders()
				.then((orders) => {
					res.status(200).json(orders);
					return;
				})
				.catch((err) => {
					res.sendStatus(500);
					return;
				});
		}
	} else {
		getAllOrders()
			.then((orders) => {
				res.status(200).json(orders);
				return;
			})
			.catch((err) => {
				res.sendStatus(500);
				return;
			});
	}
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
					res.status(404).send(
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

router.get("/unpacked", (req, res) => {
	getAllUnpackedOrders()
		.then((orders) => {
			res.status(200).json(orders);
			return;
		})
		.catch((err) => {
			res.sendStatus(500);
			return;
		});
});

router.get("/unpacked/oldest", (req, res) => {
	getOldestUnpackedOrder()
		.then((order) => {
			res.status(200).json(order);
			return;
		})
		.catch((err) => {
			res.sendStatus(500);
			return;
		});
});

router.get("/packed", (req, res) => {
	getAllPackedOrders()
		.then((orders) => {
			res.status(200).json(orders);
			return;
		})
		.catch((err) => {
			res.sendStatus(500);
			return;
		});
});

router.get("/packed/oldest", (req, res) => {
	getOldestPackedOrder()
		.then((order) => {
			res.status(200).json(order);
			return;
		})
		.catch((err) => {
			res.sendStatus(500);
			return;
		});
});

router.get("/:orderID/price", (req, res) => {
	let orderID = req.params.orderID;

	if (!isValidObjectId(orderID)) {
		return res.status(400).send("Bad Request, invalid order ID");
	}

	getOrderPriceByID(orderID)
		.then((price) => {
			res.status(200).json({ price });
		})
		.catch((err) => {
			res.sendStatus(500);
		});
});

router.put("/:orderID/grabber", orderIDParsing, async (req, res) => {
	let orderID = req.params.orderID;
	let grabberName = req.body.name;
	let order = (req as any).order;

	if (typeof grabberName !== "string") {
		return res.status(400).send("Bad Request, invalid name");
	}

	let error = false;

	if (order.grabber) {
		return res.status(400).send("Order already has a grabber asigned");
	}

	if (order.packed_at) {
		return res.status(400).send("Order is already packed");
	}

	let grabberID;

	try {
		grabberID = await getGrabberIDByName(grabberName);
	} catch (err) {
		error = true;
		if (err instanceof Error) {
			if (err.message === "Employee not found") {
				return res.status(404).send("Employee not found");
			} else {
				return res.status(400).send("Employee not a grabber");
			}
		} else {
			return res.sendStatus(500);
		}
	}

	if (error) return;

	addGrabberToOrder(orderID, grabberID)
		.then(() => {
			return res.sendStatus(200);
		})
		.catch((err: Error) => {
			if (err.message === "Order not found") {
				return res.status(404).send("Order not found");
			} else {
				return res.sendStatus(500);
			}
		});
});

router.put("/:orderID/packed", orderIDParsing, async (req, res) => {
	let orderID = req.params.orderID;
	let order = (req as any).order;

	if (!order.grabber) {
		return res.status(400).send("Order doesn't have a grabber asigned");
	}

	if (order.packed_at) {
		return res.status(400).send("Order is already packed");
	}

	setOrderAsPacked(orderID)
		.then(() => {
			return res.sendStatus(200);
		})
		.catch((err: Error) => {
			if (err.message === "Order not found") {
				return res.status(404).send("Order not found");
			} else {
				return res.sendStatus(500);
			}
		});
});

router.put("/:orderID/driver", orderIDParsing, async (req, res) => {
	let orderID = req.params.orderID;
	let driverName = req.body.name;
	let order = (req as any).order;

	if (typeof driverName !== "string") {
		return res.status(400).send("Bad Request, invalid name");
	}

	let error = false;

	if (order.driver) {
		return res.status(400).send("Order already has a driver asigned");
	}

	if (order.delivered_at) {
		return res.status(400).send("Order is already delivered");
	}

	let driverID;

	try {
		driverID = await getDriverIDByName(driverName);
	} catch (err) {
		error = true;
		if (err instanceof Error) {
			if (err.message === "Employee not found") {
				return res.status(404).send("Employee not found");
			} else {
				return res.status(400).send("Employee is not a driver");
			}
		} else {
			return res.sendStatus(500);
		}
	}

	if (error) return;

	addDriverToOrder(orderID, driverID)
		.then(() => {
			return res.sendStatus(200);
		})
		.catch((err: Error) => {
			if (err.message === "Order not found") {
				return res.status(404).send("Order not found");
			} else {
				return res.sendStatus(500);
			}
		});
});

router.put("/:orderID/delivered", orderIDParsing, async (req, res) => {
	let orderID = req.params.orderID;
	let order = (req as any).order;

	if (!order.driver) {
		return res.status(400).send("Order doesn't have a driver asigned");
	}

	if (order.delivered_at) {
		return res.status(400).send("Order is already delivered");
	}

	setOrderAsDelivered(orderID)
		.then(() => {
			return res.sendStatus(200);
		})
		.catch((err: Error) => {
			if (err.message === "Order not found") {
				return res.status(404).send("Order not found");
			} else {
				return res.sendStatus(500);
			}
		});
});

async function orderIDParsing(req: Request, res: Response, next: NextFunction) {
	let orderID = req.params.orderID;

	if (!isValidObjectId(orderID)) {
		return res.status(400).send("Bad Request, invalid order ID");
	}

	let error = false;

	let order;

	try {
		order = await getOrderById(orderID);
	} catch (err) {
		error = true;
		if (err instanceof Error) {
			return res.status(404).send("Order not found");
		} else {
			return res.sendStatus(500);
		}
	}

	if (error) return;

	(req as any).order = order;

	next();
}

export default router;
