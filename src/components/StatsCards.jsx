export default function StatsCards({ total = 0, completed = 0, pending = 0 }) {
  return (
    <div className="row g-3 mb-3">
      <div className="col-12 col-md-4">
        <div className="card shadow-sm">
          <div className="card-body d-flex align-items-center gap-3">
            <div className="icon-pill bg-primary-subtle text-primary">📋</div>
            <div>
              <div className="text-muted small">Total Tasks</div>
              <div className="fs-4 fw-bold">{total}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="col-12 col-md-4">
        <div className="card shadow-sm">
          <div className="card-body d-flex align-items-center gap-3">
            <div className="icon-pill bg-success-subtle text-success">✔</div>
            <div>
              <div className="text-muted small">Completed</div>
              <div className="fs-4 fw-bold">{completed}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="col-12 col-md-4">
        <div className="card shadow-sm">
          <div className="card-body d-flex align-items-center gap-3">
            <div className="icon-pill bg-warning-subtle text-warning">⏳</div>
            <div>
              <div className="text-muted small">Pending</div>
              <div className="fs-4 fw-bold">{pending}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}