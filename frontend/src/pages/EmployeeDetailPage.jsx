import { useEffect, useMemo, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { EmployeeTrendChart } from "../components/EmployeeTrendChart";
import { KpiForm } from "../components/KpiForm";
import { MonthClosureCard } from "../components/MonthClosureCard";
import { MonthlyNoteCard } from "../components/MonthlyNoteCard";
import { PageHeader } from "../components/PageHeader";
import { PerformanceCharts } from "../components/PerformanceCharts";
import { useMonth } from "../context/MonthContext";
import { api } from "../services/api";

const getPreviousMonth = (month) => {
  const [year, monthNumber] = month.split("-").map(Number);
  return new Date(year, monthNumber - 2, 1).toISOString().slice(0, 7);
};

const sumQuantity = (items) => items.reduce((sum, item) => sum + item.quantity, 0);

export const EmployeeDetailPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const { selectedMonth, setSelectedMonth } = useMonth();
  const [employee, setEmployee] = useState(null);
  const [selectedMonthKpis, setSelectedMonthKpis] = useState([]);
  const [previousMonthKpis, setPreviousMonthKpis] = useState([]);
  const [reports, setReports] = useState([]);
  const [taskGroups, setTaskGroups] = useState([]);
  const [allKpis, setAllKpis] = useState([]);
  const [selectedTrendTask, setSelectedTrendTask] = useState("");
  const [closed, setClosed] = useState(false);

  useEffect(() => {
    const monthFromQuery = new URLSearchParams(location.search).get("month");
    if (monthFromQuery) {
      setSelectedMonth(monthFromQuery);
    }
  }, [location.search, setSelectedMonth]);

  const loadStaticEmployeeData = async () => {
    const [employeeResponse, reportsResponse, taskGroupsResponse, allKpisResponse, closureResponse] =
      await Promise.all([
        api.get(`/employees/${id}`),
        api.get(`/reports/employee/${id}`),
        api.get("/task-groups"),
        api.get(`/kpis?employeeId=${id}`),
        api.get(`/month-closures?month=${selectedMonth}`),
      ]);

    setEmployee(employeeResponse.data);
    setReports(reportsResponse.data);
    setTaskGroups(taskGroupsResponse.data);
    setAllKpis(allKpisResponse.data);
    setClosed(Boolean(closureResponse.data.closed));
  };

  const loadMonthAnalysis = async (month) => {
    const previousMonth = getPreviousMonth(month);
    const [currentResponse, previousResponse] = await Promise.all([
      api.get(`/kpis?employeeId=${id}&month=${month}`),
      api.get(`/kpis?employeeId=${id}&month=${previousMonth}`),
    ]);

    setSelectedMonthKpis(currentResponse.data);
    setPreviousMonthKpis(previousResponse.data);
  };

  useEffect(() => {
    loadStaticEmployeeData();
  }, [id, selectedMonth]);

  useEffect(() => {
    loadMonthAnalysis(selectedMonth);
  }, [id, selectedMonth]);

  useEffect(() => {
    if (!selectedTrendTask && allKpis.length > 0) {
      setSelectedTrendTask(`${allKpis[0].taskGroupName}|||${allKpis[0].taskName}`);
    }
  }, [allKpis, selectedTrendTask]);

  const handleCreateKpi = async (payload) => {
    const { data } = await api.post("/task-groups", {
      name: payload.groupName,
      tasks: payload.tasks.map((task) => ({ name: task.name })),
    });

    await api.post("/kpis", {
      employee: payload.employee,
      month: payload.month,
      taskGroupId: data._id,
      tasks: payload.tasks,
    });

    await api.post(`/reports/employee/${id}/generate`, { month: payload.month });
    await loadStaticEmployeeData();

    if (payload.month === selectedMonth) {
      await loadMonthAnalysis(selectedMonth);
    }
  };

  const taskOptions = useMemo(
    () =>
      Array.from(
        new Map(
          allKpis.map((item) => [
            `${item.taskGroupName}|||${item.taskName}`,
            {
              value: `${item.taskGroupName}|||${item.taskName}`,
              label: `${item.taskGroupName} / ${item.taskName}`,
            },
          ])
        ).values()
      ),
    [allKpis]
  );

  const trendPoints = useMemo(() => {
    const filtered = allKpis.filter(
      (item) => `${item.taskGroupName}|||${item.taskName}` === selectedTrendTask
    );

    const grouped = filtered.reduce((acc, item) => {
      acc[item.month] = (acc[item.month] || 0) + item.quantity;
      return acc;
    }, {});

    return Object.entries(grouped)
      .map(([month, quantity]) => ({ month, quantity }))
      .sort((a, b) => a.month.localeCompare(b.month));
  }, [allKpis, selectedTrendTask]);

  if (!employee) {
    return <div>Cargando empleado...</div>;
  }

  const previousMonth = getPreviousMonth(selectedMonth);
  const currentTotal = sumQuantity(selectedMonthKpis);
  const previousTotal = sumQuantity(previousMonthKpis);
  const variation = currentTotal - previousTotal;
  const selectedTrendTaskLabel =
    taskOptions.find((option) => option.value === selectedTrendTask)?.label || "";

  return (
    <div className="row g-4">
      <div className="col-lg-5">
        <PageHeader
          eyebrow="Ficha individual"
          title={employee.fullName}
          description={`${employee.position} | ${employee.department}`}
          aside={
            <div className="text-end">
              <div className="small text-muted">Legajo</div>
              <div className="fw-semibold">{employee.legajo}</div>
              <div className="small text-muted mt-2">Supervisor: {employee.supervisor?.name}</div>
            </div>
          }
        />
        <MonthClosureCard month={selectedMonth} onChange={setClosed} />
        <div className="mt-4">
          <KpiForm
            employeeId={id}
            taskGroups={taskGroups}
            onSubmit={handleCreateKpi}
            month={selectedMonth}
            readOnly={closed}
          />
        </div>
        <MonthlyNoteCard employeeId={id} month={selectedMonth} readOnly={closed} />
      </div>
      <div className="col-lg-7">
        <div className="card border-0 shadow-sm">
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div>
                <h2 className="h5 mb-1">Analisis mensual</h2>
                <p className="text-muted small mb-0">
                  Se compara el mes global seleccionado con su mes inmediatamente anterior.
                </p>
              </div>
              <div className="text-end">
                <div className="small text-muted">Mes activo</div>
                <div className="fw-semibold">{selectedMonth}</div>
              </div>
            </div>
            <div className="row g-3 mb-4">
              <div className="col-md-4">
                <div className="bg-body-tertiary rounded p-3 h-100">
                  <small className="text-muted d-block">Mes seleccionado</small>
                  <div className="fw-semibold">{selectedMonth}</div>
                  <div className="small text-muted">Cantidad total: {currentTotal}</div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="bg-body-tertiary rounded p-3 h-100">
                  <small className="text-muted d-block">Mes anterior</small>
                  <div className="fw-semibold">{previousMonth}</div>
                  <div className="small text-muted">Cantidad total: {previousTotal}</div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="bg-body-tertiary rounded p-3 h-100">
                  <small className="text-muted d-block">Variacion</small>
                  <div className={`fw-semibold ${variation >= 0 ? "text-success" : "text-danger"}`}>
                    {variation >= 0 ? "+" : ""}
                    {variation}
                  </div>
                  <div className="small text-muted">Diferencia entre ambos meses</div>
                </div>
              </div>
            </div>
            <PerformanceCharts currentMonthKpis={selectedMonthKpis} previousMonthKpis={previousMonthKpis} />
          </div>
        </div>
        <div className="card border-0 shadow-sm mt-4">
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h2 className="h5 mb-0">Evolucion por tarea</h2>
              <select
                className="form-select"
                style={{ maxWidth: "320px" }}
                value={selectedTrendTask}
                onChange={(event) => setSelectedTrendTask(event.target.value)}
              >
                {taskOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <EmployeeTrendChart points={trendPoints} selectedTaskLabel={selectedTrendTaskLabel} />
          </div>
        </div>
        <div className="card border-0 shadow-sm mt-4">
          <div className="card-body">
            <h2 className="h5 mb-3">Carga del mes seleccionado</h2>
            <div className="table-responsive">
              <table className="table mb-0">
                <thead>
                  <tr>
                    <th>Grupo</th>
                    <th>Tarea</th>
                    <th>Cantidad</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedMonthKpis.map((item) => (
                    <tr key={item._id}>
                      <td>{item.taskGroupName}</td>
                      <td>{item.taskName}</td>
                      <td>{item.quantity}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {selectedMonthKpis.length === 0 ? (
              <p className="text-muted mb-0 mt-3">No hay registros para el mes seleccionado.</p>
            ) : null}
          </div>
        </div>
        <div className="card border-0 shadow-sm mt-4">
          <div className="card-body">
            <h2 className="h5 mb-3">Historial de reportes</h2>
            <div className="table-responsive">
              <table className="table mb-0">
                <thead>
                  <tr>
                    <th>Mes</th>
                    <th>Cantidad total</th>
                    <th>Total tareas</th>
                    <th>Total grupos</th>
                  </tr>
                </thead>
                <tbody>
                  {reports.map((report) => (
                    <tr key={report._id}>
                      <td>{report.month}</td>
                      <td>{report.totalQuantity}</td>
                      <td>{report.totalTasks}</td>
                      <td>{report.totalGroups}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
