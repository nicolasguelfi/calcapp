import { useState, type FormEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { useExpenses } from '../context/ExpenseContext'
import { useCategories } from '../context/CategoryContext'
import { validateExpenseInput } from '../domain/validation'
import styles from './ExpenseForm.module.css'

export function ExpenseForm() {
  const { t } = useTranslation()
  const { addExpense } = useExpenses()
  const { categories } = useCategories()

  const [amount, setAmount] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [date, setDate] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [showSuccess, setShowSuccess] = useState(false)

  const isFormEmpty = !amount.trim() || !categoryId.trim() || !date.trim()

  function handleSubmit(e: FormEvent) {
    e.preventDefault()

    const validation = validateExpenseInput(amount, categoryId, date)
    if (!validation.valid) {
      setErrors(validation.errors)
      return
    }

    addExpense({
      amount: Number(amount),
      categoryId,
      date,
    })

    setAmount('')
    setCategoryId('')
    setDate('')
    setErrors({})
    setShowSuccess(true)
    setTimeout(() => setShowSuccess(false), 2000)
  }

  function clearError(field: string) {
    setErrors((prev) => {
      if (!prev[field]) return prev
      const next = { ...prev }
      delete next[field]
      return next
    })
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      {showSuccess && (
        <div className={styles.successMessage}>{t('expense.added')}</div>
      )}

      <div className={`${styles.field} ${errors.amount ? styles.fieldError : ''}`}>
        <label htmlFor="expense-amount">{t('expense.amount')}</label>
        <input
          id="expense-amount"
          type="number"
          step="0.01"
          min="0"
          value={amount}
          onChange={(e) => {
            setAmount(e.target.value)
            clearError('amount')
          }}
          placeholder="0.00"
        />
        {errors.amount && (
          <span className={styles.errorMessage}>{t(errors.amount)}</span>
        )}
      </div>

      <div className={`${styles.field} ${errors.category ? styles.fieldError : ''}`}>
        <label htmlFor="expense-category">{t('expense.category')}</label>
        <select
          id="expense-category"
          value={categoryId}
          onChange={(e) => {
            setCategoryId(e.target.value)
            clearError('category')
          }}
        >
          <option value="">{t('expense.selectCategory')}</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {t(`categories.${cat.id}`, cat.name)}
            </option>
          ))}
        </select>
        {errors.category && (
          <span className={styles.errorMessage}>{t(errors.category)}</span>
        )}
      </div>

      <div className={`${styles.field} ${errors.date ? styles.fieldError : ''}`}>
        <label htmlFor="expense-date">{t('expense.date')}</label>
        <input
          id="expense-date"
          type="date"
          value={date}
          onChange={(e) => {
            setDate(e.target.value)
            clearError('date')
          }}
        />
        {errors.date && (
          <span className={styles.errorMessage}>{t(errors.date)}</span>
        )}
      </div>

      <button type="submit" className={styles.submitButton} disabled={isFormEmpty}>
        {t('expense.submit')}
      </button>
    </form>
  )
}
