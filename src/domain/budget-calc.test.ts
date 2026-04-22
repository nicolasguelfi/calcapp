import { describe, it, expect } from 'vitest'
import { calculateRemaining } from './budget-calc'
import type { Budget, Expense } from '../types'

function makeExpense(amount: number, categoryId: string): Expense {
  return {
    id: crypto.randomUUID(),
    amount,
    categoryId,
    date: '2025-01-15',
    createdAt: new Date().toISOString(),
  }
}

describe('calculateRemaining', () => {
  // TST-011: budget 200€, spent 120€ → remaining 80€, percentage 60%, status 'ok' (green)
  it('returns ok status when spending < 75%', () => {
    const budget: Budget = { categoryId: 'cat-food', month: '2025-01', amount: 200 }
    const expenses = [makeExpense(80, 'cat-food'), makeExpense(40, 'cat-food')]

    const result = calculateRemaining(budget, expenses)

    expect(result.spent).toBe(120)
    expect(result.remaining).toBe(80)
    expect(result.percentage).toBe(60)
    expect(result.status).toBe('ok')
  })

  // TST-012: spending 75-100% → status 'warning' (orange)
  it('returns warning status when spending 75-100%', () => {
    const budget: Budget = { categoryId: 'cat-food', month: '2025-01', amount: 200 }
    const expenses = [makeExpense(160, 'cat-food')]

    const result = calculateRemaining(budget, expenses)

    expect(result.spent).toBe(160)
    expect(result.remaining).toBe(40)
    expect(result.percentage).toBe(80)
    expect(result.status).toBe('warning')
  })

  it('returns warning at exactly 75%', () => {
    const budget: Budget = { categoryId: 'cat-food', month: '2025-01', amount: 200 }
    const expenses = [makeExpense(150, 'cat-food')]

    const result = calculateRemaining(budget, expenses)

    expect(result.percentage).toBe(75)
    expect(result.status).toBe('warning')
  })

  // TST-013: spending > 100% → status 'exceeded' (red), shows overspend
  it('returns exceeded status when spending > 100%', () => {
    const budget: Budget = { categoryId: 'cat-food', month: '2025-01', amount: 200 }
    const expenses = [makeExpense(250, 'cat-food')]

    const result = calculateRemaining(budget, expenses)

    expect(result.spent).toBe(250)
    expect(result.remaining).toBe(-50)
    expect(result.percentage).toBe(125)
    expect(result.status).toBe('exceeded')
  })

  // TST-014: only counts expenses for the matching category
  it('only counts expenses matching the budget category', () => {
    const budget: Budget = { categoryId: 'cat-food', month: '2025-01', amount: 200 }
    const expenses = [makeExpense(100, 'cat-food'), makeExpense(50, 'cat-transport')]

    const result = calculateRemaining(budget, expenses)

    expect(result.spent).toBe(100)
    expect(result.remaining).toBe(100)
    expect(result.percentage).toBe(50)
    expect(result.status).toBe('ok')
  })

  // TST-024: calculateRemaining returns correct values with zero spending
  it('returns full remaining when no expenses match', () => {
    const budget: Budget = { categoryId: 'cat-food', month: '2025-01', amount: 200 }
    const expenses = [makeExpense(50, 'cat-transport')]

    const result = calculateRemaining(budget, expenses)

    expect(result.spent).toBe(0)
    expect(result.remaining).toBe(200)
    expect(result.percentage).toBe(0)
    expect(result.status).toBe('ok')
  })
})
