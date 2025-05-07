# PollPal Backend

This is the backend server for the PollPal application, built with Flask and MongoDB.

## Prerequisites

- Python 3.13.2

## Setup Instructions

### 1. Clone the Repository

### 2. Navigate to Backend Directory

```bash
cd backend
```

### 3. Set Up a Virtual Environment

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

### 4. Install Dependencies

```bash
pip install -r requirements.txt
```

### 5. Run the Server

```bash
python app.py
```

## Features

### Recommendation System (feature/recommendation-system branch)
The backend includes a Q-learning based recommendation system that:
- Learns from user interactions (swipes, attendance)
- Provides personalized event recommendations
- Adapts to user preferences over time
- Uses reinforcement learning to improve suggestions

To use the recommendation system, switch to the feature branch:
```bash
git checkout feature/recommendation-system
```
