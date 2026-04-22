import { useTranslation } from 'react-i18next'
import type { Expense, Category } from '../types'
import styles from './ExpenseList.module.css'

interface ExpenseListProps {
  expenses: Expense[]
  onDelete: (id: string) => void
  categories: Category[]
}

export function ExpenseList({ expenses, onDelete, categories }: ExpenseListProps) {
  const { t } = useTranslation()

  const categoryName = (id: string) => {
    const cat = categories.find((c) => c.id === id)
    return cat ? t(`categories.${cat.id}`, cat.name) : id
  }

  if (expenses.length === 0) {
    return <p className="placeholder-text">{t('expense.noExpenses')}</p>
  }

  const total = expenses.reduce((sum, e) => sum + e.amount, 0)

  return (
    <div className={styles.container}>
      <ul className={styles.list} role="list">
        {expenses.map((expense) => (
          <li key={expense.id} className={styles.item}>
            <div className={styles.itemInfo}>
              <span className={styles.category}>{categoryName(expense.categoryId)}</span>
              <span className={styles.date}>{expense.date}</span>
            </div>
            <div className={styles.itemActions}>
              <span className={styles.amount}>{expense.amount.toFixed(2)} €</span>
              <button
                className={styles.deleteButton}
                onClick={() => onDelete(expense.id)}
                aria-label={t('expense.delete')}
              >
                🗑
              </button>
            </div>
          </li>
        ))}
      </ul>
      <div className={styles.total}>
        <span>{t('expense.total')}</span>
        <span className={styles.totalAmount}>{total.toFixed(2)} €</span>
      </div>
    </div>
  )
}
