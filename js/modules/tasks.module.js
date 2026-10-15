import { mockTasks } from "../data/mock.data.js"

function escapeHtml(value) {
  return String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;")
}

function badge(task) {
  if (task.status === "completed") return '<span class="badge badge-completed">Completada</span>'
  return `<span class="badge badge-${task.priority}">${task.priority}</span>`
}

export function renderTasksVisual() {
  const list = document.querySelector("#task-list")
  const upcoming = document.querySelector("#dashboard-task-list")
  list.innerHTML = mockTasks.map((task) => `
    <article class="list-item">
      <div class="list-item-main">
        <p class="list-item-title">${escapeHtml(task.title)}</p>
        <p class="list-item-meta">${task.category} · ${task.dueDate}</p>
        <p class="text-sm text-slate-400">${escapeHtml(task.description)}</p>
      </div>
      ${badge(task)}
    </article>`).join("")
  upcoming.innerHTML = mockTasks.filter((t) => t.status !== "completed").slice(0,4).map((task) => `
    <article class="list-item"><div class="list-item-main"><p class="list-item-title">${escapeHtml(task.title)}</p><p class="list-item-meta">${task.category} · ${task.dueDate}</p></div>${badge(task)}</article>`).join("")
}

export function initTasksVisualDemo() {
  renderTasksVisual()
  document.querySelector("#task-form")?.addEventListener("submit", (event) => {
    event.preventDefault()
    alert("Sesión 1: este formulario es visual. El guardado se habilita en la Sesión 2.")
  })
}
