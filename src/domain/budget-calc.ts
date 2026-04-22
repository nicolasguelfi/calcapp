import type { Budget, Expense } from '../types'

export type BudgetStatus = 'ok' | 'warning' | 'exceeded'

export interface BudgetCalcResult {
  categoryId: string
  budgetAmount: number
  spent: number
  remaining: number
  percentage: number
  status: BudgetStatus
}

export function calculateRemaining(budget: Budget, expenses: Expense[]): BudgetCalcResult {
  const spent = expenses
    .filter((e) => e.categoryId === budget.categoryId)
    .reduce((sum, e) => sum + e.amount, 0)

  const remaining = budget.amount - spent
  const percentage = budget.amount > 0 ? (spent / budget.amount) * 100 : 0

  let status: BudgetStatus = 'ok'
  if (percentage > 100) {
    status = 'exceeded'
  } else if (percentage >= 75) {
    status = 'warning'
  }

  return {
    categoryId: budget.categoryId,
    budgetAmount: budget.amount,
    spent,
    remaining,
    percentage,
    status,
  }
}
