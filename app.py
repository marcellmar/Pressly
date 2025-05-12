from flask import Flask, render_template, request, redirect, url_for, flash, session, jsonify
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
from werkzeug.utils import secure_filename
from datetime import datetime
import os
import uuid
from flask_cors import CORS

# Initialize Flask app
app = Flask(__name__)
CORS(app)  # Enable CORS for React frontend

# Configuration
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'dev-key-for-pressly')
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL', 'sqlite:///pressly.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['UPLOAD_FOLDER'] = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'static/uploads')
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max upload
app.config['ALLOWED_EXTENSIONS'] = {'png', 'jpg', 'jpeg', 'gif', 'pdf', 'ai', 'psd', 'eps', 'svg'}

# Ensure the upload directory exists
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

# Initialize database
db = SQLAlchemy(app)

# Models
class User(db.Model):
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)
    full_name = db.Column(db.String(100), nullable=False)
    phone = db.Column(db.String(20), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    is_active = db.Column(db.Boolean, default=True)
    user_type = db.Column(db.String(20), nullable=False)  # 'designer' or 'producer'
    
    # Relationships based on user type
    designer = db.relationship('Designer', backref='user', uselist=False, cascade='all, delete-orphan')
    producer = db.relationship('Producer', backref='user', uselist=False, cascade='all, delete-orphan')

class Designer(db.Model):
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = db.Column(db.String(36), db.ForeignKey('user.id'), nullable=False)
    brand_name = db.Column(db.String(100), nullable=True)
    bio = db.Column(db.Text, nullable=True)
    portfolio_url = db.Column(db.String(255), nullable=True)
    design_preferences = db.Column(db.JSON, nullable=True)
    rating = db.Column(db.Float, default=0.0)
    joined_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationships
    designs = db.relationship('Design', backref='designer', lazy=True, cascade='all, delete-orphan')

class Producer(db.Model):
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = db.Column(db.String(36), db.ForeignKey('user.id'), nullable=False)
    business_name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=True)
    production_capabilities = db.Column(db.JSON, nullable=True)
    rating = db.Column(db.Float, default=0.0)
    verified = db.Column(db.Boolean, default=False)
    joined_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationships
    orders = db.relationship('Order', backref='producer', lazy=True)

class Design(db.Model):
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    designer_id = db.Column(db.String(36), db.ForeignKey('designer.id'), nullable=False)
    title = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=True)
    specifications = db.Column(db.JSON, nullable=True)
    status = db.Column(db.String(20), default='draft')  # draft, active, archived
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    is_active = db.Column(db.Boolean, default=True)
    licensing_terms = db.Column(db.JSON, nullable=True)
    file_path = db.Column(db.String(255), nullable=True)  # Path to uploaded design file
    
    # Relationships
    product_listings = db.relationship('ProductListing', backref='design', lazy=True, cascade='all, delete-orphan')

class ProductListing(db.Model):
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    design_id = db.Column(db.String(36), db.ForeignKey('design.id'), nullable=False)
    sku = db.Column(db.String(50), unique=True, nullable=False)
    base_price = db.Column(db.Float, nullable=False)
    available_sizes = db.Column(db.JSON, nullable=True)
    available_colors = db.Column(db.JSON, nullable=True)
    printing_requirements = db.Column(db.JSON, nullable=True)
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    orders = db.relationship('Order', backref='product_listing', lazy=True)

class Order(db.Model):
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    customer_id = db.Column(db.String(36), db.ForeignKey('user.id'), nullable=False)
    producer_id = db.Column(db.String(36), db.ForeignKey('producer.id'), nullable=False)
    product_listing_id = db.Column(db.String(36), db.ForeignKey('product_listing.id'), nullable=False)
    total_amount = db.Column(db.Float, nullable=False)
    status = db.Column(db.String(20), default='pending')  # pending, in_production, shipped, delivered, dispute
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    shipping_details = db.Column(db.JSON, nullable=True)
    payment_details = db.Column(db.JSON, nullable=True)

class Message(db.Model):
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    sender_id = db.Column(db.String(36), db.ForeignKey('user.id'), nullable=False)
    receiver_id = db.Column(db.String(36), db.ForeignKey('user.id'), nullable=False)
    order_id = db.Column(db.String(36), db.ForeignKey('order.id'), nullable=True)
    content = db.Column(db.Text, nullable=False)
    sent_at = db.Column(db.DateTime, default=datetime.utcnow)
    is_read = db.Column(db.Boolean, default=False)

# Helper functions
def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in app.config['ALLOWED_EXTENSIONS']

# Routes
@app.route('/')
def index():
    return render_template('index.html')

@app.route('/register', methods=['GET', 'POST'])
def register():
    # We'll use client-side localStorage for user registration in this version
    return render_template('register.html')

@app.route('/login', methods=['GET', 'POST'])
def login():
    # We'll use client-side localStorage for authentication in this version
    return render_template('login.html')

@app.route('/logout')
def logout():
    # We'll use client-side localStorage for authentication in this version
    return redirect(url_for('index'))

@app.route('/designer/dashboard')
def designer_dashboard():
    # Authentication is handled client-side using localStorage in this version
    return render_template('designer_dashboard.html')

