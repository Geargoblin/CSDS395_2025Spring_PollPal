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



# ENDPOINT FOR RETRIEVING PLACES
places = [
    {
        "name": "Rock & Roll Hall of Fame",
        "description": "A museum dedicated to preserving the history of rock music.",
        "image": "https://ohiomagazine.imgix.net/sitefinity/images/default-source/articles/2018/04---april-2018/rock-and-roll-hall-of-fame.jpg?sfvrsn=cdf2ab38_4&w=960&auto=compress%2cformat"
    },
    {
        "name": "West Side Market",
        "description": "Historic public market with fresh produce and artisanal foods.",
        "image": "https://cdn.prod.website-files.com/582efd75e6a8159513741627/582f57dce6a8159513757b8b_Market2.jpg"
    },
    {
        "name": "Cleveland Museum of Art",
        "description": "A world-class museum featuring a diverse collection of artworks.",
        "image": "https://www.universitycircle.org/files/locations/slider/cmabenefitallpeoplebanners.jpg"
    },
    {
        "name": "Cleveland Metroparks Zoo",
        "description": "A massive zoo with a rainforest exhibit and exotic animals.",
        "image": "https://www.cleveland.com/resizer/v2/EHSJDX3UQZFIDGPRXZ2QHY6CBM.jpeg?auth=94b62f93d5c4592373658325d0e9cab9fd1f00a1d9357c9e47fd5a49a54121d3&width=1280&quality=90"
    },
    {
        "name": "Great Lakes Science Center",
        "description": "A museum dedicated to science, technology, and space exploration.",
        "image": "https://images.axios.com/gG3fR7KzDJQTcXEtClqOr0mJ7XI=/0x126:5456x3195/1920x1080/2024/02/22/1708620325715.jpg?w=3840"
    },
    {
        "name": "Edgewater Park",
        "description": "A beautiful park along Lake Erie with beaches and scenic views.",
        "image": "https://playeasy.com/cdn-cgi/image/width=3840,fit=scale-down,format=auto,quality=85,background=white/https://storage.playeasy.com/facility-mgmt/523bd1f0-0bc1-46af-ba6d-cd43c7d3adde"
    },
    {
        "name": "Progressive Field",
        "description": "Home stadium of the Cleveland Guardians baseball team.",
        "image": "https://static.wixstatic.com/media/1de578_ff607606645643b39561f28eac0c39de~mv2.jpg/v1/fill/w_1016,h_762,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/1de578_ff607606645643b39561f28eac0c39de~mv2.jpg"
    },
    {
        "name": "Playhouse Square",
        "description": "The largest performing arts center outside of New York City.",
        "image": "https://www.dlrgroup.com/media/2021/06/25_00088_00_N4_weblg-2140x1281.jpg"
    },
    {
        "name": "University Circle",
        "description": "A cultural hub with museums, gardens, and Case Western Reserve University.",
        "image": "https://dailymedia.case.edu/wp-content/uploads/2016/08/19140754/CWRU-university-circle.jpg"
    },
    {
        "name": "The Flats",
        "description": "An entertainment district with waterfront dining and nightlife.",
        "image": "https://scontent.fbkl1-1.fna.fbcdn.net/v/t39.30808-6/296404277_5842436765784617_7542443823342321004_n.jpg?_nc_cat=109&ccb=1-7&_nc_sid=cc71e4&_nc_ohc=Eam24OkVIEgQ7kNvgHPz640&_nc_oc=Adh1nzOBU2fBmwkKwkx3knwt4DehnJP8A5Sh77uXUu1Ughs7cWvtY8Zn-EvOf_70RPU&_nc_zt=23&_nc_ht=scontent.fbkl1-1.fna&_nc_gid=A8U3VraZFW4rU1-PIlitw9y&oh=00_AYGarNt-KnZSPx1u3PIE5XYaI_pKGnmMpDAjQSejtX5Eag&oe=67D0152F"
    }
]

@app.route('/places', methods=['GET'])
def get_places():
    return jsonify(places)

if __name__ == '__main__':
    app.run(port=5001, debug=app.config['DEBUG']) 