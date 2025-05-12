import os
from app import app, db

print("Initializing Pressly application...")

# Ensure upload directory exists
upload_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'static/uploads')
os.makedirs(upload_dir, exist_ok=True)
print(f"Upload directory created/verified at: {upload_dir}")

# Create database tables
with app.app_context():
    db.create_all()
    print("Database tables created successfully")

print("Pressly initialization complete!")
