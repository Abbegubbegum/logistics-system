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

export function getEmployeeByName(name: string): Promise<IEmployee> {
	return new Promise<IEmployee>((resolve, reject) => {
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

export function createEmployee(newEmployee: IEmployee): Promise<void> {
	return new Promise<void>((resolve, reject) => {
		employeeModel
			.create(newEmployee)
			.then(() => {
				resolve();
			})
			.catch((err) => {
				console.log(err);
				reject();
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
