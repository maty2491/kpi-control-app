import { useEffect, useState } from "react";
import { BulkEntryCard } from "../components/BulkEntryCard";
import { MonthClosureCard } from "../components/MonthClosureCard";
import { PageHeader } from "../components/PageHeader";
import { PerformanceMatrix } from "../components/PerformanceMatrix";
import { useDepartment } from "../context/DepartmentContext";
import { useMonth } from "../context/MonthContext";
import { api } from "../services/api";

const getPreviousMonth = (month) => {
  const [year, monthNumber] = month.split("-").map(Number);
  return new Date(year, monthNumber - 2, 1).toISOString().slice(0, 7);
};

export const PerformanceBoardPage = () => {
  const { selectedMonth } = useMonth();
  const { selectedDepartment } = useDepartment();
  const [employees, setEmployees] = useState([]);
  const [kpis, setKpis] = useState([]);
  const [previousKpis, setPreviousKpis] = useState([]);
  const [closed, setClosed] = useState(false);

  const loadData = async () => {
    const previousMonth = getPreviousMonth(selectedMonth);
    const departmentQuery = selectedDepartment ? `&department=${encodeURIComponent(selectedDepartment)}` : "";
    const [employeesResponse, kpisResponse, previousResponse, closureResponse] = await Promise.all([
      api.get(selectedDepartment ? `/employees?department=${encodeURIComponent(selectedDepartment)}` : "/employees"),
      api.get(`/kpis?month=${selectedMonth}${departmentQuery}`),
      api.get(`/kpis?month=${previousMonth}${departmentQuery}`),
      api.get(`/month-closures?month=${selectedMonth}`),
    ]);

    setEmployees(employeesResponse.data);
    setKpis(kpisResponse.data);
    setPreviousKpis(previousResponse.data);
    setClosed(Boolean(closureResponse.data.closed));
  };

  useEffect(() => {
    loadData();
  }, [selectedMonth, selectedDepartment]);

  return (
    <section>
      <PageHeader
        eyebrow="Control operativo"
        title="Desempeno por empleados"
        description="Vista cruzada con empleados en columnas y tareas en filas para analizar cantidades por mes."
        aside={
          <div className="text-end">
            <div className="small text-muted">Mes analizado</div>
            <div className="fw-semibold">{selectedMonth}</div>
            {selectedDepartment ? <div className="small text-muted mt-2">{selectedDepartment}</div> : null}
          </div>
        }
      />

      <div className="row g-4 mb-4">
        <div className="col-lg-4">
          <MonthClosureCard month={selectedMonth} onChange={setClosed} />
        </div>
        <div className="col-lg-8">
          <BulkEntryCard employees={employees} month={selectedMonth} readOnly={closed} onSaved={loadData} />
        </div>
      </div>

      <PerformanceMatrix employees={employees} kpis={kpis} previousKpis={previousKpis} month={selectedMonth} />
    </section>
  );
};
