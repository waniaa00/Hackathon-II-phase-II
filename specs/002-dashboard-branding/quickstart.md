# Quickstart: Dashboard UI & Application Branding

**Feature**: 002-dashboard-branding
**Date**: 2026-01-08
**Purpose**: Get the TASKIFY dashboard running locally and validate all dashboard functionality

---

## Prerequisites

### Required Software

Same as todo-frontend-ui feature:

- **Node.js**: Version 18.17.0 or higher
  - Check version: `node --version`
  - Download: https://nodejs.org/

- **Package Manager**: npm 9+ (included with Node.js) or pnpm 8+
  - Check npm version: `npm --version`
  - Install pnpm (optional): `npm install -g pnpm`

- **Modern Browser** (one of the following):
  - Google Chrome 120+
  - Mozilla Firefox 121+
  - Safari 17+ (macOS)
  - Microsoft Edge 120+

### System Requirements

- **Operating System**: Windows 10+, macOS 11+, or Linux
- **RAM**: Minimum 4GB (8GB recommended for development)
- **Disk Space**: 500MB for dependencies and build artifacts

---

## Setup Instructions

### 1. Install Dashboard Dependencies

Navigate to the project root and install new dependencies for dashboard feature:

```bash
# Install heroicons for dashboard icons
npm install @heroicons/react

# Verify installation
npm list @heroicons/react
```

**Expected Output**:
```
@heroicons/react@2.x.x
```

**Note**: date-fns 3.x should already be installed from todo-frontend-ui feature.

---

### 2. Run Development Server

Start the Next.js development server (same as todo-frontend-ui):

```bash
# Using npm
npm run dev

# OR using pnpm
pnpm dev
```

**Expected Output**:
```
▲ Next.js 14.x.x
- Local:        http://localhost:3000
- Ready in 2.5s
```

**Server Details**:
- **URL**: http://localhost:3000
- **Hot Reload**: Enabled (changes reflected automatically)
- **Port**: 3000 (default, configurable in `next.config.js`)

---

### 3. Access Dashboard

1. Open your browser (Chrome, Firefox, Safari, or Edge)
2. Navigate to: **http://localhost:3000/dashboard**
3. Dashboard should load within 2 seconds

**Expected Initial View**:
- Navigation bar with "TASKIFY" branding (logo + title)
- 4 summary cards in a grid layout:
  - Total Tasks (blue card with number)
  - Completed Tasks (green card with checkmark icon)
  - Pending Tasks (yellow card with clock icon)
  - Overdue Tasks (red card with alert icon)
- "Today's Focus" section below summary cards
- "Quick Actions" panel (right side or below on mobile)

---

## Validation Steps

Validate each user story by following these test scenarios:

### P1 - Dashboard Overview & Branding (MVP) 🎯

#### Test 1: TASKIFY Branding Visible

1. **Given** you open http://localhost:3000/dashboard
2. **When** the page loads
3. **Then** verify:
   - Navigation bar at top of page with sticky positioning
   - "TASKIFY" title text visible in navigation
   - Logo/icon to the left of title (checkmark or task icon)
   - Consistent branding styling (color, font, spacing)

**Expected Result**: TASKIFY branding is prominently displayed and recognizable

---

#### Test 2: Summary Cards Display Accurate Counts

**Setup**: Ensure you have mock tasks with varied statuses:
- 10 total tasks
- 3 completed
- 7 incomplete
- 2 overdue (past due date)

1. **Given** the task state contains 10 tasks (3 completed, 7 incomplete, 2 overdue)
2. **When** the summary cards render
3. **Then** verify each card displays:
   - **Total Tasks**: 10
   - **Completed Tasks**: 3
   - **Pending Tasks**: 7
   - **Overdue Tasks**: 2

**Expected Result**: All summary cards show accurate counts matching task state

---

#### Test 3: Summary Cards Responsive Layout

1. **Given** you are viewing the dashboard
2. **When** you resize the browser window:
   - **Mobile** (375px width): Cards stack vertically (1 column)
   - **Tablet** (768px width): Cards in 2x2 grid (2 columns)
   - **Desktop** (1280px width): Cards in single row (4 columns)
