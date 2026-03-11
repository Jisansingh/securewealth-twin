from fastapi import APIRouter
from models.user_model import User

router = APIRouter()

# temporary in-memory storage
users = []

@router.post("/create-user")
def create_user(user: User):
    users.append(user)
    return {
        "message": "User created successfully",
        "user": user
    }

@router.get("/users")
def get_users():
    return users