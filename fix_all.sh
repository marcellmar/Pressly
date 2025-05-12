#!/bin/bash
# Comprehensive fix script for Pressly MVP

echo "===================================================="
echo "   PRESSLY MVP COMPREHENSIVE FIX SCRIPT             "
echo "===================================================="

# Step 1: Backup current node_modules if needed
echo "Creating backup of node_modules..."
mkdir -p node_modules_backup_$(date +%Y%m%d)
cp -r node_modules/* node_modules_backup_$(date +%Y%m%d)/ 2>/dev/null || true

# Step 2: Remove duplicate lodash files
echo "Removing duplicate lodash files..."
find ./node_modules/lodash -name "*\ 2.js" -type f -delete 2>/dev/null || true

# Step 3: Clear cache and temporary files
echo "Clearing npm and React cache..."
npm cache clean --force
rm -rf ./node_modules/.cache 2>/dev/null || true

# Step 4: Fix potential Node.js memory issues
echo "Setting up Node.js memory parameters..."
if ! grep -q "NODE_OPTIONS=\"--max-old-space-size=4096\"" ~/.bash_profile; then
  echo 'export NODE_OPTIONS="--max-old-space-size=4096"' >> ~/.bash_profile
fi
source ~/.bash_profile 2>/dev/null || true

# Step 5: Fix package.json if needed
if grep -q "\"tensorflow" package.json; then
  echo "Ensuring compatibility with TensorFlow dependencies..."
  npm install --legacy-peer-deps
else
  echo "Reinstalling dependencies..."
  npm ci || npm install
fi

# Step 6: Make start script executable
echo "Setting up enhanced start script..."
chmod +x start.sh 2>/dev/null || true

echo "===================================================="
echo "Fix completed successfully!"
echo ""
echo "To start the application, run:"
echo "./start.sh"
echo ""
echo "If you encounter any issues, please refer to the README.md"
echo "===================================================="
