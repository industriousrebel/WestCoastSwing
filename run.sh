#!/bin/bash

# Navigate to the backend directory and run FastAPI
echo "Starting FastAPI server..."
cd backend
poetry run python3 main.py --reload &

# Get the FastAPI process ID to stop it later
FASTAPI_PID=$!

# Navigate to the frontend directory and start React
echo "Starting React frontend..."
cd ../frontend
npm start &

# Get the React process ID to stop it later
REACT_PID=$!

# Function to kill both processes when script is stopped
cleanup() {
  echo "Stopping both servers..."
  kill $FASTAPI_PID
  kill $REACT_PID
}

# Trap SIGINT and SIGTERM to stop the servers on exit
trap cleanup SIGINT SIGTERM

# Wait for the servers to run in the background
wait $FASTAPI_PID
wait $REACT_PID
