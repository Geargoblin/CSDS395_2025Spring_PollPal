from datetime import datetime
from bson import ObjectId
from models import db

# User collection reference
users = db.Users

def create_user(username, email, first_name, last_name, password, date_of_birth, phone_number):
    """
    Create a new user in the database
    """
    # Check if username or email already exists
    if users.find_one({"username": username}):
        return None, "Username already exists"
    
    if users.find_one({"email": email}):
        return None, "Email already exists"
    
    # Create user document
    user = {
        "username": username,
        "email": email,
        "first_name": first_name,
        "last_name": last_name,
        "password": password,  # Note: In production, this should be hashed
        "date_of_birth": date_of_birth,
        "phone_number": phone_number,
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    }
    
    # Insert user into database
    result = users.insert_one(user)
    
    # Get the inserted user with _id
    user_id = result.inserted_id
    created_user = users.find_one({"_id": user_id})
    
    # Convert ObjectId to string for JSON serialization
    created_user["_id"] = str(created_user["_id"])
    
    return created_user, None

def get_user_by_id(user_id):
    """
    Get a user by their ID
    """
    try:
        user = users.find_one({"_id": ObjectId(user_id)})
        if user:
            user["_id"] = str(user["_id"])
        return user
    except:
        return None

def get_user_by_username(username):
    """
    Get a user by their username
    """
    user = users.find_one({"username": username})
    if user:
        user["_id"] = str(user["_id"])
    return user

def get_user_by_email(email):
    """
    Get a user by their email
    """
    user = users.find_one({"email": email})
    if user:
        user["_id"] = str(user["_id"])
    return user 