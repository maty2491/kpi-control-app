import { useEffect, useState } from "react";
import { api } from "../services/api";

export const MonthlyNoteCard = ({ employeeId, month, readOnly }) => {
  const [note, setNote] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    api.get(`/monthly-notes/${employeeId}?month=${month}`).then(({ data }) => {
      setNote(data.note || "");
    });
  }, [employeeId, month]);

  const save = async () => {
    await api.put(`/monthly-notes/${employeeId}`, { month, note });
    setStatus("Observacion guardada.");
    window.setTimeout(() => setStatus(""), 2500);
  };

  return (
    <div className="card border-0 shadow-sm mt-4">
      <div className="card-body">
        <h2 className="h5 mb-3">Observacion del mes</h2>
        <textarea
          className="form-control"
          rows="4"
          value={note}
          onChange={(event) => setNote(event.target.value)}
          placeholder="Ej: cubrio reemplazos, tuvo licencias, apoyo a otra area..."
          disabled={readOnly}
        />
        <div className="d-flex justify-content-between align-items-center mt-3">
          <small className="text-muted">Mes: {month}</small>
          <div className="d-flex align-items-center gap-2">
            {status ? <small className="text-success">{status}</small> : null}
            <button className="btn btn-primary btn-sm" type="button" onClick={save} disabled={readOnly}>
              Guardar observacion
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
