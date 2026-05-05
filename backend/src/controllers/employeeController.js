import { Employee } from "../models/Employee.js";
import { buildEmployeeScope } from "../utils/accessScope.js";

export const getEmployees = async (req, res) => {
  const filters = buildEmployeeScope(req.user);

  if (req.user.role === "admin" && req.query.department) {
    filters.department = req.query.department;
  }

  const employees = await Employee.find(filters).populate(
    "supervisor",
    "name email department"
  );

  res.json(employees);
};

export const getDepartments = async (_req, res) => {
  const departments = await Employee.distinct("department");
  res.json(departments.filter(Boolean).sort((a, b) => a.localeCompare(b)));
};

export const getEmployeeById = async (req, res) => {
  const employee = await Employee.findOne({
    _id: req.params.id,
    ...buildEmployeeScope(req.user),
  }).populate("supervisor", "name email department");

  if (!employee) {
    return res.status(404).json({ message: "Employee not found" });
  }

  res.json(employee);
};

export const createEmployee = async (req, res) => {
  const payload = { ...req.body };

  if (req.user.role === "manager") {
    payload.supervisor = req.user._id;
    payload.department = req.user.department;
  }

  const employee = await Employee.create(payload);
  res.status(201).json(employee);
};
