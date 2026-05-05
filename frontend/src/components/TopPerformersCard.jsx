export const TopPerformersCard = ({ ranking }) => (
  <div className="card border-0 shadow-sm h-100">
    <div className="card-body">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="h5 mb-0">Top Performers</h2>
        <span className="badge text-bg-warning">Mes actual</span>
      </div>
      <div className="list-group list-group-flush">
        {ranking.map((item, index) => (
          <div key={item.employeeId} className="list-group-item px-0 d-flex justify-content-between">
            <div>
              <div className="fw-semibold">
                #{index + 1} {item.fullName}
              </div>
              <small className="text-muted">{item.department}</small>
            </div>
            <div className="text-end">
              <div className="fw-semibold">{item.totalQuantity}</div>
              <small className="text-muted">cantidad total</small>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);
