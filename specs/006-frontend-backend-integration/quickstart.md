# Quickstart Guide: Frontend-Backend Integration

## Development Setup

### Prerequisites
- Node.js 18+ with npm
- Python 3.11+ with pip
- Git

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables in `.env.local`:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:8000
   NEXTAUTH_SECRET=your-secret-key
   NEXTAUTH_URL=http://localhost:3000
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

   The frontend will be available at http://localhost:3000

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Set up environment variables in `.env`:
   ```env
   DATABASE_URL=postgresql://user:password@localhost/dbname
   SECRET_KEY=your-secret-key
   ```

5. Start the backend server:
   ```bash
   uvicorn main:app --reload
   ```

   The backend will be available at http://localhost:8000

## Available Scripts

### Frontend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run linter
- `npm run test` - Run tests

### Backend
- `uvicorn main:app --reload` - Start development server
- `pytest` - Run tests
- `alembic upgrade head` - Run database migrations

## Key Integrations

### Authentication Flow
1. User navigates to `/login` or `/signup`
2. Form data is validated on the client-side
3. Credentials are sent to backend auth endpoints
4. Backend returns session token
5. Frontend stores session and redirects to protected area

### Todo Operations
1. Authenticated user performs Todo operations
2. Frontend API client adds auth headers to requests
3. Backend validates session and processes request
4. Response is returned to frontend
5. UI updates based on response

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/signup` - User registration
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user

### Todo Management
- `GET /api/todos` - Get user's todos
- `POST /api/todos` - Create new todo
- `GET /api/todos/{id}` - Get specific todo
- `PUT /api/todos/{id}` - Update todo
- `DELETE /api/todos/{id}` - Delete todo

## Common Tasks

### Adding a New Page
1. Create new directory in `app/` with `page.tsx`
2. Implement component with proper authentication checks
3. Add to navigation if needed

### Creating a New API Route
1. Create new route file in `app/api/`
2. Implement API handler with proper auth validation
3. Update API client in `lib/api/`

### Adding a New Component
1. Create component in `components/`
2. Export from index file if needed globally
3. Use in pages with proper props

## Testing

### Frontend Testing
Run all frontend tests:
```bash
npm run test
```

Test specific file:
```bash
npm run test -- path/to/test/file.test.tsx
```

### Backend Testing
Run all backend tests:
```bash
pytest
```

Run tests with coverage:
```bash
pytest --cov=.
```

## Troubleshooting

### Common Issues
- **CORS errors**: Ensure backend and frontend URLs are properly configured
- **Auth failures**: Check that session handling is configured correctly
- **API timeouts**: Verify backend server is running and accessible

### Debugging Tips
- Check browser console for frontend errors
- Check backend logs for server-side errors
- Verify environment variables are set correctly
- Ensure both servers are running during development