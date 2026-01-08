# Quickstart: Todo App Frontend UI

**Feature**: 004-todo-frontend-ui
**Date**: 2026-01-08
**Purpose**: Get the Todo App frontend running locally and validate core functionality

---

## Prerequisites

### Required Software

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

### 1. Install Dependencies

Navigate to the project root directory and install all required packages:

```bash
# Using npm
npm install

# OR using pnpm (faster)
pnpm install
```

**Expected Output**:
```
added 234 packages, and audited 235 packages in 15s
```

**Troubleshooting**:
- If installation fails, delete `node_modules/` and `package-lock.json`, then try again
- Ensure you're in the correct directory (should contain `package.json`)

---

### 2. Run Development Server

Start the Next.js development server:

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

**Troubleshooting**:
- **Port 3000 in use**: Stop other services or change port via `PORT=3001 npm run dev`
- **Build errors**: Check console output for TypeScript or dependency errors
- **Slow startup**: First build takes longer; subsequent starts are faster

---

### 3. Open Application in Browser

1. Open your browser (Chrome, Firefox, Safari, or Edge)
2. Navigate to: **http://localhost:3000**
3. Application should load within 2-3 seconds

**Expected Initial View**:
- Dashboard page with header "Todo App"
- 5-10 mock tasks pre-populated in the list
- "Add Task" button prominently displayed (top-right or above list)
- Filter panel with search input, status dropdown, priority dropdown
- Sort control dropdown (default: "Newest First")
- Task items showing:
  - Task title in bold
  - Description (if present)
  - Priority badge (color-coded: red=high, yellow=medium, green=low)
  - Due date (if present)
  - Tags as chips/badges
  - Completion checkbox
  - Edit and delete buttons

---

## Validation Steps

Validate each user story by following these test scenarios:

### P1 - Create and View Tasks (MVP) 🎯

#### Test 1: Empty State (if no mock data)
1. If task list is empty, verify you see:
   - Empty state message (e.g., "No tasks yet. Add your first task to get started!")
   - Prominent "Add Task" button
2. Click "Add Task" button → Form modal should open

#### Test 2: Add New Task
1. Click "Add Task" button
2. Fill in form fields:
   - **Title**: "Test Task" (required)
   - **Description**: "This is a test task" (optional)
   - **Priority**: Select "High" from dropdown
   - **Due Date**: Select tomorrow's date
   - **Tags**: Type "test, validation" (comma-separated)
3. Observe real-time validation:
   - Submit button should be disabled if title is empty
   - Submit button should be enabled when title is filled
4. Click "Submit" or "Add Task" button
5. **Expected Result**:
   - Modal closes immediately
   - New task appears at top of list (sorted by creation time)
   - Task displays all entered information correctly
   - High priority badge shows in red
   - Tags appear as individual chips

#### Test 3: View Task List
1. Observe task list layout:
   - Tasks displayed in card or list format
   - Clear visual hierarchy (title largest, description smaller)
   - Priority badges color-coded and visible
   - Due dates formatted (e.g., "Jan 9, 2026")
   - Completion checkboxes unchecked for new tasks
2. Resize browser window to mobile width (320px-640px)
3. **Expected Result**:
   - Layout adapts to single column on mobile
   - Touch targets are large enough (44x44px minimum)
   - Text remains readable without horizontal scroll

---

### P2 - Manage Task Lifecycle

#### Test 4: Edit Existing Task
1. Click "Edit" button (pencil icon) on any task
2. **Expected Result**:
   - Modal opens with form pre-filled with current task values
   - Title field contains current title
   - All other fields match current task data
3. Modify fields:
   - Change title to "Updated Test Task"
   - Change priority from "High" to "Medium"
4. Click "Save" or "Update" button
5. **Expected Result**:
   - Modal closes immediately
   - Task list updates with new values
   - Medium priority badge now shows in yellow
   - Focus returns to task list or appropriate element

#### Test 5: Toggle Task Completion
1. Locate an incomplete task (checkbox unchecked)
2. Click the completion checkbox
3. **Expected Result**:
   - Checkbox becomes checked immediately
   - Task visual appearance changes:
     - Title has strikethrough text decoration OR
     - Task has reduced opacity (e.g., 60%) OR
     - Task moves to "Completed" section (if grouped)
4. Click checkbox again to uncheck
5. **Expected Result**:
   - Checkbox becomes unchecked
   - Task returns to normal appearance

#### Test 6: Delete Task
1. Click "Delete" button (trash icon) on any task
2. **Expected Result**:
   - Confirmation dialog appears
   - Dialog has clear destructive styling (red buttons/text)
   - Dialog asks "Are you sure you want to delete this task?"
   - Two buttons: "Cancel" and "Delete" (or similar)
3. Click "Cancel" button
4. **Expected Result**:
   - Dialog closes
   - Task remains in list unchanged
