<!--
Sync Impact Report:
Version Change: 1.0.0 → 2.0.0
Modified Principles:
  - Principle II: Documentation-First Correctness (expanded with hard rule emphasis)
  - Principle III: UI-First Design (refined scope boundaries)
  - Principle VII: Mobile-First Responsive Design (maintained but clarified)
Added Sections:
  - § 2. Authoritative Sources (new section with Context7 MCP mandate)
  - § 3. Architectural Principles (formalized three sub-principles)
  - § 8. Productivity Enhancements (recurring tasks, due dates)
  - § 11. Mock Data & Backend Readiness (explicit API-ready shape requirements)
  - § 12. Quality Gates (non-negotiable completion criteria)
  - Final Mandate section
Removed Sections: None
Templates Requiring Updates:
  ✅ plan-template.md - Constitution Check section aligned with new quality gates
  ✅ spec-template.md - Frontend specification requirements integrated
  ✅ tasks-template.md - Task organization reflects UI-first and deterministic principles
Follow-up TODOs: None
Rationale for MAJOR version bump (1.0.0 → 2.0.0):
  - Backward incompatible change: Hard rule against non-official documentation sources
  - Redefined scope boundaries: Explicit "Out of Scope" constraints added
  - New governance section: Quality gates now non-negotiable, affects all existing code review
  - Structural changes: Constitution now supersedes all practices (governance authority change)
-->

# AI / Spec-Driven Todo App — Frontend Only

**Version**: 2.0.0
**Ratified**: 2026-01-04
**Last Amended**: 2026-01-08

---

## 1. Purpose & Scope

This constitution defines the **non-negotiable rules, constraints, and quality standards** for building a **modern, production-ready Todo App frontend**.

### In Scope

- Frontend UI & UX
- Client-side state management
- Mock data & UI logic
- Responsive, accessible design
- Spec-driven, AI-assisted development

### Explicitly Out of Scope

- Backend services
- APIs
- Authentication
- Server-side persistence
- Database or cloud integrations

---

## 2. Authoritative Sources (Single Source of Truth)

All technical and architectural decisions **MUST** be derived **only** from **official documentation** retrieved via:

> **Context7 MCP**

### Allowed Documentation Sources

- Next.js (App Router)
- React
- Tailwind CSS
- Browser APIs (MDN)

⚠️ **Hard Rule**

No blog posts, tutorials, StackOverflow answers, or undocumented patterns are permitted.

If documentation is unavailable or unclear:

- The limitation **must be explicitly stated**
- A **documented alternative** must be proposed

**Rationale**: Guarantees production-ready code quality and prevents implementation drift from official standards. Ensures all patterns are maintainable and traceable to authoritative sources.

---

## 3. Architectural Principles

### 3.1 Spec-Driven Development

- Specs come **before** implementation
- Code must be traceable to a written spec
- No speculative or intuition-based coding

**Rationale**: Ensures predictable outcomes, facilitates AI-assisted development, and maintains clear requirements traceability throughout the development lifecycle.

### 3.2 UI-First Design

- UX and interaction flows define structure
- State exists to serve UI needs only
- Backend readiness without backend assumptions

**Rationale**: Focuses development on user value delivery while maintaining architectural flexibility for future backend integration.

### 3.3 Deterministic Frontend Behavior

- All state transitions must be predictable
- No hidden side effects
- UI must behave identically given the same inputs

**Rationale**: Ensures testability, debuggability, and reliable user experience across all interactions.

---

## 4. Technology Constraints

### Required Stack

- **Framework:** Next.js (App Router only)
- **Language:** TypeScript
- **UI Library:** React
- **Styling:** Tailwind CSS
- **State:** React state, Context API, or lightweight documented solutions

### Forbidden

- Pages Router
- CSS frameworks other than Tailwind
- Unofficial UI libraries
- Server Components for backend logic
- Direct DOM manipulation (unless explicitly allowed by React docs)

---

## 5. Frontend Specification Requirements

A **frontend-only specification MUST define**:

### 5.1 UI Components

- Task input form
- Task list (list or card)
- Task item
- Edit task modal / inline editor
- Delete confirmation dialog
- Filters, search, sorting controls
- Recurring task UI
- Date & time pickers

### 5.2 Page Layouts

- Main dashboard layout
- Empty state layout
- Mobile vs desktop adaptations

### 5.3 State Flows

- Task creation lifecycle
- Edit → preview → confirm flows
- Completion toggling
- Filtered & sorted derived state
- Recurring task previews

### 5.4 User Interactions

- Keyboard accessibility
- Focus management
- Form validation feedback
- Destructive action confirmations

