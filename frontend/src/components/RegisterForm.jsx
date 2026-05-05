import { useState } from "react";
import { Link } from "react-router-dom";

const initialForm = {
  name: "",
  email: "",
  password: "",
  role: "manager",
  department: "",
};

export const RegisterForm = ({ onSubmit, error, loading }) => {
  const [form, setForm] = useState(initialForm);

  const handleChange = (event) => {
    setForm((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="card shadow-sm border-0">
      <div className="card-body p-4">
        <h1 className="h3 mb-2">Crear usuario</h1>
        <p className="text-muted mb-4">Usa este formulario para dar de alta un manager.</p>

        <div className="mb-3">
          <label className="form-label">Nombre</label>
          <input className="form-control" name="name" value={form.name} onChange={handleChange} required />
        </div>

        <div className="mb-3">
          <label className="form-label">Correo</label>
          <input
            className="form-control"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Contrasena</label>
          <input
            className="form-control"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            minLength="6"
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Rol</label>
          <select className="form-select" name="role" value={form.role} onChange={handleChange}>
            <option value="manager">Encargado</option>            
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label">Departamento</label>
          <input
            className="form-control"
            name="department"
            value={form.department}
            onChange={handleChange}
            required
          />
        </div>

        {error ? <div className="alert alert-danger py-2">{error}</div> : null}

        <button className="btn btn-primary w-100" disabled={loading} type="submit">
          {loading ? "Creando..." : "Crear usuario"}
        </button>

        <div className="text-center mt-3">
          <Link to="/login" className="text-decoration-none">
            Volver al login
          </Link>
        </div>
      </div>
    </form>
  );
};
