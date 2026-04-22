export interface Expense {
  id: string
  amount: number
  categoryId: string
  date: string
  createdAt: string
}

export interface Budget {
  categoryId: string
  month: string
  amount: number
}

export interface Category {
  id: string
  name: string
  isDefault: boolean
}

export interface ValidationResult {
  valid: boolean
  errors: Record<string, string>
}
