# Agent Context for Frontend-Backend Integration

This file provides additional context for the agent regarding frontend-backend integration capabilities in the TASKIFY todo app.

## New Capabilities/Technologies

### Frontend-Backend Integration with Authentication UI

**Feature**: 006-frontend-backend-integration
**Status**: Planning Complete
**Tech Stack**: Next.js 14+, React 18+, TypeScript 5+, FastAPI 0.104+, Better-Auth 1.1+, Python 3.11+

#### Authentication UI Components

1. **Login Page (`app/login/page.tsx`)**
   - Email/password form with validation
   - Loading state indicators
   - Error messaging
   - Redirect to dashboard on success
   - Link to signup page

2. **Signup Page (`app/signup/page.tsx`)**
   - Registration form with validation
   - Password confirmation
   - Loading state indicators
   - Error messaging
   - Redirect options after success

3. **Auth Provider (`components/auth/AuthProvider.tsx`)**
   - Context provider for auth state
   - Centralized authentication logic
   - Session management
   - Loading/error states

#### Protected Routing

1. **Protected Route Component (`components/auth/ProtectedRoute.tsx`)**
   - Wrapper for authenticated-only pages
   - Redirects unauthenticated users to login
   - Session validation
   - Loading state during auth check

2. **Route Guarding Pattern**
   - Higher-order component approach
   - Context-based auth state checking
   - Automatic redirects
   - Session expiration handling

#### API Client Integration

1. **Centralized API Client (`lib/api/client.ts`)**
   - Base configuration for all API calls
   - Auth header injection
   - Error handling and normalization
   - Request/response interceptors

2. **Auth API Module (`lib/api/auth.ts`)**
   - Login, signup, logout functions
   - Session token management
   - Error handling for auth operations

3. **Todo API Module (`lib/api/todos.ts`)**
   - CRUD operations for todos
   - Response type safety
   - Error handling for todo operations

#### State Management

1. **Auth Context (`context/AuthContext.tsx`)**
   - Global authentication state
   - User information storage
   - Authentication methods (login, logout, etc.)
   - Loading and error states

2. **Todo State Management**
   - TanStack Query for server state
   - Caching and background updates
   - Optimistic updates
   - Error handling and retries

#### Component Reuse Strategy

- **UI Components**: Button, Input, Card, Alert from `components/ui/`
- **Form Components**: ControlledInput, FormError from `components/forms/`
- **Loading Components**: LoadingSpinner from `components/loading/`
- **Auth Components**: AuthProvider, ProtectedRoute from `components/auth/`

#### Data Types & Contracts

- **Type Definitions**: Defined in `lib/types/` with auth.ts and todos.ts
- **API Contracts**: Defined in `contracts/` with auth-contract.ts and todo-contract.ts
- **Response Interfaces**: Standardized across frontend and backend
- **Error Types**: Consistent error handling across the application

#### Integration Patterns

1. **Next.js App Router Integration**
   - Client components for dynamic UI
   - Server components for static content
   - Layout and loading boundaries
   - Route protection patterns

2. **Better-Auth Integration**
   - Session management following official docs
   - Secure token handling
   - Middleware integration
   - API route protection

3. **TanStack Query Integration**
   - Server state management
   - Caching and background updates
   - Optimistic updates for better UX
   - Error handling and retries

#### Security Considerations

- **Session Management**: Following Better-Auth best practices
- **Token Storage**: Secure storage according to official docs
- **CORS Configuration**: Proper backend configuration
- **Input Validation**: Client and server-side validation
- **Error Handling**: No sensitive information exposure

#### Error Handling & UX

1. **Form Validation**
   - Client-side validation with immediate feedback
   - Controlled components for predictability
   - Error message display
   - Submission prevention for invalid forms

2. **API Error Handling**
   - Centralized error normalization
   - User-friendly error messages
   - Retry mechanisms where appropriate
   - Loading and error state management

3. **Loading State Management**
   - Component-level loading indicators
   - Skeleton UI patterns
   - Submission disable during processing
   - Smooth transitions

#### Performance Considerations

- **Code Splitting**: Automatic with Next.js App Router
- **Caching**: TanStack Query caching strategies
- **Bundle Optimization**: Tree-shaking and dynamic imports
- **API Efficiency**: Optimistic updates and background refetching
- **Component Optimization**: Memoization where appropriate

#### TypeScript Contracts

- **Interfaces**: AuthState, TodoApiResponse, etc. in data-model.md
- **Type Safety**: Full type checking across API boundaries
- **Contract Validation**: Compile-time checking of API contracts
- **Documentation**: JSDoc comments for all exported functions

#### Documentation References

All patterns derived from Context7 MCP documentation:
- Next.js App Router: File-system routing, layouts, client components
- React: Context API, hooks, composition patterns
- Better-Auth: Integration with Next.js App Router, session management
- TanStack Query: Server state management, caching, optimistic updates
- TypeScript: Type safety, interfaces, generics
- MDN: Fetch API, security best practices

#### Implementation Status

- ✅ Planning Complete (plan.md, research.md, data-model.md, contracts/, quickstart.md)
- ⏳ Tasks Generation Pending (/sp.tasks command)
- ⏳ Implementation Pending (will follow tasks.md in priority order P1→P2→P3→P4)

#### Related Features

- **Depends On**: 005-backend-api-integration (FastAPI backend, Better-Auth)
- **Extends**: Builds upon existing frontend structure with authentication
- **Integration**: Seamless - adds auth layer to existing todo functionality