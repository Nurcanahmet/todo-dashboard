import { useMemo, useState } from "react";

export default function AddTaskForm({ onAdd }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [tags, setTags] = useState("");

  const canSubmit = useMemo(() => title.trim().length > 0, [title]);

  function handleSubmit(e) {
    e.preventDefault();
    if (!canSubmit) return;

    const cleanTags = tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    onAdd({
      title: title.trim(),
      description: description.trim(),
      dueDate: dueDate ? dueDate : null,
      priority,
      tags: cleanTags,
    });

    setTitle("");
    setDescription("");
    setDueDate("");
    setPriority("Medium");
    setTags("");
  }

  return (
    <div className="card shadow-sm">
      <div className="card-body">
        <h5 className="mb-3">Add Task</h5>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Task Title</label>
            <input
              className="form-control"
              placeholder="Enter task title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Description</label>
            <textarea
              className="form-control"
              rows={3}
              placeholder="Enter task description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Due Date</label>
            <input
              type="date"
              className="form-control"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Priority</label>
            <select
              className="form-select"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
            >
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
            </select>
          </div>

          <div className="mb-3">
            <label className="form-label">Tags</label>
            <input
              className="form-control"
              placeholder="Enter tags separated by commas"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
            />
          </div>

          <button className="btn btn-primary w-100" disabled={!canSubmit}>
            + Add Task
          </button>
        </form>
      </div>
    </div>
  );
}