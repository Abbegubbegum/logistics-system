import mongoose, { Schema, model, InferSchemaType } from "mongoose";

let warehouseSchema = new Schema({});


export type IWarehouse = InferSchemaType<typeof warehouseSchema>;

export default model("Warehouse", warehouseSchema);
