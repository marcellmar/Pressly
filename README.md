# Pressly MVP React

## Fixing Node Dependencies Error

If you encounter errors like ETIMEDOUT or npm start freezing, use our comprehensive fix script:

### Comprehensive Fix (Recommended)

1. Open Terminal and navigate to the project folder:
   ```
   cd ~/Desktop/pressly-mvp-react-main
   ```

2. Make the fix script executable:
   ```
   chmod +x fix_all.sh
   ```

3. Run the script:
   ```
   ./fix_all.sh
   ```

This script will fix both the module loading errors and npm start freezing issues by:
- Backing up your node_modules
- Removing duplicate files
- Clearing npm cache
- Setting proper memory parameters
- Reinstalling dependencies with compatibility fixes
- Setting up the enhanced start script

### Alternative Fix Options

If you prefer more targeted fixes:

- **For lodash errors only**: `chmod +x fix_lodash.sh && ./fix_lodash.sh`
- **For complete node_modules reinstall**: `chmod +x fix_dependencies.sh && ./fix_dependencies.sh`

## Running the Application

Once dependencies are fixed, you have two ways to start the application:

### Option 1: Enhanced Start Script (Recommended)

Use the enhanced start script that avoids freezing issues:

```
chmod +x start.sh
./start.sh
```

### Option 2: Standard Start with More Memory

If you prefer using npm directly:

```
NODE_OPTIONS='--max-old-space-size=4096' npm start
```

### Troubleshooting

If the application still freezes on startup:

1. Try closing other memory-intensive applications
2. Restart your computer to clear memory
3. Consider increasing the memory limit in `start.sh` if your system has more RAM available

## Development

The Pressly MVP is a platform for connecting designers with print producers in a distributed marketplace.
