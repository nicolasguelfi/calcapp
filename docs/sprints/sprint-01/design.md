---
gse:
  type: design
  sprint: 1
  branch: gse/sprint-01/integration
  status: approved
  created: "2026-04-22"
  updated: "2026-04-22"
  traces:
    derives_from: [TASK-001, TASK-002, TASK-003, TASK-004]
    implements: [REQ-001, REQ-002, REQ-003, REQ-004, REQ-005, REQ-006, REQ-007, REQ-008, REQ-009]
    tested_by: []
    decided_by: [DEC-001, DEC-002]
---

# CalcApp — Design — Sprint 01

## Architecture Overview

CalcApp is a single-page application (SPA) built with **Vite + React + TypeScript**.
All data is stored in the browser's **localStorage**. No backend server is required.

```
┌─────────────────────────────────────────────┐
│                  Browser                     │
│                                              │
│  ┌──────────┐  ┌──────────┐  ┌───────────┐ │
│  │  Pages/   │  │  Domain  │  │  Storage   │ │
│  │  Views    │──│  Logic   │──│  (local-   │ │
│  │  (React)  │  │  (pure)  │  │  Storage)  │ │
│  └──────────┘  └──────────┘  └───────────┘ │
│       │                                      │
│  ┌──────────┐  ┌──────────┐                 │
│  │   i18n   │  │   UI     │                 │
│  │ (react-  │  │ Component│                 │
│  │  i18next)│  │ Library  │                 │
│  └──────────┘  └──────────┘                 │
└─────────────────────────────────────────────┘
```

**Layers:**
- **Pages/Views** — React page components (one per app section)
- **Domain Logic** — pure TypeScript functions (no React dependency) for budget calculations, filtering, validation
- **Storage** — localStorage abstraction layer for persistence
- **i18n** — react-i18next for internationalization
- **UI Components** — reusable presentational components (forms, progress bars, filters)

## Component Decomposition

### DES-001 — ExpenseForm component
- **Responsibility:** Capture new expense input (amount, category, date)
- **Dependencies:** StorageService, CategoryService, i18n
- **Files:** `src/components/ExpenseForm.tsx`
- **Requirements:** REQ-001, REQ-005, REQ-008

### DES-002 — ExpenseList component
- **Responsibility:** Display expenses with month and category filters
- **Dependencies:** StorageService, domain/filters, i18n
- **Files:** `src/components/ExpenseList.tsx`, `src/components/ExpenseFilters.tsx`
- **Requirements:** REQ-002

### DES-003 — BudgetSettings component
- **Responsibility:** Set monthly budget per category
- **Dependencies:** StorageService, CategoryService, i18n
- **Files:** `src/components/BudgetSettings.tsx`
- **Requirements:** REQ-003, REQ-008

### DES-004 — BudgetDashboard component
- **Responsibility:** Display remaining budget with visual indicators
- **Dependencies:** StorageService, domain/budget-calc, i18n
- **Files:** `src/components/BudgetDashboard.tsx`, `src/components/BudgetProgressBar.tsx`
- **Requirements:** REQ-004, REQ-007

### DES-005 — StorageService module
- **Responsibility:** Abstraction over localStorage for CRUD operations on expenses, budgets, and categories
- **Dependencies:** none (pure TypeScript)
- **Files:** `src/services/storage.ts`
- **Requirements:** all (cross-cutting)

### DES-006 — Domain logic module
- **Responsibility:** Pure functions for filtering expenses, calculating remaining budgets, validating inputs
- **Dependencies:** none (pure TypeScript, no framework imports)
- **Files:** `src/domain/filters.ts`, `src/domain/budget-calc.ts`, `src/domain/validation.ts`
- **Requirements:** REQ-001, REQ-002, REQ-004, REQ-008, REQ-009

### DES-007 — CategoryService module
- **Responsibility:** Manage predefined and custom categories
- **Dependencies:** StorageService
- **Files:** `src/services/categories.ts`
- **Requirements:** REQ-005

### DES-008 — i18n configuration
- **Responsibility:** Internationalization setup with react-i18next, language detection, translation files
- **Dependencies:** react-i18next, i18next-browser-languagedetector
- **Files:** `src/i18n/index.ts`, `src/i18n/locales/fr.json`, `src/i18n/locales/en.json`
- **Requirements:** REQ-006

## Shared State

