#!/usr/bin/env python3
"""
Simple HTTP Server for Pressly MVP
"""

import http.server
import socketserver
import os

# Configure the server
PORT = 3000
DIRECTORY = "./build"

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)
    
    def end_headers(self):
        # Enable CORS for development testing
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type')
        super().end_headers()
    
    def do_GET(self):
        # Handle SPA routing - redirect all paths to index.html
        if self.path != "/" and "." not in self.path:
            self.path = "/index.html"
        return super().do_GET()

# Start the server
print(f"Starting Pressly server on http://localhost:{PORT}")
print(f"Press Ctrl+C to stop the server")

with socketserver.TCPServer(("", PORT), Handler) as httpd:
    print(f"Serving directory: {os.path.abspath(DIRECTORY)}")
    httpd.serve_forever()