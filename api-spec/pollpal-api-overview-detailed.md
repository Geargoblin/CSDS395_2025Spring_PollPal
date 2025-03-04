# PollPal API Overview Document

## Introduction
This document outlines the RESTful API endpoints required for the PollPal recommendation application. The backend is built using Flask and MongoDB, while the frontend is implemented in React.

## API Sections

### 1. Authentication API (`/auth`)

#### 1.1 User Registration
- **Endpoint**: `POST /auth/register`
- **Functionality**: Create a new user account
- **Request Parameters**:
  ```json
  {
    "username": "string",
    "email": "string",
    "password": "string",
    "location": "string" // City or coordinates
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "message": "User registered successfully",
    "user_id": "string"
  }
  ```
- **Error Responses**:
  - 400: Username/email already exists
  - 400: Invalid input

#### 1.2 User Login
- **Endpoint**: `POST /auth/login`
- **Functionality**: Authenticate user and create session
- **Request Parameters**:
  ```json
  {
    "username": "string",
    "password": "string"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "message": "Login successful",
    "user_id": "string"
  }
  ```
- **Error Responses**:
  - 401: Invalid credentials
  - 400: Missing required fields

#### 1.3 Password Reset Request
- **Endpoint**: `POST /auth/reset-password-request`
- **Functionality**: Send password reset email to user
- **Request Parameters**:
  ```json
  {
    "email": "string"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "message": "Password reset instructions sent"
  }
  ```
- **Error Responses**:
  - 404: Email not found
  - 400: Invalid email format

#### 1.4 Password Reset
- **Endpoint**: `POST /auth/reset-password`
- **Functionality**: Reset user password using token
- **Request Parameters**:
  ```json
  {
    "token": "string",
    "new_password": "string"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "message": "Password reset successful"
  }
  ```
- **Error Responses**:
  - 400: Invalid or expired token
  - 400: Password requirements not met

#### 1.5 Logout
- **Endpoint**: `POST /auth/logout`
- **Functionality**: End user session
- **Request Parameters**: None (uses session cookie)
- **Response**:
  ```json
  {
    "success": true,
    "message": "Logged out successfully"
  }
  ```

### 2. User Profile API (`/profile`)

#### 2.1 Get User Profile
- **Endpoint**: `GET /profile`
- **Functionality**: Retrieve current user's profile information
- **Request Parameters**: None (uses session for authentication)
- **Response**:
  ```json
  {
    "user_id": "string",
    "username": "string",
    "email": "string",
    "location": "string",
    "created_at": "timestamp",
    "profile_picture": "url_string"
  }
  ```
- **Error Responses**:
  - 401: Unauthorized
  - 404: Profile not found

#### 2.2 Update Profile
- **Endpoint**: `PUT /profile`
- **Functionality**: Update user profile information
- **Request Parameters**:
  ```json
  {
    "username": "string", // optional
    "email": "string", // optional
    "location": "string", // optional
    "profile_picture": "file or url", // optional
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "message": "Profile updated successfully",
    "profile": { /* updated profile object */ }
  }
  ```
- **Error Responses**:
  - 401: Unauthorized
  - 400: Invalid input

#### 2.3 Get User Activity History
- **Endpoint**: `GET /profile/activity`
- **Functionality**: Get user's like/dislike history and reviews
- **Request Parameters**:
  - Query param: `type` (optional): "likes", "dislikes", "reviews", "all"
  - Query param: `page` (optional): pagination page number
  - Query param: `limit` (optional): items per page
- **Response**:
  ```json
  {
    "likes": [
      {
        "post_id": "string",
        "post_name": "string",
        "timestamp": "timestamp"
      }
    ],
    "dislikes": [
      {
        "post_id": "string",
        "post_name": "string",
        "timestamp": "timestamp"
      }
    ],
    "reviews": [
      {
        "post_id": "string",
        "post_name": "string",
        "review_content": "string",
        "rating": "number",
        "timestamp": "timestamp"
      }
    ],
    "pagination": {
      "total": "number",
      "page": "number",
      "limit": "number",
      "total_pages": "number"
    }
  }
  ```
- **Error Responses**:
  - 401: Unauthorized
  - 400: Invalid parameters

#### 2.4 Get Friends List
- **Endpoint**: `GET /profile/friends`
- **Functionality**: Retrieve user's friends list
- **Request Parameters**:
  - Query param: `page` (optional): pagination page number
  - Query param: `limit` (optional): items per page
- **Response**:
  ```json
  {
    "friends": [
      {
        "user_id": "string",
        "username": "string",
        "profile_picture": "url_string"
      }
    ],
    "pagination": {
      "total": "number",
      "page": "number",
      "limit": "number",
      "total_pages": "number"
    }
  }
  ```
- **Error Responses**:
  - 401: Unauthorized

### 3. Posts API (`/posts`)

#### 3.1 Get Post Recommendations
- **Endpoint**: `GET /posts/recommendations`
- **Functionality**: Fetch personalized post recommendations for main scrolling page
- **Request Parameters**:
  - Query param: `category` (optional): filter by category
  - Query param: `limit` (optional): number of recommendations to return
