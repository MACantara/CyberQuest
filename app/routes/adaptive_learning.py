from flask import Blueprint, request, jsonify, current_app, session
from flask_login import login_required, current_user
import json
import uuid
from datetime import datetime
from app.models.adaptive_learning import (
    UserProgress, LearningAnalytics, AdaptivePreferences, 
    SkillAssessment, LearningRecommendation
)
from app.utils.adaptive_learning_engine import (
    AdaptiveLearningEngine, TutorialAdaptationEngine, GameificationEngine
)

adaptive_bp = Blueprint('adaptive_learning', __name__, url_prefix='/api/adaptive')

@adaptive_bp.route('/difficulty/<int:level_id>')
@login_required
def get_adaptive_difficulty(level_id):
    """Get recommended difficulty for a specific level."""
    try:
        level_type = request.args.get('level_type', 'simulation')
        difficulty = AdaptiveLearningEngine.calculate_adaptive_difficulty(
            current_user.id, level_id, level_type
        )
        
        return jsonify({
            'success': True,
            'difficulty': difficulty,
            'level_id': level_id,
            'level_type': level_type
        })
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@adaptive_bp.route('/progress', methods=['POST'])
@login_required
def update_progress():
    """Update user progress after completing a level or activity."""
    try:
        data = request.get_json()
        
        required_fields = ['level_id', 'score', 'time_spent']
        if not all(field in data for field in required_fields):
            return jsonify({'success': False, 'error': 'Missing required fields'}), 400
        
        level_id = data['level_id']
        score = data['score']
        time_spent = data['time_spent']
        level_type = data.get('level_type', 'simulation')
        hints_used = data.get('hints_used', 0)
        mistakes_made = data.get('mistakes_made', 0)
        difficulty = data.get('difficulty', 'normal')
        
        # Update learning path
        performance_data = {
            'score': score,
            'time_spent': time_spent,
            'hints_used': hints_used,
            'mistakes_made': mistakes_made,
            'difficulty': difficulty,
            'level_type': level_type
        }
        
        success = AdaptiveLearningEngine.update_learning_path(
            current_user.id, level_id, performance_data
        )
        
        if not success:
            return jsonify({'success': False, 'error': 'Failed to update progress'}), 500
        
        # Check for achievements
        achievements = GameificationEngine.check_achievements(
            current_user.id, 'level_complete', performance_data
        )
        
        # Get updated progress summary
        progress_summary = UserProgress.get_user_progress_summary(current_user.id)
        
        return jsonify({
            'success': True,
            'achievements': achievements,
            'progress_summary': progress_summary,
            'xp_earned': AdaptiveLearningEngine.calculate_xp_reward(
                AdaptiveLearningEngine._get_base_xp_for_level(level_id),
                difficulty, score, 
                time_spent < AdaptiveLearningEngine._estimate_completion_time(current_user.id, level_id) * 60,
                hints_used == 0
            )
        })
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@adaptive_bp.route('/analytics/log', methods=['POST'])
@login_required
def log_analytics():
    """Log user learning analytics."""
    try:
        data = request.get_json()
        
        session_id = session.get('learning_session_id')
        if not session_id:
            session_id = str(uuid.uuid4())
            session['learning_session_id'] = session_id
        
        level_id = data.get('level_id', 0)
        action_type = data.get('action_type', 'unknown')
        level_type = data.get('level_type', 'simulation')
        action_data = data.get('action_data', {})
        
        success = LearningAnalytics.log_action(
            current_user.id, session_id, level_id, action_type,
            level_type, action_data, 
            request.remote_addr, request.headers.get('User-Agent')
        )
        
        return jsonify({'success': success})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@adaptive_bp.route('/recommendations')
@login_required
def get_recommendations():
    """Get personalized learning recommendations."""
    try:
        recommendations = LearningRecommendation.get_user_recommendations(current_user.id)
        
        # Convert to JSON-serializable format
        rec_data = []
        for rec in recommendations:
            rec_data.append({
                'id': rec.id,
                'type': rec.recommendation_type,
                'target_level_id': rec.target_level_id,
                'target_level_type': rec.target_level_type,
                'target_skill': rec.target_skill,
                'data': rec.recommendation_data,
                'confidence_score': rec.confidence_score,
                'created_at': rec.created_at
            })
        
        return jsonify({
            'success': True,
            'recommendations': rec_data
        })
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@adaptive_bp.route('/recommendations/<int:rec_id>/action', methods=['POST'])
@login_required
def handle_recommendation_action(rec_id):
    """Handle user action on a recommendation (accept/dismiss)."""
    try:
        data = request.get_json()
        action = data.get('action', 'dismiss')  # accept, dismiss, complete
        
        # Get recommendation
        recommendations = LearningRecommendation.get_user_recommendations(current_user.id, False)
        recommendation = next((r for r in recommendations if r.id == rec_id), None)
        
        if not recommendation:
            return jsonify({'success': False, 'error': 'Recommendation not found'}), 404
        
        # Update recommendation status
        success = recommendation.update_status(action)
        
        return jsonify({'success': success})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@adaptive_bp.route('/preferences', methods=['GET', 'POST'])
