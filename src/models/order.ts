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
	cost: {
		type: Number,
		required: [true, "Order Product needs a cost"],
	},
	created_at: {
		type: Date,
		default: Date.now,
	},
	grabber: {
		type: Types.ObjectId,
		ref: "Employee",
	},
	packed_at: {
		type: Date,
	},
	driver: {
		type: Types.ObjectId,
		ref: "Employee",
	},
	delivered_at: {
		type: Date,
	},
});

export type IOrder = InferSchemaType<typeof orderSchema>;
export default model("Order", orderSchema);
