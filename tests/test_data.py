"""
Test data setup utilities for CyberQuest tests.
"""
import json
from datetime import datetime, timedelta
from typing import Dict, List, Any

class TestDataBuilder:
    """Builder class for creating test data structures."""
    
    def __init__(self):
        self.reset()
    
    def reset(self):
        """Reset the builder to initial state."""
        self.modules = []
        self.test_plans = []
        self.executions = []
        return self
    
    def add_module(self, name: str, test_count: int = 10, 
                   passed: int = 7, failed: int = 2, pending: int = 1) -> 'TestDataBuilder':
        """Add a test module to the data set."""
        module = {
            'module_name': name,
            'total_tests': test_count,
            'passed_tests': passed,
            'failed_tests': failed,
            'pending_tests': pending,
            'pass_rate': round((passed / test_count) * 100, 1) if test_count > 0 else 0
        }
        self.modules.append(module)
        return self
    
    def add_test_plan(self, test_plan_no: str, module_name: str, 
                      status: str = 'pending', priority: str = 'medium',
                      failure_reason: str = None) -> 'TestDataBuilder':
        """Add a test plan to the data set."""
        test_plan = {
            'test_plan_no': test_plan_no,
            'module_name': module_name,
            'status': status,
            'priority': priority,
            'description': f'Test plan for {test_plan_no}',
            'expected_results': f'Expected results for {test_plan_no}',
            'procedure': f'Test procedure for {test_plan_no}'
        }
        
        if failure_reason and status == 'failed':
            test_plan['failure_reason'] = failure_reason
            
        self.test_plans.append(test_plan)
        return self
    
    def add_execution(self, test_plan_no: str, module_name: str, 
                      status: str, executed_by: str = 'admin',
                      days_ago: int = 1) -> 'TestDataBuilder':
        """Add a test execution to the data set."""
        execution_date = datetime.now() - timedelta(days=days_ago)
        
        execution = {
            'test_plan_no': test_plan_no,
            'module_name': module_name,
            'status': status,
            'execution_date': execution_date.isoformat(),
            'executed_by': executed_by
        }
        self.executions.append(execution)
        return self
    
    def build(self) -> Dict[str, Any]:
        """Build and return the complete test data structure."""
        # Calculate summary statistics
        total_tests = sum(module['total_tests'] for module in self.modules)
        passed_tests = sum(module['passed_tests'] for module in self.modules)
        failed_tests = sum(module['failed_tests'] for module in self.modules)
        pending_tests = sum(module['pending_tests'] for module in self.modules)
        
        pass_rate = round((passed_tests / total_tests) * 100, 1) if total_tests > 0 else 0
        
        # Get failed tests
        failed_test_plans = [tp for tp in self.test_plans if tp['status'] == 'failed']
        
        # Get recent executions (last 30 days)
        recent_date = datetime.now() - timedelta(days=30)
        recent_executions = [
            ex for ex in self.executions 
            if datetime.fromisoformat(ex['execution_date']) >= recent_date
        ]
        
        # Sort recent executions by date (newest first)
        recent_executions.sort(
            key=lambda x: datetime.fromisoformat(x['execution_date']), 
            reverse=True
        )
        
        return {
            'summary': {
                'total_tests': total_tests,
                'passed_tests': passed_tests,
                'failed_tests': failed_tests,
                'pending_tests': pending_tests,
                'pass_rate': pass_rate
            },
            'modules': self.modules,
            'failed_tests': failed_test_plans,
            'recent_executions': recent_executions[:10],  # Limit to 10 most recent
            'generated_at': datetime.now().isoformat()
        }

def create_sample_test_data() -> Dict[str, Any]:
    """Create a comprehensive sample test data set."""
    builder = TestDataBuilder()
    
    # Add sample modules
    builder.add_module('Authentication', 15, 12, 2, 1)
    builder.add_module('User Management', 20, 15, 3, 2)
    builder.add_module('Data Processing', 12, 8, 3, 1)
    builder.add_module('API Security', 18, 14, 1, 3)
    builder.add_module('Database Operations', 10, 7, 2, 1)
    
    # Add sample test plans
    test_plans = [
        ('STP-001-01', 'Authentication', 'passed', 'critical'),
        ('STP-001-02', 'Authentication', 'failed', 'high', 'Login timeout after 30 seconds'),
        ('STP-002-01', 'User Management', 'passed', 'medium'),
        ('STP-002-02', 'User Management', 'failed', 'critical', 'Database connection error during user creation'),
        ('STP-003-01', 'Data Processing', 'pending', 'low'),
        ('STP-003-02', 'Data Processing', 'failed', 'medium', 'CSV parsing error with special characters'),
        ('STP-004-01', 'API Security', 'passed', 'critical'),
        ('STP-005-01', 'Database Operations', 'failed', 'high', 'Query timeout during bulk operations')
    ]
    
    for plan_data in test_plans:
        if len(plan_data) == 5:
            builder.add_test_plan(plan_data[0], plan_data[1], plan_data[2], plan_data[3], plan_data[4])
        else:
            builder.add_test_plan(plan_data[0], plan_data[1], plan_data[2], plan_data[3])
    
    # Add sample executions
    executions = [
        ('STP-001-01', 'Authentication', 'passed', 'admin', 1),
        ('STP-001-02', 'Authentication', 'failed', 'admin', 2),
        ('STP-002-01', 'User Management', 'passed', 'testuser', 3),
        ('STP-002-02', 'User Management', 'failed', 'admin', 4),
        ('STP-003-02', 'Data Processing', 'failed', 'admin', 5),
        ('STP-004-01', 'API Security', 'passed', 'testuser', 6),
        ('STP-005-01', 'Database Operations', 'failed', 'admin', 7)
    ]
    
    for exec_data in executions:
        builder.add_execution(*exec_data)
    
    return builder.build()

