#!/usr/bin/env python3
"""
Test runner script for CyberQuest Test Execution Reports
"""
import os
import sys
import subprocess
import argparse
from pathlib import Path

def install_playwright():
    """Install Playwright browsers if not already installed."""
    print("Installing Playwright browsers...")
    try:
        subprocess.run([sys.executable, "-m", "playwright", "install"], check=True)
        print("✅ Playwright browsers installed successfully")
    except subprocess.CalledProcessError as e:
        print(f"❌ Failed to install Playwright browsers: {e}")
        return False
    return True

def run_tests(test_file=None, markers=None, verbose=False, headless=True, browser="chromium"):
    """Run the test suite with specified options."""
    
    # Ensure we're in the project root directory
    project_root = Path(__file__).parent
    os.chdir(project_root)
    
    # Set environment variables for testing
    os.environ.setdefault("PLAYWRIGHT_HEADLESS", str(headless).lower())
    os.environ.setdefault("PLAYWRIGHT_BROWSER", browser)
    
    # Build pytest command
    cmd = [sys.executable, "-m", "pytest"]
    
    if test_file:
        cmd.append(test_file)
    else:
        cmd.append("tests/test_execution_reports.py")
    
    if markers:
        cmd.extend(["-m", markers])
    
    if verbose:
        cmd.append("-v")
    else:
        cmd.append("-q")
    
    # Add additional options
    cmd.extend([
        "--tb=short",
        "--asyncio-mode=auto",
        "--html=reports/test_report.html",
        "--self-contained-html"
    ])
    
    print(f"Running command: {' '.join(cmd)}")
    print("=" * 60)
    
    try:
        result = subprocess.run(cmd, check=False)
        return result.returncode == 0
    except KeyboardInterrupt:
        print("\n❌ Tests interrupted by user")
        return False
    except Exception as e:
        print(f"❌ Error running tests: {e}")
        return False

def main():
    """Main function to handle command line arguments and run tests."""
    parser = argparse.ArgumentParser(description="Run CyberQuest Test Execution Reports tests")
    
    parser.add_argument(
        "--test-file", "-f",
        help="Specific test file to run (default: tests/test_execution_reports.py)",
        default=None
    )
    
    parser.add_argument(
        "--markers", "-m",
        help="Pytest markers to filter tests (e.g., 'critical', 'smoke', 'not slow')",
        default=None
    )
    
    parser.add_argument(
        "--verbose", "-v",
        action="store_true",
        help="Run tests in verbose mode"
    )
    
    parser.add_argument(
        "--headed",
        action="store_true",
        help="Run tests in headed mode (show browser)"
    )
    
    parser.add_argument(
        "--browser", "-b",
        choices=["chromium", "firefox", "webkit"],
        default="chromium",
        help="Browser to use for testing (default: chromium)"
    )
    
    parser.add_argument(
        "--install-browsers",
        action="store_true",
        help="Install Playwright browsers before running tests"
    )
    
    parser.add_argument(
        "--smoke",
        action="store_true",
        help="Run only smoke tests (quick validation)"
    )
    
    parser.add_argument(
        "--critical",
        action="store_true",
        help="Run only critical tests"
    )
    
    parser.add_argument(
        "--integration",
        action="store_true",
        help="Run only integration tests"
    )
    
    args = parser.parse_args()
    
    # Create reports directory if it doesn't exist
    Path("reports").mkdir(exist_ok=True)
    Path("downloads").mkdir(exist_ok=True)
    
    # Install browsers if requested
    if args.install_browsers:
        if not install_playwright():
            return 1
    
    # Set markers based on flags
    markers = args.markers
    if args.smoke:
        markers = "smoke"
    elif args.critical:
        markers = "critical"
    elif args.integration:
        markers = "integration"
    
    # Run tests
    headless = not args.headed
    success = run_tests(
        test_file=args.test_file,
        markers=markers,
        verbose=args.verbose,
        headless=headless,
        browser=args.browser
    )
    
    if success:
        print("✅ All tests passed!")
        return 0
    else:
        print("❌ Some tests failed. Check the output above for details.")
        return 1

if __name__ == "__main__":
    sys.exit(main())
