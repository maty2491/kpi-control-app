import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Tooltip,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const fallbackColors = ["#0d6efd", "#198754", "#dc3545", "#fd7e14", "#6610f2", "#20c997"];

export const EmployeeComparisonChart = ({
  employees,
  selectedTask,
  selectedTaskLabel,
  taskOptions,
  taskTotals,
  onTaskChange,
}) => {
  const data = {
    labels: employees.map((item) => item.fullName),
    datasets: [
      {
        label: selectedTaskLabel || "Cantidad por empleado",
        data: employees.map((item) => taskTotals[item._id] || 0),
        backgroundColor: employees.map(
          (item, index) => item.color || fallbackColors[index % fallbackColors.length]
        ),
      },
    ],
  };

  return (
    <div className="card border-0 shadow-sm h-100">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div>
            <h2 className="h5 mb-1">Comparativa entre empleados</h2>
            <p className="text-muted small mb-0">
              Compara a todos los empleados visibles segun la tarea elegida.
            </p>
          </div>
          <select className="form-select" style={{ maxWidth: "320px" }} value={selectedTask} onChange={(event) => onTaskChange(event.target.value)}>
            {taskOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        {employees.length === 0 || taskOptions.length === 0 ? (
          <p className="text-muted mb-0">Todavia no hay datos suficientes para comparar este mes.</p>
        ) : (
          <Bar data={data} />
        )}
      </div>
    </div>
  );
};
