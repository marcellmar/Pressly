#!/bin/bash
# Direct start script for Pressly MVP - bypasses npm start

echo "Starting Pressly directly using react-scripts..."
export NODE_OPTIONS="--max-old-space-size=4096"

# Direct execution of the start script from node_modules
node ./node_modules/react-scripts/scripts/start.js
