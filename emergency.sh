#!/bin/bash
# Emergency script for Pressly MVP
# This bypasses React entirely and starts a simple server

# Make all scripts executable
chmod +x bypass.sh
chmod +x build_and_run.sh

# Run the bypass script directly
echo "Starting emergency server mode..."
./bypass.sh
