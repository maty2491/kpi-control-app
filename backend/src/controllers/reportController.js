import { Employee } from "../models/Employee.js";
import { Kpi } from "../models/Kpi.js";
import { MonthlyReport } from "../models/MonthlyReport.js";
import { buildEmployeeScope } from "../utils/accessScope.js";

const calculateReport = (kpis) => {
  const totalQuantity = kpis.reduce((sum, item) => sum + item.quantity, 0);
  const totalTasks = kpis.length;
  const uniqueGroups = new Set(kpis.map((item) => item.taskGroupName)).size;

  return {
    totalQuantity,
    totalTasks,
    totalGroups: uniqueGroups,
  };
};

export const generateMonthlyReport = async (req, res) => {
  const employee = await Employee.findOne({
    _id: req.params.employeeId,
    ...buildEmployeeScope(req.user),
  });

  if (!employee) {
    return res.status(404).json({ message: "Employee not found" });
  }

  const month = req.body.month || req.query.month;
  const kpis = await Kpi.find({ employee: employee._id, month });
  const reportData = calculateReport(kpis);

  const highlights = kpis
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, 3)
    .map((item) => `${item.taskGroupName} / ${item.taskName}: ${item.quantity}`);

  const report = await MonthlyReport.findOneAndUpdate(
    { employee: employee._id, month },
    {
      employee: employee._id,
      supervisor: employee.supervisor,
      month,
      ...reportData,
      highlights,
    },
    { new: true, upsert: true }
  );

  res.json(report);
};

export const getEmployeeReports = async (req, res) => {
  const employee = await Employee.findOne({
    _id: req.params.employeeId,
    ...buildEmployeeScope(req.user),
  });

  if (!employee) {
    return res.status(404).json({ message: "Employee not found" });
  }

  const reports = await MonthlyReport.find({ employee: employee._id }).sort({ month: -1 });
  res.json(reports);
};

export const getTopPerformers = async (req, res) => {
  const month = req.query.month;
  const employeeScope = buildEmployeeScope(req.user);

  if (req.user.role === "admin" && req.query.department) {
    employeeScope.department = req.query.department;
  }

  const employees = await Employee.find(employeeScope).select("_id fullName department");
  const employeeIds = employees.map((item) => item._id);

  const ranking = await Kpi.aggregate([
    { $match: { month, employee: { $in: employeeIds } } },
    {
      $group: {
        _id: "$employee",
        totalQuantity: { $sum: "$quantity" },
        totalTasks: { $sum: 1 },
      },
    },
    { $sort: { totalQuantity: -1, totalTasks: -1 } },
    { $limit: 10 },
  ]);

  const normalized = ranking.map((item) => {
    const employee = employees.find((employeeItem) => String(employeeItem._id) === String(item._id));
    return {
      employeeId: item._id,
      fullName: employee?.fullName || "Unknown",
      department: employee?.department || "",
      totalQuantity: item.totalQuantity,
      totalTasks: item.totalTasks,
    };
  });

  res.json(normalized);
};
