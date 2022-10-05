import productModel, { IProduct } from "../models/product.js";

export function getProductByName(name: string) {
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
