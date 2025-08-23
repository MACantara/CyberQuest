"""
System Test Plan Admin Routes
Admin interface for managing system test plans and test execution
"""
from flask import Blueprint, render_template, request, redirect, url_for, flash, jsonify, current_app, abort
from flask_login import login_required, current_user
from datetime import datetime
import json
from app.models.system_test_plan import SystemTestPlan
from app.models.user import User

system_test_bp = Blueprint('system_test', __name__, url_prefix='/admin/system-test')

def admin_required(f):
    """Decorator to require admin access."""
    def decorated_function(*args, **kwargs):
        if not current_user.is_authenticated or not current_user.is_admin:
            abort(403)  # Forbidden
        return f(*args, **kwargs)
    decorated_function.__name__ = f.__name__
    return decorated_function

@system_test_bp.route('/')
@login_required
@admin_required
def dashboard():
    """System test dashboard with overview statistics."""
    try:
        # Get summary statistics
        test_summary = SystemTestPlan.get_test_summary()
        modules_summary = SystemTestPlan.get_modules_summary()
        
        # Get recent test executions
        recent_tests = SystemTestPlan.get_all(order_by='updated_at desc')[:10]
        
        # Get failed tests requiring attention
        failed_tests = SystemTestPlan.get_all(filters={'test_status': 'failed'})
        
        return render_template('admin/system-test/dashboard.html',
                             test_summary=test_summary,
                             modules_summary=modules_summary,
                             recent_tests=recent_tests,
                             failed_tests=failed_tests)
    except Exception as e:
        current_app.logger.error(f'Error loading dashboard: {str(e)}')
        abort(500)

@system_test_bp.route('/test-plans')
@login_required
@admin_required
def test_plans_list():
    """List all test plans with filtering options."""
    try:
        # Get filter parameters
        module_filter = request.args.get('module', '')
        status_filter = request.args.get('status', '')
        priority_filter = request.args.get('priority', '')
        category_filter = request.args.get('category', '')
        
        # Build filters
        filters = {}
        if module_filter:
            filters['module_name'] = module_filter
        if status_filter:
            filters['test_status'] = status_filter
        if priority_filter:
            filters['priority'] = priority_filter
        if category_filter:
            filters['category'] = category_filter
        
        # Get test plans
        test_plans = SystemTestPlan.get_all(filters=filters)
        
        # Get unique values for filter dropdowns
        all_plans = SystemTestPlan.get_all()
        modules = sorted(list(set(plan.module_name for plan in all_plans if plan.module_name)))
        
        return render_template('admin/system-test/test-plans-list.html',
                             test_plans=test_plans,
                             modules=modules,
                             current_filters={
                                 'module': module_filter,
                                 'status': status_filter,
                                 'priority': priority_filter,
                                 'category': category_filter
                             })
    except Exception as e:
        current_app.logger.error(f'Error loading test plans: {str(e)}')
        abort(500)

@system_test_bp.route('/test-plans/new', methods=['GET', 'POST'])
@login_required
@admin_required
def create_test_plan():
    """Create a new test plan."""
    if request.method == 'POST':
        try:
            test_plan = SystemTestPlan(
                test_plan_no=request.form.get('test_plan_no'),
                module_name=request.form.get('module_name'),
                screen_design_ref=request.form.get('screen_design_ref'),
                description=request.form.get('description'),
                scenario=request.form.get('scenario'),
                expected_results=request.form.get('expected_results'),
                procedure=request.form.get('procedure'),
                test_status=request.form.get('test_status', 'pending'),
                priority=request.form.get('priority', 'medium'),
                category=request.form.get('category', 'functional')
            )
            
            if test_plan.save():
                flash('Test plan created successfully!', 'success')
                return redirect(url_for('system_test.test_plans_list'))
            else:
                flash('Error creating test plan.', 'error')
                abort(500)
        except Exception as e:
            current_app.logger.error(f'Error creating test plan: {str(e)}')
            flash(f'Error creating test plan: {str(e)}', 'error')
            abort(500)
    
    return render_template('admin/system-test/test-plan-form.html', 
                         test_plan=None, 
                         action='Create')

