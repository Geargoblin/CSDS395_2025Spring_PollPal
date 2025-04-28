from flask import Flask, jsonify, request, session
from flask_cors import CORS
from models import db
from models.user import (
    create_user, get_user_by_username, get_user_by_id,
    add_liked_place, add_disliked_place, remove_place_from_lists,
    get_user_details, update_user
)
from models.testMLAlgorithm import score_places_for_user
import config
from datetime import datetime
from bson import ObjectId

# Initialize Flask app
app = Flask(__name__)
app.config.from_object(config)
app.secret_key = app.config['SECRET_KEY']  # Required for sessions

# Enable CORS
CORS(app, supports_credentials=True)  # Enable credentials for session cookies

# Home page - Test route
@app.route('/')
def home():
    return jsonify({"message": "Welcome to PollPal Backend"})

# MongoDB connection test route
@app.route('/api/db-test', methods=['GET'])
def db_test():
    try:
        # List all collections in the database
        collections = db.list_collection_names()
        return jsonify({
            "status": "success",
            "message": "Connected to MongoDB!",
            "collections": collections
        })
    except Exception as e:
        return jsonify({
            "status": "error",
            "message": f"Failed to connect to MongoDB: {str(e)}"
        }), 500

# User registration endpoint
@app.route('/api/auth/register', methods=['POST'])
def register():
    try:
        data = request.get_json()
        
        # Extract user data from request
        username = data.get('username')
        email = data.get('email')
        password = data.get('password')
        date_of_birth = data.get('date_of_birth')
        phone_number = data.get('phone_number')
        preferences = data.get('preferences', [])
        location = data.get('location')
        
        # Validate required fields
        if not all([username, email, password]):
            return jsonify({
                "status": "error",
                "message": "Missing required fields"
            }), 400
        
        # Create user in database
        user, error = create_user(
            username=username,
            email=email,
            password=password,
            date_of_birth=date_of_birth,
            phone_number=phone_number,
            preferences=preferences,
            location=location
        )
        
        if error:
            return jsonify({
                "status": "error",
                "message": error
            }), 400
        
        # Set user session
        session['user_id'] = user['_id']
        
        # Return success response
        return jsonify({
            "status": "success",
            "message": "User registered successfully",
            "user": {
                "id": user['_id'],
                "username": user['username'],
                "email": user['email'],
                "preferences": user['preferences'],
                "location": user.get('location'),
                "liked_places": user.get('liked_places', []),
                "disliked_places": user.get('disliked_places', []),
                "date_of_birth": user.get('date_of_birth'),
                "phone_number": user.get('phone_number')
            }
        }), 201
        
    except Exception as e:
        return jsonify({
            "status": "error",
            "message": f"Registration failed: {str(e)}"
        }), 500

