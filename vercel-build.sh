#!/bin/bash

# Install React dependencies and build frontend
npm install
npm run build

# Install Python dependencies (will use vercel-requirements.txt)
# Vercel will handle Python requirements automatically

echo "Build completed successfully"