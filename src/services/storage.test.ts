import { describe, it, expect, beforeEach } from 'vitest'
import {
  addExpense,
  getExpenses,
  deleteExpense,
  getCategories,
  getBudgets,
  setBudget,
  addCategory,
  deleteCategory,
} from './storage'
import { DEFAULT_CATEGORIES } from './categories'

beforeEach(() => {
  localStorage.clear()
})

describe('addExpense / getExpenses', () => {
  // TST-020: addExpense persists to localStorage and returns expense with generated ID
  it('persists an expense and returns it with a generated id and createdAt', () => {
    const expense = addExpense({
      amount: 42.5,
      categoryId: 'cat-food',
      date: '2025-01-15',
    })

    expect(expense.id).toBeDefined()
    expect(expense.id.length).toBeGreaterThan(0)
    expect(expense.createdAt).toBeDefined()
    expect(expense.amount).toBe(42.5)
    expect(expense.categoryId).toBe('cat-food')
    expect(expense.date).toBe('2025-01-15')

    const raw = localStorage.getItem('calcapp_expenses')
    expect(raw).not.toBeNull()
    const stored = JSON.parse(raw!)
    expect(stored).toHaveLength(1)
    expect(stored[0].id).toBe(expense.id)
  })

  // TST-021: getExpenses returns all stored expenses
  it('returns all stored expenses', () => {
    addExpense({ amount: 10, categoryId: 'cat-food', date: '2025-01-01' })
    addExpense({ amount: 20, categoryId: 'cat-transport', date: '2025-01-02' })
    addExpense({ amount: 30, categoryId: 'cat-health', date: '2025-01-03' })

    const expenses = getExpenses()
    expect(expenses).toHaveLength(3)
  })

  it('returns an empty array when no expenses exist', () => {
    const expenses = getExpenses()
    expect(expenses).toEqual([])
  })
})

describe('deleteExpense', () => {
  // TST-022: deleteExpense removes the expense
  it('removes the specified expense', () => {
    const e1 = addExpense({ amount: 10, categoryId: 'cat-food', date: '2025-01-01' })
    const e2 = addExpense({ amount: 20, categoryId: 'cat-transport', date: '2025-01-02' })

    deleteExpense(e1.id)

    const remaining = getExpenses()
    expect(remaining).toHaveLength(1)
    expect(remaining[0].id).toBe(e2.id)
  })

  it('does nothing when id does not exist', () => {
    addExpense({ amount: 10, categoryId: 'cat-food', date: '2025-01-01' })
    deleteExpense('nonexistent-id')
    expect(getExpenses()).toHaveLength(1)
  })
})

describe('getCategories', () => {
  // TST-026: Default categories are loaded when no custom categories exist
  it('returns default categories when none are stored', () => {
    const categories = getCategories()
    expect(categories).toHaveLength(DEFAULT_CATEGORIES.length)
    expect(categories.map((c) => c.id)).toEqual(DEFAULT_CATEGORIES.map((c) => c.id))
  })

  it('returns stored categories when they exist', () => {
    addCategory('Custom Category')
    const categories = getCategories()
    expect(categories.length).toBe(DEFAULT_CATEGORIES.length + 1)
  })
})

describe('addCategory / deleteCategory', () => {
  it('adds a custom category', () => {
    const cat = addCategory('Vacances')
    expect(cat.id).toBeDefined()
    expect(cat.name).toBe('Vacances')
    expect(cat.isDefault).toBe(false)
  })

  it('deletes a custom category', () => {
    const cat = addCategory('Vacances')
    deleteCategory(cat.id)
    const categories = getCategories()
    expect(categories.find((c) => c.id === cat.id)).toBeUndefined()
  })
})

describe('getBudgets / setBudget', () => {
  it('returns empty array when no budgets exist', () => {
    expect(getBudgets('2025-01')).toEqual([])
  })

  // TST-008: setBudget saves a new budget
  it('sets and retrieves a budget', () => {
    const budget = setBudget('cat-food', '2025-01', 300)
    expect(budget.categoryId).toBe('cat-food')
    expect(budget.month).toBe('2025-01')
    expect(budget.amount).toBe(300)

    const budgets = getBudgets('2025-01')
    expect(budgets).toHaveLength(1)
    expect(budgets[0].amount).toBe(300)
  })

  // TST-009: setBudget updates existing budget
  it('updates an existing budget for the same category and month', () => {
    setBudget('cat-food', '2025-01', 300)
    setBudget('cat-food', '2025-01', 500)

    const budgets = getBudgets('2025-01')
    expect(budgets).toHaveLength(1)
    expect(budgets[0].amount).toBe(500)
  })
})
