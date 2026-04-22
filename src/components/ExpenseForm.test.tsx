import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ExpenseForm } from './ExpenseForm'
import { ExpenseProvider } from '../context/ExpenseContext'
import '../i18n'
import { I18nextProvider } from 'react-i18next'
import i18n from '../i18n'
import { getExpenses } from '../services/storage'

function renderForm() {
  return render(
    <I18nextProvider i18n={i18n}>
      <ExpenseProvider>
        <ExpenseForm />
      </ExpenseProvider>
    </I18nextProvider>,
  )
}

beforeEach(() => {
  localStorage.clear()
  i18n.changeLanguage('fr')
})

describe('ExpenseForm', () => {
  // TST-001: Given valid input, when submitted, expense is saved and form clears
  it('saves expense and clears form on valid submission', async () => {
    const user = userEvent.setup()
    renderForm()

    const amountInput = screen.getByLabelText(/montant/i)
    const categorySelect = screen.getByLabelText(/catégorie/i)
    const dateInput = screen.getByLabelText(/date/i)
    const submitButton = screen.getByRole('button', { name: /ajouter la dépense/i })

    await user.clear(amountInput)
    await user.type(amountInput, '42.50')
    await user.selectOptions(categorySelect, 'cat-food')
    await user.clear(dateInput)
    await user.type(dateInput, '2025-01-15')

    await user.click(submitButton)

    const expenses = getExpenses()
    expect(expenses).toHaveLength(1)
    expect(expenses[0].amount).toBe(42.5)
    expect(expenses[0].categoryId).toBe('cat-food')
    expect(expenses[0].date).toBe('2025-01-15')

    expect(amountInput).toHaveValue(null)
    expect(categorySelect).toHaveValue('')
  })

  // TST-002: Given missing fields, error messages appear next to each field
  it('shows error messages when fields are empty and form is touched', async () => {
    const user = userEvent.setup()
    renderForm()

    const amountInput = screen.getByLabelText(/montant/i)
    const submitButton = screen.getByRole('button', { name: /ajouter la dépense/i })

    await user.clear(amountInput)
    await user.click(submitButton)

    expect(await screen.findByText(/le montant est requis/i)).toBeInTheDocument()
    expect(screen.getByText(/la catégorie est requise/i)).toBeInTheDocument()
    expect(screen.getByText(/la date est requise/i)).toBeInTheDocument()

    expect(getExpenses()).toHaveLength(0)
  })
})
