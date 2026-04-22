import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import type { Category } from '../types'
import * as storage from '../services/storage'

interface CategoryContextValue {
  categories: Category[]
  addCategory: (name: string) => Category
  deleteCategory: (id: string) => void
}

const CategoryContext = createContext<CategoryContextValue | null>(null)

export function CategoryProvider({ children }: { children: ReactNode }) {
  const [categories, setCategories] = useState<Category[]>(() => storage.getCategories())

  const refreshCategories = useCallback(() => {
    setCategories(storage.getCategories())
  }, [])

  const addCategory = useCallback(
    (name: string) => {
      const category = storage.addCategory(name)
      refreshCategories()
      return category
    },
    [refreshCategories],
  )

  const deleteCategory = useCallback(
    (id: string) => {
      storage.deleteCategory(id)
      refreshCategories()
    },
    [refreshCategories],
  )

  return (
    <CategoryContext.Provider value={{ categories, addCategory, deleteCategory }}>
      {children}
    </CategoryContext.Provider>
  )
}

export function useCategories(): CategoryContextValue {
  const ctx = useContext(CategoryContext)
  if (!ctx) {
    throw new Error('useCategories must be used within a CategoryProvider')
  }
  return ctx
}
