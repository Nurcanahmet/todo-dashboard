export default function ProgressBar({ percent = 0 }) {
  const value = Number.isFinite(percent) ? Math.max(0, Math.min(100, percent)) : 0;

  return (
    <div className="card shadow-sm mb-3">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <div className="fw-semibold">Overall Progress</div>
          <div className="text-muted small">{value.toFixed(0)}%</div>
        </div>

        <div className="progress" role="progressbar" aria-valuenow={value} aria-valuemin="0" aria-valuemax="100">
          <div className="progress-bar" style={{ width: `${value}%` }} />
        </div>
      </div>
    </div>
  );
}