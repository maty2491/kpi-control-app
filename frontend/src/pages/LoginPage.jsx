import { useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { LoginForm } from "../components/LoginForm";
import { useAuth } from "../context/AuthContext";

export const LoginPage = () => {
  const { login, token } = useAuth();
  const location = useLocation();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (token) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleLogin = async (credentials) => {
    try {
      setLoading(true);
      setError("");
      await login(credentials);
    } catch (loginError) {
      setError(loginError.response?.data?.message || "No se pudo iniciar sesion");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container min-vh-100 d-flex align-items-center justify-content-center">
      <div className="col-md-5 col-lg-4">
        <LoginForm
          onSubmit={handleLogin}
          error={error}
          loading={loading}
          successMessage={location.state?.successMessage || ""}
        />
      </div>
    </div>
  );
};