3. **Then** verify:
   - Layout adapts smoothly at each breakpoint
   - Cards remain readable and properly spaced
   - No horizontal scrolling at any viewport size

**Expected Result**: Summary cards respond to viewport changes correctly

---

#### Test 4: Summary Cards Empty State

1. **Given** the task state is empty (no tasks)
2. **When** the summary cards render
3. **Then** verify all cards show:
   - Total: 0
   - Completed: 0
   - Pending: 0
   - Overdue: 0
4. Verify cards maintain proper styling with zero counts

**Expected Result**: Dashboard handles empty state gracefully

---

#### Test 5: Summary Card Icons and Colors

1. **Given** you view the 4 summary cards
2. **Then** verify each card has:
   - **Total Tasks** (blue card): List icon, blue color scheme
   - **Completed** (green card): Checkmark icon, green color scheme
   - **Pending** (yellow card): Clock icon, yellow/amber color scheme
   - **Overdue** (red card): Alert/warning icon, red color scheme

**Expected Result**: Color coding is consistent and icons are visible

---

### P2 - Today's Focus Section

#### Test 6: Today's Focus Filtering - Due Today

**Setup**: Create tasks:
- Task A: Due today, medium priority, incomplete
- Task B: Due tomorrow, high priority, incomplete
- Task C: Due yesterday, low priority, incomplete

1. **Given** the above tasks exist
2. **When** Today's Focus section renders
3. **Then** verify:
   - Task A appears in Today's Focus (due today)
   - Task B does NOT appear (not due today)
   - Task C does NOT appear (overdue but not high priority)

**Expected Result**: Only Task A (due today) appears in Today's Focus

---

#### Test 7: Today's Focus Filtering - High Priority

**Setup**: Create tasks:
- Task A: No due date, high priority, incomplete
- Task B: No due date, medium priority, incomplete
- Task C: No due date, low priority, incomplete

1. **Given** the above tasks exist
2. **When** Today's Focus section renders
3. **Then** verify:
   - Task A appears in Today's Focus (high priority)
   - Task B does NOT appear (medium priority)
   - Task C does NOT appear (low priority)

**Expected Result**: Only Task A (high priority) appears in Today's Focus

---

#### Test 8: Today's Focus Deduplication

**Setup**: Create task:
- Task A: Due today, high priority, incomplete (meets BOTH criteria)

1. **Given** Task A is both due today AND high priority
2. **When** Today's Focus section renders
3. **Then** verify:
   - Task A appears exactly ONCE (no duplication)
   - Task shows both priority badge and due date

**Expected Result**: Task appears once despite meeting multiple criteria

---

#### Test 9: Today's Focus Excludes Completed

**Setup**: Create tasks:
- Task A: Due today, high priority, completed
- Task B: Due today, medium priority, incomplete

1. **Given** Task A is completed despite meeting focus criteria
2. **When** Today's Focus section renders
3. **Then** verify:
   - Task A does NOT appear (completed tasks excluded)
   - Task B appears (due today and incomplete)

**Expected Result**: Completed tasks never appear in Today's Focus

---

#### Test 10: Today's Focus Empty State

**Setup**: Ensure no tasks meet focus criteria (all completed or not urgent)

1. **Given** no tasks are due today or high priority incomplete
2. **When** Today's Focus section renders
3. **Then** verify:
   - Empty state message appears (e.g., "Nothing urgent right now. Great job!")
   - No task items displayed
   - Section remains visible with positive messaging

**Expected Result**: Appropriate empty state message displayed

---

#### Test 11: Today's Focus Real-Time Updates

**Setup**: Start with Task A in Today's Focus

1. **Given** Task A appears in Today's Focus
2. **When** you click the completion checkbox on Task A
3. **Then** verify:
   - Task A disappears from Today's Focus immediately
   - Summary cards update (Pending -1, Completed +1)
   - No page refresh required

**Expected Result**: Today's Focus updates reactively when tasks change

---

### P3 - Quick Actions Panel

#### Test 12: Add Task Quick Action

1. **Given** you are viewing the dashboard
2. **When** you click the "Add Task" button in Quick Actions
3. **Then** verify:
   - TaskForm modal opens within 100ms
   - Modal is in "create" mode (not pre-filled)
   - Focus moves to title input field
   - Form fields are all empty/default values

