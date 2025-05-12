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

## Vercel Deployment Instructions

This application uses a hybrid approach for Vercel deployment:

1. The React frontend is built using `npm run build` and served from the `build` directory
2. The API backend is a simplified Flask app in the `api` directory that only uses minimal dependencies

### Deployment Steps

1. Push code to GitHub
2. Connect to Vercel and select the repository
3. Use the following settings:
   - Framework Preset: Other
   - Build Command: `npm run build`
   - Output Directory: `build`
   - Install Command: `npm install`

The configuration in `vercel.json` handles routing:
- Frontend requests are served from the static build directory
- API requests are routed to the Flask app in the `api` directory

### API Features

The simplified API provides mock data for basic functionality:
- `/api/health` - Status check
- `/api/producers` - List of producers

## Development

The Pressly MVP is a platform for connecting designers with print producers in a distributed marketplace.