5. Click "Delete" button again
6. Click "Delete" in confirmation dialog
7. **Expected Result**:
   - Dialog closes immediately
   - Task is removed from list
   - Remaining tasks shift up to fill space

---

### P3 - Filter, Search, and Sort Tasks

#### Test 7: Search by Keyword
1. Locate search input box (usually at top of task list)
2. Type "test" slowly (one character at a time)
3. **Expected Result**:
   - No filtering occurs for 300ms after last keystroke (debounced)
   - After 300ms, task list filters to show only tasks with "test" in title or description
   - Search is case-insensitive
4. Clear search input (backspace all characters)
5. **Expected Result**:
   - All tasks reappear after 300ms debounce

#### Test 8: Filter by Completion Status
1. Locate completion status filter dropdown (e.g., "All Tasks")
2. Select "Completed" from dropdown
3. **Expected Result**:
   - Task list shows only tasks with checked checkboxes
   - Incomplete tasks are hidden
4. Select "Incomplete" from dropdown
5. **Expected Result**:
   - Task list shows only tasks with unchecked checkboxes
   - Completed tasks are hidden
6. Select "All Tasks" from dropdown
7. **Expected Result**:
   - All tasks reappear regardless of completion status

#### Test 9: Filter by Priority
1. Locate priority filter dropdown (e.g., "All Priorities")
2. Select "High" from dropdown
3. **Expected Result**:
   - Task list shows only tasks with red (high) priority badges
   - Medium and low priority tasks are hidden
4. Select "All Priorities" from dropdown
5. **Expected Result**:
   - All tasks reappear regardless of priority

#### Test 10: Sort Tasks
1. Locate sort control dropdown (e.g., "Sort by: Newest First")
2. Select "Due Date" from dropdown
3. **Expected Result**:
   - Task list reorders with earliest due dates at top
   - Tasks without due dates appear at bottom
4. Select "Priority" from dropdown
5. **Expected Result**:
   - Task list reorders with high-priority tasks at top, then medium, then low
6. Select "Alphabetical" from dropdown
7. **Expected Result**:
   - Task list reorders alphabetically by title (A-Z)

#### Test 11: Multiple Filters
1. Type "test" in search box (filter 1)
2. Select "High" priority from dropdown (filter 2)
3. **Expected Result**:
   - Task list shows ONLY tasks that:
     - Contain "test" in title or description AND
     - Have "High" priority
   - Tasks that match only one filter are hidden

#### Test 12: Clear Filters
1. Apply multiple filters (search + priority filter)
2. Locate "Clear Filters" or "Reset" button
3. Click button
4. **Expected Result**:
   - Search input clears to empty
   - Priority filter resets to "All Priorities"
   - All tasks reappear

---

### P4 - Recurring Tasks and Priorities

#### Test 13: Create Recurring Task
1. Click "Add Task" button
2. Fill in task details:
   - Title: "Weekly Meeting"
   - Priority: "Medium"
3. Locate recurrence controls (dropdown or buttons)
4. Select "Weekly" recurrence
5. **Expected Result**:
   - UI shows preview of next 3-5 occurrences (e.g., "Jan 15, Jan 22, Jan 29, Feb 5, Feb 12")
6. Submit task
7. **Expected Result**:
   - Task appears in list with recurrence indicator (e.g., icon or badge)

#### Test 14: Priority Visual Indicators
1. Create or locate three tasks with different priorities (low, medium, high)
2. Observe priority badges:
   - **High priority**: Red background with white or dark red text
   - **Medium priority**: Yellow background with white or dark yellow text
   - **Low priority**: Green background with white or dark green text
3. **Expected Result**:
   - Priority is immediately identifiable by color without reading text
   - Color scheme is consistent across all tasks

#### Test 15: Overdue Task Indicator
1. Create a task with due date in the past (e.g., yesterday)
2. **Expected Result**:
   - Task displays "Overdue" badge or indicator (red highlight)
   - Due date text may be in red color
3. Create a task with due date tomorrow (within 24 hours)
4. **Expected Result**:
   - Task displays "Due Soon" indicator (yellow/orange)

---

## Edge Case Validation

### Test 16: Empty Task List
1. Delete all tasks (if mock data present)
2. **Expected Result**:
   - Empty state message appears
   - "Add Task" button remains prominent
   - No errors in browser console

### Test 17: Invalid Form Input
1. Click "Add Task"
2. Leave title field empty
3. Try to submit form
4. **Expected Result**:
   - Submit button is disabled OR
   - Inline error message appears: "Title is required"
   - Form does not submit

### Test 18: Very Long Task Title
1. Create task with 250-character title (exceeds 200-char limit)
2. **Expected Result**:
   - Validation error appears: "Title must be 200 characters or less"
   - Submit button disabled until title shortened

