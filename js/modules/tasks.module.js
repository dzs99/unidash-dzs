import { getTasks, saveTasks } from "../services/storage.service.js";

const priorityLabels = {
  low: 'Baja',
  medium: 'Media',
  high: 'Alta'
}

let onChange = () => {}

const todayISO = () => {
  const date = new Date()
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`
}

export function isTaskOverdue(task) {
  return task.status !== 'completed' && task.dueDate < todayISO()
}

const taskBadge = (task) => {
  if (task.status === 'completed') {
    return `<span class="badge badge-completed">Completada</span>`
  }
  if (isTaskOverdue(task)) {
    return `<span class="badge badge-overdue">Vencida</span>`
  }
  return `
    <span class="badge badge-${task.priority}">
      ${task.priority}
    </span>
  `
}

const renderTaskList = (filter = 'all') => {
  const container = document.querySelector('#task-list')
  const tasks = getTasks().filter((task) => {
    if (filter === 'all') return true
    if (filter === 'completed') return task.status === 'completed'
    if (filter === 'pending') return task.status !== 'completed' && !isTaskOverdue(task)
    if (filter === 'overdue') return isTaskOverdue(task)
    return true
  }).sort((a, b) => a.dueDate.localeCompare(b.dueDate))

  if (!tasks.length) {
    container.innerHTML = `<div class="empty-state">No hay tareas para el filtro</div>`
    return
  }

  container.innerHTML = tasks.map((task) => `
    <article class="list-item">
      <div class="list-item-main">
        <div class="flex flex-wrap items-center gap-2">
          <p class="list-item-title">${escapeHtml(task.title)}</p>
          ${taskBadge(task)}
        </div>
        <p class="list-item-meta">
          ${escapeHtml(task.category)} - Vence ${formatDate(task.dueDate)}
        </p>
        ${task.description ? `<p class="list-item-description">${escapeHtml(task.description)}</p>` : ""}
      </div>
      <div class="list-actions">
        <button class="mini-button" data-task-action="toggle" data-id="${task.id}">
          ${task.status === 'completed' ? 'Reabrir' : 'Completar'}
        </button>
        <button class="mini-button" data-task-action="edit" data-id="${task.id}">
          Editar
        </button>
        <button class="mini-button" data-task-action="delete" data-id="${task.id}">
          Eliminar
        </button>
      </div>
    </article>
  `).join('')
}

function escapeHtml(value) {
  return String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;")
}

function formatDate(value) {
  return new Intl.DateTimeFormat("es-MX", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "UTC"
  }).format(new Date(`${value}T00:00:00Z`))
}

function resetForm() {
  document.querySelector("#task-form").reset()
  document.querySelector("#task-id").value = ""
  document.querySelector("#task-submit-button").textContent = "Guardar tarea"
  document.querySelector("#task-cancel-button").classList.add("hidden")
  document.querySelector("#task-due-date").value = todayISO()
}

function startEdit(taskId) {
  const task = getTasks().find((item) => item.id === taskId)
  if (!task) return
  document.querySelector("#task-id").value = task.id
  document.querySelector("#task-title").value = task.title
  document.querySelector("#task-description").value = task.description
  document.querySelector("#task-category").value = task.category
  document.querySelector("#task-priority").value = task.priority
  document.querySelector("#task-due-date").value = task.dueDate
  document.querySelector("#task-submit-button").textContent = "Actualizar tarea"
  document.querySelector("#task-cancel-button").classList.remove("hidden")
  document.querySelector("#task-title").focus()
}

function saveTask(event) {
  event.preventDefault()
  const id = document.querySelector("#task-id").value
  const tasks = getTasks()
  const taskData = {
    title: document.querySelector("#task-title").value.trim(),
    description: document.querySelector("#task-description").value.trim(),
    category: document.querySelector("#task-category").value,
    priority: document.querySelector("#task-priority").value,
    dueDate: document.querySelector("#task-due-date").value
  }
  if (!taskData.title || !taskData.dueDate) return
  if (id) {
    const index = tasks.findIndex((task) => task.id === id)
    if (index >= 0) tasks[index] = { ...tasks[index], ...taskData }
  } else {
    tasks.push({
      id: crypto.randomUUID(),
      ...taskData,
      status: "pending",
      createdAt: new Date().toISOString()
    })
  }
  saveTasks(tasks)
  resetForm()
  refreshTasks()
  onChange()
}

function handleTaskAction(event) {
  const button = event.target.closest("[data-task-action]")
  if (!button) return
  const { taskAction, id } = button.dataset
  const tasks = getTasks()
  const task = tasks.find((item) => item.id === id)
  if (!task) return
  if (taskAction === "toggle") {
    task.status = task.status === "completed" ? "pending" : "completed"
    saveTasks(tasks)
  }
  if (taskAction === "delete") {
    saveTasks(tasks.filter((item) => item.id !== id))
  }
  if (taskAction === "edit") {
    startEdit(id)
    return
  }
  refreshTasks()
  onChange()
}

export function refreshTasks() {
  renderTaskList(document.querySelector("#task-filter")?.value || "all")
}

export function initTasksModule(callback) {
  onChange = callback
  document.querySelector("#task-form").addEventListener("submit", saveTask)
  document.querySelector("#task-list").addEventListener("click", handleTaskAction)
  document.querySelector("#task-filter").addEventListener("change", refreshTasks)
  document.querySelector("#task-cancel-button").addEventListener("click", resetForm)
  resetForm()
  refreshTasks()
}
