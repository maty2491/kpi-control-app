import { useState } from "react";

const createTaskRow = (name = "", quantity = 0) => ({
  id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
  name,
  quantity,
});

const createEmptyGroupTasks = () => [createTaskRow()];

export const KpiForm = ({ employeeId, taskGroups, onSubmit, month, readOnly }) => {
  const [groupMode, setGroupMode] = useState("new");
  const [groupName, setGroupName] = useState("");
  const [selectedGroupId, setSelectedGroupId] = useState("");
  const [tasks, setTasks] = useState(createEmptyGroupTasks);

  const resetForNewGroup = () => {
    setGroupMode("new");
    setSelectedGroupId("");
    setGroupName("");
    setTasks(createEmptyGroupTasks());
  };

  const handleTaskChange = (taskId, field, value) => {
    setTasks((current) =>
      current.map((task) =>
        task.id === taskId
          ? {
              ...task,
              [field]: field === "quantity" ? Number(value) : value,
            }
          : task
      )
    );
  };

  const handleSelectGroup = (event) => {
    const groupId = event.target.value;

    if (!groupId) {
      resetForNewGroup();
      return;
    }

    const group = taskGroups.find((item) => item._id === groupId);
    setGroupMode("existing");
    setSelectedGroupId(groupId);
    setGroupName(group?.name || "");
    setTasks(
      group?.tasks?.length
        ? group.tasks.map((task) => createTaskRow(task.name, 0))
        : createEmptyGroupTasks()
    );
  };

  const addTask = () => {
    setTasks((current) => [...current, createTaskRow()]);
  };

  const removeTask = (taskId) => {
    setTasks((current) => {
      if (current.length === 1) {
        return current;
      }

      return current.filter((task) => task.id !== taskId);
    });
  };

  const submit = async (event) => {
    event.preventDefault();

    const normalizedTasks = tasks
      .map((task) => ({
        name: task.name.trim(),
        quantity: Number(task.quantity || 0),
      }))
      .filter((task) => task.name);

    await onSubmit({
      employee: employeeId,
      month,
      groupName: groupName.trim(),
      taskGroupId: groupMode === "existing" ? selectedGroupId : "",
      tasks: normalizedTasks,
    });

    resetForNewGroup();
  };

  return (
    <form onSubmit={submit} className="card border-0 shadow-sm">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-start mb-3">
          <div>
            <h2 className="h5 mb-1">Grupo de tareas y carga mensual</h2>
            <p className="text-muted mb-0">
              Puedes reutilizar un grupo existente o crear uno nuevo con sus tareas relacionadas.
            </p>
          </div>
          {groupMode === "existing" ? (
            <button
              className="btn btn-outline-secondary btn-sm"
              onClick={resetForNewGroup}
              type="button"
              disabled={readOnly}
            >
              Nuevo grupo
            </button>
          ) : null}
        </div>

        <div className="row g-3">
          <div className="col-md-6">
            <label className="form-label">Grupo existente</label>
            <select className="form-select" value={selectedGroupId} onChange={handleSelectGroup} disabled={readOnly}>
              <option value="">Crear nuevo grupo</option>
              {taskGroups.map((group) => (
                <option key={group._id} value={group._id}>
                  {group.name}
                </option>
              ))}
            </select>
          </div>
          <div className="col-md-6">
            <label className="form-label">Mes</label>
            <input
              className="form-control"
              type="month"
              value={month}
              onChange={() => {}}
              disabled
              required
            />
          </div>
          <div className="col-12">
            <label className="form-label">Nombre del grupo</label>
            <input
              className="form-control"
              value={groupName}
              onChange={(event) => setGroupName(event.target.value)}
              disabled={groupMode === "existing"}
              placeholder="Ej: Atencion al cliente, Deposito, Caja"
              required
            />
          </div>
        </div>

        <div className="mt-4">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h3 className="h6 mb-0">Tareas del grupo</h3>
            <button className="btn btn-outline-primary btn-sm" onClick={addTask} type="button" disabled={readOnly}>
              +
            </button>
          </div>

          <div className="row g-3">
            {tasks.map((task, index) => (
              <div className="col-12" key={task.id}>
                <div className="row g-2 align-items-center">
                  <div className="col-md-7">
                    <input
                      className="form-control"
                      placeholder={`Tarea ${index + 1}`}
                      value={task.name}
                      onChange={(event) => handleTaskChange(task.id, "name", event.target.value)}
                      disabled={readOnly}
                      required
                    />
                  </div>
                  <div className="col-md-4">
                    <input
                      className="form-control"
                      type="number"
                      min="0"
                      placeholder="Cantidad realizada"
                      value={task.quantity}
                      onChange={(event) => handleTaskChange(task.id, "quantity", event.target.value)}
                      disabled={readOnly}
                      required
                    />
                  </div>
                  <div className="col-md-1">
                    <button
                      className="btn btn-outline-danger w-100"
                      onClick={() => removeTask(task.id)}
                      type="button"
                      disabled={tasks.length === 1 || readOnly}
                    >
                      x
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <button className="btn btn-primary mt-4" type="submit" disabled={readOnly}>
          Guardar grupo y tareas
        </button>
      </div>
    </form>
  );
};
