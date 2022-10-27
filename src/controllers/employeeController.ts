import { HydratedDocument, Types } from "mongoose";
import employeeModel, { IEmployee } from "../models/employee.js";

export function getAllEmployees() {
	return new Promise<IEmployee[]>((resolve, reject) => {
		employeeModel
			.find()
			.then((employees) => {
				resolve(employees);
			})
			.catch((err) => {
				console.log(err);
				reject();
			});
	});
}

export function getEmployeesWorkingOnDay(key: string): Promise<IEmployee[]> {
	return new Promise<IEmployee[]>((resolve, reject) => {
		employeeModel
			.find({ [`schedule.${key}`]: true })
			.then((employees) => {
				resolve(employees);
			})
			.catch((err) => {
				console.log(err);
				reject();
			});
	});
}

export function getEmployeesWorkingATimestep(
	dayKey: string,
	timestepIndex: number
) {
	return new Promise<IEmployee[]>((resolve, reject) => {
		employeeModel
			.find({ [`schedule.${dayKey}.${timestepIndex}`]: true })
			.then((employees) => {
				resolve(employees);
			})
			.catch((err) => {
				console.log(err);
				reject();
			});
	});
}

export function getGrabbersWorkingATimestep(
	dayKey: string,
	timestepIndex: number
) {
	return new Promise<IEmployee[]>((resolve, reject) => {
		employeeModel
			.find({ [`schedule.${dayKey}.${timestepIndex}`]: true })
			.then((employees) => {
				resolve(
					employees.filter(
						(employee) => (employee.role as any).title === "grabber"
					)
				);
			})
			.catch((err) => {
				console.log(err);
				reject();
			});
	});
}

export function getEmployeeByName(name: string): Promise<IEmployee> {
	return new Promise<IEmployee>((resolve, reject) => {
		employeeModel
			.findOne({ name: name })
			.populate("role")
			.populate("warehouse")
			.then((employee) => {
				if (employee) {
					resolve(employee);
				} else {
					reject(new Error("Employee not found"));
				}
			})
			.catch((err) => {
				console.log(err);
				reject(err);
			});
	});
}

export function getEmployeeDocByName(name: string) {
	return new Promise<HydratedDocument<IEmployee>>((resolve, reject) => {
		employeeModel
			.findOne({ name: name })
			.then((employee) => {
				if (employee) {
					resolve(employee);
				} else {
					reject(new Error("Employee not found"));
				}
			})
			.catch((err) => {
				console.log(err);
				reject(err);
			});
	});
}

export function getEmployeeIDByName(name: string) {
	return new Promise<Types.ObjectId>((resolve, reject) => {
		employeeModel
			.findOneByName(name)
			.then(async (employee) => {
				if (employee) {
					resolve(employee._id);
				} else {
					reject(new Error("Employee not found"));
				}
			})
			.catch((err) => {
				console.log(err);
				reject();
			});
	});
}

export function getGrabberIDByName(name: string) {
	return new Promise<Types.ObjectId>((resolve, reject) => {
		employeeModel
			.findOneByName(name)
			.then(async (employee) => {
				if (employee) {
					await employee.populate("role");

					if ((employee.role as any).title === "grabber") {
						resolve(employee._id);
					} else {
						reject(new Error("Employee is not a grabber"));
					}
				} else {
					reject(new Error("Employee not found"));
				}
			})
			.catch((err) => {
				console.log(err);
				reject();
			});
	});
}

export function getDriverIDByName(name: string) {
	return new Promise<Types.ObjectId>((resolve, reject) => {
		employeeModel
			.findOneByName(name)
			.then(async (employee) => {
				if (employee) {
					await employee.populate("role");

					if ((employee.role as any).title === "driver") {
						resolve(employee._id);
					} else {
						reject(new Error("Employee is not a driver"));
					}
				} else {
					reject(new Error("Employee not found"));
				}
			})
			.catch((err) => {
				console.log(err);
				reject();
			});
	});
}

export function createEmployee(newEmployee: IEmployee) {
	return new Promise<IEmployee>((resolve, reject) => {
		employeeModel
			.create(newEmployee)
			.then(async (employee) => {
				await employee.populate("role");
				resolve(employee);
			})
			.catch((err) => {
				if (err.code === 11000) {
					reject(new Error("Duplicate employee"));
				} else {
					reject();
				}
			});
	});
}

export function deleteAllEmployees(): Promise<number> {
	return new Promise<number>((resolve, reject) => {
		employeeModel
			.deleteMany()
			.then((result) => {
				resolve(result.deletedCount);
			})
			.catch((err) => {
				console.log(err);
				reject();
			});
	});
}

export function deleteEmployeeByName(name: string): Promise<void> {
	return new Promise<void>((resolve, reject) => {
		employeeModel
			.deleteOne({ name: name })
			.then((result) => {
				if (result.deletedCount === 0) {
					reject(new Error("Employee not found"));
				} else {
					resolve();
				}
			})
			.catch((err) => {
				console.log(err);
				reject();
			});
	});
}
