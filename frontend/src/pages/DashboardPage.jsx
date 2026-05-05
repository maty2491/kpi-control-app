import { useEffect, useState } from "react";
import { api } from "../services/api";
import { EmployeeComparisonChart } from "../components/EmployeeComparisonChart";
import { MonthlyInsightsCard } from "../components/MonthlyInsightsCard";
import { PageHeader } from "../components/PageHeader";
import { TopPerformersCard } from "../components/TopPerformersCard";
import { useDepartment } from "../context/DepartmentContext";
import { useMonth } from "../context/MonthContext";

export const DashboardPage = () => {
  const { selectedMonth } = useMonth();
  const { selectedDepartment } = useDepartment();
  const [employees, setEmployees] = useState([]);
  const [ranking, setRanking] = useState([]);
  const [kpis, setKpis] = useState([]);
  const [selectedTask, setSelectedTask] = useState("");

  useEffect(() => {
    const loadData = async () => {
      const departmentQuery = selectedDepartment ? `&department=${encodeURIComponent(selectedDepartment)}` : "";
      const [employeesResponse, rankingResponse, kpisResponse] = await Promise.all([
        api.get(selectedDepartment ? `/employees?department=${encodeURIComponent(selectedDepartment)}` : "/employees"),
        api.get(`/reports/top-performers?month=${selectedMonth}${departmentQuery}`),
        api.get(`/kpis?month=${selectedMonth}${departmentQuery}`),
      ]);

      setEmployees(employeesResponse.data);
      setRanking(rankingResponse.data);
      setKpis(kpisResponse.data);
    };

    loadData();
  }, [selectedMonth, selectedDepartment]);

  useEffect(() => {
    if (kpis.length === 0) {
      setSelectedTask("");
      return;
    }

    const available = new Set(kpis.map((item) => `${item.taskGroupName}|||${item.taskName}`));
    if (!selectedTask || !available.has(selectedTask)) {
      setSelectedTask(`${kpis[0].taskGroupName}|||${kpis[0].taskName}`);
    }
  }, [kpis, selectedTask]);

  const averageQuantity =
    kpis.length === 0
      ? 0
      : (kpis.reduce((sum, item) => sum + item.quantity, 0) / kpis.length).toFixed(1);

  const activeGroups = new Set(kpis.map((item) => item.taskGroupName)).size;

  const taskOptions = Array.from(
    new Map(
      kpis.map((item) => [
        `${item.taskGroupName}|||${item.taskName}`,
        {
          value: `${item.taskGroupName}|||${item.taskName}`,
          label: `${item.taskGroupName} / ${item.taskName}`,
        },
      ])
    ).values()
  );

  const selectedTaskLabel =
    taskOptions.find((option) => option.value === selectedTask)?.label || "";

  const taskTotals = kpis
    .filter((item) => `${item.taskGroupName}|||${item.taskName}` === selectedTask)
    .reduce((acc, item) => {
      const employeeId = item.employee?._id;
      if (!employeeId) {
        return acc;
      }

      acc[employeeId] = (acc[employeeId] || 0) + item.quantity;
      return acc;
    }, {});

  return (
    <div className="row g-4">
      <div className="col-lg-8">
        <PageHeader
          eyebrow="Vision general"
          title="Dashboard principal"
          description="Resumen ejecutivo del mes global seleccionado con comparativas y tareas mas relevantes."
          aside={
            <div className="text-end">
              <div className="small text-muted">Mes activo</div>
              <div className="fw-semibold">{selectedMonth}</div>
              {selectedDepartment ? <div className="small text-muted mt-2">{selectedDepartment}</div> : null}
            </div>
          }
        />
        <div className="row g-4">
          <div className="col-md-4">
            <div className="card border-0 shadow-sm stat-card">
              <div className="card-body">
                <div className="stat-card__icon">EM</div>
                <small className="text-muted">Empleados visibles</small>
                <div className="display-6 fw-semibold">{employees.length}</div>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card border-0 shadow-sm stat-card">
              <div className="card-body">
                <div className="stat-card__icon">GT</div>
                <small className="text-muted">Grupos de tareas activos</small>
                <div className="display-6 fw-semibold">{activeGroups}</div>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card border-0 shadow-sm stat-card">
              <div className="card-body">
                <div className="stat-card__icon">PR</div>
                <small className="text-muted">Cantidad promedio por tarea</small>
                <div className="display-6 fw-semibold">{averageQuantity}</div>
              </div>
            </div>
          </div>
          <div className="col-12">
            <MonthlyInsightsCard ranking={ranking} kpis={kpis} />
          </div>
          <div className="col-12">
            <EmployeeComparisonChart
              employees={employees}
              onTaskChange={setSelectedTask}
              selectedTask={selectedTask}
              selectedTaskLabel={selectedTaskLabel}
              taskOptions={taskOptions}
              taskTotals={taskTotals}
            />
          </div>
        </div>
      </div>
      <div className="col-lg-4">
        <TopPerformersCard ranking={ranking} />
      </div>
    </div>
  );
};
