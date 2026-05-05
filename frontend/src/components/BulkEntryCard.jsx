import { useEffect, useMemo, useState } from "react";
import { api } from "../services/api";

export const BulkEntryCard = ({ employees, month, readOnly, onSaved }) => {
  const [taskGroups, setTaskGroups] = useState([]);
  const [selectedTask, setSelectedTask] = useState("");
  const [values, setValues] = useState({});

  useEffect(() => {
    api.get("/task-groups").then(({ data }) => setTaskGroups(data));
  }, []);

  const taskOptions = useMemo(
    () =>
      taskGroups.flatMap((group) =>
        group.tasks.map((task) => ({
          value: `${group._id}|||${task.name}`,
          groupId: group._id,
          taskName: task.name,
          label: `${group.name} / ${task.name}`,
        }))
      ),
    [taskGroups]
  );

  const selectedTaskData = taskOptions.find((item) => item.value === selectedTask);

  const save = async () => {
    if (!selectedTaskData) {
      return;
    }

    await Promise.all(
      employees.map((employee) =>
        api.post("/kpis", {
          employee: employee._id,
          month,
          taskGroupId: selectedTaskData.groupId,
          tasks: [
            {
              name: selectedTaskData.taskName,
              quantity: Number(values[employee._id] || 0),
            },
          ],
        })
      )
    );

    onSaved?.();
  };

  return (
    <div className="card border-0 shadow-sm mt-4">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div>
            <h2 className="h5 mb-1">Carga rapida mensual</h2>
            <p className="text-muted small mb-0">Carga una tarea para varios empleados sin entrar uno por uno.</p>
          </div>
        </div>
        <div className="row g-3">
          <div className="col-12">
            <label className="form-label">Tarea</label>
            <select
              className="form-select"
              value={selectedTask}
              onChange={(event) => setSelectedTask(event.target.value)}
              disabled={readOnly}
            >
              <option value="">Seleccionar tarea</option>
              {taskOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="row g-3 mt-1">
          {employees.map((employee) => (
            <div className="col-md-6" key={employee._id}>
              <label className="form-label">{employee.fullName}</label>
              <input
                className="form-control"
                type="number"
                min="0"
                value={values[employee._id] || ""}
                onChange={(event) =>
                  setValues((current) => ({ ...current, [employee._id]: event.target.value }))
                }
                disabled={readOnly || !selectedTask}
              />
            </div>
          ))}
        </div>
        <button className="btn btn-primary mt-4" type="button" onClick={save} disabled={readOnly || !selectedTask}>
          Guardar carga masiva
        </button>
      </div>
    </div>
  );
};
