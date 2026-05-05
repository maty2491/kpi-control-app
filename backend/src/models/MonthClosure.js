import mongoose from "mongoose";

const monthClosureSchema = new mongoose.Schema(
  {
    month: {
      type: String,
      required: true,
      match: /^\d{4}-\d{2}$/,
    },
    supervisor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    department: {
      type: String,
      required: true,
      trim: true,
    },
    closed: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

monthClosureSchema.index({ month: 1, supervisor: 1 }, { unique: true });

export const MonthClosure = mongoose.model("MonthClosure", monthClosureSchema);
