import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useBudgets } from '../context/BudgetContext'
import { getCategories } from '../services/storage'
import { validateBudgetInput } from '../domain/validation'
import type { Category } from '../types'
import styles from './BudgetSettings.module.css'

interface BudgetRowProps {
  category: Category
  currentAmount: number | undefined
  onSave: (amount: number) => void
}

function BudgetRow({ category, currentAmount, onSave }: BudgetRowProps) {
  const { t } = useTranslation()
  const [amount, setAmount] = useState(currentAmount?.toString() ?? '')
  const [error, setError] = useState('')
  const [saved, setSaved] = useState(false)

  function handleSave() {
    const validation = validateBudgetInput(amount)
    if (!validation.valid) {
      setError(t(validation.errors.amount))
      return
    }
    setError('')
    onSave(Number(amount))
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className={styles.row}>
      <label htmlFor={`budget-${category.id}`} className={styles.categoryLabel}>
        {t(`categories.${category.id}`, category.name)}
      </label>
      <div className={styles.rowInput}>
        <input
          id={`budget-${category.id}`}
          type="number"
          step="0.01"
          min="0"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="0.00"
          className={error ? styles.inputError : ''}
        />
        <button type="button" onClick={handleSave} className={styles.saveButton}>
          {t('budget.save')}
        </button>
      </div>
      {error && <span className={styles.errorMessage}>{error}</span>}
      {saved && <span className={styles.savedMessage}>{t('budget.saved')}</span>}
    </div>
  )
}

export function BudgetSettings() {
  const { t } = useTranslation()
  const { budgets, setBudget } = useBudgets()
  const categories = getCategories()

  return (
    <div className={styles.container}>
      <h2>{t('budget.title')}</h2>
      <div className={styles.list}>
        {categories.map((cat) => {
          const existing = budgets.find((b) => b.categoryId === cat.id)
          return (
            <BudgetRow
              key={cat.id}
              category={cat}
              currentAmount={existing?.amount}
              onSave={(amount) => setBudget(cat.id, amount)}
            />
          )
        })}
      </div>
    </div>
  )
}
