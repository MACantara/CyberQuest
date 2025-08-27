"""
Pytest configuration and fixtures for CyberQuest tests.
"""
import pytest
import asyncio
from playwright.async_api import async_playwright
from typing import Generator, AsyncGenerator
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

@pytest.fixture(scope="session")
def event_loop():
    """Create an instance of the default event loop for the test session."""
    loop = asyncio.get_event_loop_policy().new_event_loop()
    yield loop
    loop.close()

@pytest.fixture(scope="session")
async def browser():
    """Create a browser instance for the test session."""
    async with async_playwright() as playwright:
        browser = await playwright.chromium.launch(
            headless=True,  # Set to False for debugging
            args=['--disable-web-security', '--disable-features=VizDisplayCompositor']
        )
        yield browser
        await browser.close()

@pytest.fixture(scope="function")
async def page(browser):
    """Create a new page for each test."""
    context = await browser.new_context(
        viewport={'width': 1920, 'height': 1080},
        ignore_https_errors=True
    )
    page = await context.new_page()
    yield page
    await context.close()

@pytest.fixture
def base_url():
    """Base URL for the application."""
    return os.getenv('TEST_BASE_URL', 'http://localhost:5000')

@pytest.fixture
async def admin_user(page, base_url):
    """Login as admin user and return the authenticated page."""
    # Navigate to login page
    await page.goto(f"{base_url}/auth/login")
    
    # Fill login form (adjust selectors based on your actual login form)
    await page.fill('input[name="username"]', os.getenv('TEST_ADMIN_USERNAME', 'admin'))
    await page.fill('input[name="password"]', os.getenv('TEST_ADMIN_PASSWORD', 'admin123'))
    
    # Submit login form
    await page.click('button[type="submit"]')
    
    # Wait for successful login (adjust based on your redirect behavior)
    await page.wait_for_url(f"{base_url}/")
    
    return page

@pytest.fixture
async def regular_user(page, base_url):
    """Login as regular user and return the authenticated page."""
    # Navigate to login page
    await page.goto(f"{base_url}/auth/login")
    
    # Fill login form
    await page.fill('input[name="username"]', os.getenv('TEST_USER_USERNAME', 'testuser'))
    await page.fill('input[name="password"]', os.getenv('TEST_USER_PASSWORD', 'test123'))
    
    # Submit login form
    await page.click('button[type="submit"]')
    
    # Wait for successful login
    await page.wait_for_url(f"{base_url}/")
    
    return page

# Test data fixtures
@pytest.fixture
def test_module_data():
    """Sample test module data for testing."""
    return {
        "module_name": "Test Module",
        "total_tests": 10,
        "passed_tests": 7,
        "failed_tests": 2,
        "pending_tests": 1,
        "pass_rate": 70.0
    }

@pytest.fixture
def test_execution_data():
    """Sample test execution data for testing."""
    return {
        "test_plan_no": "STP-001-01",
        "module_name": "Authentication",
        "status": "passed",
        "execution_date": "2025-08-27 10:30:00",
        "executed_by": "admin"
    }

@pytest.fixture
def failed_test_data():
    """Sample failed test data for testing."""
    return {
        "test_plan_no": "STP-002-01",
        "module_name": "User Management",
        "failure_reason": "Database connection timeout during user creation test",
        "last_executed": "2025-08-26 15:45:00",
        "priority": "critical"
    }
