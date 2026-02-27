import { useEffect, useMemo, useState } from "react";

import StatsCards from "../components/StatsCards";
import ProgressBar from "../components/ProgressBar";
import Toolbar from "../components/Toolbar";
import AddTaskForm from "../components/AddTaskForm";
import TaskList from "../components/TaskList";

const STORAGE_KEY = "todo_dashboard_tasks_v1";

function uid() {
  return crypto?.randomUUID ? crypto.randomUUID() : String(Date.now() + Math.random());
}

function safeParse(json, fallback) {
  try {
    return JSON.parse(json);
  } catch {
    return fallback;
  }
}

export default function TodoDashboard() {
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? safeParse(saved, []) : [];
  });

  const [filter, setFilter] = useState("all"); // all | active | completed
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("newest"); // newest | oldest | dueSoon

  // save to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks]);

  const stats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter((t) => t.completed).length;
    const pending = total - completed;
    const percent = total === 0 ? 0 : (completed / total) * 100;
    return { total, completed, pending, percent };
  }, [tasks]);

  function addTask(partial) {
    setTasks((prev) => [
      {
        id: uid(),
        title: partial.title,
        description: partial.description || "",
        dueDate: partial.dueDate || null,
        priority: partial.priority || "Medium",
        tags: partial.tags || [],
        completed: false,
        createdAt: Date.now(),
        updatedAt: null,
      },
      ...prev,
    ]);
  }

  function toggleComplete(id) {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, completed: !t.completed, updatedAt: Date.now() } : t
      )
    );
  }

  function deleteTask(id) {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }

  function editTitle(id, newTitle) {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, title: newTitle, updatedAt: Date.now() } : t))
    );
  }

  async function syncFromAPI() {
    // demo API
    try {
      const res = await fetch("https://jsonplaceholder.typicode.com/todos?_limit=5");
      const data = await res.json();

      const mapped = data.map((x) => ({
        id: uid(),
        title: x.title,
        description: "Synced from API (demo)",
        dueDate: null,
        priority: "Low",
        tags: ["api"],
        completed: Boolean(x.completed),
        createdAt: Date.now(),
        updatedAt: null,
      }));

      setTasks((prev) => [...mapped, ...prev]);
    } catch {
      alert("API sync failed. Check your internet connection.");
    }
  }

  function clearLocal() {
    if (!confirm("Clear all tasks from LocalStorage?")) return;
    localStorage.removeItem(STORAGE_KEY);
    setTasks([]);
  }

  function exportJSON() {
    const blob = new Blob([JSON.stringify(tasks, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "tasks.json";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="min-vh-100 bg-light">
      {/* Header */}
      <div className="topbar">
        <div className="container py-3">
          <div className="d-flex align-items-center gap-2 text-white">
            <div className="logo-circle">
              <i className="bi bi-check2"></i>
            </div>
            <div>
              <div className="h4 m-0 fw-bold">TODO Dashboard</div>
              <div className="small opacity-75">CRUD operations + LocalStorage + optional API fetch</div>
            </div>
          </div>
        </div>
      </div>

      <div className="container my-4">
        {/* Stats */}
        <StatsCards total={stats.total} completed={stats.completed} pending={stats.pending} />

        {/* Progress */}
        <ProgressBar percent={stats.percent} />

        {/* Toolbar */}
        <Toolbar onSync={syncFromAPI} onClear={clearLocal} onExport={exportJSON} />

        {/* Main */}
        <div className="row g-3">
          <div className="col-12 col-lg-5">
            <AddTaskForm onAdd={addTask} />
          </div>

          <div className="col-12 col-lg-7">
            <TaskList
              tasks={tasks}
              filter={filter}
              onFilterChange={setFilter}
              search={search}
              onSearchChange={setSearch}
              sort={sort}
              onSortChange={setSort}
              onToggleComplete={toggleComplete}
              onDelete={deleteTask}
              onEditTitle={editTitle}
            />
          </div>
        </div>
      </div>
    </div>
  );
}