**Expected Result**: TaskForm modal opens for task creation

---

#### Test 13: View All Tasks Quick Action

1. **Given** you are viewing the dashboard at /dashboard
2. **When** you click "View All Tasks" button in Quick Actions
3. **Then** verify:
   - Browser navigates to main task list route (e.g., / or /tasks)
   - Navigation occurs immediately (<100ms)
   - Full task list displays

**Expected Result**: Navigation to main task list works correctly

---

#### Test 14: Clear Completed Quick Action - Confirmation

**Setup**: Ensure 5 completed tasks exist

1. **Given** there are 5 completed tasks
2. **When** you click "Clear Completed (5)" button
3. **Then** verify:
   - Confirmation dialog appears
   - Dialog asks: "Are you sure you want to delete all 5 completed tasks?"
   - Dialog has two buttons: "Cancel" and "Delete"
   - "Delete" button has destructive styling (red background)

**Expected Result**: Confirmation dialog prevents accidental deletion

---

#### Test 15: Clear Completed Quick Action - Cancel

**Setup**: Continue from Test 14

1. **Given** the confirmation dialog is open
2. **When** you click "Cancel" button
3. **Then** verify:
   - Dialog closes immediately
   - No tasks are deleted
   - Completed count remains 5
   - Dashboard state unchanged

**Expected Result**: Cancel button dismisses dialog without action

---

#### Test 16: Clear Completed Quick Action - Confirm

**Setup**: Continue from Test 14

1. **Given** the confirmation dialog is open
2. **When** you click "Delete" button
3. **Then** verify:
   - Dialog closes immediately
   - All 5 completed tasks are removed
   - Summary cards update:
     - Total: -5
     - Completed: 0 (was 5)
     - Pending: unchanged
   - Update happens within 200ms

**Expected Result**: All completed tasks are removed with real-time UI update

---

#### Test 17: Clear Completed Disabled State

**Setup**: Ensure no completed tasks exist

1. **Given** there are 0 completed tasks
2. **When** you view the Quick Actions panel
3. **Then** verify:
   - "Clear Completed (0)" button is disabled
   - Button has disabled styling (grayed out, no hover effect)
   - Button is not clickable
   - Cursor shows "not-allowed" on hover

**Expected Result**: Button is disabled when no completed tasks exist

---

### P4 - Enhanced Navigation & Visual Consistency

#### Test 18: Navigation Bar Persistence

1. **Given** you are on the dashboard (/dashboard)
2. **When** you navigate to main task list (/) using Navbar links
3. **Then** verify:
   - Navigation bar remains at top (persists across routes)
   - TASKIFY branding remains visible
   - Active route is highlighted in navigation
   - No page flicker or navigation bar rerender

**Expected Result**: Navigation bar persists across all routes

---

#### Test 19: Active Route Highlighting

1. **Given** you are on the dashboard (/dashboard)
2. **Then** verify:
   - "Dashboard" link in Navbar has active styling (underline, bold, or background highlight)
2. **When** you click "All Tasks" link
3. **Then** verify:
   - "All Tasks" link becomes active
   - "Dashboard" link returns to inactive styling
   - Active state updates immediately

**Expected Result**: Active route is visually indicated in navigation

---

#### Test 20: Hover States and Interactions

1. **Given** you hover over interactive elements
2. **Then** verify consistent hover states:
   - Summary cards (if interactive): Subtle background color change
   - Quick Action buttons: Background darkens, cursor changes to pointer
   - Navigation links: Underline or color change
   - Task checkboxes: Border highlight

**Expected Result**: All interactive elements have consistent hover feedback

---

#### Test 21: Focus Indicators (Keyboard Navigation)

1. **Given** you press Tab key to navigate
2. **Then** verify visible focus indicators:
   - Blue ring around focused element (Tailwind focus-ring-2 focus-ring-blue-500)
   - Focus order is logical: Navbar → Summary Cards → Today's Focus → Quick Actions
   - Pressing Enter/Space activates focused button

**Expected Result**: Keyboard navigation works with visible focus indicators

---

#### Test 22: Responsive Layout - Tablet View

