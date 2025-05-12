#!/bin/bash
# Enhanced start script for Pressly MVP

# Set higher memory limit for Node.js
export NODE_OPTIONS="--max-old-space-size=4096"

# Use a more reliable way to start the React app
echo "Starting Pressly with enhanced settings..."
echo "Press Ctrl+C to stop the application"

# Alternative start method if normal npm start freezes
npx react-scripts start

# If the above doesn't work, uncomment this alternative approach:
# NODE_ENV=development node ./node_modules/react-scripts/scripts/start.js
