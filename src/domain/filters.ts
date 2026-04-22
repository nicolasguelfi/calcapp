import type { Expense } from '../types'

export function filterExpensesByMonth(expenses: Expense[], month: string): Expense[] {
  return expenses.filter((e) => e.date.startsWith(month))
}

export function filterExpensesByCategory(expenses: Expense[], categoryId: string): Expense[] {
  return expenses.filter((e) => e.categoryId === categoryId)
}
