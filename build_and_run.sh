#!/bin/bash
# Build and run script for Pressly MVP

echo "===================================================="
echo "   PRESSLY MVP BUILD AND RUN SCRIPT                 "
echo "===================================================="

# Set large memory limit for Node.js
export NODE_OPTIONS="--max-old-space-size=8192"

echo "Building Pressly in production mode..."
# Use direct npx command to avoid npm freezing
npx react-scripts build

# Check if build was successful
if [ -d "./build" ]; then
    echo "Build successful! Starting server..."
    chmod +x bypass.sh
    ./bypass.sh
else
    echo "Build failed. Starting temporary server..."
    chmod +x bypass.sh
    ./bypass.sh
fi
