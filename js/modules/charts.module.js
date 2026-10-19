import { getTasks, getTransactions } from "../services/storage.service.js"
import { isTaskOverdue } from "./tasks.module.js"

const charts = new Map()

function destroyChart(id) {
  const chart = charts.get(id)
  if (chart) chart.destroy()
}

function createChart(id, config) {
  const canvas = document.querySelector(`#${id}`)
  if (!canvas || typeof Chart === "undefined") return
  destroyChart(id)
  const chart = new Chart(canvas, config)
  charts.set(id, chart)
}

function monthKey(date) {
  return date.slice(0, 7)
}

function monthLabel(key) {
  const [year, month] = key.split("-")
  return new Intl.DateTimeFormat("es-MX", { month: "short" }).format(new Date(Number(year), Number(month) - 1, 1))
}

function lastSixMonths() {
  const now = new Date()
  return Array.from({ length: 6 }, (_, index) => {
    const date = new Date(now.getFullYear(), now.getMonth() - (5 - index), 1)
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`
  })
}

function chartDefaults() {
  return {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: { color: "#cbd5e1" }
      }
    },
    scales: {
      x: {
        ticks: { color: "#94a3b8" },
        grid: { color: "rgba(148, 163, 184, 0.08)" }
      },
      y: {
        ticks: { color: "#94a3b8" },
        grid: { color: "rgba(148, 163, 184, 0.08)" }
      }
    }
  }
}

export function renderFinanceCharts() {
  const transactions = getTransactions()
  const months = lastSixMonths()
  const income = months.map((month) => transactions
    .filter((item) => item.type === "income" && monthKey(item.date) === month)
    .reduce((sum, item) => sum + item.amount, 0))
  const expense = months.map((month) => transactions
    .filter((item) => item.type === "expense" && monthKey(item.date) === month)
    .reduce((sum, item) => sum + item.amount, 0))

  const barConfig = {
    type: "bar",
    data: {
      labels: months.map(monthLabel),
      datasets: [
        { label: "Ingresos", data: income, backgroundColor: "rgba(52, 211, 153, 0.72)" },
        { label: "Egresos", data: expense, backgroundColor: "rgba(251, 113, 133, 0.72)" }
      ]
    },
    options: chartDefaults()
  }

  createChart("dashboard-finance-chart", barConfig)
  createChart("monthly-finance-chart", barConfig)

  const expenseByCategory = transactions
    .filter((item) => item.type === "expense")
    .reduce((acc, item) => {
      acc[item.category] = (acc[item.category] || 0) + item.amount
      return acc
    }, {})

  createChart("expense-category-chart", {
    type: "doughnut",
    data: {
      labels: Object.keys(expenseByCategory),
      datasets: [{
        data: Object.values(expenseByCategory),
        backgroundColor: ["#22d3ee", "#818cf8", "#34d399", "#fbbf24", "#fb7185", "#c084fc", "#60a5fa"]
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { labels: { color: "#cbd5e1" } }
      }
    }
  })
}

export function renderTaskChart() {
  const tasks = getTasks()
  const completed = tasks.filter((task) => task.status === "completed").length
  const overdue = tasks.filter(isTaskOverdue).length
  const pending = tasks.length - completed - overdue

  createChart("task-status-chart", {
    type: "bar",
    data: {
      labels: ["Completadas", "Pendientes", "Vencidas"],
      datasets: [{
        label: "Tareas",
        data: [completed, pending, overdue],
        backgroundColor: ["#22d3ee", "#fbbf24", "#fb7185"]
      }]
    },
    options: chartDefaults()
  })
}

export function renderAnalytics() {
  renderFinanceCharts()
  renderTaskChart()
}
