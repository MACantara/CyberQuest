import os
from app import create_app

# Create app with automatic configuration detection
app = create_app()

if __name__ == '__main__':
    app.run(debug=app.config.get('DEBUG', True))
