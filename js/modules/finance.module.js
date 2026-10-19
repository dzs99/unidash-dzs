import { getTransactions, saveTransactions } from "../services/storage.service.js"

let onChange = () => {}

function todayISO() {
  const date = new Date()
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;")
}

function money(value, currency = "MXN") {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency,
    maximumFractionDigits: 2
  }).format(value)
}

function formatDate(value) {
  return new Intl.DateTimeFormat("es-MX", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "UTC"
  }).format(new Date(`${value}T00:00:00Z`))
}

function renderTransactions() {
  const container = document.querySelector("#transaction-list")
  const transactions = getTransactions().sort((a, b) => b.date.localeCompare(a.date))

  if (!transactions.length) {
    container.innerHTML = '<div class="empty-state">No hay movimientos registrados.</div>'
    return
  }

  container.innerHTML = transactions.map((item) => `
    <article class="list-item">
      <div class="list-item-main">
        <div class="flex flex-wrap items-center gap-2">
          <p class="list-item-title">${escapeHtml(item.description)}</p>
          <span class="badge ${item.type === "income" ? "badge-low" : "badge-high"}">${item.type === "income" ? "Ingreso" : "Egreso"}</span>
        </div>
        <p class="list-item-meta">${escapeHtml(item.category)} · ${formatDate(item.date)}</p>
        <p class="list-item-description">${money(item.amount)}</p>
      </div>
      <div class="list-actions">
        <button class="mini-button" data-transaction-delete="${item.id}">Eliminar</button>
      </div>
    </article>
  `).join("")
}

function saveTransaction(event) {
  event.preventDefault()

  const description = document.querySelector("#transaction-description").value.trim()
  const type = document.querySelector("#transaction-type").value
  const amount = Number(document.querySelector("#transaction-amount").value)
  const category = document.querySelector("#transaction-category").value
  const date = document.querySelector("#transaction-date").value

  if (!description || !date || !Number.isFinite(amount) || amount <= 0) return

  const transactions = getTransactions()
  transactions.push({
    id: crypto.randomUUID(),
    description,
    type,
    amount,
    category,
    date
  })

  saveTransactions(transactions)
  document.querySelector("#transaction-form").reset()
  document.querySelector("#transaction-date").value = todayISO()
  renderTransactions()
  onChange()
}

function deleteTransaction(event) {
  const button = event.target.closest("[data-transaction-delete]")
  if (!button) return

  const id = button.dataset.transactionDelete
  saveTransactions(getTransactions().filter((item) => item.id !== id))
  renderTransactions()
  onChange()
}

export function refreshFinance() {
  renderTransactions()
}

export function initFinanceModule(callback) {
  onChange = callback
  document.querySelector("#transaction-form").addEventListener("submit", saveTransaction)
  document.querySelector("#transaction-list").addEventListener("click", deleteTransaction)
  document.querySelector("#transaction-date").value = todayISO()
  renderTransactions()
}
