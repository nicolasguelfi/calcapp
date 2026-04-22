import { useTranslation } from 'react-i18next'
import type { BudgetStatus } from '../domain/budget-calc'
import styles from './BudgetProgressBar.module.css'

interface BudgetProgressBarProps {
  categoryName: string
  spent: number
  budget: number
  remaining: number
  percentage: number
  status: BudgetStatus
}

export function BudgetProgressBar({
  categoryName,
  spent,
  budget,
  remaining,
  percentage,
  status,
}: BudgetProgressBarProps) {
  const { t } = useTranslation()
  const barWidth = Math.min(percentage, 100)

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <span className={styles.categoryName}>{categoryName}</span>
        <span className={styles.amounts}>
          {spent.toFixed(2)} € / {budget.toFixed(2)} €
        </span>
      </div>
      <div className={styles.barContainer}>
        <div
          className={`${styles.bar} ${styles[status]}`}
          style={{ width: `${barWidth}%` }}
          role="progressbar"
          aria-valuenow={percentage}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>
      <div className={styles.footer}>
        {status === 'exceeded' ? (
          <span className={styles.exceededText}>
            {t('dashboard.exceeded')} {Math.abs(remaining).toFixed(2)} €
          </span>
        ) : (
          <span className={styles.remainingText}>
            {t('dashboard.remaining')}: {remaining.toFixed(2)} €
          </span>
        )}
        <span className={styles.percentageText}>{Math.round(percentage)}%</span>
      </div>
    </div>
  )
}
