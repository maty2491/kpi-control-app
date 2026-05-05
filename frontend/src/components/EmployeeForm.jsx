import { useState } from "react";

const initialForm = {
  legajo: "",
  fullName: "",
  position: "",
  department: "",
  supervisor: "",
};

export const EmployeeForm = ({ onSubmit, loading, error, userRole }) => {
  const [form, setForm] = useState(initialForm);

  const handleChange = (event) => {
    setForm((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    await onSubmit(form);
    setForm(initialForm);
  };

  return (
    <form onSubmit={handleSubmit} className="card border-0 shadow-sm mb-4">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div>
            <h2 className="h5 mb-1">Nuevo empleado</h2>
            <p className="text-muted mb-0">
              {userRole === "manager"
                ? "El departamento y supervisor se asignan automaticamente segun tu cuenta."
                : "Como admin puedes definir supervisor y departamento desde la API o extender este formulario."}
            </p>
          </div>
        </div>

        <div className="row g-3">
          <div className="col-md-4">
            <label className="form-label">Legajo</label>
            <input
              className="form-control"
              name="legajo"
              value={form.legajo}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-4">
            <label className="form-label">Nombre completo</label>
            <input
              className="form-control"
              name="fullName"
              value={form.fullName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-4">
            <label className="form-label">Cargo</label>
            <input
              className="form-control"
              name="position"
              value={form.position}
              onChange={handleChange}
              required
            />
          </div>

          {userRole === "admin" ? (
            <>
              <div className="col-md-6">
                <label className="form-label">Departamento</label>
                <input
                  className="form-control"
                  name="department"
                  value={form.department}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Supervisor (ObjectId)</label>
                <input
                  className="form-control"
                  name="supervisor"
                  value={form.supervisor}
                  onChange={handleChange}
                  required
                />
              </div>
            </>
          ) : null}
        </div>

        {error ? <div className="alert alert-danger py-2 mt-3 mb-0">{error}</div> : null}

        <button className="btn btn-primary mt-4" disabled={loading} type="submit">
          {loading ? "Guardando..." : "Crear empleado"}
        </button>
      </div>
    </form>
  );
};
