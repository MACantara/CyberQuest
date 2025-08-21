"""
Data analytics routes for admin panel.
"""

from flask import Blueprint, render_template
from flask_login import login_required
from app.routes.admin.admin_utils import admin_required

data_analytics_bp = Blueprint('data_analytics', __name__, url_prefix='/admin')


@data_analytics_bp.route('/player-analytics')
@login_required
@admin_required
def player_analytics():
    """Player Data Analytics dashboard with comprehensive metrics."""
    # Generate dummy data for all analytics metrics
    
    # 1. General Usage Statistics
    general_stats = {
        'dau': 847,
        'wau': 3421,
        'mau': 12156,
        'dau_mau_ratio': 0.07,
        'avg_session_length': 1847,  # seconds
        'session_frequency': 4.2,
        'retention_rates': {
            'day_1': 78.5,
            'day_7': 45.2,
            'day_30': 23.8
        },
        'churn_rate': 12.4,
        'completion_rate': 67.3,
        'drop_off_rate': 15.7
    }
    
    # 2. Gameplay Interaction
    gameplay_stats = {
        'levels_completed': {
            'level_1': 89.2,
            'level_2': 76.4,
            'level_3': 58.7,
            'level_4': 34.1,
            'level_5': 18.9
        },
        'avg_actions_per_session': 127.3,
        'hint_usage_rate': 34.7,
        'avg_time_to_completion': {
            'level_1': 912,  # seconds
            'level_2': 1435,
            'level_3': 1789,
            'level_4': 2341,
            'level_5': 2987
        },
        'failure_retry_rate': 28.6,
        'achievements_unlocked': 4521
    }
    
    # 3. Engagement Quality
    engagement_stats = {
        'nps_score': 42,
        'avg_rating': 4.2,
        'total_ratings': 2847,
        'promoters_pct': 56.3,
        'detractors_pct': 14.2
    }
    
    # 4. Cybersecurity-Specific Stats
    cybersec_stats = {
        'level_1_metrics': {
            'fact_check_accuracy': 82.4,
            'misinformation_detection_speed': 45.6  # seconds
        },
        'level_2_metrics': {
            'phishing_detection_rate': 76.8,
            'false_positive_rate': 12.3
        },
        'level_3_metrics': {
            'malware_identification_accuracy': 71.5
        },
        'level_4_metrics': {
            'vulnerability_discovery_rate': 3.2,  # avg per session
            'ethical_methodology_score': 87.1,
            'responsible_disclosure_rate': 94.3
        },
        'level_5_metrics': {
            'evidence_collection_score': 79.6,
            'timeline_accuracy': 68.4,
            'attribution_confidence': 73.2
        },
        'blue_vs_red_metrics': {
            'asset_protection_rate': 74.8,
            'threat_detection_speed': 127.3,  # seconds
            'incident_response_effectiveness': 81.2,
            'ai_attack_success_rate': 34.7,
            'mttd': 89.4,  # seconds
            'mttr': 234.7  # seconds
        }
    }
    
    # 5. Weekly trends data for charts
    weekly_trends = [
        {'date': '2025-08-11', 'dau': 823, 'sessions': 3421, 'completions': 234},
        {'date': '2025-08-12', 'dau': 891, 'sessions': 3789, 'completions': 267},
        {'date': '2025-08-13', 'dau': 756, 'sessions': 3156, 'completions': 198},
        {'date': '2025-08-14', 'dau': 934, 'sessions': 4012, 'completions': 289},
        {'date': '2025-08-15', 'dau': 867, 'sessions': 3654, 'completions': 241},
        {'date': '2025-08-16', 'dau': 912, 'sessions': 3892, 'completions': 276},
        {'date': '2025-08-17', 'dau': 847, 'sessions': 3567, 'completions': 253}
    ]
    
    return render_template('admin/player-data-analytics/dashboard.html',
                         general_stats=general_stats,
                         gameplay_stats=gameplay_stats,
                         engagement_stats=engagement_stats,
                         cybersec_stats=cybersec_stats,
                         weekly_trends=weekly_trends)


