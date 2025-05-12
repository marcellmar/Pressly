from flask import Flask, jsonify

# Create a minimal Flask app for Vercel
app = Flask(__name__)

@app.route('/', methods=['GET'])
def home():
    return jsonify({"status": "ok", "message": "Pressly API is running"})

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({"status": "ok", "environment": "vercel"})

# Simple API route without database dependencies
@app.route('/api/producers/featured', methods=['GET'])
def featured_producers():
    # Return mock data
    mock_producers = [
        {
            "id": "1",
            "businessName": "PrintMaster Studios",
            "description": "High quality printing services",
            "rating": 4.8,
            "verified": True
        },
        {
            "id": "2",
            "businessName": "Creative Press",
            "description": "Specialized in creative print solutions",
            "rating": 4.9,
            "verified": True
        }
    ]
    return jsonify(mock_producers)