#First Attempts to connect to local host data base, will need to create database 
#remote access via username and password enabling and database address

from pymongo import MongoClient

# Connect to MongoDB
client = MongoClient("mongodb://localhost:27017/395")
db = client["395"]  # Database name
collection = db["Users"]  # Collection name

def user_exists(first_name, last_name, email):
    """Check if the user already exists in the database."""
    return collection.find_one({"first_name": first_name, "last_name": last_name, "email": email}) is not None

def add_user():
    """Prompt for user details and add to MongoDB if not exists."""
    first_name = input("Enter first name: ")
    last_name = input("Enter last name: ")
    email = input("Enter email: ")
    
    if user_exists(first_name, last_name, email):
        print("User already exists in the database.")
    else:
        user_data = {"first_name": first_name, "last_name": last_name, "email": email}
        collection.insert_one(user_data)
        print("User added successfully.")

if __name__ == "__main__":
    while True:
        add_user()
        cont = input("Do you want to add another user? (yes/no): ")
        if cont.lower() != "yes":
            break