#!/bin/bash
# Main script for rebuilding and running Pressly

# Make scripts executable
chmod +x rebuild_npm.sh
chmod +x enhanced_start.sh

# Display menu
echo "===================================================="
echo "   PRESSLY MVP LAUNCHER                             "
echo "===================================================="
echo ""
echo "Choose an option:"
echo "1. Rebuild npm and dependencies (do this first time)"
echo "2. Start application with enhanced settings"
echo "3. Exit"
echo ""
read -p "Enter your choice (1-3): " choice

case $choice in
  1) ./rebuild_npm.sh ;;
  2) ./enhanced_start.sh ;;
  3) echo "Exiting..."; exit 0 ;;
  *) echo "Invalid choice"; exit 1 ;;
esac
