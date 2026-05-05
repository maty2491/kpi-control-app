import express from "express";
import {
  createEmployee,
  getDepartments,
  getEmployeeById,
  getEmployees,
} from "../controllers/employeeController.js";
import { authorize, protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.use(protect);

router.get("/departments", getDepartments);
router.get("/", getEmployees);
router.get("/:id", getEmployeeById);
router.post("/", authorize("admin", "manager"), createEmployee);

export default router;
