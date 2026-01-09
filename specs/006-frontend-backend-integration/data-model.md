# Data Model: Frontend-Backend Integration

## Auth State Interface

### AuthState
Represents the authentication state and operations available to the frontend

```typescript
interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  signup: (userData: SignupData) => Promise<void>;
  logout: () => Promise<void>;
  checkAuthStatus: () => Promise<boolean>;
}
```

### LoginCredentials
Credentials required for user authentication

```typescript
interface LoginCredentials {
  email: string;
  password: string;
}
```

### SignupData
Data required for user registration

```typescript
interface SignupData {
  email: string;
  password: string;
  confirmPassword: string;
  name?: string;
}
```

### User
Represents an authenticated user

```typescript
interface User {
  id: string;
  email: string;
  name?: string;
  createdAt: string;
  updatedAt: string;
}
```

## Todo API Response Interface

### TodoApiResponse
Response structure for Todo API operations

```typescript
interface TodoApiResponse {
  id: number;
  title: string;
  description?: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
}
```

### TodoRequest
Request payload for Todo operations

```typescript
interface TodoRequest {
  title: string;
  description?: string;
  priority?: 'low' | 'medium' | 'high';
  dueDate?: string;
  completed?: boolean;
}
```

### TodoListResponse
Response for fetching multiple todos

```typescript
interface TodoListResponse {
  todos: TodoApiResponse[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
}
```

## Error Response Interface

### ApiErrorResponse
Standardized error response format

```typescript
interface ApiErrorResponse {
  error: {
    code: string;
    message: string;
    details?: Record<string, any>;
  };
}
```

## Loading State Interface

### LoadingState
Loading state representation for UI components

```typescript
interface LoadingState {
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  error?: string;
}
```

## Form State Interface

### FormState
State management for form components

```typescript
interface FormState<T> {
  values: T;
  errors: Partial<Record<keyof T, string>>;
  isValid: boolean;
  isSubmitting: boolean;
}
```

## API Client Configuration

### ApiClientConfig
Configuration options for the API client

```typescript
interface ApiClientConfig {
  baseUrl: string;
  timeout?: number;
  headers?: Record<string, string>;
  interceptors?: {
    request?: (config: any) => any;
    response?: (response: any) => any;
  };
}
```

## Session Management

### SessionData
Structure for session data management

```typescript
interface SessionData {
  token: string;
  refreshToken?: string;
  expiresAt: number;
  user: User;
}
```