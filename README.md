# TASKIFY - Todo Application with Better-Auth Integration

A full-stack todo application featuring Next.js 14+, FastAPI, and Better-Auth for secure authentication.

## Features

- User registration and login with email/password
- Secure session management with HTTP-only cookies
- Personal todo lists with user isolation
- Responsive UI with Next.js App Router
- Protected routes and authorization
- Comprehensive error handling and validation

## Tech Stack

- **Frontend**: Next.js 14+, React 18+, TypeScript 5+
- **Backend**: FastAPI 0.104+, Python 3.11+
- **Authentication**: Better-Auth 1.1+
- **Database**: Neon PostgreSQL
- **Styling**: Tailwind CSS

## Getting Started

### Prerequisites

- Node.js 18+
- Python 3.11+
- PostgreSQL (or Neon PostgreSQL account)

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd hackathon-prac/Hackathon-II/phase-II
   ```

2. Install frontend dependencies:
   ```bash
   npm install
   ```

3. Install backend dependencies:
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

### Environment Variables

Create `.env.local` in the root directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_BETTER_AUTH_URL=http://localhost:3000
BETTER_AUTH_URL=http://localhost:3000
BETTER_AUTH_SECRET=your-super-secret-jwt-token-with-at-least-32-characters-long
DATABASE_URL=your-neon-postgres-connection-string
```

Create `.env` in the backend directory:

```env
DATABASE_URL=your-neon-postgres-connection-string
FRONTEND_URL=http://localhost:3000
PORT=8000
```

### Better-Auth Setup

This project uses Better-Auth for authentication:

1. **Configuration**: See `lib/auth.ts` (client) and `lib/auth-server.ts` (server)
2. **Session Management**: Automatic handling of HTTP-only cookies
3. **Protected Routes**: Use `components/auth/ProtectedRoute.tsx` for route protection
4. **Auth Context**: Use `useAuth()` hook for authentication state

### Running the Application

1. Start the backend server:
   ```bash
   cd backend
   python main.py
   ```

2. In a new terminal, start the frontend:
   ```bash
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## API Endpoints

- `POST /api/auth/[...all]` - Better-Auth API routes
- `GET /api/v1/todos` - Get user's todos
- `POST /api/v1/todos` - Create new todo
- `GET /api/v1/todos/{id}` - Get specific todo
- `PATCH /api/v1/todos/{id}` - Update todo
- `DELETE /api/v1/todos/{id}` - Delete todo

## Authentication Flow

1. User registers/login via Better-Auth forms
2. Session cookie is set (HTTP-only, Secure, SameSite=Lax)
3. All API requests include credentials automatically
4. Backend validates session and authorizes access
5. Users can only access their own data

## Security Features

- HTTP-only session cookies
- CSRF protection via SameSite=Lax
- Secure cookies in production (HTTPS)
- User data isolation
- Input validation and sanitization
- Generic error messages to prevent enumeration

## Learn More

To learn more about the technologies used:

- [Next.js Documentation](https://nextjs.org/docs) - Next.js features and API
- [FastAPI Documentation](https://fastapi.tiangolo.com/) - FastAPI framework
- [Better-Auth Documentation](https://better-auth.com/docs) - Authentication solution
- [Neon Documentation](https://neon.tech/docs) - PostgreSQL hosting

## Deployment

Deploy the frontend on Vercel and backend on Render or similar platforms.
Remember to update environment variables with production URLs and secrets.
