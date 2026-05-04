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