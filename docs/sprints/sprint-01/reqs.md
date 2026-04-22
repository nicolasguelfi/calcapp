---
gse:
  type: requirement
  sprint: 1
  branch: gse/sprint-01/integration
  elicitation_summary: |
    Verbatim: "Application web de budget, ajouter des dépenses, lister avec filtres,
    budgets mensuels, indicateurs visuels. Catégories mixtes (prédéfinies + personnalisées),
    multilingue dès le départ, interface moderne, devise Euro."
    Reformulation: CalcApp est un outil de gestion de budget personnel accessible au public,
    sans authentification, avec 4 fonctionnalités de base et une approche multilingue.
  status: approved
  created: "2026-04-22"
  updated: "2026-04-22"
  traces:
    derives_from: [PLN-001]
    decided_by: []
---

# CalcApp — Requirements — Sprint 01

## Functional Requirements

### REQ-001 — Add an expense

- **id:** REQ-001
- **type:** functional
- **title:** Add an expense (amount, category, date)
- **description:** |
    As a user,
    I want to add an expense by entering an amount, selecting a category, and choosing a date,
    so that I can track my spending over time.
- **priority:** must
- **acceptance_criteria:**
    - "Given the expense form is displayed, when the user enters a valid amount (> 0), selects a category, and picks a date, then the expense is saved and appears in the expense list"
    - "Given the expense form, when the user submits without filling all required fields, then an error message is displayed next to each missing field and the form is not submitted"
    - "Given the expense form, when the user enters a negative or zero amount, then an error message indicates the amount must be positive"
    - "Given a saved expense, when the user returns to the expense list, then the new expense appears with the correct amount (in €), category, and date"
- **open_questions:**
    - "Default categories list: which categories should be predefined? (resolves_in: DESIGN)"
- **traces:**
    derives_from: [TASK-001, INT-001]
    tested_by: []
    implemented_by: []
- **sprint:** 1
- **status:** draft

### REQ-002 — List expenses with filters

- **id:** REQ-002
- **type:** functional
- **title:** List expenses with filters by month and category
- **description:** |
    As a user,
    I want to see all my expenses in a list and filter them by month and/or category,
    so that I can easily find and review my spending.
- **priority:** must
- **acceptance_criteria:**
    - "Given expenses exist, when the user opens the expense list, then all expenses are displayed sorted by date (most recent first)"
    - "Given expenses exist in multiple months, when the user selects a specific month, then only expenses from that month are shown"
    - "Given expenses exist in multiple categories, when the user selects a specific category, then only expenses from that category are shown"
    - "Given a month and a category filter are both active, when the user views the list, then only expenses matching both filters are shown"
    - "Given no expenses match the active filters, when the user views the list, then a message indicates no expenses were found"
- **open_questions:** []
- **traces:**
    derives_from: [TASK-002, INT-001]
    tested_by: []
    implemented_by: []
- **sprint:** 1
- **status:** draft

### REQ-003 — Define monthly budgets per category

- **id:** REQ-003
- **type:** functional
- **title:** Define monthly budgets per category
- **description:** |
    As a user,
    I want to set a monthly spending limit for each category,
    so that I can control my expenses and avoid overspending.
- **priority:** must
- **acceptance_criteria:**
    - "Given the budget settings view, when the user sets a budget amount (> 0) for a category, then the budget is saved for the current month"
    - "Given a budget is defined for a category, when the user changes the amount, then the new amount replaces the old one"
    - "Given a category with no budget, when the user views the budget indicators, then that category shows 'No budget defined'"
    - "Given the budget form, when the user enters a negative or zero amount, then an error message indicates the budget must be positive"
- **open_questions:** []
- **traces:**
    derives_from: [TASK-003, INT-001]
    tested_by: []
    implemented_by: []
- **sprint:** 1
- **status:** draft

### REQ-004 — Display remaining budget with visual indicators

- **id:** REQ-004
- **type:** functional
- **title:** Display remaining budget per category with visual indicators
- **description:** |
    As a user,
    I want to see how much budget I have left for each category this month,
    displayed with visual indicators (progress bars, color codes),
    so that I can see at a glance whether I'm within my limits.
