import mongoose, { Schema, model, InferSchemaType } from "mongoose";

let employeeSchema = new Schema({
	name: {
		type: String,
		required: [true, "Name is required"],
	},
});

employeeSchema.post("save", function (doc, next) {
	console.log(doc);
	next();
});

export type IEmployee = InferSchemaType<typeof employeeSchema>;

export default model("Employee", employeeSchema);
