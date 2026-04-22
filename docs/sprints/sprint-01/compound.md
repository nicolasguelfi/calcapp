---
gse:
  type: compound
  sprint: 1
  status: approved
  created: "2026-04-22"
  updated: "2026-04-22"
  traces:
    derives_from: [PLN-001, TASK-001, TASK-002, TASK-003, TASK-004]
---

# Sprint 01 — Capitalization

## Axe 1: Project Capitalization

### Patterns Discovered

1. **Storage abstraction layer** — All localStorage access goes through StorageService with JSON serialization. This pattern makes future migration (e.g., to IndexedDB or a backend) straightforward — only one module to change.

2. **Domain logic separation** — Pure TypeScript functions in `src/domain/` with zero React dependencies. This enabled fast unit testing (no component rendering needed) and clear separation of concerns.

3. **React Context per data domain** — ExpenseContext, BudgetContext, CategoryContext each manage one data type. Components subscribe only to what they need.

4. **i18n from day one** — Setting up react-i18next at project inception avoided retrofitting translations later. All user-facing strings are externalized.

### Lessons Learned

1. **Always protect JSON.parse** (from RVW-001) — localStorage can contain corrupted data. Every JSON.parse call must be wrapped in try/catch with a safe fallback. Prevention: use a centralized `readJSON()` helper.

2. **Runtime validation on external data** (from RVW-002) — TypeScript `as T` casts provide zero runtime safety. Data from localStorage, APIs, or user input must be shape-validated. Prevention: validate at the boundary (StorageService read methods).

3. **Design document ≠ implementation** (from RVW-003) — The design specified CategoryContext but the initial implementation accessed StorageService directly. Prevention: use the design document as a checklist during PRODUCE.

4. **Dependency classification matters** (from RVW-004) — Runtime packages in devDependencies cause production build failures. Prevention: always verify `npm ls --production` after adding dependencies.

5. **Read requirements literally** (from RVW-005, RVW-006, RVW-007) — Three MEDIUM findings were direct REQ violations (sorting order, button disabled state, error message clearing). Prevention: cross-check each acceptance criterion after implementation.

### Best Practices Confirmed

1. **TDD approach** — Writing tests before code (red-green-refactor) caught validation edge cases early and provided confidence during the FIX phase. All 65 tests passed after fixes.

2. **CSS Modules** — Scoped styling prevented class name collisions without adding a CSS-in-JS dependency. Clean and beginner-friendly.

3. **Commit convention** — `gse(sprint-NN/type): description` with traces made the git history readable and traceable.

### Technical Debt

1. **No E2E tests** — Only unit and integration tests exist. Full user flow testing (Playwright) deferred to Sprint 2. Impact: LOW — manual testing covers the gap for now.

2. **No data export/import** — Users cannot back up or transfer their data. Impact: MEDIUM — risk of data loss if browser storage is cleared.

3. **No expense editing** — Users can only add and delete expenses, not modify them. Impact: LOW — acceptable for MVP.

## Axe 2: Methodology Capitalization

### Observations: 4 collected, 3 themes

**Theme 1: Mode selection transparency**
- Observation: The initial mode selection (Lightweight vs Full) was presented without enough context. The user had to push back twice before the three lifecycle modes (Micro/Lightweight/Full) were properly explained.
- Source: Conversation history
- Improvement: Always present the 3 modes with their lifecycle sequences before asking the user to choose.

**Theme 2: TDD integration in the lifecycle**
- Observation: The user raised an important question about when tests should be written relative to code. The methodology's TDD approach (tests-first in PRODUCE) was not made explicit enough during TESTS --strategy.
- Source: User question before PRODUCE
- Improvement: TESTS --strategy should explicitly state that the test specifications will be implemented as actual test code BEFORE the feature code during PRODUCE.

**Theme 3: Smooth sprint execution**
- Observation: Once the mode was chosen and the lifecycle understood, the sprint flowed smoothly through all 11 activities (COLLECT through DELIVER). The user validated each step via buttons (AskQuestion).
- Source: Activity history
- Assessment: The Full mode lifecycle works well for a structured introduction to software engineering practices.

### Route: Local export only (no GitHub upstream configured)

Workflow ledger: 0 raw observations from 0 axes condensed (coach observations not generated this sprint — first sprint).

## Axe 3: Competency Capitalization

### Concepts Encountered This Sprint

| Concept | Learning Goal | Status |
|---------|--------------|--------|
| Git branches and merges | "La gestion de versions (git)" | Introduced — feature branch → integration → main flow |
| TDD (Red-Green-Refactor) | "Les tests automatiques" | Introduced — 65 tests written before or alongside code |
| React components and contexts | "L'organisation du code (architecture)" | Introduced — 8 components, 3 contexts, domain separation |
| Sprint lifecycle (LC01→LC02→LC03) | "La méthode agile" | Completed — full cycle from COLLECT to COMPOUND |
| Requirements with acceptance criteria | "La méthode agile" | Practiced — 9 REQs with Given/When/Then |
| Code review and fix cycle | "Les tests automatiques" | Practiced — 19 findings identified and resolved |

### Proposed Learning Topics for Next Sprint

1. **Git in practice** — You used branches this sprint but didn't interact with them directly. A short session on `git log`, `git diff`, and understanding your project history could be valuable.

2. **Understanding React state** — The app uses React Contexts for shared state. Understanding how data flows through components is key for adding features.

3. **Reading test output** — You saw test results as summaries. Learning to read test names and understand what each test verifies will help you guide future development.
