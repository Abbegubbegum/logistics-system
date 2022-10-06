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

export function createOrder(order: IOrder) {
	return new Promise<IOrder>((resolve, reject) => {
		
	});
}
