import { useMemo, useState } from "react";

function priorityBadge(priority) {
  if (priority === "High") return "badge text-bg-danger";
  if (priority === "Medium") return "badge text-bg-warning";
  return "badge text-bg-success";
}

export default function TaskList({
  tasks,
  filter,
  onFilterChange,
  search,
  onSearchChange,
  sort,
  onSortChange,
  onToggleComplete,
  onDelete,
  onEditTitle,
}) {
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState("");

  const counts = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter((t) => t.completed).length;
    const active = total - completed;
    return { total, completed, active };
  }, [tasks]);

  const visibleTasks = useMemo(() => {
    let list = [...tasks];

    // filter
    if (filter === "active") list = list.filter((t) => !t.completed);
    if (filter === "completed") list = list.filter((t) => t.completed);

    // search
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter((t) => {
        const hay = `${t.title} ${t.description} ${(t.tags || []).join(" ")}`.toLowerCase();
        return hay.includes(q);
      });
    }

    // sort
    if (sort === "newest") list.sort((a, b) => b.createdAt - a.createdAt);
    if (sort === "oldest") list.sort((a, b) => a.createdAt - b.createdAt);
    if (sort === "dueSoon") {
      list.sort((a, b) => {
        const ad = a.dueDate ? new Date(a.dueDate).getTime() : Number.POSITIVE_INFINITY;
        const bd = b.dueDate ? new Date(b.dueDate).getTime() : Number.POSITIVE_INFINITY;
        return ad - bd;
      });
    }

    return list;
  }, [tasks, filter, search, sort]);

  function startEdit(task) {
    setEditingId(task.id);
    setEditValue(task.title);
  }

  function saveEdit(id) {
    const v = editValue.trim();
    if (v) onEditTitle(id, v);
    setEditingId(null);
    setEditValue("");
  }

  return (
    <div className="card shadow-sm">
      <div className="card-body">
        <h5 className="mb-3">Task List</h5>

        {/* Tabs */}
        <div className="d-flex gap-2 mb-3">
          <button
            className={`btn btn-sm ${filter === "all" ? "btn-primary" : "btn-outline-primary"}`}
            onClick={() => onFilterChange("all")}
          >
            All <span className="ms-1 badge text-bg-light">{counts.total}</span>
          </button>

          <button
            className={`btn btn-sm ${filter === "active" ? "btn-primary" : "btn-outline-primary"}`}
            onClick={() => onFilterChange("active")}
          >
            Active <span className="ms-1 badge text-bg-light">{counts.active}</span>
          </button>

          <button
            className={`btn btn-sm ${filter === "completed" ? "btn-primary" : "btn-outline-primary"}`}
            onClick={() => onFilterChange("completed")}
          >
            Completed <span className="ms-1 badge text-bg-light">{counts.completed}</span>
          </button>
        </div>

        {/* Search + Sort */}
        <div className="d-flex gap-2 align-items-center mb-3">
          <div className="input-group input-group-sm">
            <span className="input-group-text">
              <i className="bi bi-search" />
            </span>
            <input
              className="form-control"
              placeholder="Search tasks..."
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>

          <select
            className="form-select form-select-sm w-auto"
            value={sort}
            onChange={(e) => onSortChange(e.target.value)}
          >
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="dueSoon">Due Soon</option>
          </select>
        </div>

        {/* List */}
        {visibleTasks.length === 0 ? (
          <div className="text-center text-muted p-4 border rounded empty-state">
            <div style={{ fontSize: "40px" }}>📋</div>
            <p className="mb-1">No tasks yet</p>
            <small>Add your first task to get started with your TODO list.</small>
          </div>
        ) : (
          <div className="vstack gap-2">
            {visibleTasks.map((t) => (
              <div key={t.id} className="border rounded p-3">
                <div className="d-flex justify-content-between gap-3">
                  <div className="d-flex gap-2">
                    <input
                      type="checkbox"
                      className="form-check-input mt-1"
                      checked={t.completed}
                      onChange={() => onToggleComplete(t.id)}
                    />
                    <div>
                      {editingId === t.id ? (
                        <div className="d-flex gap-2">
                          <input
                            className="form-control form-control-sm"
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                          />
                          <button className="btn btn-sm btn-primary" onClick={() => saveEdit(t.id)}>
                            Save
                          </button>
                          <button className="btn btn-sm btn-outline-secondary" onClick={() => setEditingId(null)}>
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <>
                          <div className={`fw-semibold ${t.completed ? "text-decoration-line-through text-muted" : ""}`}>
                            {t.title}
                          </div>
                          {t.dueDate && (
                            <div className="text-muted small">
                              Due: {new Date(t.dueDate).toLocaleDateString()}
                            </div>
                          )}
                          {t.description && <div className="text-muted small mt-1">{t.description}</div>}

                          <div className="d-flex flex-wrap gap-2 mt-2">
                            <span className={priorityBadge(t.priority)}>{t.priority}</span>
                            {(t.tags || []).map((tag, idx) => (
                              <span key={idx} className="badge text-bg-light border fw-normal">
                                {tag}
                              </span>
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                  </div>

               {editingId !== t.id && (
  <div className="d-flex gap-2 align-items-start flex-shrink-0">

  <button
    type="button"
    className="btn btn-outline-primary btn-sm d-flex align-items-center gap-1"
    onClick={() => startEdit(t)}
  >
    <i className="bi bi-pencil"></i>
    Edit
  </button>

  <button
    type="button"
    className="btn btn-outline-danger btn-sm d-flex align-items-center gap-1"
    onClick={() => onDelete(t.id)}
  >
    <i className="bi bi-trash"></i>
    Delete
  </button>

</div>
)}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* footer counts */}
        <div className="d-flex justify-content-between text-muted small mt-3">
          <div>{counts.active} tasks remaining</div>
          <div>{counts.completed} completed</div>
        </div>
      </div>
    </div>
  );
}