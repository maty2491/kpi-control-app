import { useAuth } from "../context/AuthContext";
import { useDepartment } from "../context/DepartmentContext";

export const GlobalDepartmentPicker = () => {
  const { user } = useAuth();
  const { departments, selectedDepartment, setSelectedDepartment } = useDepartment();

  if (user?.role !== "admin") {
    return null;
  }

  return (
    <div className="d-flex flex-column gap-2">
      <label className="small text-muted mb-0">Departamento</label>
      <select
        className="form-select form-select-sm"
        value={selectedDepartment}
        onChange={(event) => setSelectedDepartment(event.target.value)}
      >
        {departments.map((department) => (
          <option key={department} value={department}>
            {department}
          </option>
        ))}
      </select>
    </div>
  );
};