### 5.5 Edge Cases

- Empty task list
- Overdue tasks
- Duplicate titles
- Invalid dates
- Rapid add/edit/delete actions

---

## 6. Core Todo MVP Rules

### 6.1 Add Task

Each task **MUST support**:

- Title (required)
- Description (optional)
- Priority (low / medium / high)
- Due date
- Tags / categories

**Rules**:

- Controlled React inputs only
- Validation feedback must be visible
- Tailwind utility classes only

---

### 6.2 View Tasks

- Responsive list or card layout
- Clear visual hierarchy
- Accessible semantics (`ul`, `li`, `button`, `label`)
- No virtualized lists unless documented by React

---

### 6.3 Update Task

- Inline edit or modal dialog (documented pattern)
- Shared form logic with "Add Task"
- Smooth transitions using Tailwind utilities

---

### 6.4 Delete Task

- Confirmation required
- Clear destructive action styling
- Undo is optional but must be documented if added

---

### 6.5 Mark as Complete

- Toggle interaction
- Visual distinction for completed tasks
- Conditional Tailwind styling only

---

## 7. Advanced Task Management (UI Logic Only)

### 7.1 Priorities & Tags

- Color semantics must be consistent
- Priority must affect visual prominence
- Dynamic Tailwind classes allowed only via documented patterns

---

### 7.2 Search & Filters

**Supported filters**:

- Keyword
- Completion status
- Priority
- Due date

**Rules**:

- Client-side only
- Derived state (no duplicated sources of truth)
- Debounce inputs using documented browser/React APIs

---

### 7.3 Sorting

**Supported sorting**:

- Due date
- Priority
- Alphabetical

**Rules**:

- Stable sorting
- Explicit comparator functions
- UI must reflect active sort state

---

## 8. Productivity Enhancements (Frontend Logic)

### 8.1 Recurring Tasks

- UI controls for daily / weekly / monthly
- Preview upcoming occurrences
- No background scheduling or persistence assumptions

---

### 8.2 Due Dates & Reminders

- Native browser date/time inputs
- Visual urgency indicators (overdue, upcoming)
- No notifications or alarms

---

## 9. State Management Strategy

**Allowed**:

- `useState`
- `useReducer`
- React Context
- Lightweight documented state libraries (if justified)

**Rules**:

- Single source of truth for tasks
- Derived views must not mutate base state
- Clear separation between UI state and domain state

---

## 10. Responsiveness & Accessibility

### Required

- Mobile-first design
- Tablet & desktop breakpoints
- Keyboard navigability
- ARIA attributes where documented
- Color contrast compliance

---

## 11. Mock Data & Backend Readiness

- Use realistic mock task objects
- Shape must be API-ready
- No hard-coded UI assumptions tied to backend logic

**Example Task Shape**:

```typescript
interface Task {
  id: string;
  title: string;
  description?: string;
  priority: 'low' | 'medium' | 'high';
  completed: boolean;
  dueDate?: string; // ISO 8601
  tags?: string[];
  recurrence?: {
    frequency: 'daily' | 'weekly' | 'monthly';
    interval: number;
  };
  createdAt: string; // ISO 8601
  updatedAt: string; // ISO 8601
}
```

---

## 12. Quality Gates (Non-Negotiable)

The frontend is considered **complete only if**:

- All behavior is spec-defined
- All patterns trace to Context7 MCP documentation
- UI works fully without backend
- Codebase is backend-integration ready
- No undocumented shortcuts exist

---

## 🎯 Final Mandate

This project must demonstrate:

- **Spec-driven engineering discipline**
- **Documentation-first correctness**
- **Production-ready UI architecture**
- **Clean separation between UI logic and future backend integration**

---

## Governance

This constitution supersedes all other practices and preferences. All development decisions, code reviews, and architectural choices MUST verify compliance with these principles.

### Amendment Process

1. Proposed amendments MUST be documented with rationale
2. Amendments require explicit approval before implementation
3. Version number MUST be incremented according to semantic versioning:
   - **MAJOR**: Backward incompatible governance/principle removals or redefinitions
   - **MINOR**: New principle/section added or materially expanded guidance
   - **PATCH**: Clarifications, wording, typo fixes, non-semantic refinements
4. All dependent templates MUST be updated to reflect amendments
5. Migration plan required for changes affecting existing code

### Compliance Review

- All PRs MUST reference constitution principles addressed
- Complexity MUST be justified against constitution constraints
- Deviations require documented ADR with approval

---

**Version**: 2.0.0 | **Ratified**: 2026-01-04 | **Last Amended**: 2026-01-08
