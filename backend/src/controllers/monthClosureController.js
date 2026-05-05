import { MonthClosure } from "../models/MonthClosure.js";

export const getMonthClosure = async (req, res) => {
  const month = req.query.month;
  const supervisor = req.user.role === "admin" ? req.query.supervisor || req.user._id : req.user._id;
  const department = req.user.role === "admin" ? req.query.department || req.user.department : req.user.department;

  const closure = await MonthClosure.findOne({ month, supervisor, department });
  res.json({ month, closed: closure?.closed || false });
};

export const setMonthClosure = async (req, res) => {
  const month = req.body.month;
  const closed = Boolean(req.body.closed);
  const supervisor = req.user.role === "admin" ? req.body.supervisor || req.user._id : req.user._id;
  const department = req.user.role === "admin" ? req.body.department || req.user.department : req.user.department;

  const closure = await MonthClosure.findOneAndUpdate(
    { month, supervisor, department },
    { month, supervisor, department, closed },
    { upsert: true, new: true }
  );

  res.json(closure);
};
