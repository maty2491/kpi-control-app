import mongoose from "mongoose";

const kpiSchema = new mongoose.Schema(
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
    taskGroup: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TaskGroup",
      required: true,
    },
    taskGroupName: {
      type: String,
      required: true,
      trim: true,
    },
    taskName: {
      type: String,
      required: true,
      trim: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  { timestamps: true }
);

kpiSchema.index(
  { employee: 1, month: 1, taskGroup: 1, taskName: 1 },
  { unique: true }
);

export const Kpi = mongoose.model("Kpi", kpiSchema);
