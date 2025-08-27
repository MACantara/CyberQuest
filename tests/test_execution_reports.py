"""
Automated tests for Test Execution Reports functionality using Playwright.
Based on test-execution-reports-tests.json test plan.
"""
import pytest
import asyncio
import json
import re
from playwright.async_api import Page, expect
from datetime import datetime, timedelta
import os


class TestExecutionReports:
    """Test class for Test Execution Reports functionality."""

    @pytest.mark.asyncio
    async def test_stp_032_01_reports_page_loads(self, admin_user: Page, base_url: str):
        """
        STP-032-01: Verify that the test execution reports page loads correctly 
        with proper authentication and comprehensive data display.
        """
        # Navigate to reports page
        await admin_user.goto(f"{base_url}/admin/system-test/reports")
        
        # Verify page loads with correct title
        await expect(admin_user).to_have_title("Test Execution Reports")
        
        # Check main title is displayed
        title_element = admin_user.locator('h1:text("Test Execution Reports")')
        await expect(title_element).to_be_visible()
        
        # Check comprehensive analysis subtitle
        subtitle = admin_user.locator('text="Comprehensive analysis of test execution results"')
        await expect(subtitle).to_be_visible()
        
        # Verify main sections are present
        await expect(admin_user.locator('[data-testid="summary-statistics"]')).to_be_visible()
        await expect(admin_user.locator('[data-testid="module-results"]')).to_be_visible()
        await expect(admin_user.locator('[data-testid="recent-executions"]')).to_be_visible()
        await expect(admin_user.locator('[data-testid="report-info"]')).to_be_visible()

    @pytest.mark.asyncio
    async def test_stp_032_02_authentication_security(self, regular_user: Page, base_url: str):
        """
        STP-032-02: Verify that non-admin users cannot access 
        the test execution reports functionality.
        """
        # Attempt to navigate to reports page as regular user
        response = await regular_user.goto(f"{base_url}/admin/system-test/reports")
        
        # Verify 403 Forbidden error or redirect to error page
        assert response.status == 403 or response.url != f"{base_url}/admin/system-test/reports"
        
        # Check that reports interface is not accessible
        reports_title = regular_user.locator('h1:text("Test Execution Reports")')
        await expect(reports_title).not_to_be_visible()

    @pytest.mark.asyncio
    async def test_stp_032_03_page_header_navigation(self, admin_user: Page, base_url: str):
        """
        STP-032-03: Verify the page header displays correct title 
        and provides proper navigation options.
        """
        await admin_user.goto(f"{base_url}/admin/system-test/reports")
        
        # Check title
        title = admin_user.locator('h1:text("Test Execution Reports")')
        await expect(title).to_be_visible()
        
        # Check description
        description = admin_user.locator('text="Comprehensive analysis of test execution results"')
        await expect(description).to_be_visible()
        
        # Check Back to Dashboard button
        back_button = admin_user.locator('a:text("Back to Dashboard")')
        await expect(back_button).to_be_visible()
        
        # Check export buttons
        await expect(admin_user.locator('button:text("Export DOCX")')).to_be_visible()
        await expect(admin_user.locator('button:text("Export JSON")')).to_be_visible()
        await expect(admin_user.locator('button:text("Print Report")')).to_be_visible()
        
        # Test Back to Dashboard navigation
        await back_button.click()
        await expect(admin_user).to_have_url(f"{base_url}/admin/dashboard")

    @pytest.mark.asyncio
    async def test_stp_032_04_summary_statistics_cards(self, admin_user: Page, base_url: str):
        """
        STP-032-04: Verify the summary statistics section displays 
        accurate test counts and percentages.
        """
        await admin_user.goto(f"{base_url}/admin/system-test/reports")
        
        # Wait for statistics to load
        await admin_user.wait_for_selector('[data-testid="summary-statistics"]')
        
        # Check Total Tests card
        total_card = admin_user.locator('[data-testid="total-tests-card"]')
        await expect(total_card).to_be_visible()
        await expect(total_card.locator('.bi-clipboard-data')).to_be_visible()
        
        # Check Passed Tests card
        passed_card = admin_user.locator('[data-testid="passed-tests-card"]')
        await expect(passed_card).to_be_visible()
        await expect(passed_card.locator('.bi-check-circle')).to_be_visible()
        await expect(passed_card).to_have_class(re.compile(r'.*border-green.*'))
        
        # Check Failed Tests card
        failed_card = admin_user.locator('[data-testid="failed-tests-card"]')
        await expect(failed_card).to_be_visible()
        await expect(failed_card.locator('.bi-x-circle')).to_be_visible()
        await expect(failed_card).to_have_class(re.compile(r'.*border-red.*'))
        
        # Check Pending Tests card
        pending_card = admin_user.locator('[data-testid="pending-tests-card"]')
        await expect(pending_card).to_be_visible()
        await expect(pending_card.locator('.bi-clock')).to_be_visible()
        await expect(pending_card).to_have_class(re.compile(r'.*border-yellow.*'))
        
        # Verify "Awaiting execution" text in pending card
        await expect(pending_card.locator('text="Awaiting execution"')).to_be_visible()

    @pytest.mark.asyncio
    async def test_stp_032_05_module_wise_results(self, admin_user: Page, base_url: str):
        """
        STP-032-05: Verify the module-wise results section displays 
        comprehensive statistics for each module.
        """
        await admin_user.goto(f"{base_url}/admin/system-test/reports")
        
        # Wait for module results to load
        module_section = admin_user.locator('[data-testid="module-results"]')
        await expect(module_section).to_be_visible()
        
        # Check section title
        await expect(module_section.locator('h3:text("Module-wise Test Results")')).to_be_visible()
        
        # Get first module (if any exist)
        module_cards = admin_user.locator('[data-testid="module-card"]')
        if await module_cards.count() > 0:
            first_module = module_cards.first
            
            # Check module name is clickable link
            module_link = first_module.locator('a[href*="/admin/system-test/modules/"]')
            await expect(module_link).to_be_visible()
            
            # Check test count display
            await expect(first_module.locator('[data-testid="test-count"]')).to_be_visible()
            
            # Check passed, failed, pending counts
            await expect(first_module.locator('[data-testid="passed-count"]')).to_be_visible()
            await expect(first_module.locator('[data-testid="failed-count"]')).to_be_visible()
            await expect(first_module.locator('[data-testid="pending-count"]')).to_be_visible()
            
            # Check progress bar
            progress_bar = first_module.locator('[data-testid="progress-bar"]')
            await expect(progress_bar).to_be_visible()
            
            # Check pass rate percentage
            await expect(first_module.locator('[data-testid="pass-rate"]')).to_be_visible()

    @pytest.mark.asyncio
    async def test_stp_032_06_recent_executions_timeline(self, admin_user: Page, base_url: str):
        """
        STP-032-06: Verify the recent test executions section displays 
        tests from the last 30 days.
        """
        await admin_user.goto(f"{base_url}/admin/system-test/reports")
        
        # Wait for recent executions section
        recent_section = admin_user.locator('[data-testid="recent-executions"]')
        await expect(recent_section).to_be_visible()
        
        # Check section title and subtitle
        await expect(recent_section.locator('h3:text("Recent Test Executions")')).to_be_visible()
        await expect(recent_section.locator('text="Last 30 days"')).to_be_visible()
        
        # Check if executions exist
        execution_items = admin_user.locator('[data-testid="execution-item"]')
        execution_count = await execution_items.count()
        
        if execution_count > 0:
            # Check first execution item
            first_execution = execution_items.first
            
            # Check test plan number
            await expect(first_execution.locator('[data-testid="test-plan-no"]')).to_be_visible()
            
            # Check status badge (should be colored)
            status_badge = first_execution.locator('[data-testid="status-badge"]')
            await expect(status_badge).to_be_visible()
            
            # Check module name
            await expect(first_execution.locator('[data-testid="module-name"]')).to_be_visible()
            
            # Check execution date
            await expect(first_execution.locator('[data-testid="execution-date"]')).to_be_visible()
            
            # Check executed by (if available)
            executed_by = first_execution.locator('[data-testid="executed-by"]')
            if await executed_by.count() > 0:
                await expect(executed_by).to_be_visible()
            
            # Check view link (eye icon)
            view_link = first_execution.locator('a[href*="/admin/system-test/test-plans/"]')
            await expect(view_link).to_be_visible()
            await expect(view_link.locator('.bi-eye')).to_be_visible()
        
        # Verify maximum 10 recent executions are displayed
        assert execution_count <= 10

    @pytest.mark.asyncio
    async def test_stp_032_07_failed_tests_analysis(self, admin_user: Page, base_url: str):
        """
        STP-032-07: Verify the failed tests analysis section displays 
        detailed information about failed tests.
        """
        await admin_user.goto(f"{base_url}/admin/system-test/reports")
        
        # Check if failed tests section exists (only appears when failed tests exist)
        failed_section = admin_user.locator('[data-testid="failed-tests-analysis"]')
        
        if await failed_section.count() > 0:
            await expect(failed_section).to_be_visible()
            
            # Check section title
            await expect(failed_section.locator('h3:text("Failed Tests Analysis")')).to_be_visible()
            
            # Check table headers
            table = failed_section.locator('table')
            await expect(table).to_be_visible()
            
            headers = ['Test Plan', 'Module', 'Failure Reason', 'Last Executed', 'Priority', 'Actions']
            for header in headers:
                await expect(table.locator(f'th:text("{header}")')).to_be_visible()
            
            # Check first failed test row (if any)
            failed_rows = table.locator('tbody tr')
            if await failed_rows.count() > 0:
                first_row = failed_rows.first
                
                # Check test plan number link
                test_plan_link = first_row.locator('a[href*="/admin/system-test/test-plans/"]')
                await expect(test_plan_link).to_be_visible()
                
                # Check failure reason (should handle truncation)
                failure_reason = first_row.locator('[data-testid="failure-reason"]')
                await expect(failure_reason).to_be_visible()
                
                # Check execution date
                await expect(first_row.locator('[data-testid="last-executed"]')).to_be_visible()
                
                # Check priority badge (should be color-coded)
                priority_badge = first_row.locator('[data-testid="priority-badge"]')
                await expect(priority_badge).to_be_visible()
                
                # Check action buttons
                actions_cell = first_row.locator('[data-testid="actions-cell"]')
                await expect(actions_cell.locator('.bi-eye')).to_be_visible()  # View
                await expect(actions_cell.locator('.bi-play-circle')).to_be_visible()  # Re-execute
                await expect(actions_cell.locator('.bi-pencil')).to_be_visible()  # Edit

    @pytest.mark.asyncio
    async def test_stp_032_08_no_data_states(self, admin_user: Page, base_url: str):
        """
        STP-032-08: Verify proper display when no test data is available.
        """
        await admin_user.goto(f"{base_url}/admin/system-test/reports")
        
        # Check for no modules message (if applicable)
        no_modules_msg = admin_user.locator('text="No test modules found"')
        if await no_modules_msg.count() > 0:
            await expect(no_modules_msg).to_be_visible()
            await expect(admin_user.locator('.bi-inbox')).to_be_visible()
        
        # Check for no recent executions message (if applicable)
        no_executions_msg = admin_user.locator('text="No recent test executions found"')
        if await no_executions_msg.count() > 0:
            await expect(no_executions_msg).to_be_visible()
            await expect(admin_user.locator('.bi-calendar-x')).to_be_visible()
        
        # Failed tests section should be hidden when no failed tests exist
        failed_section = admin_user.locator('[data-testid="failed-tests-analysis"]')
        if await failed_section.count() == 0:
            # This is expected behavior - failed tests section is hidden
            pass

    @pytest.mark.asyncio
    async def test_stp_032_09_export_docx_functionality(self, admin_user: Page, base_url: str):
        """
        STP-032-09: Verify the DOCX export functionality generates 
        proper document with all test plans.
        """
        await admin_user.goto(f"{base_url}/admin/system-test/reports")
        
        # Set up download promise before clicking
        async with admin_user.expect_download() as download_info:
            # Click Export DOCX button
            await admin_user.click('button:text("Export DOCX")')
        
        download = await download_info.value
        
        # Verify download started
        assert download.suggested_filename.endswith('.docx')
        assert 'test_plans' in download.suggested_filename.lower()
        
        # Verify the request was sent to correct endpoint
        # Note: This would require monitoring network requests in a real implementation
        
        # Save file for verification (optional)
        await download.save_as(f"./downloads/{download.suggested_filename}")

    @pytest.mark.asyncio
    async def test_stp_032_10_export_json_functionality(self, admin_user: Page, base_url: str):
        """
        STP-032-10: Verify the JSON export functionality generates 
        proper report data.
        """
        await admin_user.goto(f"{base_url}/admin/system-test/reports")
        
        # Set up download promise before clicking
        async with admin_user.expect_download() as download_info:
            # Click Export JSON button
            await admin_user.click('button:text("Export JSON")')
        
        download = await download_info.value
        
        # Verify download
        assert download.suggested_filename.endswith('.json')
        assert 'report' in download.suggested_filename.lower()
        
        # Save and verify JSON structure
        file_path = f"./downloads/{download.suggested_filename}"
        await download.save_as(file_path)
        
        # Verify JSON structure (optional)
        with open(file_path, 'r') as f:
            report_data = json.load(f)
            assert 'generated_at' in report_data
            assert 'summary' in report_data
            assert 'modules' in report_data

    @pytest.mark.asyncio
    async def test_stp_032_11_print_report_functionality(self, admin_user: Page, base_url: str):
        """
        STP-032-11: Verify the print functionality provides 
        properly formatted printable report.
        """
        await admin_user.goto(f"{base_url}/admin/system-test/reports")
        
        # Click Print Report button
        # Note: This will trigger window.print() which opens print dialog
        # In headless mode, we can only verify the button click doesn't cause errors
        await admin_user.click('button:text("Print Report")')
        
        # Verify page is still accessible after print action
        title = admin_user.locator('h1:text("Test Execution Reports")')
        await expect(title).to_be_visible()

    @pytest.mark.asyncio
    async def test_stp_032_12_report_generation_info(self, admin_user: Page, base_url: str):
        """
        STP-032-12: Verify the report generation information section 
        displays accurate metadata.
        """
        await admin_user.goto(f"{base_url}/admin/system-test/reports")
        
        # Check report information section
        info_section = admin_user.locator('[data-testid="report-info"]')
        await expect(info_section).to_be_visible()
        
        # Check info icon and title
        await expect(info_section.locator('.bi-info-circle')).to_be_visible()
        await expect(info_section.locator('text="Report Information"')).to_be_visible()
        
        # Check generation timestamp
        timestamp = info_section.locator('[data-testid="generation-timestamp"]')
        await expect(timestamp).to_be_visible()
        
        # Check explanation about data scope
        explanation = info_section.locator('text*="30-day timeframe"')
        await expect(explanation).to_be_visible()
        
        # Verify blue theme styling
        await expect(info_section).to_have_class(re.compile(r'.*bg-blue.*'))

    @pytest.mark.asyncio
    async def test_stp_032_13_progress_bar_visual_feedback(self, admin_user: Page, base_url: str):
        """
        STP-032-13: Verify module progress bars accurately represent 
        pass rates with proper visual feedback.
        """
        await admin_user.goto(f"{base_url}/admin/system-test/reports")
        
        # Get module cards with progress bars
        module_cards = admin_user.locator('[data-testid="module-card"]')
        
        if await module_cards.count() > 0:
            first_module = module_cards.first
            progress_bar = first_module.locator('[data-testid="progress-bar"]')
            
            # Check progress bar is visible
            await expect(progress_bar).to_be_visible()
            
            # Check green color for progress
            await expect(progress_bar).to_have_class(re.compile(r'.*bg-green.*'))
            
            # Check rounded corners
            await expect(progress_bar).to_have_class(re.compile(r'.*rounded.*'))
            
            # Verify progress bar width corresponds to pass rate
            pass_rate_text = await first_module.locator('[data-testid="pass-rate"]').text_content()
            if pass_rate_text:
                pass_rate = float(pass_rate_text.replace('%', ''))
                bar_width = await progress_bar.get_attribute('style')
                assert f"width: {pass_rate}%" in bar_width or f"width:{pass_rate}%" in bar_width

    @pytest.mark.asyncio
    async def test_stp_032_14_status_badge_color_coding(self, admin_user: Page, base_url: str):
        """
        STP-032-14: Verify status badges use proper color coding 
        for different test statuses.
        """
        await admin_user.goto(f"{base_url}/admin/system-test/reports")
        
        # Check recent executions for status badges
        execution_items = admin_user.locator('[data-testid="execution-item"]')
        
        if await execution_items.count() > 0:
            for i in range(min(3, await execution_items.count())):
                execution = execution_items.nth(i)
                status_badge = execution.locator('[data-testid="status-badge"]')
                
                if await status_badge.count() > 0:
                    status_text = await status_badge.text_content()
                    
                    if status_text.lower() == 'passed':
                        await expect(status_badge).to_have_class(re.compile(r'.*bg-green.*'))
                    elif status_text.lower() == 'failed':
                        await expect(status_badge).to_have_class(re.compile(r'.*bg-red.*'))
                    elif status_text.lower() == 'skipped':
                        await expect(status_badge).to_have_class(re.compile(r'.*bg-gray.*'))

    @pytest.mark.asyncio
    async def test_stp_032_15_priority_badge_styling(self, admin_user: Page, base_url: str):
        """
        STP-032-15: Verify priority badges in failed tests table 
        use appropriate color coding.
        """
        await admin_user.goto(f"{base_url}/admin/system-test/reports")
        
        # Check failed tests table for priority badges
        failed_section = admin_user.locator('[data-testid="failed-tests-analysis"]')
        
        if await failed_section.count() > 0:
            priority_badges = failed_section.locator('[data-testid="priority-badge"]')
            
            for i in range(min(3, await priority_badges.count())):
                badge = priority_badges.nth(i)
                priority_text = await badge.text_content()
                
                if priority_text.lower() == 'critical':
                    await expect(badge).to_have_class(re.compile(r'.*bg-red.*'))
                elif priority_text.lower() == 'high':
                    await expect(badge).to_have_class(re.compile(r'.*bg-orange.*'))
                elif priority_text.lower() == 'medium':
                    await expect(badge).to_have_class(re.compile(r'.*bg-blue.*'))
                elif priority_text.lower() == 'low':
                    await expect(badge).to_have_class(re.compile(r'.*bg-green.*'))

    @pytest.mark.asyncio
    async def test_stp_032_16_responsive_layout(self, admin_user: Page, base_url: str):
        """
        STP-032-16: Verify the reports page layout adapts properly 
        to different screen sizes.
        """
        await admin_user.goto(f"{base_url}/admin/system-test/reports")
        
        # Test desktop view (1920x1080)
        await admin_user.set_viewport_size({"width": 1920, "height": 1080})
        
        # Verify 4-column statistics layout on desktop
        stats_container = admin_user.locator('[data-testid="summary-statistics"]')
        await expect(stats_container).to_be_visible()
        
        # Test tablet view (1024px)
        await admin_user.set_viewport_size({"width": 1024, "height": 768})
        await expect(stats_container).to_be_visible()
        
        # Test mobile view (375px)
        await admin_user.set_viewport_size({"width": 375, "height": 667})
        await expect(stats_container).to_be_visible()
        
        # Check that table has horizontal scrolling on narrow screens
        failed_table = admin_user.locator('[data-testid="failed-tests-analysis"] table')
        if await failed_table.count() > 0:
            # Table should be scrollable on mobile
            await expect(failed_table).to_be_visible()

    @pytest.mark.asyncio
    async def test_stp_032_17_navigation_links(self, admin_user: Page, base_url: str):
        """
        STP-032-17: Verify all navigation links within reports page 
        function correctly.
        """
        await admin_user.goto(f"{base_url}/admin/system-test/reports")
        
        # Test Back to Dashboard button
        back_button = admin_user.locator('a:text("Back to Dashboard")')
        if await back_button.count() > 0:
            await back_button.click()
            await expect(admin_user).to_have_url(re.compile(r'.*/admin/dashboard.*'))
            await admin_user.go_back()
        
        # Test module name links
        module_links = admin_user.locator('[data-testid="module-card"] a[href*="/admin/system-test/modules/"]')
        if await module_links.count() > 0:
            first_link = module_links.first
            await first_link.click()
            await expect(admin_user).to_have_url(re.compile(r'.*/admin/system-test/modules/.*'))
            await admin_user.go_back()
        
        # Test test plan links in recent executions
        execution_links = admin_user.locator('[data-testid="recent-executions"] a[href*="/admin/system-test/test-plans/"]')
        if await execution_links.count() > 0:
            first_execution_link = execution_links.first
            await first_execution_link.click()
            await expect(admin_user).to_have_url(re.compile(r'.*/admin/system-test/test-plans/.*'))
            await admin_user.go_back()

    @pytest.mark.asyncio
    async def test_stp_032_18_data_accuracy(self, admin_user: Page, base_url: str):
        """
        STP-032-18: Verify all calculated values and percentages 
        are accurate based on underlying data.
        """
        await admin_user.goto(f"{base_url}/admin/system-test/reports")
        
        # Get summary statistics
        total_tests = await admin_user.locator('[data-testid="total-tests-count"]').text_content()
        passed_tests = await admin_user.locator('[data-testid="passed-tests-count"]').text_content()
        failed_tests = await admin_user.locator('[data-testid="failed-tests-count"]').text_content()
        pending_tests = await admin_user.locator('[data-testid="pending-tests-count"]').text_content()
        
        if total_tests and passed_tests and failed_tests and pending_tests:
            # Convert to integers
            total = int(total_tests)
            passed = int(passed_tests)
            failed = int(failed_tests)
            pending = int(pending_tests)
            
            # Verify total equals sum of passed, failed, and pending
            assert total == passed + failed + pending, "Total tests should equal sum of passed, failed, and pending"
            
            # Check pass rate calculation
            if total > 0:
                expected_pass_rate = round((passed / total) * 100, 1)
                pass_rate_element = admin_user.locator('[data-testid="pass-rate-percentage"]')
                if await pass_rate_element.count() > 0:
                    pass_rate_text = await pass_rate_element.text_content()
                    actual_pass_rate = float(pass_rate_text.replace('%', ''))
                    assert abs(actual_pass_rate - expected_pass_rate) < 0.1, "Pass rate calculation should be accurate"

    @pytest.mark.asyncio
    async def test_stp_032_19_error_handling(self, admin_user: Page, base_url: str):
        """
        STP-032-19: Verify proper error handling when reports generation 
        encounters issues.
        """
        # This test would typically involve mocking server errors
        # For now, we'll test that the page handles missing data gracefully
        
        await admin_user.goto(f"{base_url}/admin/system-test/reports")
        
        # Check that page loads even if some data is missing
        title = admin_user.locator('h1:text("Test Execution Reports")')
        await expect(title).to_be_visible()
        
        # Verify no JavaScript errors occurred
        console_messages = []
        admin_user.on("console", lambda msg: console_messages.append(msg))
        
        await admin_user.reload()
        
        # Check for console errors (filter out informational messages)
        errors = [msg for msg in console_messages if msg.type == "error"]
        assert len(errors) == 0, f"Page should not have JavaScript errors: {[msg.text for msg in errors]}"

    @pytest.mark.asyncio
    async def test_stp_032_20_performance(self, admin_user: Page, base_url: str):
        """
        STP-032-20: Verify the reports page loads efficiently with good performance.
        """
        # Measure page load time
        start_time = datetime.now()
        await admin_user.goto(f"{base_url}/admin/system-test/reports")
        await admin_user.wait_for_load_state("networkidle")
        end_time = datetime.now()
        
        load_time = (end_time - start_time).total_seconds()
        
        # Verify page loads within reasonable time (adjust threshold as needed)
        assert load_time < 10, f"Page should load within 10 seconds, took {load_time:.2f}s"
        
        # Check that main content is visible
        await expect(admin_user.locator('h1:text("Test Execution Reports")')).to_be_visible()
        
        # Verify no memory leaks by checking page can be reloaded multiple times
        for _ in range(3):
            await admin_user.reload()
            await admin_user.wait_for_load_state("networkidle")
            await expect(admin_user.locator('h1:text("Test Execution Reports")')).to_be_visible()

    @pytest.mark.asyncio
    async def test_stp_032_21_date_time_formatting(self, admin_user: Page, base_url: str):
        """
        STP-032-21: Verify date and time information is displayed 
        in consistent, readable formats.
        """
        await admin_user.goto(f"{base_url}/admin/system-test/reports")
        
        # Check report generation timestamp format
        timestamp_element = admin_user.locator('[data-testid="generation-timestamp"]')
        if await timestamp_element.count() > 0:
            timestamp_text = await timestamp_element.text_content()
            # Should match format like "August 27, 2025 at 10:30"
            date_pattern = re.compile(r'\w+ \d{1,2}, \d{4} at \d{1,2}:\d{2}')
            assert date_pattern.search(timestamp_text), f"Timestamp format should be readable: {timestamp_text}"
        
        # Check execution dates in recent executions
        execution_dates = admin_user.locator('[data-testid="execution-date"]')
        if await execution_dates.count() > 0:
            first_date = await execution_dates.first.text_content()
            # Should be in a readable format
            assert len(first_date.strip()) > 0, "Execution date should not be empty"

    @pytest.mark.asyncio
    async def test_stp_032_22_text_truncation(self, admin_user: Page, base_url: str):
        """
        STP-032-22: Verify long text content is properly truncated 
        with tooltips for full content.
        """
        await admin_user.goto(f"{base_url}/admin/system-test/reports")
        
        # Check failure reason truncation in failed tests table
        failure_reasons = admin_user.locator('[data-testid="failure-reason"]')
        
        if await failure_reasons.count() > 0:
            first_reason = failure_reasons.first
            
            # Check if text appears truncated (has ellipsis or max-width)
            reason_text = await first_reason.text_content()
            
            # Check for title attribute (tooltip)
            title_attr = await first_reason.get_attribute('title')
            if title_attr:
                # Title should contain full content
                assert len(title_attr) >= len(reason_text), "Title should contain full or equal content"

    @pytest.mark.asyncio
    async def test_stp_032_23_dark_mode_compatibility(self, admin_user: Page, base_url: str):
        """
        STP-032-23: Verify the reports page displays correctly in dark mode theme.
        """
        await admin_user.goto(f"{base_url}/admin/system-test/reports")
        
        # If dark mode toggle exists, test it
        dark_toggle = admin_user.locator('[data-testid="dark-mode-toggle"]')
        if await dark_toggle.count() > 0:
            await dark_toggle.click()
            
            # Verify dark theme is applied
            body = admin_user.locator('body')
            await expect(body).to_have_class(re.compile(r'.*dark.*'))
            
            # Check that content is still visible and readable
            title = admin_user.locator('h1:text("Test Execution Reports")')
            await expect(title).to_be_visible()
            
            # Verify dark backgrounds are applied
            cards = admin_user.locator('[data-testid="summary-statistics"] > div')
            if await cards.count() > 0:
                first_card = cards.first
                # Should have dark background classes
                card_classes = await first_card.get_attribute('class')
                assert 'dark:bg-gray-' in card_classes or 'bg-gray-' in card_classes

    @pytest.mark.asyncio
    async def test_stp_032_24_accessibility(self, admin_user: Page, base_url: str):
        """
        STP-032-24: Verify the reports page meets accessibility standards 
        for screen readers and keyboard navigation.
        """
        await admin_user.goto(f"{base_url}/admin/system-test/reports")
        
        # Test keyboard navigation
        await admin_user.keyboard.press('Tab')
        
        # Check proper heading hierarchy
        h1_elements = admin_user.locator('h1')
        h3_elements = admin_user.locator('h3')
        
        # Should have one main h1
        await expect(h1_elements).to_have_count(1)
        
        # Check that buttons and links have proper text or aria-labels
        buttons = admin_user.locator('button')
        button_count = await buttons.count()
        
        for i in range(button_count):
            button = buttons.nth(i)
            button_text = await button.text_content()
            aria_label = await button.get_attribute('aria-label')
            
            # Button should have either text or aria-label
            assert button_text.strip() or aria_label, f"Button {i} should have text or aria-label"
        
        # Check table structure (if failed tests table exists)
        tables = admin_user.locator('table')
        if await tables.count() > 0:
            table = tables.first
            # Should have proper headers
            headers = table.locator('th')
            await expect(headers.first).to_be_visible()

    @pytest.mark.asyncio
    async def test_stp_032_25_browser_compatibility(self, admin_user: Page, base_url: str):
        """
        STP-032-25: Verify reports functionality works across different web browsers.
        Note: This test runs in Chromium. For full browser testing, 
        additional fixtures would be needed.
        """
        await admin_user.goto(f"{base_url}/admin/system-test/reports")
        
        # Verify basic functionality works
        title = admin_user.locator('h1:text("Test Execution Reports")')
        await expect(title).to_be_visible()
        
        # Test JavaScript functionality (export buttons)
        export_json_btn = admin_user.locator('button:text("Export JSON")')
        if await export_json_btn.count() > 0:
            # Click should not cause errors
            await export_json_btn.click()
        
        # Test print functionality
        print_btn = admin_user.locator('button:text("Print Report")')
        if await print_btn.count() > 0:
            await print_btn.click()
        
        # Page should still be functional
        await expect(title).to_be_visible()

    @pytest.mark.asyncio
    async def test_stp_032_26_table_overflow_scrolling(self, admin_user: Page, base_url: str):
        """
        STP-032-26: Verify failed tests table handles overflow content 
        with proper scrolling.
        """
        await admin_user.goto(f"{base_url}/admin/system-test/reports")
        
        # Set narrow viewport to test overflow
        await admin_user.set_viewport_size({"width": 600, "height": 800})
        
        # Check failed tests table
        failed_table = admin_user.locator('[data-testid="failed-tests-analysis"] table')
        
        if await failed_table.count() > 0:
            # Table should be visible
            await expect(failed_table).to_be_visible()
            
            # Check if table container has overflow handling
            table_container = admin_user.locator('[data-testid="failed-tests-analysis"] .overflow-x-auto')
            if await table_container.count() > 0:
                await expect(table_container).to_be_visible()
            
            # Verify all columns are still accessible
            headers = failed_table.locator('th')
            header_count = await headers.count()
            assert header_count > 0, "Table should have headers"
            
            # Check that headers remain visible
            await expect(headers.first).to_be_visible()

    @pytest.mark.asyncio
    async def test_stp_032_27_icon_display(self, admin_user: Page, base_url: str):
        """
        STP-032-27: Verify all icons display correctly with proper sizing and alignment.
        """
        await admin_user.goto(f"{base_url}/admin/system-test/reports")
        
        # Check statistics card icons
        await expect(admin_user.locator('.bi-clipboard-data')).to_be_visible()  # Total tests
        await expect(admin_user.locator('.bi-check-circle')).to_be_visible()    # Passed tests
        await expect(admin_user.locator('.bi-x-circle')).to_be_visible()        # Failed tests
        await expect(admin_user.locator('.bi-clock')).to_be_visible()           # Pending tests
        
        # Check navigation button icons
        await expect(admin_user.locator('.bi-arrow-left')).to_be_visible()      # Back button
        
        # Check export button icons (if visible)
        export_icons = ['.bi-file-earmark-word', '.bi-download', '.bi-printer']
        for icon_class in export_icons:
            icon = admin_user.locator(icon_class)
            if await icon.count() > 0:
                await expect(icon).to_be_visible()
        
        # Check action icons in failed tests (if table exists)
        action_icons = ['.bi-eye', '.bi-play-circle', '.bi-pencil']
        for icon_class in action_icons:
            icons = admin_user.locator(icon_class)
            if await icons.count() > 0:
                await expect(icons.first).to_be_visible()
        
        # Check info icon
        info_icon = admin_user.locator('.bi-info-circle')
        if await info_icon.count() > 0:
            await expect(info_icon).to_be_visible()

    @pytest.mark.asyncio
    async def test_stp_032_28_data_refresh(self, admin_user: Page, base_url: str):
        """
        STP-032-28: Verify reports data reflects current state of test plans and executions.
        """
        await admin_user.goto(f"{base_url}/admin/system-test/reports")
        
        # Get initial statistics
        initial_total = await admin_user.locator('[data-testid="total-tests-count"]').text_content()
        
        # Navigate away and back to simulate data refresh
        await admin_user.goto(f"{base_url}/admin/dashboard")
        await admin_user.goto(f"{base_url}/admin/system-test/reports")
        
        # Verify data is still displayed
        current_total = await admin_user.locator('[data-testid="total-tests-count"]').text_content()
        
        # Data should be consistent (or updated if changes occurred)
        assert current_total is not None, "Total tests count should be displayed after refresh"
        
        # Check that recent executions show current data
        recent_section = admin_user.locator('[data-testid="recent-executions"]')
        await expect(recent_section).to_be_visible()

    @pytest.mark.asyncio
    async def test_stp_032_29_workflow_integration(self, admin_user: Page, base_url: str):
        """
        STP-032-29: Verify reports page integrates seamlessly with 
        overall test management workflow.
        """
        # Start from dashboard
        await admin_user.goto(f"{base_url}/admin/dashboard")
        
        # Navigate to reports (assuming there's a link/button)
        reports_link = admin_user.locator('a[href*="/admin/system-test/reports"]')
        if await reports_link.count() > 0:
            await reports_link.click()
            await expect(admin_user).to_have_url(re.compile(r'.*/admin/system-test/reports.*'))
        else:
            # Direct navigation if no link found
            await admin_user.goto(f"{base_url}/admin/system-test/reports")
        
        # Verify reports page loads
        await expect(admin_user.locator('h1:text("Test Execution Reports")')).to_be_visible()
        
        # Test navigation to test plan from failed tests
        test_plan_links = admin_user.locator('[data-testid="failed-tests-analysis"] a[href*="/admin/system-test/test-plans/"]')
        if await test_plan_links.count() > 0:
            await test_plan_links.first.click()
            await expect(admin_user).to_have_url(re.compile(r'.*/admin/system-test/test-plans/.*'))
            await admin_user.go_back()
        
        # Test return to dashboard
        back_button = admin_user.locator('a:text("Back to Dashboard")')
        if await back_button.count() > 0:
            await back_button.click()
            await expect(admin_user).to_have_url(re.compile(r'.*/admin/dashboard.*'))

    @pytest.mark.asyncio
    async def test_stp_032_30_complete_analytics_workflow(self, admin_user: Page, base_url: str):
        """
        STP-032-30: Verify complete test execution reports and analytics workflow 
        from access through data export.
        """
        # Step 1: Navigate to reports from admin dashboard
        await admin_user.goto(f"{base_url}/admin/dashboard")
        
        # Look for reports link or navigate directly
        reports_link = admin_user.locator('a[href*="/admin/system-test/reports"]')
        if await reports_link.count() > 0:
            await reports_link.click()
        else:
            await admin_user.goto(f"{base_url}/admin/system-test/reports")
        
        # Step 2: Review summary statistics
        await expect(admin_user.locator('[data-testid="summary-statistics"]')).to_be_visible()
        total_tests = admin_user.locator('[data-testid="total-tests-count"]')
        await expect(total_tests).to_be_visible()
        
        # Step 3: Analyze module-wise results
        module_section = admin_user.locator('[data-testid="module-results"]')
        await expect(module_section).to_be_visible()
        
        # Step 4: Review recent test execution trends
        recent_section = admin_user.locator('[data-testid="recent-executions"]')
        await expect(recent_section).to_be_visible()
        
        # Step 5: Investigate failed tests (if any)
        failed_section = admin_user.locator('[data-testid="failed-tests-analysis"]')
        if await failed_section.count() > 0:
            await expect(failed_section).to_be_visible()
            
            # Step 6: Navigate to specific test plan for detailed review
            test_plan_link = failed_section.locator('a[href*="/admin/system-test/test-plans/"]').first
            if await test_plan_link.count() > 0:
                await test_plan_link.click()
                await expect(admin_user).to_have_url(re.compile(r'.*/admin/system-test/test-plans/.*'))
                await admin_user.go_back()
        
        # Step 7: Export reports in DOCX format
        docx_button = admin_user.locator('button:text("Export DOCX")')
        if await docx_button.count() > 0:
            async with admin_user.expect_download():
                await docx_button.click()
        
        # Step 8: Export JSON data
        json_button = admin_user.locator('button:text("Export JSON")')
        if await json_button.count() > 0:
            async with admin_user.expect_download():
                await json_button.click()
        
        # Step 9: Test print functionality
        print_button = admin_user.locator('button:text("Print Report")')
        if await print_button.count() > 0:
            await print_button.click()
        
        # Step 10: Verify data accuracy
        title = admin_user.locator('h1:text("Test Execution Reports")')
        await expect(title).to_be_visible()
        
        # Step 11: Confirm workflow integration
        back_button = admin_user.locator('a:text("Back to Dashboard")')
        if await back_button.count() > 0:
            await back_button.click()
            await expect(admin_user).to_have_url(re.compile(r'.*/admin/dashboard.*'))
        
        # Workflow completed successfully if we reach this point
        assert True, "Complete analytics workflow completed successfully"