# Login endpoint
@app.route('/api/auth/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        
        # Extract login credentials
        username = data.get('username')
        password = data.get('password')
        
        # Validate required fields
        if not all([username, password]):
            return jsonify({
                "status": "error",
                "message": "Username and password are required"
            }), 400
        
        # Get user from database
        user = get_user_by_username(username)
        
        # Check if user exists and password matches
        if not user or user['password'] != password:
            return jsonify({
                "status": "error",
                "message": "Invalid username or password"
            }), 401
        
        # Set user session
        session['user_id'] = user['_id']
        
        # Return success response
        return jsonify({
            "status": "success",
            "message": "Login successful",
            "user": {
                "id": user['_id'],
                "username": user['username'],
                "email": user['email'],
                "preferences": user.get('preferences', []),
                "liked_places": user.get('liked_places', []),
                "disliked_places": user.get('disliked_places', []),
                "location": user.get('location'),
                "date_of_birth": user.get('date_of_birth'),
                "phone_number": user.get('phone_number')
            }
        })
        
    except Exception as e:
        return jsonify({
            "status": "error",
            "message": f"Login failed: {str(e)}"
        }), 500

# Logout endpoint
@app.route('/api/auth/logout', methods=['POST'])
def logout():
    # Clear the session
    session.clear()
    
    return jsonify({
        "status": "success",
        "message": "Logged out successfully"
    })

# Get current user endpoint
@app.route('/api/auth/me', methods=['GET'])
def get_current_user():
    # Check if user is logged in
    if 'user_id' not in session:
        return jsonify({
            "status": "error",
            "message": "Not authenticated"
        }), 401
    
    try:
        # Get user with detailed information
        user, error = get_user_details(session['user_id'])
        
        if error:
            # Clear invalid session if user not found
            if error == "User not found":
                session.clear()
            return jsonify({
                "status": "error",
                "message": error
            }), 401
        
        # Return user data
        return jsonify({
            "status": "success",
            "user": {
                "id": user['_id'],
                "username": user['username'],
                "email": user['email'],
                "preferences": user.get('preferences', []),
                "liked_places": user.get('liked_places', []),
                "disliked_places": user.get('disliked_places', []),
                "location": user.get('location'),
                "date_of_birth": user.get('date_of_birth'),
                "phone_number": user.get('phone_number')
            }
        })
    except Exception as e:
        return jsonify({
            "status": "error",
            "message": f"Error retrieving user data: {str(e)}"
        }), 500

# Update user information endpoint
@app.route('/api/user/update', methods=['PUT'])
def update_user_info():
    # Check if user is logged in
    if 'user_id' not in session:
        return jsonify({
            "status": "error",
            "message": "Not authenticated"
        }), 401
    
    try:
        data = request.get_json()
        
        # Extract update fields from request
        update_data = {}
        for field in ['username', 'email', 'password', 'date_of_birth', 'phone_number', 'preferences', 'location']:
            if field in data:
                update_data[field] = data.get(field)
        
        # Update user information
        success, error = update_user(session['user_id'], update_data)
        
        if not success:
            return jsonify({
                "status": "error",
                "message": error or "Failed to update user information"
            }), 400
        
        # Fetch updated user information
        user, _ = get_user_details(session['user_id'])
        
        return jsonify({
            "status": "success",
            "message": "User information updated successfully",
            "user": {
                "id": user['_id'],
                "username": user['username'],
                "email": user['email'],
                "preferences": user.get('preferences', []),
                "liked_places": user.get('liked_places', []),
                "disliked_places": user.get('disliked_places', []),
                "location": user.get('location'),
                "date_of_birth": user.get('date_of_birth'),
                "phone_number": user.get('phone_number')
            }
        })
        
    except Exception as e:
        return jsonify({
            "status": "error",
            "message": f"Error updating user information: {str(e)}"
        }), 500

# Add place to liked places endpoint
@app.route('/api/user/places/like/<place_id>', methods=['POST'])
def like_place(place_id):
    # Check if user is logged in
    if 'user_id' not in session:
        return jsonify({
            "status": "error",
            "message": "Not authenticated"
        }), 401
    
    try:
        # Add place to liked places
        success = add_liked_place(session['user_id'], place_id)
        
        if not success:
            return jsonify({
                "status": "error",
                "message": "Failed to like place"
            }), 400
        
        return jsonify({
            "status": "success",
            "message": "Place added to liked places"
        })
        
    except Exception as e:
        return jsonify({
            "status": "error",
            "message": f"Error liking place: {str(e)}"
        }), 500

# Add place to disliked places endpoint
@app.route('/api/user/places/dislike/<place_id>', methods=['POST'])
def dislike_place(place_id):
    # Check if user is logged in
    if 'user_id' not in session:
        return jsonify({
            "status": "error",
            "message": "Not authenticated"
        }), 401
    
    try:
        # Add place to disliked places
        success = add_disliked_place(session['user_id'], place_id)
        
        if not success:
            return jsonify({
                "status": "error",
                "message": "Failed to dislike place"
            }), 400
        
        return jsonify({
            "status": "success",
            "message": "Place added to disliked places"
        })
        
    except Exception as e:
        return jsonify({
            "status": "error",
            "message": f"Error disliking place: {str(e)}"
        }), 500

# Remove place from liked/disliked places endpoint
@app.route('/api/user/places/reset/<place_id>', methods=['POST'])
def reset_place(place_id):
    # Check if user is logged in
    if 'user_id' not in session:
        return jsonify({
            "status": "error",
            "message": "Not authenticated"
        }), 401
    
    try:
        # Remove place from both lists
        success = remove_place_from_lists(session['user_id'], place_id)
        
        if not success:
            return jsonify({
                "status": "error",
                "message": "Failed to reset place status"
            }), 400
        
        return jsonify({
            "status": "success",
            "message": "Place removed from liked/disliked places"
        })
        
    except Exception as e:
        return jsonify({
            "status": "error",
            "message": f"Error resetting place status: {str(e)}"
        }), 500

# ENDPOINT FOR RETRIEVING SAMPLE PLACES (testing purposes)
@app.route('/places', methods=['GET'])
def get_places():
    try:
        # Get a sample of places from All_Places collection
        sample_places = list(db.All_Places.find().limit(10))
        
        # Convert ObjectIds to strings for serialization
        for place in sample_places:
            place["_id"] = str(place["_id"])
        
        return jsonify(sample_places)
    except Exception as e:
        return jsonify({
            "status": "error",
            "message": f"Failed to retrieve places: {str(e)}"
        }), 500

@app.route('/api/match', methods=['GET'])
def get_matched_places():
    if 'user_id' not in session:
        return jsonify({
            "status": "error",
            "message": "Not authenticated"
        }), 401

    try:
        user_id = session['user_id']
        results = score_places_for_user(user_id)
        return jsonify({
            "status": "success",
            "matches": results
        })
    except Exception as e:
        return jsonify({
            "status": "error",
            "message": f"Failed to calculate matches: {str(e)}"
        }), 500

if __name__ == '__main__':
    app.run(port=5001, debug=app.config['DEBUG']) 
