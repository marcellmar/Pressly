from http.server import BaseHTTPRequestHandler
import json

# Pure Python without Flask - for Vercel Serverless Functions
class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
        
        if self.path.startswith('/api/health'):
            response = {"status": "ok", "environment": "vercel"}
        elif self.path.startswith('/api/producers'):
            response = [
                {
                    "id": "p1",
                    "businessName": "PrintMaster Studios",
                    "description": "High quality printing services",
                    "capabilities": ["digital", "offset", "large-format"],
                    "rating": 4.8,
                    "verified": True,
                    "location": "Chicago, IL"
                },
                {
                    "id": "p2",
                    "businessName": "Creative Press",
                    "description": "Specialized in creative print solutions",
                    "capabilities": ["digital", "letterpress", "foil-stamping"],
                    "rating": 4.9,
                    "verified": True,
                    "location": "New York, NY"
                },
                {
                    "id": "p3",
                    "businessName": "Rapid Print Solutions",
                    "description": "Fast turnaround on all print jobs",
                    "capabilities": ["digital", "variable-data", "binding"],
                    "rating": 4.7,
                    "verified": True,
                    "location": "Los Angeles, CA"
                }
            ]
        else:
            response = {"message": "Welcome to Pressly API", "version": "1.0.0"}
        
        self.wfile.write(json.dumps(response).encode())
    
    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()