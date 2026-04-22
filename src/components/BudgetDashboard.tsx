import { useTranslation } from 'react-i18next'
import { useExpenses } from '../context/ExpenseContext'
import { useBudgets } from '../context/BudgetContext'
import { getCategories } from '../services/storage'
import { filterExpensesByMonth } from '../domain/filters'
import { calculateRemaining } from '../domain/budget-calc'
import { BudgetProgressBar } from './BudgetProgressBar'
import styles from './BudgetDashboard.module.css'

interface BudgetDashboardProps {
  selectedMonth: string
}

export function BudgetDashboard({ selectedMonth }: BudgetDashboardProps) {
  const { t } = useTranslation()
  const { expenses } = useExpenses()
  const { budgets } = useBudgets()
  const categories = getCategories()

  const monthExpenses = filterExpensesByMonth(expenses, selectedMonth)

  const expensesByCategory = new Map<string, number>()
  for (const e of monthExpenses) {
    const current = expensesByCategory.get(e.categoryId) ?? 0
    expensesByCategory.set(e.categoryId, current + e.amount)
  }

  const relevantCategories = categories.filter(
    (cat) => budgets.some((b) => b.categoryId === cat.id) || expensesByCategory.has(cat.id),
  )

  const totalSpent = monthExpenses.reduce((sum, e) => sum + e.amount, 0)

  if (relevantCategories.length === 0) {
    return <p className="placeholder-text">{t('dashboard.noBudget')}</p>
  }

  return (
    <div className={styles.container}>
      <div className={styles.cards}>
        {relevantCategories.map((cat) => {
          const budget = budgets.find((b) => b.categoryId === cat.id)
          const spent = expensesByCategory.get(cat.id) ?? 0
          const categoryName = t(`categories.${cat.id}`, cat.name)

          if (budget) {
            const calc = calculateRemaining(budget, monthExpenses)
            return (
              <BudgetProgressBar
                key={cat.id}
                categoryName={categoryName}
                spent={calc.spent}
                budget={calc.budgetAmount}
                remaining={calc.remaining}
                percentage={calc.percentage}
                status={calc.status}
              />
            )
          }

          return (
            <div key={cat.id} className={styles.noBudgetCard}>
              <div className={styles.noBudgetHeader}>
                <span className={styles.categoryName}>{categoryName}</span>
                <span className={styles.spentAmount}>{spent.toFixed(2)} €</span>
              </div>
              <span className={styles.noBudgetLabel}>{t('dashboard.noBudgetForCategory')}</span>
            </div>
          )
        })}
      </div>
      <div className={styles.totalRow}>
        <span>{t('dashboard.totalExpenses')}</span>
        <span className={styles.totalAmount}>{totalSpent.toFixed(2)} €</span>
      </div>
    </div>
  )
}
