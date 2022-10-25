import mongoose from "mongoose";
import express from "express";
import employeeRoutes from "./routes/employeeRoutes.js";
import warehouseRoutes from "./routes/warehouseRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import dotenv from "dotenv";
import { getEmployeeByName } from "./controllers/employeeController.js";
import cors from "cors";

dotenv.config();

let dbURL = process.env.DB_URL || "mongodb://localhost/logistics";

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());
app.use("/employees", employeeRoutes);
app.use("/warehouses", warehouseRoutes);
app.use("/products", productRoutes);
app.use("/orders", orderRoutes);

app.get("/", (req, res) => {
	res.sendStatus(200);
});

app.post("/login", (req, res) => {
	let name = req.body.name;

	if (typeof name !== "string") {
		res.status(400).send("Bad request, name must be a string");
		return;
	}

	getEmployeeByName(name)
		.then((employee) => {
			console.log(employee);
			res.status(200).json(employee);
		})
		.catch((err: Error) => {
			if (err.message === "Employee not found") {
				res.sendStatus(401);
			} else {
				res.sendStatus(500);
			}
		});
});

app.listen(port, () => {
	mongoose.connect(dbURL).then(() => {
		console.log("Connected to database");
	});
	console.log("Listening on http://localhost:" + port);
});
