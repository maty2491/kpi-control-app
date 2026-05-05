import express from "express";
import cors from "cors";
import path from "path";
import { existsSync } from "fs";
import { fileURLToPath } from "url";
import authRoutes from "./routes/authRoutes.js";
import employeeRoutes from "./routes/employeeRoutes.js";
import kpiRoutes from "./routes/kpiRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";
import taskGroupRoutes from "./routes/taskGroupRoutes.js";
import monthClosureRoutes from "./routes/monthClosureRoutes.js";
import monthlyNoteRoutes from "./routes/monthlyNoteRoutes.js";

export const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const frontendDistPath = path.resolve(__dirname, "../../frontend/dist");

const allowedOrigins = (process.env.FRONTEND_URL || "")
  .split(",")
  .map((item) => item.trim())
  .filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});

app.use("/api/auth", authRoutes);
app.use("/api/employees", employeeRoutes);
app.use("/api/task-groups", taskGroupRoutes);
app.use("/api/kpis", kpiRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/month-closures", monthClosureRoutes);
app.use("/api/monthly-notes", monthlyNoteRoutes);

if (existsSync(frontendDistPath)) {
  app.use(express.static(frontendDistPath));

  app.get("*", (req, res, next) => {
    if (req.path.startsWith("/api")) {
      next();
      return;
    }

    res.sendFile(path.join(frontendDistPath, "index.html"));
  });
}
