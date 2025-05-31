import os
from app import create_app

# Get configuration from environment variable
config_name = os.environ.get('FLASK_ENV', 'development')
app = create_app(config_name)

if __name__ == '__main__':
    app.run(debug=app.config.get('DEBUG', True))
