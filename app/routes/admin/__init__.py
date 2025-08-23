"""
Admin routes package - modular admin functionality.
"""

from .admin_core import admin_bp
from .data_analytics import data_analytics_bp
from .system_backup import system_backup_bp
from .logs import admin_logs_bp
from .system_test import system_test_bp

__all__ = ['admin_bp', 'data_analytics_bp', 'system_backup_bp', 'admin_logs_bp', 'system_test_bp']
