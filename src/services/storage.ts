import type { Expense, Budget, Category } from '../types'
import { DEFAULT_CATEGORIES } from './categories'

const KEYS = {
  expenses: 'calcapp_expenses',
  budgets: 'calcapp_budgets',
  categories: 'calcapp_categories',
} as const

function readJSON<T>(key: string, fallback: T): T {
  const raw = localStorage.getItem(key)
  if (!raw) return fallback
  return JSON.parse(raw) as T
}

function writeJSON<T>(key: string, data: T): void {
  localStorage.setItem(key, JSON.stringify(data))
}

export function getExpenses(): Expense[] {
  return readJSON<Expense[]>(KEYS.expenses, [])
}

export function addExpense(input: Omit<Expense, 'id' | 'createdAt'>): Expense {
  const expenses = getExpenses()
  const expense: Expense = {
    ...input,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  }
  expenses.push(expense)
  writeJSON(KEYS.expenses, expenses)
  return expense
}

export function deleteExpense(id: string): void {
  const expenses = getExpenses().filter((e) => e.id !== id)
  writeJSON(KEYS.expenses, expenses)
}

export function getCategories(): Category[] {
  const stored = readJSON<Category[]>(KEYS.categories, [])
  if (stored.length === 0) {
    writeJSON(KEYS.categories, DEFAULT_CATEGORIES)
    return [...DEFAULT_CATEGORIES]
  }
  return stored
}

export function addCategory(name: string): Category {
  const categories = getCategories()
  const category: Category = {
    id: crypto.randomUUID(),
    name,
    isDefault: false,
  }
  categories.push(category)
  writeJSON(KEYS.categories, categories)
  return category
}

export function deleteCategory(id: string): void {
  const categories = getCategories().filter((c) => c.id !== id)
  writeJSON(KEYS.categories, categories)
}

export function getBudgets(month: string): Budget[] {
  const allBudgets = readJSON<Budget[]>(KEYS.budgets, [])
  return allBudgets.filter((b) => b.month === month)
}

export function setBudget(categoryId: string, month: string, amount: number): Budget {
  const allBudgets = readJSON<Budget[]>(KEYS.budgets, [])
  const existing = allBudgets.findIndex(
    (b) => b.categoryId === categoryId && b.month === month,
  )

  const budget: Budget = { categoryId, month, amount }

  if (existing >= 0) {
    allBudgets[existing] = budget
  } else {
    allBudgets.push(budget)
  }

  writeJSON(KEYS.budgets, allBudgets)
  return budget
}
