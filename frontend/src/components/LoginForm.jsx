import { useState } from "react";
import { Link } from "react-router-dom";

export const LoginForm = ({ onSubmit, error, loading, successMessage }) => {
  const [form, setForm] = useState({ email: "", password: "" });

  const handleChange = (event) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="card shadow-sm border-0">
      <div className="card-body p-4">
        <h1 className="h3 mb-4">Ingreso al sistema</h1>
        {successMessage ? <div className="alert alert-success py-2">{successMessage}</div> : null}
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
            required
          />
        </div>
        {error ? <div className="alert alert-danger py-2">{error}</div> : null}
        <button className="btn btn-primary w-100" disabled={loading} type="submit">
          {loading ? "Ingresando..." : "Ingresar"}
        </button>
        <div className="text-center mt-3">
          <Link to="/register" className="text-decoration-none">
            Crear usuario
          </Link>
        </div>
      </div>
    </form>
  );
};
