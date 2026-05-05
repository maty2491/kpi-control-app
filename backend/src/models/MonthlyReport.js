import mongoose from "mongoose";

const monthlyReportSchema = new mongoose.Schema(
  {
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },
    supervisor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    month: {
      type: String,
      required: true,
      match: /^\d{4}-\d{2}$/,
    },
    totalQuantity: {
      type: Number,
      required: true,
      min: 0,
    },
    totalTasks: {
      type: Number,
      required: true,
      min: 0,
    },
    totalGroups: {
      type: Number,
      required: true,
      min: 0,
    },
    highlights: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

monthlyReportSchema.index({ employee: 1, month: 1 }, { unique: true });

export const MonthlyReport = mongoose.model("MonthlyReport", monthlyReportSchema);