@login_required
def manage_preferences():
    """Get or update user adaptive learning preferences."""
    try:
        if request.method == 'GET':
            preferences = AdaptivePreferences.get_by_user(current_user.id)
            
            if not preferences:
                # Create default preferences
                preferences = AdaptivePreferences.create_default(current_user.id)
            
            if preferences:
                return jsonify({
                    'success': True,
                    'preferences': {
                        'learning_style': preferences.learning_style,
                        'difficulty_preference': preferences.difficulty_preference,
                        'hint_frequency': preferences.hint_frequency,
                        'preferred_pace': preferences.preferred_pace,
                        'tutorial_skip_allowed': preferences.tutorial_skip_allowed
                    }
                })
            else:
                return jsonify({'success': False, 'error': 'Could not retrieve preferences'}), 500
        
        elif request.method == 'POST':
            data = request.get_json()
            
            preferences = AdaptivePreferences.get_by_user(current_user.id)
            if not preferences:
                preferences = AdaptivePreferences.create_default(current_user.id)
            
            # Update preferences
            if 'learning_style' in data:
                preferences.learning_style = data['learning_style']
            if 'difficulty_preference' in data:
                preferences.difficulty_preference = data['difficulty_preference']
            if 'hint_frequency' in data:
                preferences.hint_frequency = data['hint_frequency']
            if 'preferred_pace' in data:
                preferences.preferred_pace = data['preferred_pace']
            if 'tutorial_skip_allowed' in data:
                preferences.tutorial_skip_allowed = data['tutorial_skip_allowed']
            
            success = preferences.save()
            
            return jsonify({'success': success})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@adaptive_bp.route('/next-activity')
@login_required
def get_next_activity():
    """Get suggested next learning activity."""
    try:
        suggestion = AdaptiveLearningEngine.suggest_next_activity(current_user.id)
        return jsonify({
            'success': True,
            'suggestion': suggestion
        })
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@adaptive_bp.route('/learning-patterns')
@login_required
def get_learning_patterns():
    """Get user's learning pattern analysis."""
    try:
        days = request.args.get('days', 30, type=int)
        patterns = AdaptiveLearningEngine.analyze_learning_patterns(current_user.id, days)
        
        return jsonify({
            'success': True,
            'patterns': patterns
        })
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@adaptive_bp.route('/tutorial/config/<tutorial_type>')
@login_required
def get_tutorial_config(tutorial_type):
    """Get adaptive tutorial configuration."""
    try:
        skip_allowed = TutorialAdaptationEngine.should_skip_tutorial(current_user.id, tutorial_type)
        pace = TutorialAdaptationEngine.get_tutorial_pace(current_user.id)
        style = TutorialAdaptationEngine.get_tutorial_style(current_user.id)
        
        return jsonify({
            'success': True,
            'config': {
                'skip_allowed': skip_allowed,
                'pace': pace,
                'style': style,
                'tutorial_type': tutorial_type
            }
        })
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@adaptive_bp.route('/hint/should-show')
@login_required
def should_show_hint():
    """Check if a hint should be shown based on user struggle time."""
    try:
        struggle_time = request.args.get('struggle_time', 0, type=int)
        should_show = AdaptiveLearningEngine.calculate_hint_timing(current_user.id, struggle_time)
        
        return jsonify({
            'success': True,
            'should_show_hint': should_show,
            'struggle_time': struggle_time
        })
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@adaptive_bp.route('/skills')
@login_required
def get_skill_assessments():
    """Get user's skill assessments."""
    try:
        skills = SkillAssessment.get_user_skills(current_user.id)
        
        skill_data = {}
        for skill_name, assessment in skills.items():
            skill_data[skill_name] = {
                'score': assessment.assessment_score,
                'max_score': assessment.max_score,
                'proficiency_level': assessment.proficiency_level,
                'level_id': assessment.level_id,
                'level_type': assessment.level_type,
                'assessed_at': assessment.assessed_at
            }
        
        return jsonify({
            'success': True,
            'skills': skill_data
        })
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500