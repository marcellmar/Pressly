#!/bin/bash
# Enhanced starter script for Pressly MVP
# This script uses proper memory settings and starts the app in a more reliable way

echo "===================================================="
echo "   PRESSLY MVP ENHANCED STARTER                     "
echo "===================================================="

# Set large memory limit for Node.js
export NODE_OPTIONS="--max-old-space-size=8192"

# Clear any React caches that might be problematic
rm -rf node_modules/.cache 2>/dev/null || true

echo "Starting Pressly with enhanced settings..."
echo "Using NODE_OPTIONS: $NODE_OPTIONS"
echo "Press Ctrl+C to stop the application"
echo ""

# Try starting with npx first (more reliable)
echo "Trying to start with npx (method 1 of 3)..."
npx react-scripts start

# If npx fails, try normal npm start
if [ $? -ne 0 ]; then
  echo "Method 1 failed. Trying npm start (method 2 of 3)..."
  npm start
fi

# If npm start fails, try direct node execution
if [ $? -ne 0 ]; then
  echo "Method 2 failed. Trying direct node execution (method 3 of 3)..."
  node ./node_modules/react-scripts/scripts/start.js
fi