1. **Given** you set browser width to 768px (tablet)
2. **Then** verify:
   - Summary cards in 2x2 grid (2 columns)
   - Today's Focus and Quick Actions side-by-side
   - Navigation bar remains visible
   - Touch-friendly spacing (buttons min 44x44px)

**Expected Result**: Tablet layout adapts correctly

---

#### Test 23: Responsive Layout - Mobile View

1. **Given** you set browser width to 375px (mobile)
2. **Then** verify:
   - Summary cards stack vertically (1 column)
   - Today's Focus above Quick Actions (stacked, not side-by-side)
   - Navigation may collapse to hamburger menu (optional)
   - All text remains readable
   - No horizontal scrolling

**Expected Result**: Mobile layout stacks sections vertically

---

## Edge Case Validation

### Test 24: Large Task Count (Performance)

**Setup**: Create 100 tasks with mixed properties

1. **Given** 100 tasks exist (50 completed, 50 incomplete, 10 overdue)
2. **When** dashboard renders and you interact with UI
3. **Then** verify:
   - Summary cards calculate and display correct counts
   - Today's Focus filters tasks correctly
   - UI updates within 300ms when completing a task
   - No lag or stuttering during interactions

**Expected Result**: Dashboard remains performant with 100 tasks

---

### Test 25: Very Long Task Titles in Today's Focus

**Setup**: Create task with 200-character title due today

1. **Given** a task with very long title in Today's Focus
2. **Then** verify:
   - Title is truncated with ellipsis if exceeding 2 lines
   - Layout doesn't break or overflow container
   - Full title visible on hover (optional tooltip)

**Expected Result**: Long titles are handled gracefully

---

### Test 26: Many Overdue Tasks

**Setup**: Create 20 overdue tasks

1. **Given** 20 tasks are overdue
2. **When** summary cards render
3. **Then** verify:
   - Overdue card shows "20" with proper styling
   - Card emphasizes urgency with red color scheme
   - Number is formatted correctly (no truncation)

**Expected Result**: Large numbers are displayed correctly

---

### Test 27: Rapid Task Completion (State Consistency)

1. **Given** you have 5 tasks in Today's Focus
2. **When** you rapidly click checkboxes on all 5 tasks (within 1 second)
3. **Then** verify:
   - All 5 tasks are marked complete
   - Summary cards update correctly (Completed +5, Pending -5)
   - Today's Focus clears (all tasks removed)
   - No stale data or inconsistent UI state

**Expected Result**: Rapid interactions maintain state consistency

---

### Test 28: Browser Back Button

