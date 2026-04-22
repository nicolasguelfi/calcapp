import { useTranslation } from 'react-i18next'
import type { Category } from '../types'
import styles from './ExpenseList.module.css'

interface ExpenseFiltersProps {
  selectedMonth: string
  onMonthChange: (month: string) => void
  selectedCategory: string
  onCategoryChange: (categoryId: string) => void
  categories: Category[]
}

export function ExpenseFilters({
  selectedMonth,
  onMonthChange,
  selectedCategory,
  onCategoryChange,
  categories,
}: ExpenseFiltersProps) {
  const { t } = useTranslation()

  return (
    <div className={styles.filters}>
      <div className={styles.filterField}>
        <label htmlFor="filter-month">{t('filter.month')}</label>
        <input
          id="filter-month"
          type="month"
          value={selectedMonth}
          onChange={(e) => onMonthChange(e.target.value)}
        />
      </div>
      <div className={styles.filterField}>
        <label htmlFor="filter-category">{t('filter.category')}</label>
        <select
          id="filter-category"
          value={selectedCategory}
          onChange={(e) => onCategoryChange(e.target.value)}
        >
          <option value="">{t('filter.allCategories')}</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {t(`categories.${cat.id}`, cat.name)}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}
