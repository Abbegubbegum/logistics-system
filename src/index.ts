import mongoose from "mongoose";
import express from "express";
import employeeRoutes from "./routes/employeeRoutes.js";
import warehouseRoutes from "./routes/warehouseRoutes.js";

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use("/employees", employeeRoutes);
app.use("/warehouses", warehouseRoutes);

app.get("/", (req, res) => {
	res.sendStatus(200);
});

app.listen(port, () => {
	mongoose.connect("mongodb://localhost/logistics");
	console.log("Listening on http://localhost:" + port);
});
