import { Schema, model, InferSchemaType } from "mongoose";

let roleSchema = new Schema(
	{
		title: {
			type: String,
			required: [true, "Role needs a Title"],
			unique: [true, "Role Title already exists"],
		},
		level: {
			type: Number,
			required: [true, "Role needs a Level"],
		},
	},
	{
		statics: {
			findOneByTitle(title: string) {
				return this.findOne({ title: title });
			},
		},
	}
);

export type IRole = InferSchemaType<typeof roleSchema>;

export default model("Role", roleSchema);
