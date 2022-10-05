import { Schema, model, InferSchemaType } from "mongoose";

let productSchema = new Schema(
	{
		name: {
			type: String,
			required: [true, "Product requires a name"],
			unique: [true, "Name already exists"],
		},
		price: {
			type: Number,
			default: 0,
		},
		weight: {
			type: Number,
			default: 0,
		},
	},
	{
		statics: {
			findOneByName(name: string) {
				return this.findOne({ name: name });
			},
		},
	}
);
export type IProduct = InferSchemaType<typeof productSchema>;
export default model("Product", productSchema);
