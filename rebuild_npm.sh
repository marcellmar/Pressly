#!/bin/bash
# Comprehensive rebuild script for npm start issues
# This script fixes dependency issues and npm start freezing

echo "===================================================="
echo "   PRESSLY MVP NPM REBUILD SCRIPT                   "
echo "===================================================="
echo ""
echo "This script will fix npm start freezing by:"
echo "1. Cleaning problematic node_modules"
echo "2. Resetting npm cache"
echo "3. Reinstalling dependencies with correct settings"
echo "4. Setting proper memory parameters"
echo ""
echo "Press ENTER to continue or CTRL+C to cancel"
read

# Step 1: Remove problematic directories/files
echo "Step 1: Cleaning directories..."
rm -rf node_modules/.cache 2>/dev/null || true
rm -rf node_modules/.vite 2>/dev/null || true
# Remove duplicate lodash files if they exist
find ./node_modules/lodash -name "*\ 2.js" -type f -delete 2>/dev/null || true

# Step 2: Clean npm cache
echo "Step 2: Cleaning npm cache..."
npm cache clean --force

# Step 3: Remove and recreate node_modules
echo "Step 3: Removing node_modules directory..."
rm -rf node_modules

# Step 4: Set memory parameters for Node.js
echo "Step 4: Setting memory parameters for Node.js..."
# Set large memory limit for Node.js
export NODE_OPTIONS="--max-old-space-size=8192"
echo "NODE_OPTIONS=--max-old-space-size=8192" > .env

# Step 5: Reinstall dependencies
echo "Step 5: Reinstalling dependencies with correct settings..."
echo "This may take a few minutes..."
npm install --legacy-peer-deps

echo "Step 6: Verifying installation..."
if [ -d "node_modules/react" ] && [ -d "node_modules/react-dom" ]; then
  echo "Success! React dependencies are installed correctly."
else
  echo "Warning: Some dependencies may be missing. Please check for errors above."
fi

echo "===================================================="
echo "Rebuild completed!"
echo ""
echo "To start the application, run:"
echo "export NODE_OPTIONS=--max-old-space-size=8192 && npm start"
echo ""
echo "If npm start still freezes, try:"
echo "npx react-scripts start"
echo "===================================================="
