import { getTasks, getTransactions } from "../services/storage.service.js"
import { isTaskOverdue } from "./tasks.module.js"

function money(value) {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    maximumFractionDigits: 2
  }).format(value)
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;")
}

function renderMetrics() {
  const transactions = getTransactions()
  const tasks = getTasks()
  const income = transactions.filter((item) => item.type === "income").reduce((sum, item) => sum + item.amount, 0)
  const expense = transactions.filter((item) => item.type === "expense").reduce((sum, item) => sum + item.amount, 0)
  const pending = tasks.filter((task) => task.status !== "completed").length
  const overdue = tasks.filter(isTaskOverdue).length

  document.querySelector("#metric-balance").textContent = money(income - expense)
  document.querySelector("#metric-income").textContent = money(income)
  document.querySelector("#metric-expense").textContent = money(expense)
  document.querySelector("#metric-pending").textContent = pending
  document.querySelector("#metric-overdue").textContent = overdue

  document.querySelector("#analytics-total-tasks").textContent = tasks.length
  document.querySelector("#analytics-completed").textContent = tasks.filter((task) => task.status === "completed").length
  document.querySelector("#analytics-saving-rate").textContent = income > 0 ? `${Math.round(((income - expense) / income) * 100)}%` : "0%"

  const expenseByCategory = transactions
    .filter((item) => item.type === "expense")
    .reduce((acc, item) => {
      acc[item.category] = (acc[item.category] || 0) + item.amount
      return acc
    }, {})
  const topCategory = Object.entries(expenseByCategory).sort((a, b) => b[1] - a[1])[0]
  document.querySelector("#analytics-top-category").textContent = topCategory ? topCategory[0] : "Sin datos"
}

function renderUpcomingTasks() {
  const container = document.querySelector("#dashboard-task-list")
  const tasks = getTasks()
    .filter((task) => task.status !== "completed")
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate))
    .slice(0, 4)

  if (!tasks.length) {
    container.innerHTML = '<div class="empty-state">No tienes tareas pendientes.</div>'
    return
  }

  container.innerHTML = tasks.map((task) => `
    <article class="list-item">
      <div class="list-item-main">
        <p class="list-item-title">${escapeHtml(task.title)}</p>
        <p class="list-item-meta">${task.category} · ${task.dueDate}</p>
      </div>
      <span class="badge ${isTaskOverdue(task) ? "badge-overdue" : `badge-${task.priority}`}">${isTaskOverdue(task) ? "Vencida" : task.priority}</span>
    </article>
  `).join("")
}

export function refreshDashboard() {
  renderMetrics()
  renderUpcomingTasks()
}
