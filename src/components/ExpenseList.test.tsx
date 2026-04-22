import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { I18nextProvider } from 'react-i18next'
import i18n from '../i18n'
import { ExpenseProvider, useExpenses } from '../context/ExpenseContext'
import { ExpenseList } from './ExpenseList'
import { ExpenseFilters } from './ExpenseFilters'
import { addExpense, getCategories } from '../services/storage'
import { filterExpensesByMonth, filterExpensesByCategory } from '../domain/filters'

function TestPage({ initialMonth = '2025-01' }: { initialMonth?: string }) {
  const { expenses, deleteExpense } = useExpenses()
  const [month, setMonth] = useState(initialMonth)
  const [category, setCategory] = useState('')
  const categories = getCategories()

  let filtered = filterExpensesByMonth(expenses, month)
  if (category) {
    filtered = filterExpensesByCategory(filtered, category)
  }

  return (
    <>
      <ExpenseFilters
        selectedMonth={month}
        onMonthChange={setMonth}
        selectedCategory={category}
        onCategoryChange={setCategory}
        categories={categories}
      />
      <ExpenseList expenses={filtered} onDelete={deleteExpense} categories={categories} />
    </>
  )
}

function renderPage(initialMonth = '2025-01') {
  return render(
    <I18nextProvider i18n={i18n}>
      <ExpenseProvider>
        <TestPage initialMonth={initialMonth} />
      </ExpenseProvider>
    </I18nextProvider>,
  )
}

beforeEach(() => {
  localStorage.clear()
  i18n.changeLanguage('fr')
})

describe('ExpenseList integration', () => {
  it('renders expenses correctly for the selected month', () => {
    addExpense({ amount: 42.5, categoryId: 'cat-food', date: '2025-01-15' })
    addExpense({ amount: 30, categoryId: 'cat-transport', date: '2025-01-20' })

    renderPage()

    expect(screen.getByText('42.50 €')).toBeInTheDocument()
    expect(screen.getByText('30.00 €')).toBeInTheDocument()
    expect(screen.getByText('72.50 €')).toBeInTheDocument()
  })

  it('shows empty state when no expenses match the month', () => {
    addExpense({ amount: 42.5, categoryId: 'cat-food', date: '2025-02-15' })

    renderPage('2025-01')

    expect(screen.getByText(/aucune dépense/i)).toBeInTheDocument()
  })

  it('filters by category when changed', async () => {
    const user = userEvent.setup()

    addExpense({ amount: 42.5, categoryId: 'cat-food', date: '2025-01-15' })
    addExpense({ amount: 30, categoryId: 'cat-transport', date: '2025-01-20' })

    renderPage()

    expect(screen.getByText('42.50 €')).toBeInTheDocument()
    expect(screen.getByText('30.00 €')).toBeInTheDocument()

    const categorySelect = screen.getByLabelText(/catégorie/i)
    await user.selectOptions(categorySelect, 'cat-food')

    const items = screen.getAllByRole('listitem')
    expect(items).toHaveLength(1)
    expect(items[0]).toHaveTextContent('42.50 €')
    expect(screen.queryByText('30.00 €')).not.toBeInTheDocument()
  })

  it('deletes an expense when delete button is clicked', async () => {
    const user = userEvent.setup()

    addExpense({ amount: 42.5, categoryId: 'cat-food', date: '2025-01-15' })
    addExpense({ amount: 30, categoryId: 'cat-transport', date: '2025-01-20' })

    renderPage()

    const deleteButtons = screen.getAllByRole('button', { name: /supprimer/i })
    expect(deleteButtons).toHaveLength(2)

    await user.click(deleteButtons[0])

    expect(screen.queryByText('42.50 €')).not.toBeInTheDocument()
    const items = screen.getAllByRole('listitem')
    expect(items).toHaveLength(1)
    expect(items[0]).toHaveTextContent('30.00 €')
  })
})
