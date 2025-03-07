from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
from pymongo.errors import DuplicateKeyError

# MongoDB Atlas Connection URI
uri = "mongodb+srv://steyen:DMTJ60@cluster395capstone.uvddx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster395Capstone"

# Create a new client and connect to the server
client = MongoClient(uri, server_api=ServerApi('1'))
db = client["PollPal"]

# Define collections
users = db["Users"]
places = db["Places"]
reviews = db["Reviews"]
votes = db["Votes"]

# Ensure unique indexes to prevent duplicates
users.create_index("email", unique=True)
places.create_index("name", unique=True)
reviews.create_index([("user_id", 1), ("place_id", 1)], unique=TRUE)

# Function to insert a user (prevents duplicates)
def insert_user(user_id, username, email, password, location, preferences):
    if users.find_one({"email": email}):
        print(f"User with email {email} already exists.")
        return

    user_data = {
        "user_id": user_id,
        "username": username,
        "email": email,
        "password": password,  
        "location": location,
        "preferences": preferences,
        "liked_places": [],
        "disliked_places": []
    }
    users.insert_one(user_data)
    print(f"User {username} added successfully!")

# Function to insert a place (prevents duplicates)
def insert_place(place_id, category, name, description, location):
    if places.find_one({"name": name}):
        print(f"Place '{name}' already exists.")
        return

    place_data = {
        "place_id": place_id,
        "category": category,
        "name": name,
        "description": description,
        "location": location,
        "likes": 0,
        "dislikes": 0
    }
    places.insert_one(place_data)
    print(f"Place '{name}' added successfully!")

# Function to update user password (plaintext)
def update_password(email, new_password):
    result = users.update_one({"email": email}, {"$set": {"password": new_password}})
    
    if result.modified_count > 0:
        print("Password updated successfully!")
    else:
        print("User not found or password unchanged.")

# Function to update likes and dislikes (tracks user interactions)
def update_likes_dislikes(user_email, place_name, action):
    user = users.find_one({"email": user_email})
    place = places.find_one({"name": place_name})

    if not user or not place:
        print("User or Place not found.")
        return

    user_id = user["user_id"]
    place_id = place["place_id"]

    # Check if user already liked/disliked the place
    if action == "like":
        if place_id in user["liked_places"]:
            print("User already liked this place.")
            return
        # Remove from disliked_places if switching preference
        users.update_one({"email": user_email}, {"$pull": {"disliked_places": place_id}})
        users.update_one({"email": user_email}, {"$addToSet": {"liked_places": place_id}})
        places.update_one({"name": place_name}, {"$inc": {"likes": 1}})
        print(f"{user_email} liked {place_name}.")
    
    elif action == "dislike":
        if place_id in user["disliked_places"]:
            print("User already disliked this place.")
            return
        # Remove from liked_places if switching preference
        users.update_one({"email": user_email}, {"$pull": {"liked_places": place_id}})
        users.update_one({"email": user_email}, {"$addToSet": {"disliked_places": place_id}})
        places.update_one({"name": place_name}, {"$inc": {"dislikes": 1}})
        print(f"{user_email} disliked {place_name}.")
    
    else:
        print("Invalid action. Use 'like' or 'dislike'.")

# Function to insert a review
def insert_review(user_email, place_name, rating, comment):
    user = users.find_one({"email": user_email})
    place = places.find_one({"name": place_name})
    
    if not user or not place:
        print("User or Place not found.")
        return
    
    user_id = user["user_id"]
    place_id = place["place_id"]
    
    # Check if the user already reviewed this place
    if reviews.find_one({"user_id": user_id, "place_id": place_id}):
        print("User has already reviewed this place.")
        return
    
    review_data = {
        "user_id": user_id,
        "place_id": place_id,
        "rating": rating,
        "comment": comment
    }
    
    reviews.insert_one(review_data)
    print(f"Review added successfully by {user_email} for {place_name}!")

# Sample Insertions
insert_user("u1", "foodie123", "foodie@example.com", "securepass123", {"city": "Cleveland", "state": "OH"}, ["food", "bars"])
insert_place("p1", "restaurant", "Joe's Pizza", "A great spot for pizza lovers.", {"lat": 41.4993, "lng": -81.6944}, "u1")

# Sample Updates
update_password("foodie@example.com", "newsecurepassword456")
update_likes_dislikes("foodie@example.com", "Joe's Pizza", "like")
update_likes_dislikes("foodie@example.com", "Joe's Pizza", "dislike")

# Sample Review Insertion
insert_review("foodie@example.com", "Joe's Pizza", 5, "Best pizza in town!")