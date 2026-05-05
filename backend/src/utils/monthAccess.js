import { MonthClosure } from "../models/MonthClosure.js";

export const assertMonthOpen = async ({ month, supervisor, department }) => {
  const closure = await MonthClosure.findOne({
    month,
    supervisor,
    department,
    closed: true,
  });

  if (closure) {
    const error = new Error("This month is closed for changes");
    error.statusCode = 409;
    throw error;
  }
};
