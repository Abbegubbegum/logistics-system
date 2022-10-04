import mongoose, { Schema, model, InferSchemaType } from "mongoose";

let warehouseSchema = new Schema({
	name: {
		type: String,
		required: [true, "Warehouse needs a name"],
		unique: [true, "Warehouse name already exists"],
	},
});

export type IWarehouse = InferSchemaType<typeof warehouseSchema>;

export default model("Warehouse", warehouseSchema);
