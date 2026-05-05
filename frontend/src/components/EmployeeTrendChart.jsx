import {
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Tooltip,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

export const EmployeeTrendChart = ({ points, selectedTaskLabel }) => {
  const data = {
    labels: points.map((item) => item.month),
    datasets: [
      {
        label: selectedTaskLabel || "Evolucion por tarea",
        data: points.map((item) => item.quantity),
        borderColor: "#0d6efd",
        backgroundColor: "#0d6efd",
        tension: 0.25,
      },
    ],
  };

  return (
    <div className="card border-0 shadow-sm mt-4">
      <div className="card-body">
        <h2 className="h5 mb-3">Evolucion historica</h2>
        {points.length === 0 ? <p className="text-muted mb-0">No hay historial para la tarea seleccionada.</p> : <Line data={data} />}
      </div>
    </div>
  );
};
