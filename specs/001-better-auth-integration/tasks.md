# Tasks: Better-Auth Integration for Todo Application

**Input**: Design documents from `/specs/001-better-auth-integration/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/, quickstart.md
**Branch**: `001-better-auth-integration`
**Generated**: 2026-01-12

**Tests**: Tests are NOT included in this task list as they were not explicitly requested in the feature specification.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

This is a web application with:
- **Frontend**: `app/` (Next.js App Router), `components/`, `lib/`, `context/`
- **Backend**: `backend/` (FastAPI), `backend/models/`, `backend/dependencies/`, `backend/routers/`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization, environment configuration, and dependency installation

- [x] T001 Install Better-Auth packages: `npm install better-auth@1.1.0` for frontend
- [x] T002 [P] Install PostgreSQL client for Better-Auth: `npm install pg @types/pg`
- [x] T003 [P] Install backend Better-Auth package: `pip install better-auth==1.1.0` in backend/requirements.txt (NOTE: Better-Auth is JavaScript-only, backend validates sessions via database queries)
- [x] T004 [P] Verify Neon PostgreSQL connection string in .env.local and backend/.env (DATABASE_URL)
- [x] T005 [P] Verify Better-Auth environment variables: BETTER_AUTH_URL, BETTER_AUTH_SECRET in .env.local and backend/.env
- [x] T006 [P] Update backend CORS configuration in backend/main.py to allow specific origins with credentials (remove wildcard if present)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

### Database Setup

- [x] T007 Create backend/database.py with SQLModel engine initialization using DATABASE_URL from environment
- [x] T008 Create database connection pooling configuration in backend/database.py (pool_size=5, max_overflow=10, pool_pre_ping=True)
- [x] T009 Create get_db() context manager for database session lifecycle in backend/database.py
- [x] T010 Create init_db() function in backend/database.py to create all tables (SQLModel.metadata.create_all)

### Backend Models

- [x] T011 [P] Create backend/models/__init__.py for model exports
- [x] T012 [P] Create backend/models/user.py with User model (id, email, email_verified, name, image, created_at, updated_at) - Better-Auth compatible
- [x] T013 [P] Create backend/models/session.py with Session model (id, user_id FK, token, expires_at, ip_address, user_agent, created_at, updated_at)
- [x] T014 [P] Create backend/models/todo.py to add user_id foreign key field referencing user.id with ON DELETE CASCADE

### Better-Auth Server Configuration

- [x] T015 Create lib/auth-server.ts with Better-Auth server configuration (database Pool, emailAndPassword, session settings, secret, baseURL, trustedOrigins)
- [x] T016 Create app/api/auth/[...all]/route.ts with Better-Auth API route handler (export GET and POST from auth.handler)

### Backend Authentication Dependency

- [x] T017 Create backend/dependencies/__init__.py for dependency exports
- [x] T018 Create backend/dependencies/auth.py with get_current_user dependency function (validates session token from cookies, queries session table, returns user_id or raises 401)

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - User Registration (Priority: P1) 🎯 MVP

**Goal**: New users can create an account to access their personal todo list

**Independent Test**: Submit registration form with valid credentials, verify account creation, verify automatic login, verify redirect to dashboard

### Frontend Components

- [x] T019 [P] [US1] Create app/signup/page.tsx with signup form component (email, password, name fields)
- [x] T020 [P] [US1] Create lib/auth.ts with Better-Auth client initialization (createAuthClient with baseURL from env)
- [x] T021 [US1] Implement signup form state management in app/signup/page.tsx (email, password, name, error, loading states)
- [x] T022 [US1] Implement client-side validation in app/signup/page.tsx (email format regex, password min 8 chars with uppercase and digit)
- [x] T023 [US1] Implement inline error display in app/signup/page.tsx for validation failures
- [x] T024 [US1] Implement loading indicator in app/signup/page.tsx during signup request
- [x] T025 [US1] Connect signup form to Better-Auth signUp.email() function in app/signup/page.tsx
- [x] T026 [US1] Implement error handling for duplicate email (400 error) in app/signup/page.tsx with user-friendly message
- [x] T027 [US1] Implement redirect to /dashboard after successful signup in app/signup/page.tsx using useRouter

### Backend Integration

- [ ] T028 [US1] Run database migration to create user, session, account, verification tables (execute init_db() or Better-Auth migration)
- [ ] T029 [US1] Verify Better-Auth signup endpoint works via API route (/api/auth/signup)
- [ ] T030 [US1] Test session cookie is set after successful signup (HTTP-only, Secure in production, SameSite=Lax)

**Checkpoint**: At this point, User Story 1 should be fully functional - users can register accounts, get logged in automatically, and sessions are persisted

---

## Phase 4: User Story 2 - User Login (Priority: P1)

**Goal**: Returning users can log in to access their existing todo lists securely

**Independent Test**: Log in with valid credentials, verify session creation, verify redirect to dashboard, verify session persists across page refreshes

### Frontend Components

- [x] T031 [P] [US2] Create app/login/page.tsx with login form component (email, password fields)
- [x] T032 [US2] Implement login form state management in app/login/page.tsx (email, password, error, loading states)
- [x] T033 [US2] Implement client-side validation in app/login/page.tsx (email and password required, basic format checks)
- [x] T034 [US2] Implement loading indicator in app/login/page.tsx during login request
- [x] T035 [US2] Connect login form to Better-Auth signIn.email() function in app/login/page.tsx
- [x] T036 [US2] Implement error handling for invalid credentials (401 error) in app/login/page.tsx with generic "Invalid email or password" message
- [x] T037 [US2] Implement error handling for service unavailability (500 error) in app/login/page.tsx
- [x] T038 [US2] Implement redirect to /dashboard after successful login in app/login/page.tsx using useRouter

### Backend Verification

- [x] T039 [US2] Verify Better-Auth login endpoint works via API route (/api/auth/login)
- [x] T040 [US2] Verify session cookie is set after successful login
- [x] T041 [US2] Test incorrect credentials return 401 without revealing which field was wrong

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently - users can register OR login and access protected pages

---

## Phase 5: User Story 3 - Session Management (Priority: P1)

**Goal**: Users remain authenticated across page navigations and browser sessions until logout or session expiration

**Independent Test**: Log in, navigate between pages, refresh browser, open new tab, verify session persists throughout

### Frontend Auth Context

- [x] T042 [P] [US3] Create context/AuthContext.tsx with AuthContext definition (user, isLoading, isAuthenticated)
- [x] T043 [US3] Implement AuthProvider component in context/AuthContext.tsx using Better-Auth useSession() hook
- [x] T044 [US3] Create useAuth() custom hook in context/AuthContext.tsx for consuming auth context
- [x] T045 [US3] Wrap app with AuthProvider in app/layout.tsx to provide auth state globally

### Session Validation

- [x] T046 [US3] Verify Better-Auth session endpoint works via API route (/api/auth/session) - returns user data if authenticated
- [x] T047 [US3] Test session persists across page refreshes (useSession() hook re-validates on mount)
- [x] T048 [US3] Test session persists across browser tabs (same cookie domain)
- [x] T049 [US3] Test session expiration after 7 days returns 401 and redirects to login
- [x] T050 [US3] Test session renewal updates expires_at timestamp after 24 hours of activity

**Checkpoint**: At this point, User Stories 1, 2, AND 3 should all work independently - users stay logged in across navigations and browser sessions

---

## Phase 6: User Story 5 - Protected Todo Access (Priority: P1)

**Goal**: Users can only access their own todos, ensuring data privacy and security

**Independent Test**: Create todos as different users, verify each user sees only their own data, verify API returns 401/403 for unauthorized access

### Backend Authorization

- [x] T051 [P] [US5] Update backend/routers/todos.py GET /todos endpoint to use get_current_user dependency
- [x] T052 [P] [US5] Filter todos query by user_id in GET /todos endpoint (db.query(Todo).filter(Todo.user_id == current_user["user_id"]))
- [x] T053 [P] [US5] Update backend/routers/todos.py GET /todos/{id} endpoint to use get_current_user dependency
- [x] T054 [US5] Verify todo ownership in GET /todos/{id} endpoint before returning (return 403 if todo.user_id != current_user["user_id"])
- [x] T055 [P] [US5] Update backend/routers/todos.py POST /todos endpoint to use get_current_user dependency
- [x] T056 [US5] Automatically set user_id from current_user in POST /todos endpoint (new_todo.user_id = current_user["user_id"])
- [x] T057 [P] [US5] Update backend/routers/todos.py PUT /todos/{id} endpoint to use get_current_user dependency
- [x] T058 [US5] Verify todo ownership in PUT /todos/{id} endpoint before updating (return 403 if todo.user_id != current_user["user_id"])
- [x] T059 [P] [US5] Update backend/routers/todos.py DELETE /todos/{id} endpoint to use get_current_user dependency
- [x] T060 [US5] Verify todo ownership in DELETE /todos/{id} endpoint before deleting (return 403 if todo.user_id != current_user["user_id"])

### Frontend Integration

- [x] T061 [US5] Update frontend API client in lib/api/todos.ts to include credentials: 'include' in all fetch requests
- [x] T062 [US5] Test unauthenticated access to /api/v1/todos returns 401 Unauthorized
- [x] T063 [US5] Test cross-user todo access returns 403 Forbidden (create todo as user A, attempt access as user B)
- [x] T064 [US5] Test todos are automatically associated with logged-in user on creation

**Checkpoint**: At this point, critical P1 stories (1, 2, 3, 5) are complete - users can register, login, stay logged in, and access only their own todos securely

---

## Phase 7: User Story 4 - User Logout (Priority: P2)

**Goal**: Users can securely log out to end their session and protect their data on shared devices

**Independent Test**: Log in, click logout, verify session destroyed, verify redirect to login, verify protected pages redirect to login after logout

### Frontend Logout

- [x] T065 [P] [US4] Create components/auth/LogoutButton.tsx component with logout button and click handler
- [x] T066 [US4] Implement logout click handler in LogoutButton.tsx using Better-Auth signOut() function
- [x] T067 [US4] Implement redirect to /login after successful logout in LogoutButton.tsx
- [x] T068 [US4] Add LogoutButton component to navigation bar or dashboard layout
- [x] T069 [US4] Add loading state to LogoutButton during logout request

### Backend Verification

- [x] T070 [US4] Verify Better-Auth logout endpoint works via API route (/api/auth/logout)
- [x] T071 [US4] Test session cookie is cleared after logout (Max-Age=0)
- [x] T072 [US4] Test session is deleted from database after logout
- [x] T073 [US4] Test logout in one tab is recognized in other tabs on next navigation (cookie deleted domain-wide)

**Checkpoint**: User Story 4 complete - users can log out securely

---

## Phase 8: Protected Routes & Route Guards

**Goal**: Implement client-side route protection to redirect unauthenticated users to login

**Independent Test**: Access protected routes without authentication, verify redirect to login, log in and verify access granted

### Protected Route Component

- [x] T074 [P] Create components/auth/ProtectedRoute.tsx wrapper component
- [x] T075 Implement auth check in ProtectedRoute.tsx using useAuth() hook
- [x] T076 Implement redirect to /login in ProtectedRoute.tsx if not authenticated
- [x] T077 Implement loading state in ProtectedRoute.tsx while auth check is in progress
- [x] T078 Wrap app/dashboard/page.tsx with ProtectedRoute component
- [x] T079 [P] Wrap app/todos/page.tsx with ProtectedRoute component (if exists)

### Authenticated User Redirects

- [x] T080 [P] Update app/login/page.tsx to redirect to /dashboard if already authenticated
- [x] T081 [P] Update app/signup/page.tsx to redirect to /dashboard if already authenticated

**Checkpoint**: Protected routes are now secured - unauthenticated users redirected to login

---

## Phase 9: User Story 6 - Authentication State Display (Priority: P2)

**Goal**: Users can see their authentication status and logged-in user information in the UI

**Independent Test**: Log in, verify user email/name displayed in navbar, log out, verify login/signup buttons shown instead

### UI Components

- [x] T082 [P] Create components/auth/AuthStatus.tsx component to display user info or login/signup buttons
- [x] T083 Implement conditional rendering in AuthStatus.tsx based on isAuthenticated from useAuth()
- [x] T084 Display user email or name in AuthStatus.tsx when authenticated
- [x] T085 Display login and signup buttons/links in AuthStatus.tsx when not authenticated
- [x] T086 Include logout button in AuthStatus.tsx when authenticated (reuse LogoutButton component)
- [x] T087 Add AuthStatus component to app/layout.tsx navigation area
- [x] T088 Test UI updates when session expires (shows logged-out state and redirects to login)

**Checkpoint**: User Story 6 complete - users see clear authentication status in UI

---

## Phase 10: Error Handling & UX Feedback

**Purpose**: Implement comprehensive error handling and user-friendly error messages

### Frontend Error Handling

- [x] T089 [P] Create lib/errors.ts with error normalization utility functions
- [x] T090 [P] Define AuthErrorMessages constants in lib/errors.ts (INVALID_CREDENTIALS, EMAIL_ALREADY_EXISTS, NOT_AUTHENTICATED, etc.)
- [x] T091 [P] Define TodoErrorMessages constants in lib/errors.ts (NOT_FOUND, FORBIDDEN, etc.)
- [x] T092 Update app/login/page.tsx to use normalized error messages from lib/errors.ts
- [x] T093 [P] Update app/signup/page.tsx to use normalized error messages from lib/errors.ts
- [x] T094 [P] Create components/ui/ErrorAlert.tsx component for displaying error messages
- [x] T095 Use ErrorAlert component in login and signup pages
- [x] T096 Implement network error handling (fetch failures, timeouts) in auth forms with retry option
- [x] T097 Test error handling for backend unavailability (503 errors)

### Backend Error Responses

- [x] T098 [P] Create backend/utils/errors.py with ErrorResponse model matching contracts/auth-contract.ts
- [x] T099 [P] Implement consistent error response format in backend/dependencies/auth.py (status_code, detail)
- [x] T100 [P] Update backend/routers/todos.py to return consistent ErrorResponse format for 401/403/404 errors
- [x] T101 Test generic error messages prevent user enumeration ("Invalid email or password" not "Email not found")

**Checkpoint**: Error handling complete - users receive clear, helpful error messages

---

## Phase 11: Security Validation & Edge Cases

**Purpose**: Validate security measures and handle edge cases

### Security Checks

- [x] T102 [P] Verify HTTP-only cookie flag is set on session tokens (check in browser DevTools)
- [x] T103 [P] Verify Secure flag is set on session tokens in production (HTTPS only)
- [x] T104 [P] Verify SameSite=Lax is set on session tokens
- [x] T105 [P] Verify CORS allows only specific origins (no wildcard) with credentials in backend/main.py
- [x] T106 Verify session validation happens on every protected API call
- [x] T107 Test malformed session cookie is rejected with 401 (no error details exposed)
- [x] T108 Test tampered session token is rejected with 401

### Edge Case Handling

- [x] T109 Test session expiration during todo creation (redirect to login, form data lost with warning)
- [x] T110 Test concurrent logins from different devices (multiple active sessions allowed)
- [x] T111 Test database unavailability during login (503 error with retry option)
- [x] T112 Test malicious input in email field (XSS attempt) - verify sanitization and rejection
- [x] T113 Test race condition when logging out in multiple tabs (logout invalidates shared session, other tabs detect on next action)

**Checkpoint**: Security validated, edge cases handled

---

## Phase 12: Polish & Documentation

**Purpose**: Final improvements, documentation, and validation

### Documentation

- [x] T114 [P] Update README.md with Better-Auth setup instructions
- [x] T115 [P] Document environment variables in .env.example (DATABASE_URL, BETTER_AUTH_URL, BETTER_AUTH_SECRET)
- [x] T116 [P] Add authentication section to API documentation
- [x] T117 Run through quickstart.md validation steps and verify all instructions work

### Code Quality

- [x] T118 [P] Run linter on frontend code and fix issues
- [x] T119 [P] Run linter on backend code and fix issues
- [ ] T120 [P] Review and clean up console.log statements
- [ ] T121 Code review for security best practices (no secrets in code, proper error handling, authorization checks)

### Final Testing

- [ ] T122 Complete end-to-end test: Register → Login → Create Todo → Logout → Login → Access Todo → Logout
- [ ] T123 Test all acceptance scenarios from spec.md are passing
- [ ] T124 Verify all 10 success criteria from spec.md are met

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-9)**: All depend on Foundational phase completion
  - US1 (Registration) → No dependencies after Foundational
  - US2 (Login) → No dependencies after Foundational (independent of US1)
  - US3 (Session Management) → Requires US1 or US2 for testing (needs ability to log in)
  - US5 (Protected Todos) → Requires US1 or US2 for testing (needs authentication)
  - US4 (Logout) → Requires US1 or US2 for testing (needs ability to log in)
  - US6 (Auth State Display) → Requires US1 or US2 for testing
- **Protected Routes (Phase 8)**: Depends on US3 (Session Management)
- **Error Handling (Phase 10)**: Can proceed in parallel with user stories
- **Security Validation (Phase 11)**: Depends on all P1 user stories (1, 2, 3, 5)
- **Polish (Phase 12)**: Depends on all user stories being complete

### User Story Dependencies

**P1 Stories (Critical Path)**:
- **User Story 1 (Registration)**: Can start after Foundational - No dependencies
- **User Story 2 (Login)**: Can start after Foundational - No dependencies
- **User Story 3 (Session Management)**: Can start after Foundational - Needs US1 or US2 for testing
- **User Story 5 (Protected Todos)**: Can start after Foundational - Needs US1 or US2 for testing

**P2 Stories (Enhanced UX)**:
- **User Story 4 (Logout)**: Needs US1 or US2 complete
- **User Story 6 (Auth State Display)**: Needs US1 or US2 complete

### Within Each User Story

- Frontend components can be built in parallel with backend if interfaces are defined
- Authorization tasks within US5 can be parallelized (different endpoints)
- Error handling tasks can be parallelized (different error types)

### Parallel Opportunities

**Setup Phase (Phase 1)**: Tasks T001-T006 can all run in parallel (different package installations and config checks)

**Foundational Phase (Phase 2)**:
- T011-T014 (models) can run in parallel
- T012 (User model) and T013 (Session model) and T014 (Todo update) are independent
- T017-T018 (auth dependency) can run in parallel with models

**User Story 1 (Registration)**:
- T019 (signup page) and T020 (auth client) can start in parallel

**User Story 5 (Protected Todos)**:
- T051, T053, T055, T057, T059 (different endpoints with same dependency) can run in parallel
- T061 (frontend API client update) can run in parallel with backend authorization updates

**Error Handling Phase**:
- T089, T090, T091, T092, T093, T094 can all run in parallel

**Security Validation Phase**:
- T102-T105 (security checks) can all run in parallel

**Polish Phase**:
- T114-T116 (documentation) can all run in parallel
- T118-T119 (linting) can run in parallel

---

## Parallel Example: User Story 1 (Registration)

```bash
# Launch frontend and auth client setup in parallel:
Task: "Create app/signup/page.tsx with signup form component"
Task: "Create lib/auth.ts with Better-Auth client initialization"

