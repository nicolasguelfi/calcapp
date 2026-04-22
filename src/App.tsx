import { useState } from 'react'
import { HashRouter, Routes, Route, NavLink } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ExpenseProvider, useExpenses } from './context/ExpenseContext'
import { BudgetProvider } from './context/BudgetContext'
import { ExpenseForm } from './components/ExpenseForm'
import { ExpenseList } from './components/ExpenseList'
import { ExpenseFilters } from './components/ExpenseFilters'
import { BudgetSettings } from './components/BudgetSettings'
import { BudgetDashboard } from './components/BudgetDashboard'
import { filterExpensesByMonth, filterExpensesByCategory } from './domain/filters'
import { getCategories } from './services/storage'
import './i18n'
import './App.css'

function Header({
  selectedMonth,
  onMonthChange,
}: {
  selectedMonth: string
  onMonthChange: (m: string) => void
}) {
  const { t, i18n } = useTranslation()

  return (
    <header className="app-header">
      <div className="header-top">
        <h1 className="app-title">{t('app.title')}</h1>
        <div className="header-controls">
          <input
            type="month"
            className="month-selector"
            value={selectedMonth}
            onChange={(e) => onMonthChange(e.target.value)}
            aria-label={t('month.selector')}
          />
          <select
            className="language-selector"
            value={i18n.language.startsWith('fr') ? 'fr' : 'en'}
            onChange={(e) => i18n.changeLanguage(e.target.value)}
            aria-label="Language"
          >
            <option value="fr">FR</option>
            <option value="en">EN</option>
          </select>
        </div>
      </div>
      <p className="app-subtitle">{t('app.subtitle')}</p>
    </header>
  )
}

function DashboardPage({ selectedMonth }: { selectedMonth: string }) {
  const { t } = useTranslation()
  return (
    <div className="page">
      <h2>{t('dashboard.title')}</h2>
      <BudgetDashboard selectedMonth={selectedMonth} />
    </div>
  )
}

function AddExpensePage() {
  return (
    <div className="page">
      <ExpenseForm />
    </div>
  )
}

function ExpensesPage({
  selectedMonth,
  onMonthChange,
}: {
  selectedMonth: string
  onMonthChange: (m: string) => void
}) {
  const { expenses, deleteExpense } = useExpenses()
  const [categoryFilter, setCategoryFilter] = useState('')
  const categories = getCategories()

  let filtered = filterExpensesByMonth(expenses, selectedMonth)
  if (categoryFilter) {
    filtered = filterExpensesByCategory(filtered, categoryFilter)
  }

  return (
    <div className="page">
      <ExpenseFilters
        selectedMonth={selectedMonth}
        onMonthChange={onMonthChange}
        selectedCategory={categoryFilter}
        onCategoryChange={setCategoryFilter}
        categories={categories}
      />
      <ExpenseList expenses={filtered} onDelete={deleteExpense} categories={categories} />
    </div>
  )
}

function BudgetsPage() {
  return (
    <div className="page">
      <BudgetSettings />
    </div>
  )
}

function BottomNav() {
  const { t } = useTranslation()
  return (
    <nav className="bottom-nav">
      <NavLink to="/" end className="nav-tab">
        <span className="nav-icon">📊</span>
        <span className="nav-label">{t('nav.dashboard')}</span>
      </NavLink>
      <NavLink to="/add" className="nav-tab">
        <span className="nav-icon">➕</span>
        <span className="nav-label">{t('nav.add')}</span>
      </NavLink>
      <NavLink to="/expenses" className="nav-tab">
        <span className="nav-icon">📋</span>
        <span className="nav-label">{t('nav.expenses')}</span>
      </NavLink>
      <NavLink to="/budgets" className="nav-tab">
        <span className="nav-icon">💰</span>
        <span className="nav-label">{t('nav.budgets')}</span>
      </NavLink>
    </nav>
  )
}

export default function App() {
  const [selectedMonth, setSelectedMonth] = useState(
    () => new Date().toISOString().slice(0, 7),
  )

  return (
    <HashRouter>
      <ExpenseProvider>
        <BudgetProvider month={selectedMonth}>
          <div className="app-container">
            <Header selectedMonth={selectedMonth} onMonthChange={setSelectedMonth} />
            <main className="app-main">
              <Routes>
                <Route path="/" element={<DashboardPage selectedMonth={selectedMonth} />} />
                <Route path="/add" element={<AddExpensePage />} />
                <Route
                  path="/expenses"
                  element={
                    <ExpensesPage
                      selectedMonth={selectedMonth}
                      onMonthChange={setSelectedMonth}
                    />
                  }
                />
                <Route path="/budgets" element={<BudgetsPage />} />
              </Routes>
            </main>
            <BottomNav />
          </div>
        </BudgetProvider>
      </ExpenseProvider>
    </HashRouter>
  )
}