def save_test_data(data: Dict[str, Any], filename: str = 'test_data.json'):
    """Save test data to a JSON file."""
    with open(filename, 'w') as f:
        json.dump(data, f, indent=2, default=str)

def load_test_data(filename: str = 'test_data.json') -> Dict[str, Any]:
    """Load test data from a JSON file."""
    with open(filename, 'r') as f:
        return json.load(f)

# Page object models for common elements
class ReportsPageElements:
    """Page element selectors for the reports page."""
    
    # Main sections
    SUMMARY_STATISTICS = '[data-testid="summary-statistics"]'
    MODULE_RESULTS = '[data-testid="module-results"]'
    RECENT_EXECUTIONS = '[data-testid="recent-executions"]'
    FAILED_TESTS_ANALYSIS = '[data-testid="failed-tests-analysis"]'
    REPORT_INFO = '[data-testid="report-info"]'
    
    # Statistics cards
    TOTAL_TESTS_CARD = '[data-testid="total-tests-card"]'
    PASSED_TESTS_CARD = '[data-testid="passed-tests-card"]'
    FAILED_TESTS_CARD = '[data-testid="failed-tests-card"]'
    PENDING_TESTS_CARD = '[data-testid="pending-tests-card"]'
    
    # Counts and values
    TOTAL_TESTS_COUNT = '[data-testid="total-tests-count"]'
    PASSED_TESTS_COUNT = '[data-testid="passed-tests-count"]'
    FAILED_TESTS_COUNT = '[data-testid="failed-tests-count"]'
    PENDING_TESTS_COUNT = '[data-testid="pending-tests-count"]'
    PASS_RATE_PERCENTAGE = '[data-testid="pass-rate-percentage"]'
    
    # Module elements
    MODULE_CARD = '[data-testid="module-card"]'
    MODULE_LINK = '[data-testid="module-link"]'
    TEST_COUNT = '[data-testid="test-count"]'
    PASSED_COUNT = '[data-testid="passed-count"]'
    FAILED_COUNT = '[data-testid="failed-count"]'
    PENDING_COUNT = '[data-testid="pending-count"]'
    PROGRESS_BAR = '[data-testid="progress-bar"]'
    PASS_RATE = '[data-testid="pass-rate"]'
    
    # Execution elements
    EXECUTION_ITEM = '[data-testid="execution-item"]'
    TEST_PLAN_NO = '[data-testid="test-plan-no"]'
    STATUS_BADGE = '[data-testid="status-badge"]'
    MODULE_NAME = '[data-testid="module-name"]'
    EXECUTION_DATE = '[data-testid="execution-date"]'
    EXECUTED_BY = '[data-testid="executed-by"]'
    
    # Failed tests elements
    FAILURE_REASON = '[data-testid="failure-reason"]'
    LAST_EXECUTED = '[data-testid="last-executed"]'
    PRIORITY_BADGE = '[data-testid="priority-badge"]'
    ACTIONS_CELL = '[data-testid="actions-cell"]'
    
    # Navigation and actions
    BACK_TO_DASHBOARD = 'a:text("Back to Dashboard")'
    EXPORT_DOCX_BTN = 'button:text("Export DOCX")'
    EXPORT_JSON_BTN = 'button:text("Export JSON")'
    PRINT_REPORT_BTN = 'button:text("Print Report")'
    
    # Generation info
    GENERATION_TIMESTAMP = '[data-testid="generation-timestamp"]'

if __name__ == "__main__":
    # Generate and save sample test data
    sample_data = create_sample_test_data()
    save_test_data(sample_data, 'sample_test_data.json')
    print("Sample test data generated and saved to 'sample_test_data.json'")
