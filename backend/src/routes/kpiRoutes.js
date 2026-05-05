import express from "express";
import { createKpi, getKpis, updateKpi } from "../controllers/kpiController.js";
import { authorize, protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.use(protect);
router.get("/", getKpis);
router.post("/", authorize("admin", "manager"), createKpi);
router.put("/:id", authorize("admin", "manager"), updateKpi);

export default router;
