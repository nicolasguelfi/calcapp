import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ExpenseForm } from './ExpenseForm'
import { ExpenseProvider } from '../context/ExpenseContext'
import { CategoryProvider } from '../context/CategoryContext'
import '../i18n'
import { I18nextProvider } from 'react-i18next'
import i18n from '../i18n'
import { getExpenses } from '../services/storage'

function renderForm() {
  return render(
    <I18nextProvider i18n={i18n}>
      <CategoryProvider>
        <ExpenseProvider>
          <ExpenseForm />
        </ExpenseProvider>
      </CategoryProvider>
    </I18nextProvider>,
  )
}

beforeEach(() => {
  localStorage.clear()
  i18n.changeLanguage('fr')
})

describe('ExpenseForm', () => {
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

  it('shows validation error for invalid amount when all fields are filled', async () => {
    const user = userEvent.setup()
    renderForm()

    const amountInput = screen.getByLabelText(/montant/i)
    const categorySelect = screen.getByLabelText(/catégorie/i)
    const dateInput = screen.getByLabelText(/date/i)
    const submitButton = screen.getByRole('button', { name: /ajouter la dépense/i })

    await user.type(amountInput, '-5')
    await user.selectOptions(categorySelect, 'cat-food')
    await user.type(dateInput, '2025-01-15')
    await user.click(submitButton)

    expect(await screen.findByText(/le montant doit être supérieur/i)).toBeInTheDocument()
    expect(getExpenses()).toHaveLength(0)
  })

  it('disables submit button when required fields are empty', () => {
    renderForm()

    const submitButton = screen.getByRole('button', { name: /ajouter la dépense/i })
    expect(submitButton).toBeDisabled()
  })

  it('clears error for a field when user corrects it', async () => {
    const user = userEvent.setup()
    renderForm()

    const amountInput = screen.getByLabelText(/montant/i)
    const categorySelect = screen.getByLabelText(/catégorie/i)
    const dateInput = screen.getByLabelText(/date/i)
    const submitButton = screen.getByRole('button', { name: /ajouter la dépense/i })

    await user.type(amountInput, '0')
    await user.selectOptions(categorySelect, 'cat-food')
    await user.type(dateInput, '2025-01-15')
    await user.click(submitButton)

    expect(await screen.findByText(/le montant doit être supérieur/i)).toBeInTheDocument()

    await user.clear(amountInput)
    await user.type(amountInput, '50')

    expect(screen.queryByText(/le montant doit être supérieur/i)).not.toBeInTheDocument()
  })
})
