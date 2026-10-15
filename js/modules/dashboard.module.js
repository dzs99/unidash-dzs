import { mockTasks, mockTransactions } from "../data/mock.data.js"

function money(value) {
  return new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" }).format(value)
}

export function renderDashboardVisual() {
  const income = mockTransactions.filter((x) => x.type === "income").reduce((a,b) => a+b.amount, 0)
  const expense = mockTransactions.filter((x) => x.type === "expense").reduce((a,b) => a+b.amount, 0)
  const pending = mockTasks.filter((x) => x.status !== "completed").length
  document.querySelector("#metric-balance").textContent = money(income - expense)
  document.querySelector("#metric-income").textContent = money(income)
  document.querySelector("#metric-expense").textContent = money(expense)
  document.querySelector("#metric-pending").textContent = pending
  document.querySelector("#metric-overdue").textContent = "1"
  document.querySelector("#analytics-total-tasks").textContent = mockTasks.length
  document.querySelector("#analytics-completed").textContent = mockTasks.filter((x) => x.status === "completed").length
  document.querySelector("#analytics-saving-rate").textContent = `${Math.round(((income-expense)/income)*100)}%`
  document.querySelector("#analytics-top-category").textContent = "Comida"
}
