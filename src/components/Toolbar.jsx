export default function Toolbar({ onSync, onClear, onExport }) {
  return (
    <div className="card shadow-sm mb-4">
      <div className="card-body d-flex flex-wrap gap-2">
        <button className="btn btn-primary btn-sm" onClick={onSync}>
          <i className="bi bi-arrow-repeat me-2"></i>
          Sync from API
        </button>

        <button className="btn btn-outline-secondary btn-sm" onClick={onClear}>
          <i className="bi bi-eraser me-2"></i>
          Clear LocalStorage
        </button>

        <button className="btn btn-success btn-sm" onClick={onExport}>
          <i className="bi bi-download me-2"></i>
          Export JSON
        </button>
      </div>
    </div>
  );
}