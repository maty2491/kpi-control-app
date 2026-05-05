import express from "express";
import { getMonthlyNote, upsertMonthlyNote } from "../controllers/monthlyNoteController.js";
import { authorize, protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.use(protect);
router.get("/:employeeId", getMonthlyNote);
router.put("/:employeeId", authorize("admin", "manager"), upsertMonthlyNote);

export default router;
