import { Schema, model, InferSchemaType } from "mongoose";

let roleSchema = new Schema({
	title: {
		type: String,
		required: [true, "Role needs a Title"],
		unique: [true, "Role Title already exists"],
	},
    level: {
        type: Number,
        required: [true, "Role needs a Level"],
    }
});

export type IRole = InferSchemaType<typeof roleSchema>;

export default model("Roles", roleSchema);
