import { Schema, model, InferSchemaType, Types } from "mongoose";

let employeeSchema = new Schema(
	{
		name: {
			type: String,
			required: [true, "Employee needs a name"],
		},
		warehouseID: {
			type: Types.ObjectId,
			required: [true, "Employee needs a Connected Warehouse ID"],
		},
		roleID: {
			type: Types.ObjectId,
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
