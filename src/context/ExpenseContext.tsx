import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import type { Expense } from '../types'
import * as storage from '../services/storage'

interface ExpenseContextValue {
  expenses: Expense[]
  addExpense: (input: Omit<Expense, 'id' | 'createdAt'>) => Expense
  deleteExpense: (id: string) => void
  refreshExpenses: () => void
}

const ExpenseContext = createContext<ExpenseContextValue | null>(null)

export function ExpenseProvider({ children }: { children: ReactNode }) {
  const [expenses, setExpenses] = useState<Expense[]>(() => storage.getExpenses())

  const refreshExpenses = useCallback(() => {
    setExpenses(storage.getExpenses())
  }, [])

  const addExpense = useCallback(
    (input: Omit<Expense, 'id' | 'createdAt'>) => {
      const expense = storage.addExpense(input)
      refreshExpenses()
      return expense
    },
    [refreshExpenses],
  )

  const deleteExpense = useCallback(
    (id: string) => {
      storage.deleteExpense(id)
      refreshExpenses()
    },
    [refreshExpenses],
  )

  return (
    <ExpenseContext.Provider value={{ expenses, addExpense, deleteExpense, refreshExpenses }}>
      {children}
    </ExpenseContext.Provider>
  )
}

export function useExpenses(): ExpenseContextValue {
  const ctx = useContext(ExpenseContext)
  if (!ctx) {
    throw new Error('useExpenses must be used within an ExpenseProvider')
  }
  return ctx
}
