import mongoose from "mongoose";
import express from "express";
import employeeRoutes from "./routes/employeeRoutes.js";
import warehouseRoutes from "./routes/warehouseRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";

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
	mongoose.connect("mongodb://localhost/logistics");
	console.log("Listening on http://localhost:" + port);
});