- **Response**:
  ```json
  {
    "posts": [
      {
        "post_id": "string",
        "name": "string",
        "description": "string",
        "photos": ["url_string"],
        "main_photo": "url_string",
        "stars": "number", // Average rating
        "likes_count": "number",
        "dislikes_count": "number",
        "category": "string",
        "location": {
          "address": "string",
          "coordinates": [number, number] // [longitude, latitude]
        },
        "preview_reviews": [
          {
            "user_id": "string",
            "username": "string",
            "content": "string",
            "rating": "number" 
          }
        ]
      }
    ]
  }
  ```
- **Error Responses**:
  - 401: Unauthorized
  - 400: Invalid parameters

#### 3.2 Get Post Details
- **Endpoint**: `GET /posts/{post_id}`
- **Functionality**: Get detailed information about a specific post
- **Request Parameters**:
  - Path param: `post_id`
- **Response**:
  ```json
  {
    "post_id": "string",
    "name": "string",
    "description": "string",
    "photos": ["url_string"],
    "stars": "number",
    "likes_count": "number",
    "dislikes_count": "number",
    "category": "string",
    "tags": ["string"],
    "location": {
      "address": "string",
      "coordinates": [number, number],
      "distance": "number" // distance from user's location
    },
    "reviews": [
      {
        "review_id": "string",
        "user_id": "string",
        "username": "string",
        "profile_picture": "url_string",
        "content": "string",
        "rating": "number",
        "timestamp": "timestamp"
      }
    ],
    "user_interaction": {
      "liked": "boolean",
      "disliked": "boolean",
      "reviewed": "boolean"
    }
  }
  ```
- **Error Responses**:
  - 404: Post not found
  - 400: Invalid post ID

#### 3.3 Like/Dislike Post
- **Endpoint**: `POST /posts/{post_id}/vote`
- **Functionality**: Register user vote (like/dislike) for a post
- **Request Parameters**:
  - Path param: `post_id`
  - Request body:
    ```json
    {
      "vote": "string" // "like" or "dislike"
    }
    ```
- **Response**:
  ```json
  {
    "success": true,
    "message": "Vote recorded",
    "next_post": { /* next post object for recommendation */ }
  }
  ```
- **Error Responses**:
  - 401: Unauthorized
  - 404: Post not found
  - 400: Invalid vote type

#### 3.4 Get Trending Posts
- **Endpoint**: `GET /posts/trending`
- **Functionality**: Get trending posts based on user interactions
- **Request Parameters**:
  - Query param: `category` (optional): filter by category
  - Query param: `page` (optional): pagination page number
  - Query param: `limit` (optional): items per page
- **Response**:
  ```json
  {
    "posts": [
      {
        "post_id": "string",
        "name": "string",
        "description": "string",
        "main_photo": "url_string",
        "stars": "number",
        "likes_count": "number",
        "category": "string",
        "trending_factor": "number" // Score determining trend position
      }
    ],
    "pagination": {
      "total": "number",
      "page": "number",
      "limit": "number",
      "total_pages": "number"
    }
  }
  ```
- **Error Responses**:
  - 400: Invalid parameters

### 4. Reviews API (`/reviews`)

#### 4.1 Create Review
- **Endpoint**: `POST /reviews`
- **Functionality**: Create a new review for a post
- **Request Parameters**:
  ```json
  {
    "post_id": "string",
    "content": "string",
    "rating": "number" // 1-5
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "message": "Review created successfully",
    "review_id": "string"
  }
  ```
- **Error Responses**:
  - 401: Unauthorized
  - 404: Post not found
  - 400: Invalid rating or missing content

#### 4.2 Update Review
- **Endpoint**: `PUT /reviews/{review_id}`
- **Functionality**: Update an existing review
- **Request Parameters**:
  - Path param: `review_id`
  - Request body:
    ```json
    {
      "content": "string", // optional
      "rating": "number" // optional, 1-5
    }
    ```
- **Response**:
  ```json
  {
    "success": true,
    "message": "Review updated successfully"
  }
  ```
- **Error Responses**:
  - 401: Unauthorized
  - 404: Review not found
  - 403: Not user's review
  - 400: Invalid rating

#### 4.3 Delete Review
- **Endpoint**: `DELETE /reviews/{review_id}`
- **Functionality**: Delete a review
- **Request Parameters**:
  - Path param: `review_id`
- **Response**:
  ```json
  {
    "success": true,
    "message": "Review deleted successfully"
  }
  ```
- **Error Responses**:
  - 401: Unauthorized
  - 404: Review not found
  - 403: Not user's review

## Implementation Notes

1. **Authentication**: Using Flask session for user authentication
2. **Database**: MongoDB will be used as the primary database
3. **Error Handling**: Consistent error response format across all endpoints
4. **Pagination**: Implement pagination for list-based endpoints to improve performance
5. **Initial Focus**: Priority should be given to implementing core functionality endpoints first (auth, profile basics, post viewing and voting)
6. **Recommendation Algorithm**: Will be implemented in a later phase (not part of initial API implementation)