1. **Given** you navigate from Dashboard → All Tasks → Dashboard
2. **When** you press browser Back button
3. **Then** verify:
   - Navigation works correctly (Dashboard ← All Tasks ← Dashboard)
   - Dashboard state is preserved (counts, Today's Focus)
   - No errors in browser console

**Expected Result**: Browser navigation works as expected

---

## Accessibility Validation

### Test 29: Screen Reader Announcement

**Prerequisite**: Enable screen reader (NVDA on Windows, JAWS, VoiceOver on macOS)

1. **Given** screen reader is active
2. **When** you navigate through dashboard with Tab key
3. **Then** verify screen reader announces:
   - "TASKIFY Dashboard" when landing on page
   - "Total Tasks: 10" when focusing summary card
   - "Completed Tasks: 3, Tasks marked as complete" (aria-describedby)
   - "Today's Focus" heading before task list
   - "Add Task button" with appropriate role

**Expected Result**: All content is announced correctly by screen reader

---

### Test 30: Keyboard-Only Navigation

1. **Given** you use only keyboard (no mouse)
2. **When** you navigate the dashboard
3. **Then** verify:
   - All interactive elements are reachable via Tab
   - Enter/Space activates buttons
   - Escape closes modals/dialogs
   - Focus never gets trapped
   - Tab order is logical (top to bottom, left to right)

**Expected Result**: Dashboard is fully usable with keyboard only

---

### Test 31: Color Contrast (WCAG AA Compliance)

1. **Given** you inspect summary card colors
2. **Then** verify contrast ratios meet WCAG AA standards:
   - Blue card: Text vs background ≥ 4.5:1
   - Green card: Text vs background ≥ 4.5:1
   - Yellow card: Text vs background ≥ 4.5:1
   - Red card: Text vs background ≥ 4.5:1
   - Icons are not sole conveyor of information (labels present)

**Tool**: Use browser DevTools or WebAIM Contrast Checker

**Expected Result**: All color combinations meet WCAG AA standards

---

## Troubleshooting

### Issue: Dashboard Route Not Found (404)

**Symptoms**: Navigating to /dashboard shows 404 error

**Solutions**:
1. Verify `app/dashboard/page.tsx` file exists
2. Restart dev server: Ctrl+C then `npm run dev`
3. Check Next.js routing in browser console for errors
4. Ensure no typos in route path (should be `/dashboard`, not `/Dashboard`)

---

### Issue: Summary Cards Show All Zeros

**Symptoms**: All summary cards display count of 0 despite tasks existing

**Solutions**:
1. Check TaskProvider is wrapping the app in `app/layout.tsx`
2. Verify `useTasks()` hook returns tasks array
3. Open React DevTools → Components → Find TaskProvider → Inspect state
4. Check if `useDashboardStats` hook is receiving tasks array correctly
5. Verify mock data is imported and initialized in TaskProvider

---

### Issue: Icons Not Displaying

**Symptoms**: Summary cards and quick actions show no icons

**Solutions**:
1. Verify heroicons is installed: `npm list @heroicons/react`
2. If not installed: `npm install @heroicons/react`
3. Restart dev server after installation
4. Check import paths in components:
   ```typescript
   import { CheckCircleIcon } from '@heroicons/react/24/outline';
   ```
5. Ensure icon components have proper className prop

---

### Issue: Today's Focus Shows No Tasks

**Symptoms**: Today's Focus empty despite having tasks due today or high priority

**Solutions**:
1. Verify date comparison logic is using local timezone (not UTC)
2. Check task `dueDate` format is ISO 8601 (YYYY-MM-DD)
3. Inspect tasks in React DevTools:
   - Are any tasks incomplete?
   - Are any due dates set to today?
   - Are any priorities set to 'high'?
4. Check `filterTodaysFocusTasks` function is imported and used correctly
5. Verify `isToday` utility function is working (test in console)

---

### Issue: Clear Completed Not Working

**Symptoms**: Clicking Clear Completed confirmation does nothing

**Solutions**:
1. Check TaskContext reducer has `CLEAR_COMPLETED` action handler
2. Verify dispatch function is being called with correct action type
3. Open browser console → Look for action dispatch logs
4. Check reducer implementation:
   ```typescript
   case 'CLEAR_COMPLETED': {
     return {
       ...state,
       tasks: state.tasks.filter(task => !task.completed)
     };
   }
   ```
5. Ensure confirmation dialog `onConfirm` callback is wired correctly

---

### Issue: Navigation Bar Not Sticky

**Symptoms**: Navigation bar scrolls away when scrolling down dashboard

**Solutions**:
1. Check Navbar component has sticky positioning:
   ```typescript
   className="sticky top-0 z-50 bg-white"
   ```
2. Verify no parent elements have `overflow: hidden` CSS
3. Check z-index is high enough to stay above content
4. Restart dev server if Tailwind classes not applying

---

## Browser Console Commands

### Inspect Dashboard State

Open browser console (F12 → Console tab) and run:

```javascript
// Log current task count
console.log('Total tasks:', document.querySelectorAll('[data-task-id]').length);

// Check TaskProvider state (React DevTools required)
$r // Select TaskProvider in Components tab first, then $r in console
```

### Performance Profiling

1. Open DevTools → Performance tab
2. Click "Record" (circle button)
3. Interact with dashboard (complete tasks, open modals, navigate)
4. Click "Stop" recording
5. Analyze flame graph for operations >100ms

---

## Next Steps

Once all validation tests pass:

1. **Review implementation plan**: `specs/002-dashboard-branding/plan.md`
2. **Generate implementation tasks**: Run `/sp.tasks` command
3. **Begin development**: Follow tasks.md in priority order (P1 MVP → P2 → P3 → P4)

---

**Quickstart Status**: ✅ **COMPLETE**
**Expected Completion Time**: 15-20 minutes (setup + validation)
**Support**: Refer to troubleshooting section or review implementation plan for architectural guidance
