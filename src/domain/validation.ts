import type { ValidationResult } from '../types'

const ISO_DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/
const MAX_AMOUNT = 1_000_000

export function validateExpenseInput(
  amount: string,
  categoryId: string,
  date: string,
): ValidationResult {
  const errors: Record<string, string> = {}

  if (!amount.trim()) {
    errors.amount = 'validation.amountRequired'
  } else {
    const num = Number(amount)
    if (!Number.isFinite(num) || num <= 0) {
      errors.amount = 'validation.amountPositive'
    } else if (num > MAX_AMOUNT) {
      errors.amount = 'validation.amountTooLarge'
    }
  }

  if (!categoryId.trim()) {
    errors.category = 'validation.categoryRequired'
  }

  if (!date.trim()) {
    errors.date = 'validation.dateRequired'
  } else if (!ISO_DATE_REGEX.test(date) || isNaN(new Date(date).getTime())) {
    errors.date = 'validation.dateInvalid'
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  }
}

export function validateBudgetInput(amount: string): ValidationResult {
  const errors: Record<string, string> = {}

  if (!amount.trim()) {
    errors.amount = 'validation.amountRequired'
  } else {
    const num = Number(amount)
    if (!Number.isFinite(num) || num <= 0) {
      errors.amount = 'validation.amountPositive'
    } else if (num > MAX_AMOUNT) {
      errors.amount = 'validation.amountTooLarge'
    }
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  }
}