@system_test_bp.route('/test-plans/<int:test_plan_id>')
@login_required
@admin_required
def view_test_plan(test_plan_id):
    """View a specific test plan."""
    try:
        test_plan = SystemTestPlan.get_by_id(test_plan_id)
        if not test_plan:
            abort(404)
        
        return render_template('admin/system-test/test-plan-view.html', 
                             test_plan=test_plan)
    except Exception as e:
        current_app.logger.error(f'Error loading test plan: {str(e)}')
        abort(500)

@system_test_bp.route('/test-plans/<int:test_plan_id>/edit', methods=['GET', 'POST'])
@login_required
@admin_required
def edit_test_plan(test_plan_id):
    """Edit an existing test plan."""
    try:
        test_plan = SystemTestPlan.get_by_id(test_plan_id)
        if not test_plan:
            abort(404)
        
        if request.method == 'POST':
            test_plan.test_plan_no = request.form.get('test_plan_no')
            test_plan.module_name = request.form.get('module_name')
            test_plan.screen_design_ref = request.form.get('screen_design_ref')
            test_plan.description = request.form.get('description')
            test_plan.scenario = request.form.get('scenario')
            test_plan.expected_results = request.form.get('expected_results')
            test_plan.procedure = request.form.get('procedure')
            test_plan.test_status = request.form.get('test_status')
            test_plan.priority = request.form.get('priority')
            test_plan.category = request.form.get('category')
            
            if test_plan.save():
                flash('Test plan updated successfully!', 'success')
                return redirect(url_for('system_test.view_test_plan', test_plan_id=test_plan_id))
            else:
                flash('Error updating test plan.', 'error')
                abort(500)
        
        return render_template('admin/system-test/test-plan-form.html', 
                             test_plan=test_plan, 
                             action='Edit')
    except Exception as e:
        current_app.logger.error(f'Error editing test plan: {str(e)}')
        abort(500)

@system_test_bp.route('/test-plans/<int:test_plan_id>/execute', methods=['GET', 'POST'])
@login_required
@admin_required
def execute_test_plan(test_plan_id):
    """Execute a test plan and record results."""
    try:
        test_plan = SystemTestPlan.get_by_id(test_plan_id)
        if not test_plan:
            abort(404)
        
        if request.method == 'POST':
            test_status = request.form.get('test_status')
            failure_reason = request.form.get('failure_reason', '').strip()
            
            test_plan.test_status = test_status
            test_plan.execution_date = datetime.utcnow()
            test_plan.executed_by = current_user.username
            test_plan.failure_reason = failure_reason if test_status == 'failed' else None
            
            if test_plan.save():
                flash(f'Test execution recorded: {test_status.upper()}', 'success')
                return redirect(url_for('system_test.view_test_plan', test_plan_id=test_plan_id))
            else:
                flash('Error recording test execution.', 'error')
                abort(500)
        
        return render_template('admin/system-test/test-execution.html', 
                             test_plan=test_plan)
    except Exception as e:
        current_app.logger.error(f'Error executing test plan: {str(e)}')
        abort(500)

@system_test_bp.route('/test-plans/<int:test_plan_id>/delete', methods=['POST'])
@login_required
@admin_required
def delete_test_plan(test_plan_id):
    """Delete a test plan."""
    try:
        test_plan = SystemTestPlan.get_by_id(test_plan_id)
        if not test_plan:
            abort(404)
        
        if test_plan.delete():
            flash('Test plan deleted successfully!', 'success')
        else:
            flash('Error deleting test plan.', 'error')
            abort(500)
    except Exception as e:
        current_app.logger.error(f'Error deleting test plan: {str(e)}')
        flash(f'Error deleting test plan: {str(e)}', 'error')
        abort(500)
    
    return redirect(url_for('system_test.test_plans_list'))

@system_test_bp.route('/modules/<module_name>')
@login_required
@admin_required
def module_tests(module_name):
    """View all tests for a specific module."""
    try:
        test_plans = SystemTestPlan.get_by_module(module_name)
        
        # Calculate module statistics
        total = len(test_plans)
        passed = len([t for t in test_plans if t.test_status == 'passed'])
        failed = len([t for t in test_plans if t.test_status == 'failed'])
        pending = len([t for t in test_plans if t.test_status == 'pending'])
        
        module_stats = {
            'total': total,
            'passed': passed,
            'failed': failed,
            'pending': pending,
            'pass_rate': (passed / total * 100) if total > 0 else 0
        }
        
        return render_template('admin/system-test/module-tests.html',
                             module_name=module_name,
                             test_plans=test_plans,
                             module_stats=module_stats)
    except Exception as e:
        current_app.logger.error(f'Error loading module tests: {str(e)}')
        abort(500)

