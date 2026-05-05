import express from "express";
import { getMonthClosure, setMonthClosure } from "../controllers/monthClosureController.js";
import { authorize, protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.use(protect);
router.get("/", getMonthClosure);
router.put("/", authorize("admin", "manager"), setMonthClosure);

export default router;
