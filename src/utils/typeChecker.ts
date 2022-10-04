import { IEmployee } from "../models/Employee";

export function isEmployee(obj: any): obj is IEmployee {
    return typeof obj.name === "string"
}
