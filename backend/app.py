from flask import Flask, jsonify, request, session
from flask_cors import CORS
from models import db
from models.user import create_user, get_user_by_username
import config
from datetime import datetime

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
        first_name = data.get('first_name')
        last_name = data.get('last_name')
        password = data.get('password')
        date_of_birth = data.get('date_of_birth')
        phone_number = data.get('phone_number')
        
        # Validate required fields
        if not all([username, email, first_name, last_name, password]):
            return jsonify({
                "status": "error",
                "message": "Missing required fields"
            }), 400
        
        # Create user in database
        user, error = create_user(
            username=username,
            email=email,
            first_name=first_name,
            last_name=last_name,
            password=password,
            date_of_birth=date_of_birth,
            phone_number=phone_number
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
                "first_name": user['first_name'],
                "last_name": user['last_name']
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
                "first_name": user['first_name'],
                "last_name": user['last_name']
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
    
    # Get user from database
    from models.user import get_user_by_id
    user = get_user_by_id(session['user_id'])
    
    if not user:
        # Clear invalid session
        session.clear()
        return jsonify({
            "status": "error",
            "message": "User not found"
        }), 401
    
    # Return user data
    return jsonify({
        "status": "success",
        "user": {
            "id": user['_id'],
            "username": user['username'],
            "email": user['email'],
            "first_name": user['first_name'],
            "last_name": user['last_name']
        }
    })

if __name__ == '__main__':
    app.run(debug=app.config['DEBUG']) 