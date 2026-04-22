# GSE-One Decision Journal

## DEC-001 — Data Storage Strategy

- **Sprint:** 1
- **Date:** 2026-04-22
- **Activity:** /gse:design
- **Tier:** Gate
- **Options considered:** localStorage (browser), server-side with database
- **Chosen:** localStorage (browser-side)
- **Rationale:** No authentication planned — localStorage keeps data on each user's device without needing a backend. Simple, fast, no server costs. Data is private by design.
- **Consequence horizon:**
  - **Now:** No backend to build — reduces complexity significantly
  - **3 months:** If multi-device sync is needed, will require migration to a backend
  - **1 year:** localStorage has a ~5-10 MB limit — sufficient for personal budget data
- **Reversibility:** Medium cost — data model can be migrated to a backend later, but migration tool needed
- **Review trigger:** If user requests multi-device sync or data exceeds 5 MB
- **Traces:**
  - derives_from: [OQ-001, INT-001]
  - impacts: [DES-001, TASK-001, TASK-002, TASK-003, TASK-004]
  - supersedes: []
- **Status:** accepted
- **Decided by:** user

## DEC-002 — Frontend Technology Stack

- **Sprint:** 1
- **Date:** 2026-04-22
- **Activity:** /gse:design
- **Tier:** Gate
- **Options considered:** HTML/CSS/JS simple, React, Vue.js, Svelte
- **Chosen:** Vite + React + TypeScript
- **Rationale:** User's explicit choice. React is the most popular framework (large ecosystem, abundant learning resources), TypeScript adds type safety, Vite provides fast development experience.
- **Consequence horizon:**
  - **Now:** Need to install Node.js and set up Vite project
  - **3 months:** Rich ecosystem of React libraries available for future features
  - **1 year:** React skills are highly transferable to other projects
- **Reversibility:** High cost — framework choice affects all code; migration would be a rewrite
- **Review trigger:** Not applicable — foundational choice
- **Traces:**
  - derives_from: [OQ-003, INT-001]
  - impacts: [DES-001, TASK-001, TASK-002, TASK-003, TASK-004]
  - supersedes: []
- **Status:** accepted
- **Decided by:** user
