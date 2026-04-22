import { describe, it, expect } from 'vitest'
import { validateExpenseInput, validateBudgetInput } from './validation'

describe('validateExpenseInput', () => {
  // TST-003: rejects negative/zero amount
  it('rejects a negative amount', () => {
    const result = validateExpenseInput('-10', 'cat-food', '2025-01-15')
    expect(result.valid).toBe(false)
    expect(result.errors.amount).toBeDefined()
  })

  it('rejects zero amount', () => {
    const result = validateExpenseInput('0', 'cat-food', '2025-01-15')
    expect(result.valid).toBe(false)
    expect(result.errors.amount).toBeDefined()
  })

  it('rejects empty amount', () => {
    const result = validateExpenseInput('', 'cat-food', '2025-01-15')
    expect(result.valid).toBe(false)
    expect(result.errors.amount).toBeDefined()
  })

  it('rejects non-numeric amount', () => {
    const result = validateExpenseInput('abc', 'cat-food', '2025-01-15')
    expect(result.valid).toBe(false)
    expect(result.errors.amount).toBeDefined()
  })

  // TST-025: rejects empty category, invalid date
  it('rejects empty category', () => {
    const result = validateExpenseInput('50', '', '2025-01-15')
    expect(result.valid).toBe(false)
    expect(result.errors.category).toBeDefined()
  })

  it('rejects empty date', () => {
    const result = validateExpenseInput('50', 'cat-food', '')
    expect(result.valid).toBe(false)
    expect(result.errors.date).toBeDefined()
  })

  it('rejects invalid date format', () => {
    const result = validateExpenseInput('50', 'cat-food', 'not-a-date')
    expect(result.valid).toBe(false)
    expect(result.errors.date).toBeDefined()
  })

  it('accepts valid input', () => {
    const result = validateExpenseInput('42.50', 'cat-food', '2025-01-15')
    expect(result.valid).toBe(true)
    expect(Object.keys(result.errors)).toHaveLength(0)
  })

  it('returns multiple errors at once', () => {
    const result = validateExpenseInput('', '', '')
    expect(result.valid).toBe(false)
    expect(result.errors.amount).toBeDefined()
    expect(result.errors.category).toBeDefined()
    expect(result.errors.date).toBeDefined()
  })

  it('rejects Infinity', () => {
    const result = validateExpenseInput('Infinity', 'cat-food', '2025-01-15')
    expect(result.valid).toBe(false)
    expect(result.errors.amount).toBeDefined()
  })

  it('rejects -Infinity', () => {
    const result = validateExpenseInput('-Infinity', 'cat-food', '2025-01-15')
    expect(result.valid).toBe(false)
    expect(result.errors.amount).toBeDefined()
  })

  it('rejects amounts exceeding 1,000,000', () => {
    const result = validateExpenseInput('1000001', 'cat-food', '2025-01-15')
    expect(result.valid).toBe(false)
    expect(result.errors.amount).toBe('validation.amountTooLarge')
  })

  it('accepts amount of exactly 1,000,000', () => {
    const result = validateExpenseInput('1000000', 'cat-food', '2025-01-15')
    expect(result.valid).toBe(true)
  })
})

describe('validateBudgetInput', () => {
  it('rejects empty amount', () => {
    const result = validateBudgetInput('')
    expect(result.valid).toBe(false)
    expect(result.errors.amount).toBeDefined()
  })

  it('rejects negative amount', () => {
    const result = validateBudgetInput('-100')
    expect(result.valid).toBe(false)
    expect(result.errors.amount).toBeDefined()
  })

  it('rejects zero amount', () => {
    const result = validateBudgetInput('0')
    expect(result.valid).toBe(false)
    expect(result.errors.amount).toBeDefined()
  })

  it('accepts valid amount', () => {
    const result = validateBudgetInput('500')
    expect(result.valid).toBe(true)
    expect(Object.keys(result.errors)).toHaveLength(0)
  })

  it('rejects Infinity', () => {
    const result = validateBudgetInput('Infinity')
    expect(result.valid).toBe(false)
    expect(result.errors.amount).toBeDefined()
  })

  it('rejects amounts exceeding 1,000,000', () => {
    const result = validateBudgetInput('9999999')
    expect(result.valid).toBe(false)
    expect(result.errors.amount).toBe('validation.amountTooLarge')
  })
})
