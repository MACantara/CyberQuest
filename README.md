# Flask Website Template

A modern, production-ready Flask website template featuring comprehensive authentication, admin panel, and responsive design.

## ✨ Key Features

- **🏗️ Modern Architecture**: Flask factory pattern with blueprints
- **🎨 Responsive Design**: Tailwind CSS with Bootstrap Icons
- **🔐 Complete Authentication**: Registration, login, password reset, email verification
- **👥 Admin Panel**: User management, system monitoring, security logs
- **🛡️ Advanced Security**: Account lockout, rate limiting, hCaptcha integration
- **🌓 Theme System**: Light/Dark/System modes with persistent preferences
- **📧 Email Integration**: Contact forms, password reset, verification emails
- **📋 Legal Compliance**: Privacy policy, terms of service, cookie policy
- **🚀 Deployment Ready**: Vercel serverless and traditional hosting support

## 🚀 Quick Start

### 1. Clone Repository
```bash
git clone <repository-url>
cd flask-website-template
```

### 2. Create Virtual Environment
```bash
python -m venv venv
```

### 3. Activate Virtual Environment
```bash
# On Windows
venv\Scripts\activate

# On macOS/Linux
source venv/bin/activate
```

### 4. Install Dependencies
```bash
pip install -r requirements.txt
```

### 2. Configuration
```bash
cp .env.template .env
# Edit .env with your settings
```

### 3. Initialize Database
```bash
flask db init
flask db migrate -m "Initial migration"
flask db upgrade
```

### 4. Run Application
```bash
python run.py
```

Visit `http://localhost:5000` to view the website.

## 📚 Documentation

### Core Documentation
- **[Authentication System](docs/AUTHENTICATION.md)** - Complete authentication with email verification
- **[Admin Panel](docs/ADMIN_PANEL.md)** - User management and system monitoring
- **[hCaptcha Integration](docs/HCAPTCHA.md)** - Bot protection and security
- **[Deployment Guide](docs/DEPLOYMENT.md)** - Vercel, VPS, and production deployment

### Features Overview

#### 🔐 Authentication & Security
- User registration with mandatory email verification
- Secure login with username or email
- Password reset functionality
- Account lockout protection (IP-based)
- Argon2 password hashing
- Session management with security headers

#### 👥 Admin Panel
- **Default Login**: username: `admin`, password: `admin123` ⚠️ *Change in production!*
- User management (activate/deactivate, admin privileges)
- Real-time dashboard with statistics
- Security logs and monitoring
- Automated cleanup tools
- Contact form management

#### 🛡️ Security Features
- **Account Lockout**: 5 failed attempts = 15-minute lockout (configurable)
- **hCaptcha Protection**: Bot prevention on forms
- **Rate Limiting**: IP-based request limiting
- **CSRF Protection**: Built-in CSRF protection
- **Secure Headers**: Security headers for production

#### 📧 Email Verification System
- **Verification Pending Page**: Clear instructions and status
- **Auto-refresh**: Automatic verification status checking
- **Resend Functionality**: Easy verification email resending
- **Login Blocking**: Prevents login until email verified
- **24-hour Expiration**: Secure, time-limited tokens

#### 🌓 Theme System
- **Light Mode**: Clean, bright interface
- **Dark Mode**: Modern dark theme
- **System Mode**: Follows OS theme preference
- **Persistent Settings**: Saved in localStorage
- **Smooth Transitions**: Elegant theme switching

## 🔧 Environment Configuration

### Required Variables
```bash
# Core Settings
FLASK_ENV=development
DEBUG=True
SECRET_KEY=your-secret-key

# Database
DATABASE_URL=sqlite:///app.db

# Email Configuration
MAIL_SERVER=smtp.gmail.com
MAIL_PORT=587
MAIL_USE_TLS=true
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-app-password

# Security Settings
MAX_LOGIN_ATTEMPTS=5
LOGIN_LOCKOUT_MINUTES=15

# hCaptcha (optional)
HCAPTCHA_ENABLED=true
HCAPTCHA_SITE_KEY=your-site-key
HCAPTCHA_SECRET_KEY=your-secret-key
```

