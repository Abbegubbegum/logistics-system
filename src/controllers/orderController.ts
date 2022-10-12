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
