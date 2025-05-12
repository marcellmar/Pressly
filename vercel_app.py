from flask import Flask, jsonify

# Create a much simpler Flask app for Vercel
app = Flask(__name__)

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({"status": "ok", "environment": "vercel"})

@app.route('/api/version', methods=['GET'])
def version():
    return jsonify({"version": "1.0.0"})

# Simple API route that doesn't require database
@app.route('/api/producers/featured', methods=['GET'])
def featured_producers():
    # Return mock data instead of using database
    mock_producers = [
        {
            "id": "1",
            "businessName": "PrintMaster Studios",
            "description": "High quality printing services",
            "capabilities": {"capabilities": ["digital", "offset", "large-format"]},
            "rating": 4.8,
            "verified": True,
            "joinedAt": "2023-01-15T00:00:00",
            "fullName": "John Smith"
        },
        {
            "id": "2",
            "businessName": "Creative Press",
            "description": "Specialized in creative print solutions",
            "capabilities": {"capabilities": ["digital", "letterpress", "foil-stamping"]},
            "rating": 4.9,
            "verified": True,
            "joinedAt": "2023-02-20T00:00:00",
            "fullName": "Jane Doe"
        }
    ]
    return jsonify(mock_producers)

if __name__ == '__main__':
    app.run(debug=True)