## 📁 Project Structure

```
flask-website-template/
├── app/                          # Main application package
│   ├── models/                   # Database models
│   ├── routes/                   # Application routes
│   ├── static/                   # Static files (CSS, JS, images)
│   │   ├── css/                  # CSS files
│   │   ├── images/               # Image files
│   │   └── js/                   # JavaScript files
│   │       ├── components/       # Reusable JavaScript components
│   │       ├── utils/            # Utility JavaScript files
│   │       │   ├── pagination/   # Pagination utilities
│   │       │   └── theme/        # Theme utilities
│   │       └── main.js           # Main JavaScript file
│   ├── templates/                # HTML templates
│   │   ├── admin/                # Admin panel templates
│   │   ├── auth/                 # Authentication templates
│   │   ├── partials/             # Reusable template components
│   │   │   ├── admin/            # Admin panel components
│   │   │   │   ├── dashboard/    # Admin dashboard components
│   │   │   │   ├── logs/         # Admin logs components
│   │   │   │   ├── user-details/ # User details components
│   │   │   │   └── users/        # User management components
│   │   │   ├── shared/           # Shared components
│   │   │   ├── footer.html       # Footer component
│   │   │   └── navbar.html       # Navbar component
│   │   ├── password/             # Password reset templates
│   │   ├── policy-pages/         # Policy page templates
│   │   ├── profile/              # Profile templates
│   │   ├── about.html            # About page template
│   │   ├── base.html             # Base template
│   │   ├── contact.html          # Contact page template
│   │   └── home.html             # Home page template
│   ├── utils/                    # Utility modules
│   └── __init__.py               # Application factory
├── docs/                         # Documentation files
├── instance/                     # Instance-specific files
├── migrations/                   # Database migrations
├── .env.template                 # Environment variables template
├── .gitignore                    # Git ignore file
├── .vercelignore                 # Vercel ignore file
├── config.py                     # Configuration
├── LICENSE                       # MIT License file
├── README.md                     # Project README
├── requirements.txt              # Dependencies
├── run.py                        # Application entry point
└── vercel.json                   # Vercel deployment config
```

## 🚀 Deployment Options

### Vercel (Serverless)
- **One-click Deploy**: Automatic detection and deployment
- **Environment Adaptation**: Auto-disables database features
- **Contact Form**: Logs submissions instead of database storage
- **Zero Configuration**: Works out of the box

### Traditional Hosting
- **Full Features**: Complete database and authentication
- **VPS/Dedicated**: Full control and customization
- **Shared Hosting**: Basic hosting compatibility

See the [Deployment Guide](docs/DEPLOYMENT.md) for detailed instructions.

## 🛡️ Security in Production

### Essential Steps
1. **Change Default Credentials**: Update admin username/password
2. **Configure HTTPS**: Essential for secure cookies and authentication
3. **Set Strong Secret Key**: Use a cryptographically secure secret
4. **Enable hCaptcha**: Protect forms from bot submissions
5. **Configure Email**: Set up production email service
6. **Monitor Logs**: Regular review of security and access logs

### Production Checklist
- [ ] HTTPS configured with valid SSL certificate
- [ ] Environment variables secured
- [ ] Default admin credentials changed
- [ ] Database credentials secured
- [ ] Email service configured
- [ ] hCaptcha enabled and configured
- [ ] Security headers configured
- [ ] Backup strategy implemented
- [ ] Monitoring and alerting set up

## 🔨 Technologies

- **Backend**: Python Flask, SQLAlchemy, Flask-Migrate
- **Frontend**: Tailwind CSS, Bootstrap Icons, Vanilla JavaScript
- **Database**: SQLite (dev), PostgreSQL/MySQL (production)
- **Security**: Argon2, Flask-WTF, hCaptcha
- **Email**: Flask-Mail with SMTP support
- **Deployment**: Vercel, traditional hosting

## 📝 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📞 Support

- **Documentation**: Check the [docs/](docs/) directory for detailed guides
- **Issues**: Open an issue on GitHub for bug reports or feature requests
- **Email**: Contact form available in the application

---

**⚡ Quick Deploy**: [![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/MACantara/flask-website-template)