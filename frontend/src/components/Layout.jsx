import { useState } from "react";
import { Link, NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { GlobalDepartmentPicker } from "./GlobalDepartmentPicker";
import { GlobalMonthPicker } from "./GlobalMonthPicker";

const navigationItems = [
  { to: "/dashboard", label: "Dashboard", short: "DB" },
  { to: "/employees", label: "Empleados", short: "EM" },
  { to: "/performance-board", label: "Desempeño", short: "DP" },
];

export const Layout = () => {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="app-shell">
      <aside className={`app-sidebar ${sidebarOpen ? "is-open" : ""}`}>
        <div className="app-sidebar__header">
          <Link className="app-sidebar__brand" to="/dashboard" onClick={closeSidebar}>
            Gerenciar Control
          </Link>
          <button
            type="button"
            className="btn btn-sm btn-outline-secondary d-lg-none"
            onClick={closeSidebar}
          >
            Cerrar
          </button>
        </div>

        <div className="app-sidebar__month">
          <GlobalMonthPicker />
        </div>
        <div className="app-sidebar__month">
          <GlobalDepartmentPicker />
        </div>

        <nav className="app-sidebar__nav">
          {navigationItems.map((item) => (
            <NavLink
              key={item.to}
              className={({ isActive }) => `app-sidebar__link ${isActive ? "is-active" : ""}`}
              to={item.to}
              onClick={closeSidebar}
            >
              <span className="app-sidebar__link-badge">{item.short}</span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="app-sidebar__footer">
          <div className="app-sidebar__user">
            <div className="fw-semibold">{user?.name}</div>
            <small className="text-muted text-uppercase">
              {user?.role} | {user?.department}
            </small>
          </div>
          <button type="button" className="btn btn-outline-danger btn-sm w-100 mt-3" onClick={logout}>
            Salir
          </button>
        </div>
      </aside>

      {sidebarOpen ? <div className="app-sidebar__backdrop d-lg-none" onClick={closeSidebar} /> : null}

      <div className="app-main">
        <header className="app-topbar d-lg-none">
          <button type="button" className="btn btn-outline-primary" onClick={() => setSidebarOpen(true)}>
            Menu
          </button>
          <Link className="app-topbar__brand" to="/dashboard">
            Gerenciar Control
          </Link>
        </header>

        <main className="app-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
