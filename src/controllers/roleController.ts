import { Types } from "mongoose";
import roleModel, { IRole } from "../models/role.js";

export function getRoleByTitle(title: string) {
	return new Promise<IRole>((resolve, reject) => {
		roleModel
			.findOneByTitle(title)
			.then((role) => {
				if (role) {
					resolve(role);
				} else {
					reject(new Error("Role not found"));
				}
			})
			.catch((err) => {
				console.log(err);
				reject();
			});
	});
}

export function getRoleIDByTitle(title: string) {
	return new Promise<Types.ObjectId>((resolve, reject) => {
		roleModel
			.findOneByTitle(title)
			.then((role) => {
				if (role) {
					resolve(role._id);
				} else {
					reject(new Error("Role not found"));
				}
			})
			.catch((err) => {
				console.log(err);
				reject();
			});
	});
}
