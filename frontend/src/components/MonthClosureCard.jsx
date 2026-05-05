import { useEffect, useState } from "react";
import { api } from "../services/api";

export const MonthClosureCard = ({ month, onChange }) => {
  const [closed, setClosed] = useState(false);

  useEffect(() => {
    api.get(`/month-closures?month=${month}`).then(({ data }) => setClosed(Boolean(data.closed)));
  }, [month]);

  const toggle = async () => {
    const next = !closed;
    await api.put("/month-closures", { month, closed: next });
    setClosed(next);
    onChange?.(next);
  };

  return (
    <div className="card border-0 shadow-sm">
      <div className="card-body">
        <h2 className="h6 mb-2">Estado del mes</h2>
        <p className="text-muted small mb-3">
          Cuando un mes se cierra, ya no se pueden modificar cantidades ni observaciones.
        </p>
        <div className="d-flex justify-content-between align-items-center">
          <span className={`badge ${closed ? "text-bg-danger" : "text-bg-success"}`}>
            {closed ? "Mes cerrado" : "Mes abierto"}
          </span>
          <button className="btn btn-outline-secondary btn-sm" type="button" onClick={toggle}>
            {closed ? "Reabrir" : "Cerrar mes"}
          </button>
        </div>
      </div>
    </div>
  );
};
