import { Schema, model, InferSchemaType, Types } from "mongoose";

let employeeSchema = new Schema(
	{
		name: {
			type: String,
			required: [true, "Employee needs a name"],
			unique: [true, "Name already exists"],
		},
		warehouse: {
			type: Types.ObjectId,
			ref: "Warehouse",
			required: [true, "Employee needs a Connected Warehouse ID"],
		},
		role: {
			type: Types.ObjectId,
			ref: "Role",
			required: [true, "Employee needs a Role ID"],
		},
		schedule: {
			sun: { type: Array<Boolean>, default: createEmptySchedule },
			mon: { type: Array<Boolean>, default: createEmptySchedule },
			tue: { type: Array<Boolean>, default: createEmptySchedule },
			wed: { type: Array<Boolean>, default: createEmptySchedule },
			thu: { type: Array<Boolean>, default: createEmptySchedule },
			fri: { type: Array<Boolean>, default: createEmptySchedule },
			sat: { type: Array<Boolean>, default: createEmptySchedule },
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

export function createEmptySchedule() {
	let schedule = [];
	let timestep = 30;
	let sections = 1440 / timestep;

	for (let i = 0; i < sections; i++) {
		schedule[i] = false;
	}

	return schedule;
}

export type IEmployee = InferSchemaType<typeof employeeSchema>;

export default model("Employee", employeeSchema);
