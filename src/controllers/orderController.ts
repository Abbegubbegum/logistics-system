import { HydratedDocument, Types } from "mongoose";
import orderModel, { IOrder } from "../models/order.js";

export function getAllOrders() {
	return new Promise<IOrder[]>((resolve, reject) => {
		orderModel
			.find()
			.then((orders) => {
				resolve(orders);
			})
			.catch((err) => {
				console.log(err);
				reject();
			});
	});
}

export function getAllUnpackedOrders() {
	return new Promise<IOrder[]>((resolve, reject) => {
		orderModel
			.find({
				grabber: { $exists: false },
				packed_at: { $exists: false },
			})
			.populate("products.product")
			.then((orders) => {
				resolve(orders);
			})
			.catch((err) => {
				console.log(err);
				reject();
			});
	});
}

export function getOldestUnpackedOrder() {
	return new Promise<IOrder>((resolve, reject) => {
		orderModel
			.find({
				grabber: { $exists: false },
				packed_at: { $exists: false },
			})
			.sort({ created_at: "asc" })
			.limit(1)
			.populate("products.product")
			.then((orders) => {
				resolve(orders[0]);
			})
			.catch((err) => {
				console.log(err);
				reject();
			});
	});
}

export function getAllPackedOrders() {
	return new Promise<IOrder[]>((resolve, reject) => {
		orderModel
			.find({ packed_at: { $exists: true }, driver: { $exists: false } })
			.populate("products.product")
			.populate({
				path: "grabber",
				populate: { path: "warehouse", select: "name" },
			})
			.then((orders) => {
				resolve(orders);
			})
			.catch((err) => {
				console.log(err);
				reject();
			});
	});
}

export function getOldestPackedOrder() {
	return new Promise<IOrder>((resolve, reject) => {
		orderModel
			.find({ packed_at: { $exists: true }, driver: { $exists: false } })
			.sort({ created_at: "asc" })
			.limit(1)
			.populate("products.product")
			.populate({
				path: "grabber",
				populate: { path: "warehouse", select: "name" },
			})
			.then((orders) => {
				resolve(orders[0]);
			})
			.catch((err) => {
				console.log(err);
				reject();
			});
	});
}

export function getOrderById(id: string) {
	return new Promise<IOrder>((resolve, reject) => {
		orderModel
			.findById(id)
			.then((order) => {
				if (order) {
					resolve(order);
				} else {
					reject(new Error("Order not found"));
				}
			})
			.catch((err) => {
				console.log(err);
				reject();
			});
	});
}

export function getOrderPriceByID(id: string) {
	return new Promise<number>((resolve, reject) => {
		orderModel
			.findById(id, { products: 1 })
			.populate("products.product")
			.then((order) => {
				if (order) {
					let price = 0;

					order.products.forEach((product) => {
						price +=
							(product.product as any).price * product.quantity;
					});
					resolve(price);
				} else {
					reject(new Error("Order not found"));
				}
			})
			.catch((err) => {
				console.log(err);
				reject();
			});
	});
}

export function getOrdersFromMonth(month: number) {
	return new Promise<IOrder[]>((resolve, reject) => {
		var firstDay = new Date(new Date().getFullYear(), month - 1, 1);
		var lastDay = new Date(new Date().getFullYear(), month, 1);

		console.log(firstDay);
		console.log(lastDay);

		orderModel
			.find({ created_at: { $gte: firstDay, $lte: lastDay } })
			.then((orders) => {
				resolve(orders);
			})
			.catch((err) => {
				console.log(err);
				reject();
			});
	});
}

export function addGrabberToOrder(id: string, grabberID: Types.ObjectId) {
	return new Promise<void>((resolve, reject) => {
		orderModel
			.findById(id)
			.then(async (order) => {
				if (!order) {
					reject(new Error("Order not found"));
					return;
				}

				order.grabber = grabberID as any;

				try {
					await order.save();
					resolve();
				} catch (err) {
					console.log(err);
					reject();
				}
			})
			.catch((err) => {
				console.log(err);
				reject();
			});
	});
}

export function addDriverToOrder(id: string, driverID: Types.ObjectId) {
	return new Promise<void>((resolve, reject) => {
		orderModel
			.findById(id)
			.then(async (order) => {
				if (!order) {
					reject(new Error("Order not found"));
					return;
				}

				order.driver = driverID as any;

				try {
					await order.save();
					resolve();
				} catch (err) {
					console.log(err);
					reject();
				}
			})
			.catch((err) => {
				console.log(err);
				reject();
			});
	});
}

export function setOrderAsPacked(id: string) {
	return new Promise<void>((resolve, reject) => {
		orderModel
			.findById(id)
			.then(async (order) => {
				if (!order) {
					reject(new Error("Order not found"));
					return;
				}

				order.packed_at = new Date(Date.now());

				try {
					await order.save();
					resolve();
				} catch (err) {
					console.log(err);
					reject();
				}
			})
			.catch((err) => {
				console.log(err);
				reject();
			});
	});
}

export function setOrderAsDelivered(id: string) {
	return new Promise<void>((resolve, reject) => {
		orderModel
			.findById(id)
			.then(async (order) => {
				if (!order) {
					reject(new Error("Order not found"));
					return;
				}

				order.delivered_at = new Date(Date.now());

				try {
					await order.save();
					resolve();
				} catch (err) {
					console.log(err);
					reject();
				}
			})
			.catch((err) => {
				console.log(err);
				reject();
			});
	});
}

export function createOrder(order: IOrder) {
	return new Promise<void>((resolve, reject) => {
		orderModel
			.create(order)
			.then(() => {
				resolve();
			})
			.catch((err) => {
				console.log(err);
				reject();
			});
	});
}
