import { Schema, model, InferSchemaType, Types } from "mongoose";

let orderProductSchema = new Schema({
	product: {
		type: Types.ObjectId,
		ref: "Product",
		required: [true, "Order Product needs a product ID"],
	},
	quantity: {
		type: Number,
		required: [true, "Order Product needs a quantity"],
	},
});

let orderSchema = new Schema({
	products: [orderProductSchema],
	created_at: {
		type: Date,
		default: Date.now,
	},
	grabberID: {
		type: Types.ObjectId,
	},
	packed_at: {
		type: Date,
	},
	driverID: {
		type: Types.ObjectId,
	},
	delivered_at: {
		type: Date,
	},
});

export type IOrder = InferSchemaType<typeof orderSchema>;
export default model("Order", orderSchema);
