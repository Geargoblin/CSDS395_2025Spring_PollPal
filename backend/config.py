import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# MongoDB connection settings
MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017/pollpal")
MONGO_DB_NAME = os.getenv("MONGO_DB_NAME", "pollpal")

# Flask settings
DEBUG = os.getenv("DEBUG", "True") == "True"
SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key-here") 

