# PollPal API Documentation

This document outlines the available endpoints for the PollPal backend API, including request parameters and response formats.

## Authentication Endpoints

### Register User
Creates a new user account and starts a session.

- **URL**: `/api/auth/register`
- **Method**: `POST`
- **Content-Type**: `application/json`

**Request Body**:
```json
{
  "username": "string",       // Required
  "email": "string",          // Required
  "first_name": "string",     // Required
  "last_name": "string",      // Required
  "password": "string",       // Required
  "date_of_birth": "string",  // Optional, format not specified
  "phone_number": "string"    // Optional
}
```

**Successful Response** (Status Code: 201):
```json
{
  "status": "success",
  "message": "User registered successfully",
  "user": {
    "id": "string",
    "username": "string",
    "email": "string",
    "first_name": "string",
    "last_name": "string"
  }
}
```

**Error Responses**:
- Missing required fields (Status Code: 400):
  ```json
  {
    "status": "error",
    "message": "Missing required fields"
  }
  ```
- Other validation errors (Status Code: 400):
  ```json
  {
    "status": "error",
    "message": "Error message"
  }
  ```
- Server error (Status Code: 500):
  ```json
  {
    "status": "error",
    "message": "Registration failed: Error details"
  }
  ```

### Login
Authenticates a user and starts a session.

- **URL**: `/api/auth/login`
- **Method**: `POST`
- **Content-Type**: `application/json`

**Request Body**:
```json
{
  "username": "string",  // Required
  "password": "string"   // Required
}
```

**Successful Response** (Status Code: 200):
```json
{
  "status": "success",
  "message": "Login successful",
  "user": {
    "id": "string",
    "username": "string",
    "email": "string",
    "first_name": "string",
    "last_name": "string"
  }
}
```

**Error Responses**:
- Missing credentials (Status Code: 400):
  ```json
  {
    "status": "error",
    "message": "Username and password are required"
  }
  ```
- Invalid credentials (Status Code: 401):
  ```json
  {
    "status": "error",
    "message": "Invalid username or password"
  }
  ```
- Server error (Status Code: 500):
  ```json
  {
    "status": "error",
    "message": "Login failed: Error details"
  }
  ```

### Logout
Ends the current user session.

- **URL**: `/api/auth/logout`
- **Method**: `POST`
- **Authentication**: Requires an active session

**Successful Response** (Status Code: 200):
```json
{
  "status": "success",
  "message": "Logged out successfully"
}
```

### Get Current User
Retrieves the currently authenticated user's information.

- **URL**: `/api/auth/me`
- **Method**: `GET`
- **Authentication**: Requires an active session

**Successful Response** (Status Code: 200):
```json
{
  "status": "success",
  "user": {
    "id": "string",
    "username": "string",
    "email": "string",
    "first_name": "string",
    "last_name": "string"
  }
}
```

**Error Responses**:
- Not authenticated (Status Code: 401):
  ```json
  {
    "status": "error",
    "message": "Not authenticated"
  }
  ```
- User not found (Status Code: 401):
  ```json
  {
    "status": "error",
    "message": "User not found"
  }
  ```

## Utility Endpoints

### Home
Basic welcome message to confirm the API is running.

- **URL**: `/`
- **Method**: `GET`

**Response** (Status Code: 200):
```json
{
  "message": "Welcome to PollPal Backend"
}
```

### Database Test
Test connection to MongoDB and list available collections.

- **URL**: `/api/db-test`
- **Method**: `GET`

**Successful Response** (Status Code: 200):
```json
{
  "status": "success",
  "message": "Connected to MongoDB!",
  "collections": ["array_of_collection_names"]
}
```

**Error Response** (Status Code: 500):
```json
{
  "status": "error",
  "message": "Failed to connect to MongoDB: Error details"
}
```

## Notes for Frontend Implementation

1. **Session Management**:
   - The API uses cookie-based sessions for authentication
   - CORS is enabled with `supports_credentials: true`
   - Frontend must include `credentials: 'include'` when making fetch/axios requests

2. **Error Handling**:
   - Always check the `status` field in the response to determine success or failure
   - Display the `message` field to users when appropriate

3. **Authentication Flow**:
   - After successful registration or login, the current user can be accessed via `/api/auth/me`
   - The session persists until logout is called or the session expires
