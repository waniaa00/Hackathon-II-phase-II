"""
FastAPI Backend for Todo Application
Provides REST API endpoints for authentication and todo management
"""

from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlmodel import Session, SQLModel, create_engine, select
from datetime import datetime, timedelta
from typing import Optional, List
import os
from passlib.context import CryptContext
import jwt

# Models
from pydantic import BaseModel, EmailStr

# Environment variables
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./test.db")
SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key-change-in-production")
ALGORITHM = os.getenv("ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "30"))

# Database setup
engine = create_engine(DATABASE_URL, echo=True)

def create_db_and_tables():
    SQLModel.metadata.create_all(engine)

def get_session():
    with Session(engine) as session:
        yield session

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login")

# FastAPI app
app = FastAPI(
    title="Todo API",
    version="1.0.0",
    description="Backend API for Todo Application"
)

# CORS configuration
origins = [
    "http://localhost:3000",
    "http://localhost:3001",
    "https://*.vercel.app",
    # Add your production frontend URL here
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Database Models (using SQLModel)
from sqlmodel import Field, Relationship

class User(SQLModel, table=True):
    __tablename__ = "users"

    id: Optional[int] = Field(default=None, primary_key=True)
    email: str = Field(unique=True, index=True)
    hashed_password: str
    created_at: datetime = Field(default_factory=datetime.utcnow)

    todos: List["Todo"] = Relationship(back_populates="owner")

class Todo(SQLModel, table=True):
    __tablename__ = "todos"

    id: Optional[int] = Field(default=None, primary_key=True)
    title: str
    description: Optional[str] = None
    completed: bool = Field(default=False)
    priority: str = Field(default="medium")  # low, medium, high
    due_date: Optional[str] = None
    tags: str = Field(default="[]")  # JSON string array
    recurrence: Optional[str] = None  # JSON string for recurrence pattern
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    user_id: int = Field(foreign_key="users.id")
    owner: User = Relationship(back_populates="todos")

# Pydantic schemas
class UserRegister(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: int
    email: str
    created_at: datetime

class Token(BaseModel):
    access_token: str
    token_type: str

class TodoCreate(BaseModel):
    title: str
    description: Optional[str] = None
    completed: bool = False
    priority: str = "medium"
    due_date: Optional[str] = None
    tags: List[str] = []
    recurrence: Optional[dict] = None

class TodoUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    completed: Optional[bool] = None
    priority: Optional[str] = None
    due_date: Optional[str] = None
    tags: Optional[List[str]] = None
    recurrence: Optional[dict] = None

class TodoResponse(BaseModel):
    id: int
    title: str
    description: Optional[str]
    completed: bool
    priority: str
    dueDate: Optional[str]
    tags: List[str]
    recurrence: Optional[dict]
    createdAt: datetime
    updatedAt: datetime

# Utility functions
def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)

def create_access_token(data: dict) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

async def get_current_user(
    token: str = Depends(oauth2_scheme),
    session: Session = Depends(get_session)
) -> User:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: int = payload.get("sub")
        if user_id is None:
            raise credentials_exception
    except jwt.PyJWTError:
        raise credentials_exception

    user = session.get(User, user_id)
    if user is None:
        raise credentials_exception

    return user

# Helper to convert tags
import json

def tags_to_list(tags_str: str) -> List[str]:
    try:
        return json.loads(tags_str)
    except:
        return []

def list_to_tags(tags_list: List[str]) -> str:
    return json.dumps(tags_list)

def recurrence_to_dict(recurrence_str: Optional[str]) -> Optional[dict]:
    if not recurrence_str:
        return None
    try:
        return json.loads(recurrence_str)
    except:
        return None

def dict_to_recurrence(recurrence_dict: Optional[dict]) -> Optional[str]:
    if not recurrence_dict:
        return None
    return json.dumps(recurrence_dict)

# API Routes
@app.on_event("startup")
def on_startup():
    create_db_and_tables()

@app.get("/health")
def health_check():
    return {"status": "ok"}

@app.get("/")
def root():
    return {"message": "Todo API is running", "docs": "/docs"}

# Auth endpoints
@app.post("/api/v1/auth/register", response_model=Token)
def register(user_data: UserRegister, session: Session = Depends(get_session)):
    # Check if user exists
    statement = select(User).where(User.email == user_data.email)
    existing_user = session.exec(statement).first()

    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )

    # Create new user
    hashed_password = get_password_hash(user_data.password)
    new_user = User(email=user_data.email, hashed_password=hashed_password)
    session.add(new_user)
    session.commit()
    session.refresh(new_user)

    # Create access token
    access_token = create_access_token(data={"sub": new_user.id})

    return {"access_token": access_token, "token_type": "bearer"}

@app.post("/api/v1/auth/login", response_model=Token)
def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    session: Session = Depends(get_session)
):
    # Get user by email (username field contains email)
    statement = select(User).where(User.email == form_data.username)
    user = session.exec(statement).first()

    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Create access token
    access_token = create_access_token(data={"sub": user.id})

    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/api/v1/auth/me", response_model=UserResponse)
