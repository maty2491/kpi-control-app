import express from "express";
import { createTaskGroup, getTaskGroups } from "../controllers/taskGroupController.js";
import { authorize, protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.use(protect);
router.get("/", getTaskGroups);
router.post("/", authorize("admin", "manager"), createTaskGroup);

export default router;
