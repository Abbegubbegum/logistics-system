import {
	addDriverToOrder,
	addGrabberToOrder,
	createOrder,
	getAllOrders,
	getAllPackedOrders,
	getAllUnpackedOrders,
	getMostExpensiveOrder,
	getMostExpensiveOrderFromMonth,
	getOldestPackedOrder,
	getOldestUnpackedOrder,
	getOrderById,
	getSumOfOrderCostsFromMonth,
	getOrdersFromMonth,
	setOrderAsDelivered,
	setOrderAsPacked,
	getSumOfAllOrderCosts,
	getAllOrderDocs,
} from "../controllers/orderController.js";
import { Router, Request, Response, NextFunction } from "express";
import { getProductByName } from "../controllers/productController.js";
import { isValidObjectId } from "mongoose";
import {
	getDriverIDByName,
	getGrabberIDByName,
} from "../controllers/employeeController.js";

const router = Router();

router.get("/", (req, res) => {
	if (typeof req.query.month === "string") {
		let month = parseInt(req.query.month);

		if (month > 0 && month <= 12) {
			if (req.query.sum !== undefined) {
				getSumOfOrderCostsFromMonth(month)
					.then((cost) => {
						res.status(200).json({ cost });
						return;
					})
					.catch((err) => {
						res.sendStatus(500);
						return;
					});
			} else {
				getOrdersFromMonth(month)
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
			if (req.query.sum !== undefined) {
				getSumOfAllOrderCosts()
					.then((cost) => {
						res.status(200).json({ cost });
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
		}
	} else {
		if (req.query.sum !== undefined) {
			getSumOfAllOrderCosts()
				.then((cost) => {
					res.status(200).json({ cost });
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
				.send(`Bad request at index ${index}, name must be a string`);
		}

		if (typeof product.quantity !== "number") {
			error = true;
			return res
				.status(400)
				.send(
					`Bad request at index ${index}, quantity must be a number`
				);
		}
	});

	if (error) return;

	let products: any[] = [];

	let cost = 0;

	for (let i = 0; i < productsWithNames.length; i++) {
		let product = productsWithNames[i];
		await getProductByName(product.name)
			.then((productDoc) => {
				products.push({
					product: productDoc._id,
					quantity: product.quantity,
				});

				cost += productDoc.price * product.quantity;
			})
			.catch((err: Error) => {
				if (err.message === "Product not found") {
					error = true;
					res.status(404).send(
						`Bad request at index ${i}, couldn't find product`
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
		cost,
	};

	createOrder(order)
		.then((newDoc) => {
			return res.status(201).json(newDoc);
		})
		.catch((err) => {
			return res.sendStatus(500);
		});
});

router.get("/list", (req, res) => {
	getAllOrderDocs()
		.then((orders) => {
			let orderList: any[] = [];

			orders.forEach((order) => {
				let status = "UNDEFINED";

				if (order.delivered_at) {
					status = "DELIVERED";
				} else if (order.driver) {
					status = "SHIPPED";
				} else if (order.packed_at) {
					status = "AWAITING_SHIPMENT";
				} else if (order.grabber) {
					status = "PACKING";
				} else if (order.created_at) {
					status = "AWAITING_FULFILLMENT";
				}
				orderList.push({ id: order._id, status });
			});

			res.status(200).json(orderList);
			return;
		})
		.catch((err) => {
			res.sendStatus(500);
			return;
		});
});

router.get("/mostexpensive", (req, res) => {
	if (typeof req.query.month === "string") {
		let month = parseInt(req.query.month);

		if (month > 0 && month <= 12) {
			getMostExpensiveOrderFromMonth(month)
				.then((order) => {
					res.status(200).json(order);
					return;
				})
				.catch((err) => {
					res.sendStatus(500);
					return;
				});
		} else {
			getMostExpensiveOrder()
				.then((order) => {
					res.status(200).json(order);
					return;
				})
				.catch((err) => {
					res.sendStatus(500);
					return;
				});
		}
	} else {
		getMostExpensiveOrder()
			.then((order) => {
				res.status(200).json(order);
				return;
			})
			.catch((err) => {
				res.sendStatus(500);
				return;
			});
	}
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

router.put("/:orderID/grabber", orderIDParsing, async (req, res) => {
	let orderID = req.params.orderID;
	let grabberName = req.body.name;
	let order = (req as any).order;

	if (typeof grabberName !== "string") {
		return res.status(400).send("Bad Request, name must be a string");
	}

	let error = false;

	if (order.grabber) {
		return res.status(400).send("Order already has a grabber assigned");
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
				return res.status(400).send("Employee is not a grabber");
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
		return res.status(400).send("Order doesn't have a grabber assigned");
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
		return res.status(400).send("Order already has a driver assigned");
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
		return res.status(400).send("Order doesn't have a driver assigned");
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
