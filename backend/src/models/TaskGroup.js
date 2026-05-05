import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { _id: false }
);

const taskGroupSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    tasks: {
      type: [taskSchema],
      default: [],
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
  },
  { timestamps: true }
);

taskGroupSchema.index({ name: 1, supervisor: 1 }, { unique: true });

export const TaskGroup = mongoose.model("TaskGroup", taskGroupSchema);
