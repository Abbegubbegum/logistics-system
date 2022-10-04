import { Router } from "express";
import {
	createWarehouse,
	getAllWarehouses,
} from "../controllers/warehouseController.js";
import { isWarehouse } from "../utils/typeChecker.js";

const router = Router();

router.get("/", (req, res) => {
	getAllWarehouses()
		.then((warehouses) => {
			res.status(200).json(warehouses);
			return;
		})
		.catch((err) => {
			res.sendStatus(500);
			return;
		});
});

router.post("/", (req, res) => {
	let warehouse = req.body;

	if (!isWarehouse(warehouse)) {
		res.status(400).send("Bad request");
		return;
	}

	createWarehouse(warehouse)
		.then(() => {
			res.sendStatus(201);
		})
		.catch((err) => {
			res.sendStatus(500);
		});
});

export default router;
