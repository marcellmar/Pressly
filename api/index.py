from flask import Flask, jsonify, Response
from http.server import BaseHTTPRequestHandler

app = Flask(__name__)

# Flask application logic
@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({"status": "ok", "environment": "vercel"})

@app.route('/api/producers', methods=['GET'])
def get_producers():
    producers = [
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
    return jsonify(producers)

# For Vercel serverless functions
class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        self.send_response(200)
        self.send_header('Content-type', 'application/json')
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
        
        import json
        self.wfile.write(json.dumps(response).encode())