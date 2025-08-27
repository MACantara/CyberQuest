# CyberQuest Test Execution Reports - Automated Testing

This directory contains automated tests for the CyberQuest Test Execution Reports functionality using Playwright (Python).

## 📋 Test Coverage

The test suite covers all 30 test cases from the `test-execution-reports-tests.json` test plan:

### 🔐 Security & Authentication (STP-032-02)
- Admin-only access verification
- Non-admin user access restrictions

### 🖥️ User Interface Tests (STP-032-01, 03-04, 12-16, 22-27)
- Page loading and layout
- Header and navigation
- Summary statistics display
- Responsive design
- Dark mode compatibility
- Accessibility compliance
- Icon display and styling

### 📊 Data Display & Analysis (STP-032-05-08, 13, 18, 21-22, 28)
- Module-wise test results
- Recent test executions timeline
- Failed tests analysis
- Progress bar visualization
- Status and priority badge color coding
- Data accuracy and calculations
- Date/time formatting
- Text truncation with tooltips
- Data refresh and currency

### 📤 Export Functionality (STP-032-09-11)
- DOCX export
- JSON export  
- Print report functionality

### 🔧 Integration & Workflow (STP-032-17, 19-20, 29-30)
- Navigation links
- Error handling and recovery
- Performance testing
- Complete analytics workflow
- Integration with test management

## 🚀 Quick Start

### 1. Setup Test Environment

```bash
# Run the setup script
python setup_tests.py

# Or manually install dependencies
pip install pytest pytest-asyncio pytest-html pytest-cov playwright python-dotenv
python -m playwright install
```

### 2. Configure Test Environment

Copy and update the test configuration:

```bash
cp .env.test.example .env.test
```

Update `.env.test` with your actual test credentials:

```env
TEST_BASE_URL=http://localhost:5000
TEST_ADMIN_USERNAME=your_admin_username
TEST_ADMIN_PASSWORD=your_admin_password
TEST_USER_USERNAME=your_regular_username  
TEST_USER_PASSWORD=your_regular_password
```

### 3. Run Tests

```bash
# Run all tests
python run_tests.py

# Run specific test categories
python run_tests.py --critical    # Critical functionality tests
python run_tests.py --smoke       # Quick validation tests
python run_tests.py --integration # Integration tests

# Run with browser visible (for debugging)
python run_tests.py --headed

# Run specific test file
python run_tests.py -f tests/test_execution_reports.py

# Run with verbose output
python run_tests.py --verbose
```

## 📁 File Structure

```
tests/
├── conftest.py                 # Pytest configuration and fixtures
├── test_execution_reports.py   # Main test file with all 30 test cases
├── test_data.py                # Test data utilities and page objects
└── README.md                   # This file

# Configuration files
├── pytest.ini                  # Pytest configuration
├── .env.test.example           # Example test environment config
├── run_tests.py                # Test runner script
└── setup_tests.py              # Environment setup script
```

## 🧪 Test Categories

### Smoke Tests (`--smoke`)
Quick validation of core functionality:
- Page loading
- Authentication
- Basic navigation

### Critical Tests (`--critical`)  
Essential functionality that must work:
- Authentication security
- Data display accuracy
- Export functionality
- Complete workflow

### Integration Tests (`--integration`)
End-to-end workflows:
- Complete analytics workflow
- Navigation integration
- Data consistency across pages

## 📊 Test Reports

After running tests, reports are generated in the `reports/` directory:

- `reports/test_report.html` - Detailed HTML test report
- `reports/coverage/` - Code coverage reports
- `downloads/` - Downloaded files from export tests

## 🔧 Advanced Usage

### Running Specific Tests

```bash
# Run a specific test method
pytest tests/test_execution_reports.py::TestExecutionReports::test_stp_032_01_reports_page_loads -v

# Run tests matching a pattern
pytest -k "authentication" -v

# Run tests with specific markers
pytest -m "security" -v
```

### Debugging Tests

```bash
# Run with browser visible
python run_tests.py --headed --verbose

# Run a single test with maximum verbosity
pytest tests/test_execution_reports.py::TestExecutionReports::test_stp_032_01_reports_page_loads -v -s --headed
```

### Custom Browser

```bash
# Use Firefox
python run_tests.py --browser firefox

# Use WebKit (Safari engine)
python run_tests.py --browser webkit
```

## 🔍 Test Data Management

The `test_data.py` file provides utilities for creating test data:

```python
from tests.test_data import TestDataBuilder, create_sample_test_data

# Create custom test data
builder = TestDataBuilder()
builder.add_module('Custom Module', 10, 8, 1, 1)
builder.add_test_plan('STP-999-01', 'Custom Module', 'passed')
data = builder.build()

# Use predefined sample data
sample_data = create_sample_test_data()
```

## 📝 Page Object Model

The tests use page object patterns for maintainable element selection:

```python
from tests.test_data import ReportsPageElements

# Use predefined selectors
await page.locator(ReportsPageElements.SUMMARY_STATISTICS).to_be_visible()
await page.click(ReportsPageElements.EXPORT_DOCX_BTN)
```

## ⚡ Performance Considerations

- Tests are designed to run efficiently with automatic timeouts
- Large dataset tests verify performance with substantial data
- Network idle waiting ensures complete page loading
- Memory leak detection through multiple reloads

## 🐛 Troubleshooting

### Common Issues

1. **Playwright browsers not installed**
   ```bash
   python -m playwright install
   ```

2. **Authentication failures**
   - Verify credentials in `.env.test`
   - Ensure test user accounts exist in your system
   - Check if admin privileges are properly configured

3. **Application not running**
   - Ensure your CyberQuest application is running on the configured URL
   - Verify the TEST_BASE_URL in `.env.test`

4. **Test timeouts**
   - Increase timeouts in `conftest.py` if your system is slower
   - Check for console errors in the browser

5. **File download issues**
   - Ensure `downloads/` directory exists and is writable
   - Check browser permissions for file downloads

### Debug Mode

Run tests in debug mode to see detailed browser interactions:

```bash
# Enable debug logging
PYTEST_VERBOSE=1 python run_tests.py --headed --verbose

# Run with Playwright debug mode
PWDEBUG=1 pytest tests/test_execution_reports.py::TestExecutionReports::test_stp_032_01_reports_page_loads
```

## 🔄 Continuous Integration

The tests are designed to work in CI/CD environments:

```yaml
# Example GitHub Actions configuration
- name: Install dependencies
  run: |
    pip install -r requirements.txt
    python setup_tests.py

- name: Run tests  
  run: |
    python run_tests.py --verbose
  env:
    TEST_BASE_URL: ${{ secrets.TEST_BASE_URL }}
    TEST_ADMIN_USERNAME: ${{ secrets.TEST_ADMIN_USERNAME }}
    TEST_ADMIN_PASSWORD: ${{ secrets.TEST_ADMIN_PASSWORD }}
```

## 📈 Extending Tests

To add new tests:

1. Add the test method to `TestExecutionReports` class
2. Follow the naming convention: `test_stp_032_XX_description`
3. Use appropriate markers (`@pytest.mark.critical`, etc.)
4. Add page elements to `ReportsPageElements` if needed
5. Update this README with new test coverage

## 📞 Support

For issues or questions about the test suite:

1. Check the troubleshooting section above
2. Review the test output and logs in `reports/`
3. Verify your environment configuration
4. Ensure the application is running and accessible

The test suite is designed to be comprehensive, maintainable, and reliable for continuous validation of the Test Execution Reports functionality.
