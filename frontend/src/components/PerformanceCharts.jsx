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

const buildMap = (items) =>
  items.reduce((acc, item) => {
    acc[`${item.taskGroupName} / ${item.taskName}`] = item.quantity;
    return acc;
  }, {});

export const PerformanceCharts = ({ currentMonthKpis, previousMonthKpis }) => {
  const currentMap = buildMap(currentMonthKpis);
  const previousMap = buildMap(previousMonthKpis);
  const labels = Array.from(new Set([...Object.keys(currentMap), ...Object.keys(previousMap)]));

  const chartData = {
    labels,
    datasets: [
      {
        label: "Mes actual",
        data: labels.map((label) => currentMap[label] || 0),
        backgroundColor: "#0d6efd",
      },
      {
        label: "Mes anterior",
        data: labels.map((label) => previousMap[label] || 0),
        backgroundColor: "#6c757d",
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      tooltip: {
        callbacks: {
          title: (items) => items[0]?.label || "",
          label: (context) => `${context.dataset.label}: ${context.parsed.y}`,
        },
      },
    },
    scales: {
      x: {
        ticks: {
          display: false,
        },
        grid: {
          display: false,
        },
      },
    },
  };

  return (
    <div>
      <h2 className="h5 mb-3">Comparativa por tarea entre meses</h2>
      <p className="text-muted small mb-3">
        Pasa el mouse sobre cada barra para ver la tarea y comparar su cantidad con el mes anterior.
      </p>
      <Bar data={chartData} options={options} />
    </div>
  );
};
