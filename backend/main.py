from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import json
import os

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Simple file-based database for now
USERS_FILE = "users.json"

def load_users():
    if not os.path.exists(USERS_FILE):
        return []
    with open(USERS_FILE, "r") as f:
        return json.load(f)

def save_users(users):
    with open(USERS_FILE, "w") as f:
        json.dump(users, f)

class RegisterData(BaseModel):
    name: str
    email: str
    password: str

class LoginData(BaseModel):
    email: str
    password: str

@app.get("/")
def read_root():
    return {"message": "IntelliBug Backend is Running!"}

@app.post("/register")
def register(data: RegisterData):
    users = load_users()
    for user in users:
        if user["email"] == data.email:
            return {"success": False, "message": "Email already exists!"}
    users.append({"name": data.name, "email": data.email, "password": data.password})
    save_users(users)
    return {"success": True, "message": "Account created successfully!"}

@app.post("/login")
def login(data: LoginData):
    users = load_users()
    for user in users:
        if user["email"] == data.email and user["password"] == data.password:
            return {"success": True, "message": f"Welcome back, {user['name']}!"}
    return {"success": False, "message": "Invalid email or password!"}

import re

class CodeData(BaseModel):
    code: str

@app.post("/detect-bugs")
def detect_bugs(data: CodeData):
    code = data.code
    issues = []

    # Check for common bugs
    if "print " in code and "print(" not in code:
        issues.append("Python 2 style print statement found — use print() instead")

    if "==" in code and "if" not in code and "while" not in code:
        issues.append("Possible accidental == used outside condition")

    if "except:" in code:
        issues.append("Bare except: found — always specify exception type e.g. except Exception")

    if "eval(" in code:
        issues.append("eval() is dangerous — avoid using it")

    if "import *" in code:
        issues.append("Wildcard import (import *) found — import only what you need")

    if re.search(r'=\s*None\s*\n.*\.', code):
        issues.append("Possible NoneType error — variable set to None then used")

    if "while True" in code and "break" not in code:
        issues.append("Infinite loop detected — while True without break")

    if len(issues) > 0:
        return {
            "bugs_found": True,
            "issues": issues,
            "suggestion": "Fix the above issues to improve your code quality!"
        }
    else:
        return {
            "bugs_found": False,
            "issues": [],
            "suggestion": "Great code! No common bugs detected."
        }