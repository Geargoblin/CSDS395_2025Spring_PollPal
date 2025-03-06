from flask import Flask, jsonify
from flask_cors import CORS
from models import db
import config

# Initialize Flask app
app = Flask(__name__)
app.config.from_object(config)

# Enable CORS
CORS(app)

# Home page
@app.route('/')
def home():
    return jsonify({"message": "Welcome to PollPal Backend"})

# Test route
@app.route('/api/test', methods=['GET'])
def test():
    return jsonify({"message": "Hello from PollPal API!"})

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

if __name__ == '__main__':
    app.run(debug=app.config['DEBUG']) 