| Name | Scope (components) | Mechanism | Rationale | Traces |
|------|-------------------|-----------|-----------|--------|
| `expenses` | ExpenseForm, ExpenseList, BudgetDashboard | React Context (`ExpenseContext`) | Expense list must be consistent across all views — adding an expense must immediately appear in the list and update the dashboard | REQ-001, REQ-002, REQ-004 |
| `budgets` | BudgetSettings, BudgetDashboard | React Context (`BudgetContext`) | Budget amounts must be consistent between the settings view and the dashboard indicators | REQ-003, REQ-004 |
| `categories` | ExpenseForm, ExpenseList, BudgetSettings | React Context (`CategoryContext`) | Category list (predefined + custom) must be consistent across all forms and filters | REQ-005 |
| `selectedMonth` | ExpenseList, BudgetDashboard | React Context or URL query param | Month filter should persist across views so the user sees consistent data | REQ-002, REQ-004 |
| `locale` | All components | react-i18next (i18n instance) | Language choice affects all displayed text | REQ-006 |

## Interface Contracts

### StorageService

```typescript
interface StorageService {
  getExpenses(): Expense[]
  addExpense(expense: Omit<Expense, 'id'>): Expense
  deleteExpense(id: string): void

  getBudgets(month: string): Budget[]
  setBudget(categoryId: string, month: string, amount: number): Budget

  getCategories(): Category[]
  addCategory(name: string): Category
  deleteCategory(id: string): void
}

interface Expense {
  id: string
  amount: number          // positive, in EUR
  categoryId: string
  date: string            // ISO 8601 date (YYYY-MM-DD)
  createdAt: string       // ISO 8601 datetime
}

interface Budget {
  categoryId: string
  month: string           // YYYY-MM format
  amount: number          // positive, in EUR
}

interface Category {
  id: string
  name: string
  isDefault: boolean      // true for predefined categories
}
```

### Domain Logic

```typescript
// Filtering
function filterExpensesByMonth(expenses: Expense[], month: string): Expense[]
function filterExpensesByCategory(expenses: Expense[], categoryId: string): Expense[]

// Budget calculation
function calculateRemaining(budget: Budget, expenses: Expense[]): {
  spent: number
  remaining: number
  percentage: number       // 0-100+
  status: 'ok' | 'warning' | 'exceeded'   // green / orange / red
}

// Validation
function validateExpenseInput(amount: string, categoryId: string, date: string): ValidationResult
function validateBudgetInput(amount: string): ValidationResult
```

## Data Model (localStorage)

```
localStorage keys:
  calcapp_expenses     → JSON array of Expense[]
  calcapp_budgets      → JSON array of Budget[]
  calcapp_categories   → JSON array of Category[]
  calcapp_locale       → string (ISO 639-1 language code)
```

## Default Categories

| ID | Name (FR) | Name (EN) |
|----|-----------|-----------|
| cat-food | Alimentation | Food |
| cat-transport | Transport | Transport |
| cat-housing | Logement | Housing |
| cat-leisure | Loisirs | Leisure |
| cat-health | Santé | Health |
| cat-other | Autre | Other |

## File Structure

```
src/
├── main.tsx                        # App entry point
├── App.tsx                         # Root component with routing and providers
├── components/
│   ├── ExpenseForm.tsx             # DES-001
│   ├── ExpenseList.tsx             # DES-002
│   ├── ExpenseFilters.tsx          # DES-002
│   ├── BudgetSettings.tsx          # DES-003
│   ├── BudgetDashboard.tsx         # DES-004
│   ├── BudgetProgressBar.tsx       # DES-004
│   └── ui/                         # Reusable UI primitives
│       ├── Button.tsx
│       ├── Input.tsx
│       └── Select.tsx
├── context/
│   ├── ExpenseContext.tsx
│   ├── BudgetContext.tsx
│   └── CategoryContext.tsx
├── domain/
│   ├── filters.ts                  # DES-006
│   ├── budget-calc.ts              # DES-006
│   └── validation.ts               # DES-006
├── services/
│   ├── storage.ts                  # DES-005
│   └── categories.ts               # DES-007
├── i18n/
│   ├── index.ts                    # DES-008
│   └── locales/
│       ├── fr.json
│       └── en.json
├── types/
│   └── index.ts                    # Shared TypeScript interfaces
└── styles/
    └── index.css                   # Global styles (modern, clean)
```

## Dependencies

| Package | Purpose | Complexity cost |
|---------|---------|----------------|
| react + react-dom | UI framework | 0 (already chosen) |
| react-router-dom | Page navigation | 1 pt |
| react-i18next + i18next + i18next-browser-languagedetector | Internationalization | 1 pt |
| uuid | Generate unique IDs for expenses/categories | 0 (utility) |

**Total dependency cost: 2 points** (within budget)

## Security Notes

- No backend — no API security concerns
- No authentication — no credential handling
- localStorage is accessible to any JavaScript on the same origin — acceptable for personal budget data
- No sensitive data (no passwords, no bank data, no personal identification)
- Input validation prevents XSS via React's built-in escaping