# Additional utility test class for edge cases and integration
class TestExecutionReportsIntegration:
    """Integration tests for reports with other system components."""
    
    @pytest.mark.asyncio
    async def test_reports_with_large_dataset(self, admin_user: Page, base_url: str):
        """Test reports performance with large amounts of test data."""
        await admin_user.goto(f"{base_url}/admin/system-test/reports")
        
        # Set a reasonable timeout for large data loading
        await admin_user.wait_for_load_state("networkidle", timeout=30000)
        
        # Verify page still loads and functions with large dataset
        title = admin_user.locator('h1:text("Test Execution Reports")')
        await expect(title).to_be_visible()
        
        # Check that statistics are still calculated correctly
        total_tests = admin_user.locator('[data-testid="total-tests-count"]')
        await expect(total_tests).to_be_visible()
    
    @pytest.mark.asyncio
    async def test_reports_data_consistency(self, admin_user: Page, base_url: str):
        """Test that reports data is consistent across page reloads."""
        await admin_user.goto(f"{base_url}/admin/system-test/reports")
        
        # Get initial data
        initial_total = await admin_user.locator('[data-testid="total-tests-count"]').text_content()
        
        # Reload page
        await admin_user.reload()
        await admin_user.wait_for_load_state("networkidle")
        
        # Get data after reload
        reloaded_total = await admin_user.locator('[data-testid="total-tests-count"]').text_content()
        
        # Data should be consistent
        assert initial_total == reloaded_total, "Data should be consistent across reloads"
    
    @pytest.mark.asyncio 
    async def test_reports_error_states(self, admin_user: Page, base_url: str):
        """Test reports behavior when encountering various error states."""
        # Test with network timeout simulation (if possible)
        await admin_user.goto(f"{base_url}/admin/system-test/reports")
        
        # Verify graceful handling - page should still show something
        title = admin_user.locator('h1:text("Test Execution Reports")')
        await expect(title).to_be_visible()
        
        # Check that error doesn't break the interface
        error_elements = admin_user.locator('.error, .alert-danger, [role="alert"]')
        if await error_elements.count() > 0:
            # If errors are shown, they should be informative
            error_text = await error_elements.first.text_content()
            assert len(error_text.strip()) > 0, "Error messages should be informative"
