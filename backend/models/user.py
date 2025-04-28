from datetime import datetime
from bson import ObjectId
from models import db

# User collection reference
users = db.Users

def create_user(username, email, password, date_of_birth, phone_number, preferences=None, location=None):
    """
    Create a new user in the database
    
    Parameters:
    - username: unique username for the user
    - email: unique email for the user
    - password: user's password (should be hashed in production)
    - date_of_birth: user's date of birth
    - phone_number: user's phone number
    - preferences: list of category preferences (optional)
    - location: user's location coordinates or address (optional)
    
    Returns:
    - tuple: (created_user, error_message)
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
        "password": password,  # This should be hashed but its fine for now
        "date_of_birth": date_of_birth,
        "phone_number": phone_number,
        "preferences": preferences or [],  
        "liked_places": [],  
        "disliked_places": [],  
        "location": location,  
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

def add_liked_place(user_id, place_id):
    """
    Add a place to user's liked places list
    """
    try:
        # Remove from disliked places if it exists there
        users.update_one(
            {"_id": ObjectId(user_id)},
            {
                "$pull": {"disliked_places": place_id}
            }
        )
        
        # Add to liked places
        result = users.update_one(
            {"_id": ObjectId(user_id)},
            {
                "$addToSet": {"liked_places": place_id},
                "$set": {"updated_at": datetime.utcnow()}
            }
        )
        return result.modified_count > 0
    except:
        return False

def add_disliked_place(user_id, place_id):
    """
    Add a place to user's disliked places list
    """
    try:
        # Remove from liked places if it exists there
        users.update_one(
            {"_id": ObjectId(user_id)},
            {
                "$pull": {"liked_places": place_id}
            }
        )
        
        # Add to disliked places
        result = users.update_one(
            {"_id": ObjectId(user_id)},
            {
                "$addToSet": {"disliked_places": place_id},
                "$set": {"updated_at": datetime.utcnow()}
            }
        )
        return result.modified_count > 0
    except:
        return False

def remove_place_from_lists(user_id, place_id):
    """
    Remove a place from both liked and disliked lists
    """
    try:
        result = users.update_one(
            {"_id": ObjectId(user_id)},
            {
                "$pull": {
                    "liked_places": place_id,
                    "disliked_places": place_id
                },
                "$set": {"updated_at": datetime.utcnow()}
            }
        )
        return result.modified_count > 0
    except:
        return False

def get_user_liked_places(liked_place_ids):
    """
    Get detailed information for liked places based on their IDs
    
    Parameters:
    - liked_place_ids: List of place IDs that the user has liked
    
    Returns:
    - list: List of place objects with complete details
    """
    if not liked_place_ids:
        return []
        
    try:
        # Convert string IDs back to ObjectId for MongoDB query
        liked_place_object_ids = [ObjectId(id_str) for id_str in liked_place_ids]

        # Query the places from All_Places instead of Places
        liked_places = list(db.All_Places.find({"_id": {"$in": liked_place_object_ids}}))
    
        # Convert ObjectIds to strings for serialization
        for place in liked_places:
            place["_id"] = str(place["_id"])
            
        return liked_places
    except Exception as e:
        # Log error here if needed
        return []

def get_user_details(user_id):
    """
    Get user with full details including liked places
    """
    try:
        # Get user data
        user = get_user_by_id(user_id)
        
        if not user:
            return None, "User not found"
        
        # Get liked places IDs
        liked_place_ids = user.get('liked_places', [])
        
        # Get detailed information for liked places
        liked_places = get_user_liked_places(liked_place_ids)
        
        # Replace the liked_places IDs with the actual place details
        user['liked_places'] = liked_places
        
        return user, None
        
    except Exception as e:
        return None, f"Error retrieving user data: {str(e)}"

def update_user(user_id, update_data):
    """
    Update multiple user fields at once
    
    Parameters:
    - user_id: ID of the user to update
    - update_data: Dictionary containing fields to update (username, email, password, 
                   date_of_birth, phone_number, preferences, location)
    
    Returns:
    - tuple: (success, error_message)
    """
    try:
        # Create update document with only non-None fields
        update_doc = {}
        
        # Check username uniqueness if updating username
        if "username" in update_data and update_data["username"]:
            existing_user = users.find_one({"username": update_data["username"]})
            if existing_user and str(existing_user["_id"]) != user_id:
                return False, "Username already exists"
            update_doc["username"] = update_data["username"]
            
        # Check email uniqueness if updating email
        if "email" in update_data and update_data["email"]:
            existing_user = users.find_one({"email": update_data["email"]})
            if existing_user and str(existing_user["_id"]) != user_id:
                return False, "Email already exists"
            update_doc["email"] = update_data["email"]
            
        # Add other fields if they exist in the update data
        for field in ["password", "date_of_birth", "phone_number", "preferences", "location"]:
            if field in update_data and update_data[field] is not None:
                update_doc[field] = update_data[field]
        
        # Only proceed if there are fields to update
        if not update_doc:
            return False, "No valid fields to update"
            
        # Add updated timestamp
        update_doc["updated_at"] = datetime.utcnow()
        
        # Update the user
        result = users.update_one(
            {"_id": ObjectId(user_id)},
            {"$set": update_doc}
        )
        
        if result.modified_count > 0:
            return True, None
        elif users.find_one({"_id": ObjectId(user_id)}):
            # User exists but no changes made (might be same values)
            return True, None
        else:
            return False, "User not found"
            
    except Exception as e:
        return False, str(e) 