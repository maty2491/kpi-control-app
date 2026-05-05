import { Employee } from "../models/Employee.js";
import { Kpi } from "../models/Kpi.js";
import { TaskGroup } from "../models/TaskGroup.js";
import { assertManagerOwnsEmployee } from "../utils/accessScope.js";
import { assertMonthOpen } from "../utils/monthAccess.js";

export const getKpis = async (req, res) => {
  const filters = {};

  if (req.query.employeeId) {
    filters.employee = req.query.employeeId;
  }

  if (req.query.month) {
    filters.month = req.query.month;
  }

  if (req.user.role === "manager") {
    filters.supervisor = req.user._id;
  }

  if (req.user.role === "admin" && req.query.department) {
    const departmentEmployees = await Employee.find({ department: req.query.department }).select("_id");
    filters.employee = req.query.employeeId
      ? req.query.employeeId
      : { $in: departmentEmployees.map((item) => item._id) };
  }

  const kpis = await Kpi.find(filters)
    .populate("employee", "fullName department position color")
    .sort({ taskGroupName: 1, taskName: 1, month: -1 });

  res.json(kpis);
};

export const createKpi = async (req, res) => {
  const { employee: employeeId, month, taskGroupId, tasks } = req.body;
  const employee = await Employee.findById(employeeId);

  if (!employee) {
    return res.status(404).json({ message: "Employee not found" });
  }

  if (!assertManagerOwnsEmployee(req.user, employee)) {
    return res.status(403).json({
      message: "You can only manage KPIs for your assigned employees",
    });
  }

  const taskGroup = await TaskGroup.findById(taskGroupId);

  if (!taskGroup) {
    return res.status(404).json({ message: "Task group not found" });
  }

  try {
    await assertMonthOpen({
      month,
      supervisor: employee.supervisor,
      department: employee.department,
    });
  } catch (error) {
    return res.status(error.statusCode || 400).json({ message: error.message });
  }

  const records = (tasks || [])
    .map((task) => ({
      employee: employee._id,
      supervisor: employee.supervisor,
      month,
      taskGroup: taskGroup._id,
      taskGroupName: taskGroup.name,
      taskName: task.name?.trim(),
      quantity: Number(task.quantity || 0),
    }))
    .filter((task) => task.taskName);

  if (records.length === 0) {
    return res.status(400).json({ message: "At least one task is required" });
  }

  const operations = records.map((record) => ({
    updateOne: {
      filter: {
        employee: record.employee,
        month: record.month,
        taskGroup: record.taskGroup,
        taskName: record.taskName,
      },
      update: { $set: record },
      upsert: true,
    },
  }));

  await Kpi.bulkWrite(operations);

  const kpis = await Kpi.find({
    employee: employee._id,
    month,
    taskGroup: taskGroup._id,
  });

  res.status(201).json(kpis);
};

export const updateKpi = async (req, res) => {
  const kpi = await Kpi.findById(req.params.id).populate("employee");

  if (!kpi) {
    return res.status(404).json({ message: "KPI not found" });
  }

  if (!assertManagerOwnsEmployee(req.user, kpi.employee)) {
    return res.status(403).json({ message: "Forbidden" });
  }

  try {
    await assertMonthOpen({
      month: req.body.month || kpi.month,
      supervisor: kpi.employee.supervisor,
      department: kpi.employee.department,
    });
  } catch (error) {
    return res.status(error.statusCode || 400).json({ message: error.message });
  }

  Object.assign(kpi, req.body);
  await kpi.save();

  res.json(kpi);
};
