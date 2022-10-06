import { Schema, model, InferSchemaType, Types } from "mongoose";

let employeeSchema = new Schema(
	{
		name: {
			type: String,
			required: [true, "Employee needs a name"],
			unique: [true, "Name already exists"],
		},
		warehouseID: {
			type: Types.ObjectId,
			ref: "Warehouse",
			required: [true, "Employee needs a Connected Warehouse ID"],
		},
		roleID: {
			type: Types.ObjectId,
			ref: "Role",
			required: [true, "Employee needs a Role ID"],
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

export type IEmployee = InferSchemaType<typeof employeeSchema>;

export default model("Employee", employeeSchema);
