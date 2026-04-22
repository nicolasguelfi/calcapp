import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react'
import type { Budget } from '../types'
import * as storage from '../services/storage'

interface BudgetContextValue {
  budgets: Budget[]
  setBudget: (categoryId: string, amount: number) => void
}

const BudgetContext = createContext<BudgetContextValue | null>(null)

export function BudgetProvider({ children, month }: { children: ReactNode; month: string }) {
  const [budgets, setBudgetsState] = useState<Budget[]>(() => storage.getBudgets(month))

  useEffect(() => {
    setBudgetsState(storage.getBudgets(month))
  }, [month])

  const setBudget = useCallback(
    (categoryId: string, amount: number) => {
      storage.setBudget(categoryId, month, amount)
      setBudgetsState(storage.getBudgets(month))
    },
    [month],
  )

  return (
    <BudgetContext.Provider value={{ budgets, setBudget }}>
      {children}
    </BudgetContext.Provider>
  )
}

export function useBudgets(): BudgetContextValue {
  const ctx = useContext(BudgetContext)
  if (!ctx) {
    throw new Error('useBudgets must be used within a BudgetProvider')
  }
  return ctx
}
