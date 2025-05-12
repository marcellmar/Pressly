#!/bin/bash
# Simplified fix script for Pressly MVP - skips backup step

echo "===================================================="
echo "   PRESSLY MVP QUICK FIX SCRIPT                     "
echo "===================================================="

# Step 1: Remove duplicate lodash files
echo "Removing duplicate lodash files..."
find ./node_modules/lodash -name "*\ 2.js" -type f -delete 2>/dev/null || true

# Step 2: Clear cache and temporary files
echo "Clearing npm and React cache..."
npm cache clean --force
rm -rf ./node_modules/.cache 2>/dev/null || true

# Step 3: Fix potential Node.js memory issues
echo "Setting up Node.js memory parameters..."
export NODE_OPTIONS="--max-old-space-size=4096"

# Step 4: Make start script executable
echo "Setting up enhanced start script..."
chmod +x start.sh 2>/dev/null || true

echo "===================================================="
echo "Quick fix completed!"
echo ""
echo "To start the application, run:"
echo "NODE_OPTIONS='--max-old-space-size=4096' npx react-scripts start"
echo ""
echo "If you encounter any issues, please try reinstalling dependencies with:"
echo "npm install --legacy-peer-deps"
echo "===================================================="
