from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy import create_engine, Column, Integer, String, Text, DateTime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from datetime import datetime
import re

# Database setup
DATABASE_URL = "sqlite:///./intellibug.db"
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
Base = declarative_base()
SessionLocal = sessionmaker(bind=engine)

# Database Models
class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    email = Column(String, unique=True)
    password = Column(String)

class BugReport(Base):
    __tablename__ = "bug_reports"
    id = Column(Integer, primary_key=True, index=True)
    user_email = Column(String)
    code = Column(Text)
    bugs_found = Column(Integer)
    issues = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic models
class RegisterData(BaseModel):
    name: str
    email: str
    password: str

class LoginData(BaseModel):
    email: str
    password: str

class CodeData(BaseModel):
    code: str
    user_email: str = "guest"

# Routes
@app.get("/")
def read_root():
    return {"message": "IntelliBug Backend is Running!"}

@app.post("/register")
def register(data: RegisterData):
    db = SessionLocal()
    existing = db.query(User).filter(User.email == data.email).first()
    if existing:
        db.close()
        return {"success": False, "message": "Email already exists!"}
    user = User(name=data.name, email=data.email, password=data.password)
    db.add(user)
    db.commit()
    db.close()
    return {"success": True, "message": "Account created successfully!"}

@app.post("/login")
def login(data: LoginData):
    db = SessionLocal()
    user = db.query(User).filter(
        User.email == data.email,
        User.password == data.password
    ).first()
    db.close()
    if user:
        return {"success": True, "message": f"Welcome back, {user.name}!", "name": user.name, "email": user.email}
    return {"success": False, "message": "Invalid email or password!"}

@app.post("/detect-bugs")
def detect_bugs(data: CodeData):
    code = data.code
    issues = []

    if "print " in code and "print(" not in code:
        issues.append("Python 2 style print statement found — use print() instead")
    if "except:" in code:
        issues.append("Bare except: found — always specify exception type")
    if "eval(" in code:
        issues.append("eval() is dangerous — avoid using it")
    if "import *" in code:
        issues.append("Wildcard import (import *) found — import only what you need")
    if "while True" in code and "break" not in code:
        issues.append("Infinite loop detected — while True without break")

    # Save to database
    db = SessionLocal()
    report = BugReport(
        user_email=data.user_email,
        code=code,
        bugs_found=len(issues),
        issues=str(issues)
    )
    db.add(report)
    db.commit()
    db.close()

    if issues:
        return {"bugs_found": True, "issues": issues, "suggestion": "Fix the above issues to improve your code quality!"}
    return {"bugs_found": False, "issues": [], "suggestion": "Great code! No common bugs detected."}

@app.get("/history/{user_email}")
def get_history(user_email: str):
    db = SessionLocal()
    reports = db.query(BugReport).filter(BugReport.user_email == user_email).all()
    db.close()
    return {"history": [
        {
            "id": r.id,
            "bugs_found": r.bugs_found,
            "issues": r.issues,
            "created_at": str(r.created_at)
        } for r in reports
    ]}