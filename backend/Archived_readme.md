# PollPal Backend

This is the backend server for the PollPal application, built with Flask and MongoDB.

## Prerequisites

- Python 3.13.2
- MongoDB Atlas account (or local MongoDB installation)

## Setup Instructions

### 1. Clone the Repository

### 2. Set Up a Virtual Environment

#### On Windows:
```bash
python -m venv venv
venv\Scripts\activate
```

#### On macOS/Linux:
```bash
python3 -m venv venv
source venv/bin/activate
```

### 3. Install Dependencies

```bash
pip install -r requirements.txt
```

### 4. Configure Environment Variables

Create a `.env` file in the backend directory with the following content:

```
MONGO_URI=mongodb+srv://<username>:<password>@<cluster-url>/<database>?retryWrites=true&w=majority
MONGO_DB_NAME=PollPal
DEBUG=True
SECRET_KEY=SOMETHINGRANDOM_SOMETHINGRANDOM_SOMETHINGRANDOM
```

Replace the MONGO_URI with the link to your Mongo Atlas cluster

> **Note:** Creating your own MongoDB atlas server is pretty straightforward. Although I am not sure if we can connect to each other's clusters in the free tier. The DB team should look into a method where we can all connect to the same cluster. 

### 5. Run the Server

```bash
python app.py
```
## API Test Endpoints
- `GET /api/db-test` - Test endpoint that verifies MongoDB connection

## Authentication Endpoints

The backend provides the following authentication endpoints:

### Register a New User

**Endpoint:** `POST /auth/register`

**Request Body:**
```json
{
  "username": "your_username",
  "email": "your_email@example.com",
  "first_name": "Your",
  "last_name": "Name",
  "password": "your_password",
  "date_of_birth": "YYYY-MM-DD",
  "phone_number": "1234567890"
}
```

**Response:**
```json
{
  "status": "success",
  "message": "User registered successfully",
  "user": {
    "id": "user_id",
    "username": "your_username",
    "email": "your_email@example.com",
    "first_name": "Your",
    "last_name": "Name"
  }
}
```

### Login

**Endpoint:** `POST /auth/login`

**Request Body:**
```json
{
  "username": "your_username",
  "password": "your_password"
}
```

**Response:**
```json
{
  "status": "success",
  "message": "Login successful",
  "user": {
    "id": "user_id",
    "username": "your_username",
    "email": "your_email@example.com",
    "first_name": "Your",
    "last_name": "Name"
  }
}
```

### Get Current User

**Endpoint:** `GET /auth/me`

**Response:**
```json
{
  "status": "success",
  "user": {
    "id": "user_id",
    "username": "your_username",
    "email": "your_email@example.com",
    "first_name": "Your",
    "last_name": "Name"
  }
}
```

### Logout

**Endpoint:** `POST /auth/logout`

**Response:**
```json
{
  "status": "success",
  "message": "Logged out successfully"
}
```

## Testing Authentication

You can test the authentication endpoints using the provided test script:

```bash
python test/test_auth.py
```

This script will:
1. Register a test user
2. Login with the test user credentials
3. Retrieve the current user information
4. Logout the user
5. Verify the logout by attempting to retrieve the user information again

## Project Structure

```
backend/
├── app.py           # Main Flask application
├── config.py        # Configuration settings
├── models/          # Database models
│   ├── __init__.py  # Database connection
│   └── user.py      # User model
├── test/            # Test directory
│   ├── __init__.py  # Test package initialization
│   └── test_auth.py # Authentication tests
├── requirements.txt # Dependencies
└── .env             # Environment variables (not in git)
```

## Troubleshooting

### Virtual Environment Issues

If you encounter issues with the virtual environment:

```bash
# Remove the existing venv
rm -rf venv  # On macOS/Linux
rmdir /s /q venv  # On Windows

# Create a new one
python -m venv venv
```
