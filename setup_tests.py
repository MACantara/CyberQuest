#!/usr/bin/env python3
"""
Setup script for CyberQuest test environment
"""
import subprocess
import sys
import os
from pathlib import Path

def run_command(command, description):
    """Run a command and handle errors."""
    print(f"🔧 {description}...")
    try:
        result = subprocess.run(command, shell=True, check=True, capture_output=True, text=True)
        print(f"✅ {description} completed successfully")
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ {description} failed:")
        print(f"   Error: {e}")
        if e.stdout:
            print(f"   Output: {e.stdout}")
        if e.stderr:
            print(f"   Error output: {e.stderr}")
        return False

def setup_test_environment():
    """Set up the complete test environment."""
    print("🚀 Setting up CyberQuest test environment...")
    print("=" * 60)
    
    # Check Python version
    python_version = sys.version_info
    if python_version < (3, 8):
        print("❌ Python 3.8 or higher is required")
        return False
    
    print(f"✅ Python {python_version.major}.{python_version.minor}.{python_version.micro} detected")
    
    # Install/upgrade pip
    if not run_command(f"{sys.executable} -m pip install --upgrade pip", "Upgrading pip"):
        return False
    
    # Install test dependencies
    test_deps = [
        "pytest",
        "pytest-asyncio", 
        "pytest-html",
        "pytest-cov",
        "playwright",
        "python-dotenv"
    ]
    
    for dep in test_deps:
        if not run_command(f"{sys.executable} -m pip install {dep}", f"Installing {dep}"):
            return False
    
    # Install Playwright browsers
    if not run_command(f"{sys.executable} -m playwright install", "Installing Playwright browsers"):
        print("⚠️  Playwright browser installation failed. You may need to run this manually:")
        print(f"   {sys.executable} -m playwright install")
    
    # Create necessary directories
    directories = ["tests", "reports", "downloads"]
    for directory in directories:
        Path(directory).mkdir(exist_ok=True)
        print(f"📁 Created directory: {directory}")
    
    # Create .env.test file if it doesn't exist
    env_test_path = Path(".env.test")
    if not env_test_path.exists():
        env_example_path = Path(".env.test.example")
        if env_example_path.exists():
            env_test_path.write_text(env_example_path.read_text())
            print("📝 Created .env.test from .env.test.example")
            print("⚠️  Please update .env.test with your actual test credentials")
        else:
            # Create a basic .env.test file
            basic_env = """# Test Environment Configuration
TEST_BASE_URL=http://localhost:5000
TEST_ADMIN_USERNAME=admin
TEST_ADMIN_PASSWORD=admin123
TEST_USER_USERNAME=testuser
TEST_USER_PASSWORD=test123
PLAYWRIGHT_HEADLESS=true
"""
            env_test_path.write_text(basic_env)
            print("📝 Created basic .env.test file")
            print("⚠️  Please update .env.test with your actual test credentials")
    
    print("\n" + "=" * 60)
    print("🎉 Test environment setup completed!")
    print("\nNext steps:")
    print("1. Update .env.test with your actual test credentials")
    print("2. Ensure your application is running on the configured URL")
    print("3. Run tests with: python run_tests.py")
    print("4. Or run specific tests with: python run_tests.py --critical")
    print("\nAvailable test options:")
    print("  --smoke      : Run quick validation tests")
    print("  --critical   : Run critical functionality tests")
    print("  --integration: Run integration tests")
    print("  --headed     : Show browser during tests (useful for debugging)")
    print("  --verbose    : Show detailed test output")
    
    return True

def verify_installation():
    """Verify that all components are installed correctly."""
    print("🔍 Verifying installation...")
    
    # Check pytest
    try:
        import pytest
        print(f"✅ pytest {pytest.__version__} installed")
    except ImportError:
        print("❌ pytest not found")
        return False
    
    # Check playwright
    try:
        import playwright
        print(f"✅ playwright {playwright.__version__} installed")
    except ImportError:
        print("❌ playwright not found")
        return False
    
    # Check if browsers are installed
    try:
        result = subprocess.run([sys.executable, "-m", "playwright", "--help"], 
                              capture_output=True, text=True, check=True)
        print("✅ Playwright CLI available")
    except subprocess.CalledProcessError:
        print("❌ Playwright CLI not working")
        return False
    
    print("✅ All components verified successfully")
    return True

if __name__ == "__main__":
    if len(sys.argv) > 1 and sys.argv[1] == "--verify":
        verify_installation()
    else:
        setup_test_environment()
