import { HashRouter, Routes, Route, NavLink } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ExpenseProvider } from './context/ExpenseContext'
import { ExpenseForm } from './components/ExpenseForm'
import './i18n'
import './App.css'

function Header() {
  const { t, i18n } = useTranslation()

  const currentMonth = new Date().toISOString().slice(0, 7)

  return (
    <header className="app-header">
      <div className="header-top">
        <h1 className="app-title">{t('app.title')}</h1>
        <div className="header-controls">
          <input
            type="month"
            className="month-selector"
            defaultValue={currentMonth}
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

function DashboardPage() {
  const { t } = useTranslation()
  return (
    <div className="page">
      <h2>{t('dashboard.title')}</h2>
      <p className="placeholder-text">{t('dashboard.noBudget')}</p>
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

function ExpensesPage() {
  const { t } = useTranslation()
  return (
    <div className="page">
      <h2>{t('nav.expenses')}</h2>
      <p className="placeholder-text">{t('expense.noExpenses')}</p>
    </div>
  )
}

function BudgetsPage() {
  const { t } = useTranslation()
  return (
    <div className="page">
      <h2>{t('budget.title')}</h2>
      <p className="placeholder-text">{t('budget.noBudget')}</p>
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
  return (
    <HashRouter>
      <ExpenseProvider>
        <div className="app-container">
          <Header />
          <main className="app-main">
            <Routes>
              <Route path="/" element={<DashboardPage />} />
              <Route path="/add" element={<AddExpensePage />} />
              <Route path="/expenses" element={<ExpensesPage />} />
              <Route path="/budgets" element={<BudgetsPage />} />
            </Routes>
          </main>
          <BottomNav />
        </div>
      </ExpenseProvider>
    </HashRouter>
  )
}
