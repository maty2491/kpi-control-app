import { Link } from "react-router-dom";

export const EmployeeTable = ({ employees }) => (
  <div className="card border-0 shadow-sm">
    <div className="card-body">
      {employees.length === 0 ? (
        <div className="text-center py-5">
          <h2 className="h5">Todavia no hay empleados cargados</h2>
          <p className="text-muted mb-0">
            Crea el primero desde el formulario para empezar a asignar KPIs y generar reportes.
          </p>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table align-middle mb-0">
            <thead>
              <tr>
                <th>Legajo</th>
                <th>Empleado</th>
                <th>Departamento</th>
                <th>Cargo</th>
                <th>Supervisor</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {employees.map((employee) => (
                <tr key={employee._id}>
                  <td>{employee.legajo}</td>
                  <td>{employee.fullName}</td>
                  <td>{employee.department}</td>
                  <td>{employee.position}</td>
                  <td>{employee.supervisor?.name}</td>
                  <td className="text-end">
                    <Link className="btn btn-sm btn-outline-primary" to={`/employees/${employee._id}`}>
                      Ver detalle
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  </div>
);
