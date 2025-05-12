#!/usr/bin/env python3
"""
Pressly MVP Bypass Server
This script creates a simple server to serve the static files
and bypass the React development server that's freezing.
"""

import http.server
import socketserver
import os
import sys
import webbrowser
from pathlib import Path

# Check which directory to serve from
build_dir = Path("./build")
static_fallback = Path("./static_fallback")

if build_dir.exists():
    print("Found build directory, serving from there...")
    serve_dir = "./build"
elif static_fallback.exists():
    print("Using static fallback website...")
    serve_dir = "./static_fallback"
else:
    print("No suitable directory found. Creating a temporary solution...")
    # Create index.html with a message
    os.makedirs("./temp_static", exist_ok=True)
    with open("./temp_static/index.html", "w") as f:
        f.write("""
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <title>Pressly MVP - Temporary Page</title>
            <style>
                body {
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
                    max-width: 800px;
                    margin: 0 auto;
                    padding: 20px;
                    line-height: 1.6;
                }
                .container {
                    background-color: #f8f9fa;
                    border-radius: 8px;
                    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                    padding: 20px;
                    margin-top: 40px;
                }
                h1 {
                    color: #3a6ea5;
                }
                .btn {
                    display: inline-block;
                    background: #3a6ea5;
                    color: white;
                    border: none;
                    padding: 10px 20px;
                    border-radius: 5px;
                    cursor: pointer;
                    text-decoration: none;
                    margin-top: 20px;
                }
                .code {
                    background: #f1f1f1;
                    padding: 10px;
                    border-radius: 4px;
                    font-family: monospace;
                    margin: 20px 0;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>Pressly MVP</h1>
                <p>The React development server was unable to start due to memory or dependency issues. Here are two options to proceed:</p>
                
                <h2>Option 1: Build the Production Version</h2>
                <p>The fastest way to get Pressly running is to build a production version:</p>
                <div class="code">
                    cd ~/Desktop/pressly-mvp-react-main<br>
                    npm run build<br>
                    python bypass.py
                </div>
                
                <h2>Option 2: Fix Node.js Environment</h2>
                <p>If you need to use the development version for live coding, try:</p>
                <div class="code">
                    cd ~/Desktop/pressly-mvp-react-main<br>
                    rm -rf node_modules<br>
                    npm cache clean --force<br>
                    npm install --legacy-peer-deps
                </div>
                
                <h2>Option 3: Contact Support</h2>
                <p>For further assistance, please contact technical support.</p>
                
                <a href="https://github.com/facebook/create-react-app/issues" class="btn">React App Help</a>
            </div>
        </body>
        </html>
        """)
    serve_dir = "./temp_static"

# Configure the server
PORT = 5001
Handler = http.server.SimpleHTTPRequestHandler

class MyHandler(Handler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=serve_dir, **kwargs)

# Start the server
print(f"Starting Pressly server on http://localhost:{PORT}")
print(f"Press Ctrl+C to stop the server")
try:
    with socketserver.TCPServer(("", PORT), MyHandler) as httpd:
        print("Opening browser...")
        webbrowser.open(f"http://localhost:{PORT}")
        httpd.serve_forever()
except KeyboardInterrupt:
    print("\nServer stopped.")
