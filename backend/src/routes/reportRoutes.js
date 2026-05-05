import express from "express";
import {
  generateMonthlyReport,
  getEmployeeReports,
  getTopPerformers,
} from "../controllers/reportController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.use(protect);
router.get("/top-performers", getTopPerformers);
router.get("/employee/:employeeId", getEmployeeReports);
router.post("/employee/:employeeId/generate", generateMonthlyReport);

export default router;