### Test 19: Many Tags on One Task
1. Create task with 15 tags
2. **Expected Result**:
   - Tags wrap to multiple lines OR
   - Tags scroll horizontally
   - Layout does not break or overflow container

### Test 20: Rapid Button Clicks
1. Click "Add Task" button rapidly 5 times in 1 second
2. **Expected Result**:
   - Only one modal opens
   - No duplicate modals or broken state
3. Create a task, then immediately click "Edit" and "Delete" rapidly
4. **Expected Result**:
   - UI remains consistent
   - No console errors
   - State does not become stale

---

## Performance Validation

### Test 21: Large Task List
1. Create 100 tasks (or modify mock data to include 100 tasks)
2. Apply filters and sorts
3. **Expected Result**:
   - UI remains responsive (<300ms update time)
   - No lag or stuttering during interactions
   - No memory leaks (check browser dev tools Performance tab)

### Test 22: Mobile Responsiveness
1. Open browser dev tools (F12)
2. Toggle device toolbar (Ctrl+Shift+M or Cmd+Shift+M)
3. Select "iPhone SE" (375x667)
4. **Expected Result**:
   - Layout adapts to mobile width
   - All buttons remain accessible
   - Text remains readable
5. Select "iPad" (768x1024)
6. **Expected Result**:
   - Layout may switch to 2-column grid
   - Increased padding and spacing

---

## Troubleshooting

### Issue: Page Doesn't Load

**Symptoms**: Browser shows blank page or loading spinner indefinitely

**Solutions**:
1. Open browser console (F12 → Console tab)
2. Check for JavaScript errors (red text)
3. Common errors:
   - **Module not found**: Run `npm install` again
   - **Port already in use**: Stop other services or change port
   - **TypeScript errors**: Fix type errors in source code
4. Restart dev server: Ctrl+C in terminal, then `npm run dev` again

---

### Issue: Tasks Don't Appear

**Symptoms**: Empty task list despite mock data in code

**Solutions**:
1. Open browser console → Check for state errors
2. Verify `mockData.ts` is properly imported in `TaskProvider`
3. Check TaskProvider is wrapping app in `app/layout.tsx`:
   ```typescript
   export default function RootLayout({ children }) {
     return (
       <html>
         <body>
           <TaskProvider>
             {children}
           </TaskProvider>
         </body>
       </html>
     );
   }
   ```
4. Check initial state in reducer includes mock tasks

---

### Issue: Tailwind Styles Not Applied

**Symptoms**: Buttons, layout, colors appear broken or unstyled

**Solutions**:
1. Verify `globals.css` includes Tailwind directives:
   ```css
   @tailwind base;
   @tailwind components;
   @tailwind utilities;
   ```
2. Check `tailwind.config.ts` content paths include all component directories:
   ```typescript
   content: [
     './app/**/*.{js,ts,jsx,tsx}',
     './components/**/*.{js,ts,jsx,tsx}',
   ],
   ```
3. Restart dev server after config changes
4. Clear browser cache (Ctrl+Shift+R or Cmd+Shift+R)

---

### Issue: Modal Doesn't Open

**Symptoms**: Clicking "Add Task" or "Edit" does nothing

**Solutions**:
1. Check browser console for errors
2. Verify modal state is managed correctly (`useState` hook)
3. Check modal component has `isOpen={true}` when triggered
4. Verify `'use client'` directive is present in modal component file

---

### Issue: State Not Updating

**Symptoms**: Creating/editing/deleting tasks has no effect

**Solutions**:
1. Check reducer is handling actions correctly (add console.log in reducer)
2. Verify dispatch function is called with correct action type and payload
3. Check Context provider is at correct level in component tree
4. Open React DevTools → Components tab → Inspect TaskProvider state

---

## Browser Console Commands

### Inspect Application State

Open browser console (F12 → Console tab) and run:

```javascript
// Get React DevTools extension (if installed)
// Right-click component in Elements tab → "Show component in Console"

// Or use this to log all tasks
console.log('Tasks:', window.__NEXT_DATA__);
```

### Performance Profiling

1. Open Dev Tools → Performance tab
2. Click "Record" (circle button)
3. Interact with app (add/edit/delete tasks, filter, sort)
4. Click "Stop" recording
5. Analyze flame graph for slow operations (>100ms)

---

## Next Steps

Once all validation tests pass:

1. **Review implementation plan**: `specs/004-todo-frontend-ui/plan.md`
2. **Generate implementation tasks**: Run `/sp.tasks` command
3. **Begin development**: Follow tasks.md in priority order (P1 → P2 → P3 → P4)

---

**Quickstart Status**: ✅ **COMPLETE**
**Expected Completion Time**: 10-15 minutes (setup + validation)
**Support**: Refer to troubleshooting section or review implementation plan for architectural guidance
