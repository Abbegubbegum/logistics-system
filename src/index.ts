import mongoose from "mongoose";
import express from "express";
import { createEmployee } from "./controllers/employeeController.js";
import { employeeRoutes} from "./routes/employeeRoutes.js";

await mongoose.connect("mongodb://localhost/logistics");

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use("/employee", employeeRoutes);

app.get("/", (req, res) => {
	res.sendStatus(200);
});

app.listen(port, () => {
	console.log("Listening on http://localhost:" + port);
});