@system_test_bp.route('/bulk-import', methods=['GET', 'POST'])
@login_required
@admin_required
def bulk_import():
    """Bulk import test plans from JSON or CSV."""
    if request.method == 'POST':
        try:
            import_data = request.form.get('import_data')
            if not import_data:
                flash('Please provide import data.', 'error')
                return render_template('admin/system-test/bulk-import.html')
            
            # Parse JSON data
            test_plans_data = json.loads(import_data)
            
            # Validate data structure
            if not isinstance(test_plans_data, list):
                flash('Import data must be a JSON array.', 'error')
                return render_template('admin/system-test/bulk-import.html')
            
            # Import test plans
            imported_count = SystemTestPlan.bulk_import(test_plans_data)
            
            if imported_count > 0:
                flash(f'Successfully imported {imported_count} test plans!', 'success')
                return redirect(url_for('system_test.test_plans_list'))
            else:
                flash('No test plans were imported. Please check your data format.', 'error')
        
        except json.JSONDecodeError:
            flash('Invalid JSON format. Please check your data.', 'error')
        except Exception as e:
            current_app.logger.error(f'Error importing test plans: {str(e)}')
            flash(f'Error importing test plans: {str(e)}', 'error')
    
    return render_template('admin/system-test/bulk-import.html')

@system_test_bp.route('/reports')
@login_required
@admin_required
def reports():
    """Generate test execution reports."""
    try:
        # Get comprehensive test data
        test_summary = SystemTestPlan.get_test_summary()
        modules_summary = SystemTestPlan.get_modules_summary()
        
        # Get failed tests with reasons
        failed_tests = SystemTestPlan.get_all(filters={'test_status': 'failed'})
        
        # Get test execution trends (last 30 days)
        all_tests = SystemTestPlan.get_all()
        recent_executions = [t for t in all_tests if t.execution_date and 
                           (datetime.utcnow() - t.execution_date).days <= 30]
        
        return render_template('admin/system-test/reports.html',
                             test_summary=test_summary,
                             modules_summary=modules_summary,
                             failed_tests=failed_tests,
                             recent_executions=recent_executions)
    except Exception as e:
        current_app.logger.error(f'Error generating reports: {str(e)}')
        abort(500)

# API endpoints for AJAX operations
@system_test_bp.route('/api/test-plans/<int:test_plan_id>/status', methods=['POST'])
@login_required
@admin_required
def update_test_status(test_plan_id):
    """API endpoint to quickly update test status."""
    try:
        test_plan = SystemTestPlan.get_by_id(test_plan_id)
        if not test_plan:
            return jsonify({'success': False, 'error': 'Test plan not found'}), 404
        
        data = request.get_json()
        test_status = data.get('status')
        failure_reason = data.get('failure_reason', '')
        
        if test_status not in ['pending', 'passed', 'failed', 'skipped']:
            return jsonify({'success': False, 'error': 'Invalid status'}), 400
        
        test_plan.test_status = test_status
        test_plan.execution_date = datetime.utcnow()
        test_plan.executed_by = current_user.username
        test_plan.failure_reason = failure_reason if test_status == 'failed' else None
        
        if test_plan.save():
            return jsonify({'success': True})
        else:
            return jsonify({'success': False, 'error': 'Failed to save'}), 500
    
    except Exception as e:
        current_app.logger.error(f'Error updating test status: {str(e)}')
        return jsonify({'success': False, 'error': str(e)}), 500

@system_test_bp.route('/api/modules/summary')
@login_required
@admin_required
def api_modules_summary():
    """API endpoint to get modules summary for charts."""
    try:
        modules_summary = SystemTestPlan.get_modules_summary()
        return jsonify({'success': True, 'data': modules_summary})
    except Exception as e:
        current_app.logger.error(f'Error getting modules summary: {str(e)}')
        return jsonify({'success': False, 'error': str(e)}), 500
