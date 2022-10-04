import { Schema, model, InferSchemaType, Types } from "mongoose";

let employeeSchema = new Schema({
	name: {
		type: String,
		required: [true, "Employee needs a name"],
	},
	warehouseID: {
		type: Types.ObjectId,
		required: [true, "Employee needs a Connected Warehouse ID"],
	},
});

employeeSchema.post("save", function (doc, next) {
	console.log(`Employee with name ${doc.name} saved`);
	next();
});

export type IEmployee = InferSchemaType<typeof employeeSchema>;

export default model("Employee", employeeSchema);
