---
gse:
  type: test
  sprint: 1
  branch: gse/sprint-01/integration
  status: approved
  created: "2026-04-22"
  updated: "2026-04-22"
  traces:
    derives_from: [PLN-001]
    validates: [REQ-001, REQ-002, REQ-003, REQ-004, REQ-005, REQ-006, REQ-008, REQ-009]
    verifies: [DES-005, DES-006, DES-007]
---

# CalcApp — Test Strategy — Sprint 01

## Test Pyramid (Web Frontend)

| Level | Percentage | Target | Framework |
|-------|-----------|--------|-----------|
| Unit | 50% | Domain logic (filters, budget-calc, validation) + StorageService | Vitest |
| Integration | 30% | React component rendering with context providers | Vitest + React Testing Library |
| E2E / Acceptance | 15% | Full user workflows (add expense, filter, check budget) | Playwright or manual |
| Policy | 5% | Architecture boundaries (domain has no React imports) | ts-arch or custom script |

## Coverage Target

- Minimum: 60% line coverage (from config.yaml)
- Goal: 80% for domain logic (pure functions)

## Test Framework

- **Vitest** — fast, Vite-native test runner (zero extra config with Vite projects)
- **React Testing Library** — for component tests
- **Playwright** — for E2E (deferred to future sprint if needed)

## Validation Tests (from REQS acceptance criteria)

### REQ-001 — Add an expense

- **TST-001:** Given the form is displayed, when valid amount + category + date are submitted, then the expense is saved and appears in the list
  - traces: { validates: [REQ-001] }
- **TST-002:** Given the form, when submitting with missing fields, then error messages appear next to each missing field
  - traces: { validates: [REQ-001, REQ-008] }
- **TST-003:** Given the form, when entering a negative or zero amount, then an error message indicates the amount must be positive
  - traces: { validates: [REQ-001, REQ-008] }

### REQ-002 — List expenses with filters

- **TST-004:** Given expenses in multiple months, when selecting a month, then only that month's expenses are shown
  - traces: { validates: [REQ-002] }
- **TST-005:** Given expenses in multiple categories, when selecting a category, then only that category's expenses are shown
  - traces: { validates: [REQ-002] }
- **TST-006:** Given both filters active, when viewing the list, then only matching expenses are shown
  - traces: { validates: [REQ-002] }
- **TST-007:** Given no matching expenses, then a "no expenses found" message is displayed
  - traces: { validates: [REQ-002] }

### REQ-003 — Monthly budgets

- **TST-008:** Given budget settings, when setting a budget > 0 for a category, then it is saved for the current month
  - traces: { validates: [REQ-003] }
- **TST-009:** Given an existing budget, when changing the amount, then the new amount replaces the old one
  - traces: { validates: [REQ-003] }
- **TST-010:** Given a negative or zero budget, then an error message is shown
  - traces: { validates: [REQ-003, REQ-008] }

### REQ-004 — Budget indicators

- **TST-011:** Given budget 200 € and 120 € spent, then remaining shows 80 € with progress at 60% (green)
  - traces: { validates: [REQ-004] }
- **TST-012:** Given spending between 75-100% of budget, then the bar is orange
  - traces: { validates: [REQ-004] }
- **TST-013:** Given spending exceeds 100% of budget, then the bar is red and shows overspend
  - traces: { validates: [REQ-004] }
- **TST-014:** Given no budget defined for a category, then total spending is shown without a progress bar
  - traces: { validates: [REQ-004] }

### REQ-005 — Categories

- **TST-015:** Given first load, then predefined categories are available
  - traces: { validates: [REQ-005] }
- **TST-016:** Given category management, when adding a valid custom category, then it appears in the list
  - traces: { validates: [REQ-005] }
- **TST-017:** Given a duplicate category name, then an error is shown
  - traces: { validates: [REQ-005] }

### REQ-006 — Internationalization

- **TST-018:** Given browser language is French, then the interface is in French
  - traces: { validates: [REQ-006] }
- **TST-019:** Given the language selector, when switching to English, then all labels change to English
  - traces: { validates: [REQ-006] }

## Verification Tests (from DESIGN)

### DES-005 — StorageService

- **TST-020:** StorageService.addExpense persists to localStorage and returns the expense with a generated ID
  - traces: { verifies: [DES-005] }
- **TST-021:** StorageService.getExpenses returns all stored expenses
  - traces: { verifies: [DES-005] }
- **TST-022:** StorageService.deleteExpense removes the expense from localStorage
  - traces: { verifies: [DES-005] }

### DES-006 — Domain logic

- **TST-023:** filterExpensesByMonth returns only expenses matching the given month
  - traces: { verifies: [DES-006] }
- **TST-024:** calculateRemaining returns correct spent, remaining, percentage, and status
  - traces: { verifies: [DES-006] }
- **TST-025:** validateExpenseInput rejects invalid inputs (negative amount, empty category, invalid date)
  - traces: { verifies: [DES-006] }

### DES-007 — CategoryService

- **TST-026:** Default categories are loaded when no custom categories exist
  - traces: { verifies: [DES-007] }
- **TST-027:** Custom categories are persisted and retrievable
  - traces: { verifies: [DES-007] }

## Policy Tests (from DESIGN architecture)

- **TST-028:** Domain module (`src/domain/`) must not import from React or any UI framework
  - traces: { enforces: [DES-006, "Architecture Overview — domain layer separation"] }
  - tool: custom script checking import statements

## Test Data Management

- Tests use in-memory mock of localStorage (Vitest provides `vi.stubGlobal`)
- Predefined test fixtures for common scenarios (5 expenses across 3 months and 4 categories)

## Naming Convention

- Test files: `*.test.ts` (unit/integration) or `*.spec.ts` (E2E)
- Located next to source files: `src/domain/filters.test.ts`
