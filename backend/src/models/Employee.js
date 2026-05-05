import mongoose from "mongoose";

const employeePalette = [
  "#0d6efd",
  "#198754",
  "#dc3545",
  "#fd7e14",
  "#6610f2",
  "#20c997",
  "#d63384",
  "#6f42c1",
  "#0dcaf0",
  "#ffc107",
];

const employeeSchema = new mongoose.Schema(
  {
    employeeCode: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    legajo: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    department: {
      type: String,
      required: true,
      trim: true,
    },
    position: {
      type: String,
      required: true,
      trim: true,
    },
    color: {
      type: String,
      required: true,
      trim: true,
    },
    supervisor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
  },
  { timestamps: true }
);

employeeSchema.pre("validate", function assignEmployeeCode(next) {
  if (!this.employeeCode) {
    const timestamp = Date.now().toString().slice(-6);
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    this.employeeCode = `EMP-${timestamp}-${randomSuffix}`;
  }

  if (!this.color) {
    const randomIndex = Math.floor(Math.random() * employeePalette.length);
    this.color = employeePalette[randomIndex];
  }

  next();
});

export const Employee = mongoose.model("Employee", employeeSchema);
