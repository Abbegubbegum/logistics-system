import mongoose, { MongooseError } from "mongoose";
import productModel, { IProduct } from "../models/product.js";

export function getProductIDByName(name: string) {
	return new Promise<IProduct>((resolve, reject) => {
		productModel
			.findOneByName(name)
			.then((product) => {
				if (product) {
					resolve(product);
				} else {
					reject(new Error("Product not found"));
				}
			})
			.catch((err) => {
				console.log(err);
				reject();
			});
	});
}

export function createProduct(product: IProduct) {
	return new Promise<void>((resolve, reject) => {
		productModel
			.create(product)
			.then(() => {
				resolve();
			})
			.catch((err) => {
				if (err.code === 11000) {
					reject(new Error("Duplicate product"));
				} else {
					reject();
				}
			});
	});
}
