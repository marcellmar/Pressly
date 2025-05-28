#!/bin/bash

# SmartMatch Studio Sequence Test Script
# This script tests the complete workflow of SmartMatch Studio

echo "================================================"
echo "SmartMatch Studio Sequence Test"
echo "================================================"
echo ""

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if server is running
echo -e "${BLUE}Checking if development server is running...${NC}"
if curl -s http://localhost:3000 > /dev/null; then
    echo -e "${GREEN}✓ Server is running${NC}"
else
    echo -e "${YELLOW}⚠ Server not detected. Starting development server...${NC}"
    npm start &
    SERVER_PID=$!
    echo "Waiting for server to start..."
    sleep 10
fi

echo ""
echo -e "${BLUE}Running SmartMatch sequence test...${NC}"
echo ""

# Run the Node.js test script
node test_smartmatch_sequence.js

# If we started the server, offer to stop it
if [ ! -z "$SERVER_PID" ]; then
    echo ""
    echo -e "${YELLOW}Development server is running with PID: $SERVER_PID${NC}"
    read -p "Stop the server? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        kill $SERVER_PID
        echo -e "${GREEN}✓ Server stopped${NC}"
    fi
fi

echo ""
echo -e "${BLUE}Opening SmartMatch Studio in browser...${NC}"

# Open different modes in browser tabs
if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    open "http://localhost:3000/smart-match"
    sleep 1
    open "http://localhost:3000/smart-match?mode=quick"
    sleep 1
    open "http://localhost:3000/smart-match?mode=ai"
    sleep 1
    open "http://localhost:3000/smart-match?mode=eco"
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    # Linux
    xdg-open "http://localhost:3000/smart-match"
    sleep 1
    xdg-open "http://localhost:3000/smart-match?mode=quick"
    sleep 1
    xdg-open "http://localhost:3000/smart-match?mode=ai"
    sleep 1
    xdg-open "http://localhost:3000/smart-match?mode=eco"
else
    # Windows (Git Bash)
    start "http://localhost:3000/smart-match"
    sleep 1
    start "http://localhost:3000/smart-match?mode=quick"
    sleep 1
    start "http://localhost:3000/smart-match?mode=ai"
    sleep 1
    start "http://localhost:3000/smart-match?mode=eco"
fi

echo ""
echo -e "${GREEN}✓ Test completed!${NC}"
echo ""
echo "Browser tabs opened with:"
echo "  1. Default SmartMatch Studio"
echo "  2. Quick mode (PDF analysis)"
echo "  3. AI mode (optimization focus)"
echo "  4. Eco mode (sustainability focus)"
echo ""
echo "Please test the workflow manually in each mode."
echo ""