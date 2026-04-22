import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { I18nextProvider } from 'react-i18next'
import i18n from '../i18n'
import { ExpenseProvider } from '../context/ExpenseContext'
import { BudgetProvider } from '../context/BudgetContext'
import { CategoryProvider } from '../context/CategoryContext'
import { BudgetDashboard } from './BudgetDashboard'
import { addExpense, setBudget } from '../services/storage'

function renderDashboard(month = '2025-01') {
  return render(
    <I18nextProvider i18n={i18n}>
      <CategoryProvider>
        <ExpenseProvider>
          <BudgetProvider month={month}>
            <BudgetDashboard selectedMonth={month} />
          </BudgetProvider>
        </ExpenseProvider>
      </CategoryProvider>
    </I18nextProvider>,
  )
}

beforeEach(() => {
  localStorage.clear()
  i18n.changeLanguage('fr')
})

describe('BudgetDashboard', () => {
  it('shows "no budget" state when no budgets or expenses exist', () => {
    renderDashboard()
    expect(screen.getByText(/pas de budget défini/i)).toBeInTheDocument()
  })

  it('renders progress bars for categories with budgets', () => {
    setBudget('cat-food', '2025-01', 300)
    setBudget('cat-transport', '2025-01', 200)
    addExpense({ amount: 100, categoryId: 'cat-food', date: '2025-01-10' })

    renderDashboard()

    const progressBars = screen.getAllByRole('progressbar')
    expect(progressBars.length).toBeGreaterThanOrEqual(2)
  })

  it('shows green (ok) when spending is below 75%', () => {
    setBudget('cat-food', '2025-01', 200)
    addExpense({ amount: 50, categoryId: 'cat-food', date: '2025-01-10' })

    renderDashboard()

    const progressBar = screen.getByRole('progressbar')
    expect(progressBar).toHaveAttribute('aria-valuenow', '25')
    expect(progressBar.className).toMatch(/ok/i)
  })

  it('shows orange (warning) when spending is 75-100%', () => {
    setBudget('cat-food', '2025-01', 200)
    addExpense({ amount: 160, categoryId: 'cat-food', date: '2025-01-10' })

    renderDashboard()

    const progressBar = screen.getByRole('progressbar')
    expect(progressBar).toHaveAttribute('aria-valuenow', '80')
    expect(progressBar.className).toMatch(/warning/i)
  })

  it('shows red (exceeded) when spending exceeds budget', () => {
    setBudget('cat-food', '2025-01', 200)
    addExpense({ amount: 250, categoryId: 'cat-food', date: '2025-01-10' })

    renderDashboard()

    const progressBar = screen.getByRole('progressbar')
    expect(progressBar).toHaveAttribute('aria-valuenow', '125')
    expect(progressBar.className).toMatch(/exceeded/i)
    expect(screen.getByText(/dépassé de/i)).toBeInTheDocument()
  })

  it('shows "no budget" label for categories with expenses but no budget', () => {
    addExpense({ amount: 50, categoryId: 'cat-food', date: '2025-01-10' })

    renderDashboard()

    expect(screen.getByText(/pas de budget défini/i)).toBeInTheDocument()
    const amounts = screen.getAllByText('50.00 €')
    expect(amounts.length).toBeGreaterThanOrEqual(1)
  })
})
