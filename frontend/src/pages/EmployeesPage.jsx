import { useEffect, useState } from "react";
import { EmployeeForm } from "../components/EmployeeForm";
import { EmployeeTable } from "../components/EmployeeTable";
import { PageHeader } from "../components/PageHeader";
import { useAuth } from "../context/AuthContext";
import { useDepartment } from "../context/DepartmentContext";
import { api } from "../services/api";

export const EmployeesPage = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const { user } = useAuth();
  const { selectedDepartment } = useDepartment();

  const loadEmployees = async () => {
    const endpoint =
      selectedDepartment && user?.role === "admin"
        ? `/employees?department=${encodeURIComponent(selectedDepartment)}`
        : "/employees";
    const { data } = await api.get(endpoint);
    setEmployees(data);
  };

  useEffect(() => {
    loadEmployees();
  }, [selectedDepartment, user?.role]);

  const handleCreateEmployee = async (formData) => {
    try {
      setLoading(true);
      setError("");
      setSuccess("");

      const payload =
        user?.role === "admin"
          ? formData
          : {
              legajo: formData.legajo,
              fullName: formData.fullName,
              position: formData.position,
            };

      await api.post("/employees", payload);
      setSuccess("Empleado creado correctamente.");
      await loadEmployees();
    } catch (requestError) {
      setError(requestError.response?.data?.message || "No se pudo crear el empleado.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section>
      <PageHeader
        eyebrow="Gestion"
        title="Empleados"
        description="Listado filtrado por permisos del usuario autenticado."
        aside={
          <div className="text-end">
            <div className="small text-muted">Total visible</div>
            <div className="fw-semibold">{employees.length}</div>
            {selectedDepartment && user?.role === "admin" ? (
              <div className="small text-muted mt-2">{selectedDepartment}</div>
            ) : null}
          </div>
        }
      />
      {user?.role === "admin" || user?.role === "manager" ? (
        <EmployeeForm
          error={error}
          loading={loading}
          onSubmit={handleCreateEmployee}
          userRole={user?.role}
        />
      ) : null}
      {success ? <div className="alert alert-success py-2">{success}</div> : null}
      <EmployeeTable employees={employees} />
    </section>
  );
};
