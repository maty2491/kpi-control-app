import { Link } from "react-router-dom";

const buildTaskLabel = (item) => `${item.taskGroupName} / ${item.taskName}`;

export const PerformanceMatrix = ({ employees, kpis, previousKpis, month }) => {
  const taskMap = new Map();
  const previousMap = new Map();

  previousKpis.forEach((item) => {
    previousMap.set(`${buildTaskLabel(item)}|||${item.employee?._id}`, item.quantity);
  });

  kpis.forEach((item) => {
    const label = buildTaskLabel(item);
    const employeeId = item.employee?._id;

    if (!taskMap.has(label)) {
      taskMap.set(label, {});
    }

    if (employeeId) {
      const previousQuantity = previousMap.get(`${label}|||${employeeId}`) || 0;
      taskMap.get(label)[employeeId] = {
        quantity: item.quantity,
        variation: item.quantity - previousQuantity,
      };
    }
  });

  const rows = Array.from(taskMap.entries())
    .map(([taskLabel, valuesByEmployee]) => ({ taskLabel, valuesByEmployee }))
    .sort((a, b) => a.taskLabel.localeCompare(b.taskLabel));

  const employeeTotals = employees.reduce((acc, employee) => {
    acc[employee._id] = kpis
      .filter((item) => item.employee?._id === employee._id)
      .reduce((sum, item) => sum + item.quantity, 0);
    return acc;
  }, {});

  const rowTotal = (row) =>
    employees.reduce((sum, employee) => sum + (row.valuesByEmployee[employee._id]?.quantity || 0), 0);

  const exportCsv = () => {
    const header = ["Tarea", ...employees.map((item) => item.fullName), "Total"];
    const lines = rows.map((row) => [
      row.taskLabel,
      ...employees.map((employee) => row.valuesByEmployee[employee._id]?.quantity || 0),
      rowTotal(row),
    ]);
    lines.push(["Total empleado", ...employees.map((employee) => employeeTotals[employee._id]), ""]);
    const csv = [header, ...lines].map((line) => line.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `desempeno-${month}.csv`);
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="card border-0 shadow-sm">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2 className="h5 mb-0">Desempeno tabular por tarea</h2>
          <button className="btn btn-outline-primary btn-sm" type="button" onClick={exportCsv}>
            Exportar CSV
          </button>
        </div>
        {employees.length === 0 ? (
          <p className="text-muted mb-0">No hay empleados visibles para mostrar.</p>
        ) : rows.length === 0 ? (
          <p className="text-muted mb-0">No hay tareas cargadas para el mes seleccionado.</p>
        ) : (
          <div className="table-responsive performance-matrix-wrapper">
            <table className="table table-bordered align-middle mb-0 performance-matrix">
              <thead className="table-light">
                <tr>
                  <th className="sticky-col sticky-head bg-light" style={{ minWidth: "280px" }}>
                    Tarea
                  </th>
                  {employees.map((employee) => (
                    <th key={employee._id} className="text-center sticky-head" style={{ minWidth: "160px" }}>
                      <Link className="text-decoration-none" to={`/employees/${employee._id}?month=${month}`}>
                        <div>{employee.fullName}</div>
                        <small className="text-muted">{employee.legajo}</small>
                      </Link>
                    </th>
                  ))}
                  <th className="text-center sticky-head bg-light" style={{ minWidth: "120px" }}>
                    Total
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.taskLabel}>
                    <th className="fw-normal sticky-col bg-white">{row.taskLabel}</th>
                    {employees.map((employee) => {
                      const cell = row.valuesByEmployee[employee._id];
                      const variation = cell?.variation || 0;
                      const className =
                        variation > 0
                          ? "table-success"
                          : variation < 0
                            ? "table-danger"
                            : "";

                      return (
                        <td key={`${row.taskLabel}-${employee._id}`} className={`text-center ${className}`}>
                          <div>{cell?.quantity ?? 0}</div>
                          <small className="text-muted">
                            {variation > 0 ? `+${variation}` : variation}
                          </small>
                        </td>
                      );
                    })}
                    <td className="text-center fw-semibold bg-light">{rowTotal(row)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <th className="sticky-col bg-light">Total empleado</th>
                  {employees.map((employee) => (
                    <th key={employee._id} className="text-center bg-light">
                      {employeeTotals[employee._id]}
                    </th>
                  ))}
                  <th className="bg-light text-center">
                    {Object.values(employeeTotals).reduce((sum, item) => sum + item, 0)}
                  </th>
                </tr>
              </tfoot>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
