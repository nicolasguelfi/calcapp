import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { I18nextProvider } from 'react-i18next'
import i18n from '../i18n'
import { BudgetProvider } from '../context/BudgetContext'
import { BudgetSettings } from './BudgetSettings'
import { getBudgets } from '../services/storage'

function renderSettings() {
  return render(
    <I18nextProvider i18n={i18n}>
      <BudgetProvider month="2025-01">
        <BudgetSettings />
      </BudgetProvider>
    </I18nextProvider>,
  )
}

beforeEach(() => {
  localStorage.clear()
  i18n.changeLanguage('fr')
})

describe('BudgetSettings', () => {
  it('displays all categories with budget inputs', () => {
    renderSettings()

    expect(screen.getByLabelText(/alimentation/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/transport/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/logement/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/loisirs/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/santé/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/autre/i)).toBeInTheDocument()
  })

  it('saves a budget for a category and shows success message', async () => {
    const user = userEvent.setup()
    renderSettings()

    const foodInput = screen.getByLabelText(/alimentation/i)
    await user.type(foodInput, '300')

    const saveButtons = screen.getAllByRole('button', { name: /enregistrer/i })
    await user.click(saveButtons[0])

    expect(screen.getByText(/budget enregistré/i)).toBeInTheDocument()

    const budgets = getBudgets('2025-01')
    expect(budgets.find((b) => b.categoryId === 'cat-food')?.amount).toBe(300)
  })

  it('shows error when trying to save empty amount', async () => {
    const user = userEvent.setup()
    renderSettings()

    const saveButtons = screen.getAllByRole('button', { name: /enregistrer/i })
    await user.click(saveButtons[0])

    expect(screen.getByText(/le montant est requis/i)).toBeInTheDocument()
    expect(getBudgets('2025-01')).toHaveLength(0)
  })
})
