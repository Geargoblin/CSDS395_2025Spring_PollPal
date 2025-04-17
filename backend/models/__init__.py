from pymongo import MongoClient
from config import MONGO_URI, MONGO_DB_NAME

# Create MongoDB client
client = MongoClient(MONGO_URI, serverSelectionTimeoutMS=100000, connectTimeoutMS=100000, tlsAllowInvalidCertificates=True)

# Get the database
db = client[MONGO_DB_NAME]

# Define collections example - We don't need yet, we need to meet later with db team to decide what collections we need
users = db.Users