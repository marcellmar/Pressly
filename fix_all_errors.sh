#!/bin/bash
set -e

echo "==============================================="
echo "Fixing all errors in Pressly MVP React project"
echo "==============================================="

cd /Users/marsonemac/Desktop/pressly-mvp-react-main

echo "1. Installing Material UI dependencies..."
npm install @mui/material @mui/icons-material @emotion/react @emotion/styled

echo "2. Ensuring TensorFlow is correctly installed..."
npm install @tensorflow/tfjs

echo "3. Fixing import paths in source files..."
sed -i '' 's/tensorflow\/tfjs/@tensorflow\/tfjs/g' src/services/ai/designAnalyzer.js

echo "4. Making sure all other dependencies are up to date..."
npm install

echo "5. Running a clean build..."
npm run build

echo "==============================================="
echo "All fixes completed successfully!"
echo "==============================================="
