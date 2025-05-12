#!/usr/bin/env python3
"""
Fallback HTTP Server for Pressly MVP
"""

import http.server
import socketserver

# Configure the server
PORT = 8000
DIRECTORY = "./static_fallback"

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

# Start the server
print(f"Starting Fallback Server on http://localhost:{PORT}")
print(f"Press Ctrl+C to stop the server")

with socketserver.TCPServer(("", PORT), Handler) as httpd:
    httpd.serve_forever()