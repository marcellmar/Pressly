#!/bin/bash
# Fix for npm start freezing and lodash dependency issues

# Step 1: Remove duplicate lodash files
echo "Removing duplicate lodash files..."
find ./node_modules/lodash -name "*\ 2.js" -type f -delete 2>/dev/null || true

# Step 2: Clear cache and temporary files
echo "Clearing npm and React cache..."
npm cache clean --force
rm -rf ./node_modules/.cache 2>/dev/null || true

# Step 3: Fix potential Node.js memory issues
echo "Setting up Node.js memory parameters..."
echo 'export NODE_OPTIONS="--max-old-space-size=4096"' >> ~/.bash_profile
source ~/.bash_profile 2>/dev/null || true

# Step 4: Reinstall problematic dependencies
echo "Reinstalling key dependencies..."
npm uninstall lodash @tensorflow/tfjs
npm install lodash @tensorflow/tfjs --legacy-peer-deps

echo "====================================="
echo "Fix complete! Try running the app with:"
echo "NODE_OPTIONS='--max-old-space-size=4096' npm start"
echo "====================================="
