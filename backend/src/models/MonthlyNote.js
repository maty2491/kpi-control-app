import mongoose from "mongoose";

const monthlyNoteSchema = new mongoose.Schema(
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
    note: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500,
    },
  },
  { timestamps: true }
);

monthlyNoteSchema.index({ employee: 1, month: 1 }, { unique: true });

export const MonthlyNote = mongoose.model("MonthlyNote", monthlyNoteSchema);
