from app import app, db

# This is important for initializing the app when run with Gunicorn
# It ensures any initialization code runs when the WSGI app is loaded
with app.app_context():
    # Ensure database tables exist
    db.create_all()

if __name__ == "__main__":
    app.run()
