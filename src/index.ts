import mongoose from "mongoose";
import express from "express";
import employeeRoutes from "./routes/employeeRoutes.js";
import warehouseRoutes from "./routes/warehouseRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import dotenv from "dotenv";

dotenv.config();

let dbURL = process.env.DB_URL || "mongodb://localhost/logistics";

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use("/employees", employeeRoutes);
app.use("/warehouses", warehouseRoutes);
app.use("/products", productRoutes);
app.use("/orders", orderRoutes);

app.get("/", (req, res) => {
	res.sendStatus(200);
});

app.listen(port, () => {
	mongoose.connect(dbURL).then(() => {
		console.log("Connected to database");
	});
	console.log("Listening on http://localhost:" + port);
});
