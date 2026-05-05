import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { RegisterForm } from "../components/RegisterForm";
import { useAuth } from "../context/AuthContext";
import { api } from "../services/api";

export const RegisterPage = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (token) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleRegister = async (formData) => {
    try {
      setLoading(true);
      setError("");
      await api.post("/auth/register", formData);
      navigate("/login", {
        replace: true,
        state: { successMessage: "Usuario creado correctamente. Ya puedes iniciar sesion." },
      });
    } catch (requestError) {
      setError(requestError.response?.data?.message || "No se pudo crear el usuario.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container min-vh-100 d-flex align-items-center justify-content-center">
      <div className="col-md-5 col-lg-4">
        <RegisterForm onSubmit={handleRegister} error={error} loading={loading} />
      </div>
    </div>
  );
};
