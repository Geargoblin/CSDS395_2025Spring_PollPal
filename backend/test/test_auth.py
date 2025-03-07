import requests
import json

# Base URL for the API
BASE_URL = "http://localhost:5000/api"

def test_register():
    """Test user registration"""
    print("\n=== Testing User Registration ===")
    
    # Test data
    user_data = {
        "username": "testuser",
        "email": "test@example.com",
        "first_name": "Test",
        "last_name": "User",
        "password": "password123",
        "date_of_birth": "1990-01-01",
        "phone_number": "1234567890"
    }
    
    # Send request
    response = requests.post(f"{BASE_URL}/auth/register", json=user_data)
    
    # Print response
    print(f"Status Code: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")
    
    return response.json()

def test_login():
    """Test user login"""
    print("\n=== Testing User Login ===")
    
    # Login data
    login_data = {
        "username": "testuser",
        "password": "password123"
    }
    
    # Send request
    response = requests.post(f"{BASE_URL}/auth/login", json=login_data)
    
    # Print response
    print(f"Status Code: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")
    
    return response

def test_get_current_user(session_cookies):
    """Test getting current user"""
    print("\n=== Testing Get Current User ===")
    
    # Send request with session cookies
    response = requests.get(f"{BASE_URL}/auth/me", cookies=session_cookies)
    
    # Print response
    print(f"Status Code: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")

def test_logout(session_cookies):
    """Test user logout"""
    print("\n=== Testing User Logout ===")
    
    # Send request with session cookies
    response = requests.post(f"{BASE_URL}/auth/logout", cookies=session_cookies)
    
    # Print response
    print(f"Status Code: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")
    
    return response

def run_tests():
    """Run all tests"""
    # Test registration
    test_register()
    
    # Test login
    login_response = test_login()
    
    # Get session cookies
    session_cookies = login_response.cookies
    
    # Test get current user
    test_get_current_user(session_cookies)
    
    # Test logout
    test_logout(session_cookies)
    
    # Verify logout by trying to get current user again
    print("\n=== Verifying Logout ===")
    test_get_current_user(session_cookies)

if __name__ == "__main__":
    run_tests() 