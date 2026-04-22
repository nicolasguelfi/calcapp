import { describe, it, expect } from 'vitest'
import { filterExpensesByMonth, filterExpensesByCategory } from './filters'
import type { Expense } from '../types'

const expenses: Expense[] = [
  { id: '1', amount: 50, categoryId: 'cat-food', date: '2025-01-15', createdAt: '2025-01-15T10:00:00Z' },
  { id: '2', amount: 30, categoryId: 'cat-transport', date: '2025-01-20', createdAt: '2025-01-20T10:00:00Z' },
  { id: '3', amount: 100, categoryId: 'cat-food', date: '2025-02-10', createdAt: '2025-02-10T10:00:00Z' },
  { id: '4', amount: 25, categoryId: 'cat-leisure', date: '2025-02-15', createdAt: '2025-02-15T10:00:00Z' },
]

describe('filterExpensesByMonth', () => {
  // TST-004: filterExpensesByMonth returns only expenses from the given month
  it('returns only expenses from the given month', () => {
    const result = filterExpensesByMonth(expenses, '2025-01')
    expect(result).toHaveLength(2)
    expect(result.every((e) => e.date.startsWith('2025-01'))).toBe(true)
  })

  it('returns empty array when no expenses match the month', () => {
    const result = filterExpensesByMonth(expenses, '2025-03')
    expect(result).toHaveLength(0)
  })
})

describe('filterExpensesByCategory', () => {
  // TST-005: filterExpensesByCategory returns only expenses from the given category
  it('returns only expenses from the given category', () => {
    const result = filterExpensesByCategory(expenses, 'cat-food')
    expect(result).toHaveLength(2)
    expect(result.every((e) => e.categoryId === 'cat-food')).toBe(true)
  })

  it('returns empty array when no expenses match the category', () => {
    const result = filterExpensesByCategory(expenses, 'cat-health')
    expect(result).toHaveLength(0)
  })
})

describe('combined filters', () => {
  // TST-006: Both filters combined return only matching expenses
  it('month + category returns only matching expenses', () => {
    const byMonth = filterExpensesByMonth(expenses, '2025-01')
    const result = filterExpensesByCategory(byMonth, 'cat-food')
    expect(result).toHaveLength(1)
    expect(result[0].id).toBe('1')
    expect(result[0].amount).toBe(50)
  })
})

describe('empty results', () => {
  // TST-007: Empty result shows appropriate state
  it('returns empty array when filtering empty list', () => {
    expect(filterExpensesByMonth([], '2025-01')).toHaveLength(0)
    expect(filterExpensesByCategory([], 'cat-food')).toHaveLength(0)
  })

  it('returns empty array when all filters exclude everything', () => {
    const byMonth = filterExpensesByMonth(expenses, '2025-01')
    const result = filterExpensesByCategory(byMonth, 'cat-leisure')
    expect(result).toHaveLength(0)
  })
})