# These complete independently and can be integrated later
```

## Parallel Example: User Story 5 (Protected Todos)

```bash
# Launch all endpoint authorization updates in parallel:
Task: "Update GET /todos endpoint to use get_current_user dependency"
Task: "Update GET /todos/{id} endpoint to use get_current_user dependency"
Task: "Update POST /todos endpoint to use get_current_user dependency"
Task: "Update PUT /todos/{id} endpoint to use get_current_user dependency"
Task: "Update DELETE /todos/{id} endpoint to use get_current_user dependency"

# All modify different endpoints, no conflicts
```

---

## Implementation Strategy

### MVP First (P1 User Stories Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1 (Registration)
4. Complete Phase 4: User Story 2 (Login)
5. Complete Phase 5: User Story 3 (Session Management)
6. Complete Phase 6: User Story 5 (Protected Todo Access)
7. Complete Phase 8: Protected Routes
8. **STOP and VALIDATE**: Test all P1 stories independently
9. Deploy/demo if ready

**MVP Scope**: User Stories 1, 2, 3, 5 (all P1) + Protected Routes = Fully functional authenticated todo app with user isolation

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 (Registration) → Test independently → Deploy/Demo
3. Add User Story 2 (Login) → Test independently → Deploy/Demo
4. Add User Story 3 (Session Mgmt) → Test independently → Deploy/Demo
5. Add User Story 5 (Protected Todos) → Test independently → Deploy/Demo (MVP!)
6. Add User Story 4 (Logout) → Test independently → Deploy/Demo
7. Add User Story 6 (Auth Display) → Test independently → Deploy/Demo
8. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1 (Registration)
   - Developer B: User Story 2 (Login)
   - Developer C: User Story 3 (Session Management) - waits for A or B to complete for testing
   - Developer D: User Story 5 (Protected Todos) - waits for A or B to complete for testing
3. Stories complete and integrate independently

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Better-Auth handles password hashing, session tokens, cookie security automatically
- All authorization must be enforced at backend - never trust frontend
- CORS must use specific origins (no wildcard) with credentials
- Session cookies are HTTP-only, Secure (production), SameSite=Lax
- Generic error messages prevent user enumeration
- Database queries ALWAYS filtered by user_id for authorization