@app.route('/producer/dashboard')
def producer_dashboard():
    # Authentication is handled client-side using localStorage in this version
    return render_template('producer_dashboard.html')

@app.route('/designs', methods=['GET', 'POST'])
def designs():
    # Authentication is handled client-side using localStorage in this version
    return render_template('designs.html', designs=[])

@app.route('/producers')
def producers():
    # Authentication is handled client-side using localStorage in this version
    return render_template('producers.html', producers=[])

@app.route('/messages')
def messages():
    # Authentication is handled client-side using localStorage in this version
    return render_template('messages.html')

@app.route('/capacity', methods=['GET', 'POST'])
def capacity():
    # Authentication is handled client-side using localStorage in this version
    return render_template('capacity.html')

# API routes for React frontend

# Enhanced Producer routes
@app.route('/api/producers', methods=['GET'])
def api_producers():
    producers = Producer.query.all()
    result = []
    
    for producer in producers:
        user = User.query.get(producer.user_id)
        result.append({
            'id': producer.id,
            'businessName': producer.business_name,
            'description': producer.description,
            'capabilities': producer.production_capabilities,
            'rating': producer.rating,
            'verified': producer.verified,
            'joinedAt': producer.joined_at.isoformat(),
            'email': user.email if user else None,
            'fullName': user.full_name if user else None,
            'phone': user.phone if user else None
        })
    
    return jsonify(result)

@app.route('/api/producers/<producer_id>', methods=['GET'])
def api_producer(producer_id):
    producer = Producer.query.get(producer_id)
    
    if not producer:
        return jsonify({'success': False, 'message': 'Producer not found'}), 404
    
    user = User.query.get(producer.user_id)
    
    result = {
        'id': producer.id,
        'businessName': producer.business_name,
        'description': producer.description,
        'capabilities': producer.production_capabilities,
        'rating': producer.rating,
        'verified': producer.verified,
        'joinedAt': producer.joined_at.isoformat(),
        'email': user.email if user else None,
        'fullName': user.full_name if user else None,
        'phone': user.phone if user else None
    }
    
    return jsonify(result)

@app.route('/api/producers/search', methods=['POST'])
def api_producers_search():
    data = request.json
    query = data.get('query', '')
    capabilities = data.get('capabilities', [])
    location = data.get('location', 'all')
    
    # Base query
    producers_query = Producer.query
    
    # Apply filters
    if query:
        producers_query = producers_query.filter(Producer.business_name.ilike(f'%{query}%') | 
                                              Producer.description.ilike(f'%{query}%'))
    
    # Execute query
    producers = producers_query.all()
    result = []
    
    for producer in producers:
        user = User.query.get(producer.user_id)
        
        # Filter by capabilities (if producer.production_capabilities is a dict with a 'capabilities' key)
        if capabilities and producer.production_capabilities and 'capabilities' in producer.production_capabilities:
            producer_capabilities = producer.production_capabilities.get('capabilities', [])
            if not any(capability in producer_capabilities for capability in capabilities):
                continue
        
        result.append({
            'id': producer.id,
            'businessName': producer.business_name,
            'description': producer.description,
            'capabilities': producer.production_capabilities,
            'rating': producer.rating,
            'verified': producer.verified,
            'joinedAt': producer.joined_at.isoformat(),
            'fullName': user.full_name if user else None
        })
    
    return jsonify(result)

@app.route('/api/register', methods=['POST'])
def api_register():
    data = request.json
    
    # Same logic as register route but returns JSON
    existing_user = User.query.filter_by(email=data.get('email')).first()
    if existing_user:
        return jsonify({'success': False, 'message': 'Email already registered'}), 400
    
    # Create new user
    new_user = User(
        email=data.get('email'),
        password_hash=generate_password_hash(data.get('password')),
        full_name=data.get('fullName'),
        phone=data.get('phone'),
        user_type=data.get('userType')
    )
    
    db.session.add(new_user)
    db.session.flush()
    
    if data.get('userType') == 'designer':
        new_designer = Designer(user_id=new_user.id)
        db.session.add(new_designer)
    elif data.get('userType') == 'producer':
        new_producer = Producer(
            user_id=new_user.id,
            business_name=data.get('businessName', '')
        )
        db.session.add(new_producer)
    
    db.session.commit()
    
    return jsonify({'success': True, 'message': 'Registration successful'})

@app.route('/api/login', methods=['POST'])
def api_login():
    data = request.json
    
    user = User.query.filter_by(email=data.get('email')).first()
    
    if user and check_password_hash(user.password_hash, data.get('password')):
        return jsonify({
            'success': True,
            'user': {
                'id': user.id,
                'email': user.email,
                'fullName': user.full_name,
                'userType': user.user_type
            }
        })
    else:
        return jsonify({'success': False, 'message': 'Invalid credentials'}), 401

# Initialize the database
with app.app_context():
    db.create_all()

# Error handlers
@app.errorhandler(404)
def page_not_found(e):
    return render_template('404.html'), 404

@app.errorhandler(500)
def server_error(e):
    return render_template('500.html'), 500

# For running locally
if __name__ == '__main__':
    app.run(debug=True)
