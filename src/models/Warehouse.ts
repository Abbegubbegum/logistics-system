import mongoose, { Schema, model, InferSchemaType, Types } from "mongoose";

let warehouseProductSchema = new Schema({
	productID: {
		type: Types.ObjectId,
		required: [true, "Warehouse Product needs a Product ID"],
	},
	quantity: {
		type: Number,
		required: [true, "Warehouse Product needs a quantity"],
	},
	shelfID: {
		type: String,
		required: [true, "Warehouse Product needs a Shelf ID"],
	},
});

let warehouseSchema = new Schema(
	{
		name: {
			type: String,
			required: [true, "Warehouse needs a name"],
			unique: [true, "Warehouse name already exists"],
		},
		products: [warehouseProductSchema],
	},
	{
		statics: {
			findOneByName(name: string) {
				return this.findOne({ name: name });
			},
		},
	}
);

export type IWarehouseProduct = InferSchemaType<typeof warehouseProductSchema>;

export type IWarehouse = InferSchemaType<typeof warehouseSchema>;

export default model("Warehouse", warehouseSchema);