- **priority:** must
- **acceptance_criteria:**
    - "Given a category with a budget of 200 € and 120 € spent, when the user views the dashboard, then the remaining amount shows 80 € with a progress bar at 60%"
    - "Given a category where spending is below 75% of budget, when the user views the indicator, then the bar is green"
    - "Given a category where spending is between 75% and 100% of budget, when the user views the indicator, then the bar is orange"
    - "Given a category where spending exceeds 100% of budget, when the user views the indicator, then the bar is red and shows the overspend amount"
    - "Given no budget is defined for a category, when the user views the dashboard, then that category shows total spending without a progress bar"
- **open_questions:** []
- **traces:**
    derives_from: [TASK-004, INT-001]
    tested_by: []
    implemented_by: []
- **sprint:** 1
- **status:** draft

### REQ-005 — Custom categories

- **id:** REQ-005
- **type:** functional
- **title:** Manage expense categories (predefined + custom)
- **description:** |
    As a user,
    I want to have a set of predefined categories and the ability to create my own,
    so that I can organize my expenses in a way that makes sense to me.
- **priority:** must
- **acceptance_criteria:**
    - "Given the app is loaded for the first time, when the user opens the category list, then predefined categories are available (e.g., Food, Transport, Housing, Leisure, Health, Other)"
    - "Given the category management view, when the user adds a new custom category with a valid name, then it appears in the category list alongside predefined ones"
    - "Given a custom category, when the user creates an expense, then the custom category is available in the category selector"
    - "Given a category name that already exists, when the user tries to create it, then an error message indicates the name is already taken"
- **open_questions:** []
- **traces:**
    derives_from: [TASK-001, INT-001]
    tested_by: []
    implemented_by: []
- **sprint:** 1
- **status:** draft

### REQ-006 — Internationalization (i18n)

- **id:** REQ-006
- **type:** functional
- **title:** Multilingual support from the start
- **description:** |
    As a user,
    I want to use the application in my preferred language,
    so that the interface is understandable regardless of my language.
- **priority:** should
- **acceptance_criteria:**
    - "Given the app is loaded, when the user's browser language is detected, then the interface displays in that language if supported"
    - "Given a language selector, when the user chooses a different language, then the entire interface switches to that language"
    - "Given the app supports at least French and English, when comparing both versions, then all labels, buttons, messages, and error texts are translated"
- **open_questions:**
    - "Which languages to support in sprint 1? Minimum: French + English"
- **traces:**
    derives_from: [INT-001]
    tested_by: []
    implemented_by: []
- **sprint:** 1
- **status:** draft

## Non-Functional Requirements

### REQ-007 — Visual quality

- **id:** REQ-007
- **type:** non-functional
- **category:** usability
- **title:** Modern and pleasant user interface
- **description:** "The application must have a modern, clean design with harmonious colors, clear typography, and consistent spacing."
- **priority:** should
- **measurement:** "Visual review — interface perceived as modern and pleasant by the user"
- **acceptance_criteria:**
    - "The interface uses consistent colors, fonts, and spacing throughout"
    - "The app is responsive — usable on desktop and mobile screen sizes"
    - "Interactive elements (buttons, inputs) have visible hover and focus states"

### REQ-008 — Input validation and error feedback

- **id:** REQ-008
- **type:** non-functional
- **category:** usability
- **title:** Clear input validation with inline error messages
- **description:** "All user inputs must be validated, with clear error messages displayed next to the relevant field."
- **priority:** must
- **measurement:** "Every form field displays an appropriate error message when invalid input is submitted"
- **acceptance_criteria:**
    - "Error messages appear next to the concerned field, not in a generic alert"
    - "The submit button is disabled until all required fields are valid"
    - "Error messages disappear when the user corrects the input"

### REQ-009 — Performance

- **id:** REQ-009
- **type:** non-functional
- **category:** performance
- **title:** Fast page load and interaction response
- **description:** "The application must load quickly and respond to user interactions without noticeable delay."
- **priority:** should
- **measurement:** "Page load under 2 seconds, interactions respond under 300ms"
- **acceptance_criteria:**
    - "Initial page load completes in under 2 seconds on a standard connection"
    - "Adding, filtering, and viewing expenses responds in under 300ms"
    - "The app works smoothly with up to 1000 expenses stored"
