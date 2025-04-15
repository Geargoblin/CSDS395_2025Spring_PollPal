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
  "password": "string",       // Required
  "date_of_birth": "string",  // Optional
  "phone_number": "string",   // Optional
  "preferences": ["string"],  // Optional, array of preference strings
  "location": "string"        // Optional, location as a string
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
    "preferences": ["string"],
    "location": "string",
    "liked_places": ["string"],
    "disliked_places": ["string"]
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
    "preferences": ["string"],
    "liked_places": ["string"],
    "disliked_places": ["string"],
    "location": "string"
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
Retrieves the currently authenticated user's information including detailed place data.

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
    "preferences": ["string"],
    "location": "string",
    "liked_places": [
      {
        "Address": "string",
        "Google Types": "string",
        "Name": "string",
        "Place ID": "string",
        "Price": "string",
        "Rating": number,
        "Restaurant Type": "string",
        "User Ratings Total": number,
        "_id": "string"
      }
    ],
    "disliked_places": ["string"]
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

## User Management Endpoints

### Update User Information
Updates one or more fields of the current user's information.

- **URL**: `/api/user/update`
- **Method**: `PUT`
- **Authentication**: Requires an active session
- **Content-Type**: `application/json`

**Request Body**:
```json
{
  "username": "string",       // Optional
  "email": "string",          // Optional
  "password": "string",       // Optional
  "date_of_birth": "string",  // Optional
  "phone_number": "string",   // Optional
  "preferences": ["string"],  // Optional, array of preference strings
  "location": "string"        // Optional, location as a string
}
```

**Notes**:
- You only need to include the fields you want to update
- Any fields not included or set to null will not be modified
- Username and email must be unique across all users

**Successful Response** (Status Code: 200):
```json
{
  "status": "success",
  "message": "User information updated successfully",
  "user": {
    "id": "string",
    "username": "string",
    "email": "string",
    "preferences": ["string"],
    "liked_places": ["string"],
    "disliked_places": ["string"],
    "location": "string",
    "date_of_birth": "string",
    "phone_number": "string"
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
- Validation error (Status Code: 400):
  ```json
  {
    "status": "error",
    "message": "Username already exists" // Or other specific error message
  }
  ```
- No valid fields (Status Code: 400):
  ```json
  {
    "status": "error",
    "message": "No valid fields to update"
  }
  ```
- Server error (Status Code: 500):
  ```json
  {
    "status": "error",
    "message": "Error updating user information: Error details"
  }
  ```

## Places Management Endpoints

### Like a Place
Adds a place to the user's liked places list.

- **URL**: `/api/user/places/like/<place_id>`
- **Method**: `POST`
- **Authentication**: Requires an active session

**Successful Response** (Status Code: 200):
```json
{
  "status": "success",
  "message": "Place added to liked places"
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
- Action failure (Status Code: 400):
  ```json
  {
    "status": "error",
    "message": "Failed to like place"
  }
  ```
- Server error (Status Code: 500):
  ```json
  {
    "status": "error",
    "message": "Error liking place: Error details"
  }
  ```

### Dislike a Place
Adds a place to the user's disliked places list.

- **URL**: `/api/user/places/dislike/<place_id>`
- **Method**: `POST`
- **Authentication**: Requires an active session

**Successful Response** (Status Code: 200):
```json
{
  "status": "success",
  "message": "Place added to disliked places"
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
- Action failure (Status Code: 400):
  ```json
  {
    "status": "error",
    "message": "Failed to dislike place"
  }
  ```
- Server error (Status Code: 500):
  ```json
  {
    "status": "error",
    "message": "Error disliking place: Error details"
  }
  ```

### Reset Place Status
Removes a place from both liked and disliked lists.

- **URL**: `/api/user/places/reset/<place_id>`
- **Method**: `POST`
- **Authentication**: Requires an active session

**Successful Response** (Status Code: 200):
```json
{
  "status": "success",
  "message": "Place removed from liked/disliked places"
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
- Action failure (Status Code: 400):
  ```json
  {
    "status": "error",
    "message": "Failed to reset place status"
  }
  ```
- Server error (Status Code: 500):
  ```json
  {
    "status": "error",
    "message": "Error resetting place status: Error details"
  }
  ```

## Places Retrieval Endpoint

### Get Places
Retrieves a list of available places.

- **URL**: `/places`
- **Method**: `GET`

**Successful Response** (Status Code: 200):
```json
[
  {
    "name": "string",
    "description": "string",
    "image": "string",
    "categories": ["string"]
  }
]
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

4. **Places Management**:
   - Users can like, dislike, or reset their opinion on places
   - Liked places are returned with complete details in the `/api/auth/me` endpoint
   - Place data includes details such as Address, Name, Rating, Price, etc.

5. **User Updates**:
   - Use the unified `/api/user/update` endpoint to update any user attributes
   - Only send the fields you want to change in your request
