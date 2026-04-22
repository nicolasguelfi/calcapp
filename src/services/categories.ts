import type { Category } from '../types'

export const DEFAULT_CATEGORIES: Category[] = [
  { id: 'cat-food', name: 'Alimentation', isDefault: true },
  { id: 'cat-transport', name: 'Transport', isDefault: true },
  { id: 'cat-housing', name: 'Logement', isDefault: true },
  { id: 'cat-leisure', name: 'Loisirs', isDefault: true },
  { id: 'cat-health', name: 'Santé', isDefault: true },
  { id: 'cat-other', name: 'Autre', isDefault: true },
]
