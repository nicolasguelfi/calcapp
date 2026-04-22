---
gse:
  type: review
  sprint: 1
  branch: gse/sprint-01/feat/add-expense
  status: draft
  created: "2026-04-22"
  updated: "2026-04-22"
  traces:
    derives_from: [TASK-001, TASK-002, TASK-003, TASK-004]
    reviews: [REQ-001, REQ-002, REQ-003, REQ-004, REQ-005, REQ-006, REQ-008, REQ-009]
---

# CalcApp — Review — Sprint 01

## Summary

- **Tasks reviewed:** TASK-001, TASK-002, TASK-003, TASK-004
- **Tests:** 47/47 passing
- **Total findings:** 19 (HIGH: 4, MEDIUM: 8, LOW: 7)
- **AI-Integrity findings:** 0

## Findings

### HIGH severity

- **RVW-001** | code-quality | `src/services/storage.ts`
  Missing try/catch around JSON.parse — corrupted localStorage crashes the app.
  **Fix:** Wrap all JSON.parse calls in try/catch, return empty array on failure.

- **RVW-002** | security | `src/services/storage.ts`
  No runtime validation on data read from localStorage — `as T` casts provide no safety.
  **Fix:** Add basic shape validation before returning data.

- **RVW-003** | architecture | `src/` (global)
  CategoryContext described in design.md (DES-007) is not implemented as a React Context.
  **Fix:** Create CategoryContext or document the deviation.

- **RVW-004** | code-quality | `package.json`
  react-router-dom, i18next, react-i18next moved to devDependencies instead of dependencies.
  **Fix:** Move runtime packages to dependencies.

### MEDIUM severity

- **RVW-005** | requirements | `src/components/ExpenseList.tsx`
  Expenses not sorted by date descending (REQ-002 specifies "most recent first").
  **Fix:** Sort by date descending before rendering.

- **RVW-006** | requirements | `src/components/ExpenseForm.tsx`
  Submit button not disabled when fields are invalid (REQ-008).
  **Fix:** Add disabled state based on validation.

- **RVW-007** | requirements | `src/components/ExpenseForm.tsx`
  Error messages don't disappear when input is corrected (REQ-008).
  **Fix:** Clear field-level errors on input change.

- **RVW-008** | test-quality | `src/components/`
  No integration tests for BudgetDashboard and BudgetProgressBar components.
  **Fix:** Add rendering tests for the dashboard with various budget states.

- **RVW-009** | requirements | `src/services/storage.ts`
  No duplicate category name check when adding custom categories (REQ-005).
  **Fix:** Check existing names before adding.

- **RVW-010** | security | `src/domain/validation.ts`
  Infinity and extremely large numbers pass validation (e.g., 1e308).
  **Fix:** Add max amount cap and reject Infinity/NaN.

- **RVW-011** | code-quality | `src/services/storage.ts`
  No handling of localStorage quota exhaustion (typically 5-10 MB).
  **Fix:** Wrap setItem in try/catch, show user-friendly error on quota exceeded.

- **RVW-012** | test-quality | `package.json`
  Missing "test" script in package.json — `npm test` doesn't work.
  **Fix:** Add `"test": "vitest run"` to scripts.

### LOW severity

- **RVW-013** | code-quality | `src/App.css` — Double import of index.css
- **RVW-014** | code-quality | `src/components/ExpenseList.tsx` — Missing delete confirmation dialog
- **RVW-015** | code-quality | `src/components/BudgetSettings.tsx` — Stale state possible on rapid input
- **RVW-016** | accessibility | `src/components/` — Emoji icons lack aria-labels for screen readers
- **RVW-017** | code-quality | `src/vite-env.d.ts` — Default Vite env file still present (unused)
- **RVW-018** | code-quality | `src/App.tsx` — Default Vite assets (reactLogo, viteLogo) should be removed if unused
- **RVW-019** | i18n | `src/i18n/locales/` — Some keys may be missing for new budget dashboard labels
