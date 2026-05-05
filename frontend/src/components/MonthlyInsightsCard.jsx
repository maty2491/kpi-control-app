export const MonthlyInsightsCard = ({ ranking, kpis }) => {
  const topPerformer = ranking[0];

  const totalsByTask = kpis.reduce((acc, item) => {
    const key = `${item.taskGroupName} / ${item.taskName}`;
    acc[key] = (acc[key] || 0) + item.quantity;
    return acc;
  }, {});

  const mostProductiveTask = Object.entries(totalsByTask).sort((a, b) => b[1] - a[1])[0];
  const totalQuantity = kpis.reduce((sum, item) => sum + item.quantity, 0);
  const activeGroups = new Set(kpis.map((item) => item.taskGroupName)).size;

  return (
    <div className="card border-0 shadow-sm h-100">
      <div className="card-body">
        <h2 className="h5 mb-3">Resumen mensual</h2>
        <div className="mb-3">
          <small className="text-muted d-block">Empleado destacado</small>
          <div className="fw-semibold">
            {topPerformer ? `${topPerformer.fullName} (${topPerformer.totalQuantity})` : "Sin datos"}
          </div>
        </div>
        <div className="mb-3">
          <small className="text-muted d-block">Tarea con mayor volumen</small>
          <div className="fw-semibold">
            {mostProductiveTask ? `${mostProductiveTask[0]}: ${mostProductiveTask[1]}` : "Sin registros"}
          </div>
        </div>
        <div className="mb-3">
          <small className="text-muted d-block">Cantidad total registrada</small>
          <div className="fw-semibold">{totalQuantity}</div>
        </div>
        <div>
          <small className="text-muted d-block">Grupos activos del mes</small>
          <div className="fw-semibold">{activeGroups}</div>
        </div>
      </div>
    </div>
  );
};
