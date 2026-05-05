import { Employee } from "../models/Employee.js";
import { MonthlyNote } from "../models/MonthlyNote.js";
import { assertManagerOwnsEmployee } from "../utils/accessScope.js";
import { assertMonthOpen } from "../utils/monthAccess.js";

export const getMonthlyNote = async (req, res) => {
  const employee = await Employee.findById(req.params.employeeId);

  if (!employee || !assertManagerOwnsEmployee(req.user, employee)) {
    return res.status(404).json({ message: "Employee not found" });
  }

  const month = req.query.month;
  const note = await MonthlyNote.findOne({ employee: employee._id, month });
  res.json(note || { employee: employee._id, month, note: "" });
};

export const upsertMonthlyNote = async (req, res) => {
  const employee = await Employee.findById(req.params.employeeId);

  if (!employee || !assertManagerOwnsEmployee(req.user, employee)) {
    return res.status(404).json({ message: "Employee not found" });
  }

  try {
    await assertMonthOpen({
      month: req.body.month,
      supervisor: employee.supervisor,
      department: employee.department,
    });
  } catch (error) {
    return res.status(error.statusCode || 400).json({ message: error.message });
  }

  const note = await MonthlyNote.findOneAndUpdate(
    { employee: employee._id, month: req.body.month },
    {
      employee: employee._id,
      supervisor: employee.supervisor,
      month: req.body.month,
      note: req.body.note,
    },
    { upsert: true, new: true }
  );

  res.json(note);
};