def get_current_user_info(current_user: User = Depends(get_current_user)):
    return current_user

# Todo endpoints
@app.get("/api/v1/todos", response_model=List[TodoResponse])
def get_todos(
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    statement = select(Todo).where(Todo.user_id == current_user.id)
    todos = session.exec(statement).all()

    # Convert to response format
    response_todos = []
    for todo in todos:
        response_todos.append(TodoResponse(
            id=todo.id,
            title=todo.title,
            description=todo.description,
            completed=todo.completed,
            priority=todo.priority,
            dueDate=todo.due_date,
            tags=tags_to_list(todo.tags),
            recurrence=recurrence_to_dict(todo.recurrence),
            createdAt=todo.created_at,
            updatedAt=todo.updated_at
        ))

    return response_todos

@app.post("/api/v1/todos", response_model=TodoResponse)
def create_todo(
    todo_data: TodoCreate,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    # Create new todo
    new_todo = Todo(
        title=todo_data.title,
        description=todo_data.description,
        completed=todo_data.completed,
        priority=todo_data.priority,
        due_date=todo_data.due_date,
        tags=list_to_tags(todo_data.tags),
        recurrence=dict_to_recurrence(todo_data.recurrence),
        user_id=current_user.id
    )

    session.add(new_todo)
    session.commit()
    session.refresh(new_todo)

    return TodoResponse(
        id=new_todo.id,
        title=new_todo.title,
        description=new_todo.description,
        completed=new_todo.completed,
        priority=new_todo.priority,
        dueDate=new_todo.due_date,
        tags=tags_to_list(new_todo.tags),
        recurrence=recurrence_to_dict(new_todo.recurrence),
        createdAt=new_todo.created_at,
        updatedAt=new_todo.updated_at
    )

@app.put("/api/v1/todos/{todo_id}", response_model=TodoResponse)
def update_todo(
    todo_id: int,
    todo_data: TodoUpdate,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    # Get todo
    todo = session.get(Todo, todo_id)

    if not todo or todo.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Todo not found"
        )

    # Update fields
    if todo_data.title is not None:
        todo.title = todo_data.title
    if todo_data.description is not None:
        todo.description = todo_data.description
    if todo_data.completed is not None:
        todo.completed = todo_data.completed
    if todo_data.priority is not None:
        todo.priority = todo_data.priority
    if todo_data.due_date is not None:
        todo.due_date = todo_data.due_date
    if todo_data.tags is not None:
        todo.tags = list_to_tags(todo_data.tags)
    if todo_data.recurrence is not None:
        todo.recurrence = dict_to_recurrence(todo_data.recurrence)

    todo.updated_at = datetime.utcnow()

    session.add(todo)
    session.commit()
    session.refresh(todo)

    return TodoResponse(
        id=todo.id,
        title=todo.title,
        description=todo.description,
        completed=todo.completed,
        priority=todo.priority,
        dueDate=todo.due_date,
        tags=tags_to_list(todo.tags),
        recurrence=recurrence_to_dict(todo.recurrence),
        createdAt=todo.created_at,
        updatedAt=todo.updated_at
    )

@app.delete("/api/v1/todos/{todo_id}")
def delete_todo(
    todo_id: int,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    # Get todo
    todo = session.get(Todo, todo_id)

    if not todo or todo.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Todo not found"
        )

    session.delete(todo)
    session.commit()

    return {"message": "Todo deleted successfully"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
