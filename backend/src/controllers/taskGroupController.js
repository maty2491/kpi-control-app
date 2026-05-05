import { TaskGroup } from "../models/TaskGroup.js";

export const getTaskGroups = async (req, res) => {
  const filters = req.user.role === "admin" ? {} : { supervisor: req.user._id };
  const groups = await TaskGroup.find(filters).sort({ name: 1 });
  res.json(groups);
};

export const createTaskGroup = async (req, res) => {
  const payload = { ...req.body };

  if (req.user.role === "manager") {
    payload.supervisor = req.user._id;
    payload.department = req.user.department;
  }

  const normalizedTasks = (payload.tasks || [])
    .map((task) => ({ name: task.name?.trim() }))
    .filter((task) => task.name);

  const group = await TaskGroup.findOneAndUpdate(
    {
      name: payload.name,
      supervisor: payload.supervisor,
    },
    {
      $setOnInsert: {
        name: payload.name,
        supervisor: payload.supervisor,
        department: payload.department,
      },
      $addToSet: {
        tasks: { $each: normalizedTasks },
      },
    },
    {
      new: true,
      upsert: true,
    }
  );

  res.status(201).json(group);
};
