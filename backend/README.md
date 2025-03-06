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

## Project Structure

```
backend/
├── app.py           # Main Flask application
├── config.py        # Configuration settings
├── models/          # Database models
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
