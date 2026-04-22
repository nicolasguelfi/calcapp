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
  try {
    return JSON.parse(raw) as T
  } catch {
    console.warn(`Corrupted localStorage key "${key}", resetting to default`)
    return fallback
  }
}

function writeJSON<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data))
  } catch (err: unknown) {
    if (err instanceof DOMException && err.name === 'QuotaExceededError') {
      throw new Error('Storage quota exceeded. Please delete some data to free space.')
    }
    throw err
  }
}

function isExpenseArray(data: unknown): data is Expense[] {
  if (!Array.isArray(data)) return false
  return data.every(
    (e) =>
      typeof e === 'object' &&
      e !== null &&
      typeof e.id === 'string' &&
      typeof e.amount === 'number' &&
      typeof e.categoryId === 'string' &&
      typeof e.date === 'string',
  )
}

function isBudgetArray(data: unknown): data is Budget[] {
  if (!Array.isArray(data)) return false
  return data.every(
    (b) =>
      typeof b === 'object' &&
      b !== null &&
      typeof b.categoryId === 'string' &&
      typeof b.month === 'string' &&
      typeof b.amount === 'number',
  )
}

function isCategoryArray(data: unknown): data is Category[] {
  if (!Array.isArray(data)) return false
  return data.every(
    (c) =>
      typeof c === 'object' &&
      c !== null &&
      typeof c.id === 'string' &&
      typeof c.name === 'string' &&
      typeof c.isDefault === 'boolean',
  )
}

export function getExpenses(): Expense[] {
  const data = readJSON<unknown>(KEYS.expenses, [])
  if (!isExpenseArray(data)) {
    console.warn('Invalid expenses data in localStorage, returning empty array')
    return []
  }
  return data
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
  const data = readJSON<unknown>(KEYS.categories, [])
  if (!isCategoryArray(data) || data.length === 0) {
    writeJSON(KEYS.categories, DEFAULT_CATEGORIES)
    return [...DEFAULT_CATEGORIES]
  }
  return data
}

export function addCategory(name: string): Category {
  const categories = getCategories()
  const duplicate = categories.some(
    (c) => c.name.toLowerCase() === name.toLowerCase(),
  )
  if (duplicate) {
    throw new Error(`Category "${name}" already exists`)
  }
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
  const data = readJSON<unknown>(KEYS.budgets, [])
  if (!isBudgetArray(data)) {
    console.warn('Invalid budgets data in localStorage, returning empty array')
    return []
  }
  return data.filter((b) => b.month === month)
}

export function setBudget(categoryId: string, month: string, amount: number): Budget {
  const allData = readJSON<unknown>(KEYS.budgets, [])
  const allBudgets = isBudgetArray(allData) ? allData : []
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
