import { Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { DepartmentProvider } from "./context/DepartmentContext";
import { MonthProvider } from "./context/MonthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { Layout } from "./components/Layout";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { DashboardPage } from "./pages/DashboardPage";
import { EmployeesPage } from "./pages/EmployeesPage";
import { EmployeeDetailPage } from "./pages/EmployeeDetailPage";
import { PerformanceBoardPage } from "./pages/PerformanceBoardPage";

function App() {
  return (
    <AuthProvider>
      <MonthProvider>
        <DepartmentProvider>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<DashboardPage />} />
              <Route path="employees" element={<EmployeesPage />} />
              <Route path="employees/:id" element={<EmployeeDetailPage />} />
              <Route path="performance-board" element={<PerformanceBoardPage />} />
            </Route>
          </Routes>
        </DepartmentProvider>
      </MonthProvider>
    </AuthProvider>
  );
}

export default App;
