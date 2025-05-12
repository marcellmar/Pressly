from flask import Flask, jsonify, Response

app = Flask(__name__)

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

@app.route('/api')
def api_index():
    return jsonify({
        "message": "Welcome to Pressly API",
        "version": "1.0.0",
        "endpoints": [
            "/api/health",
            "/api/producers"
        ]
    })

# Default route for Vercel
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def catch_all(path):
    return Response("Pressly API Service - Frontend is served separately", mimetype="text/plain")