@data_analytics_bp.route('/player-analytics/levels')
@login_required
@admin_required
def player_analytics_levels():
    """Detailed level-specific analytics."""
    # Detailed level performance data
    level_details = {
        'level_1': {
            'name': 'The Misinformation Maze',
            'completion_rate': 89.2,
            'avg_time': 912,
            'fact_check_accuracy': 82.4,
            'source_verification_attempts': 3.4,
            'misinformation_detection_speed': 45.6,
            'critical_thinking_score': 7.8,
            'news_bias_recognition': 74.2
        },
        'level_2': {
            'name': 'Shadow in the Inbox',
            'completion_rate': 76.4,
            'avg_time': 1435,
            'phishing_detection_rate': 76.8,
            'false_positive_rate': 12.3,
            'email_analysis_thoroughness': 68.7,
            'social_engineering_susceptibility': 23.4,
            'safe_protocol_adherence': 84.1
        },
        'level_3': {
            'name': 'Malware Mayhem',
            'completion_rate': 58.7,
            'avg_time': 1789,
            'malware_identification_accuracy': 71.5,
            'quarantine_effectiveness': 79.3,
            'system_cleanup_thoroughness': 66.8,
            'threat_propagation_prevention': 82.4,
            'security_tool_utilization': 73.6
        },
        'level_4': {
            'name': 'The White Hat Test',
            'completion_rate': 34.1,
            'avg_time': 2341,
            'vulnerability_discovery_rate': 3.2,
            'ethical_methodology_score': 87.1,
            'responsible_disclosure_rate': 94.3,
            'risk_assessment_accuracy': 78.9,
            'documentation_quality': 81.7
        },
        'level_5': {
            'name': 'The Hunt for The Null',
            'completion_rate': 18.9,
            'avg_time': 2987,
            'evidence_collection_score': 79.6,
            'data_analysis_depth': 72.3,
            'timeline_accuracy': 68.4,
            'attribution_confidence': 73.2,
            'investigation_methodology': 85.6
        }
    }
    
    return render_template('admin/player-data-analytics/levels.html',
                         level_details=level_details)


@data_analytics_bp.route('/player-analytics/blue-vs-red')
@login_required
@admin_required
def player_analytics_blue_vs_red():
    """Blue Team vs Red Team mode analytics."""
    blue_vs_red_data = {
        'overview': {
            'total_games': 1247,
            'avg_game_duration': 567,  # seconds
            'asset_protection_rate': 74.8,
            'player_win_rate': 68.3
        },
        'performance_metrics': {
            'threat_detection_speed': 127.3,
            'incident_response_effectiveness': 81.2,
            'security_control_optimization': 76.4,
            'ai_attack_success_rate': 34.7,
            'player_action_efficiency': 0.73,
            'alert_prioritization_accuracy': 79.8,
            'mttd': 89.4,
            'mttr': 234.7,
            'rto': 312.6
        },
        'asset_protection': {
            'academy_server': 78.2,
            'student_db': 74.1,
            'research_files': 71.9,
            'learning_platform': 75.6
        },
        'attack_patterns': [
            {'phase': 'reconnaissance', 'success_rate': 67.2, 'detection_rate': 45.8},
            {'phase': 'initial_access', 'success_rate': 52.4, 'detection_rate': 63.1},
            {'phase': 'persistence', 'success_rate': 38.7, 'detection_rate': 78.4},
            {'phase': 'privilege_escalation', 'success_rate': 29.3, 'detection_rate': 84.2},
            {'phase': 'data_exfiltration', 'success_rate': 18.6, 'detection_rate': 91.7}
        ]
    }
    
    return render_template('admin/player-data-analytics/blue-vs-red.html',
                         blue_vs_red_data=blue_vs_red_data)
