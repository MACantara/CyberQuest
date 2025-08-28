"""
User progress tracking models for CyberQuest levels.
"""
from app.database import get_supabase, handle_supabase_error, DatabaseError
from flask_login import current_user
from datetime import datetime
from typing import Dict, List, Optional, Any
import logging

logger = logging.getLogger(__name__)

class UserProgress:
    """Model for tracking user progress in cybersecurity levels."""
    
    @staticmethod
    def get_user_progress(user_id: int, level_type: str = 'simulation') -> List[Dict[str, Any]]:
        """Get all progress records for a user."""
        try:
            supabase = get_supabase()
            response = supabase.table('user_progress').select('*').eq('user_id', user_id).eq('level_type', level_type).execute()
            return handle_supabase_error(response)
        except Exception as e:
            logger.error(f"Error fetching user progress for user {user_id}: {e}")
            return []
    
    @staticmethod
    def get_level_progress(user_id: int, level_id: int, level_type: str = 'simulation') -> Optional[Dict[str, Any]]:
        """Get progress for a specific level."""
        try:
            supabase = get_supabase()
            response = supabase.table('user_progress').select('*').eq('user_id', user_id).eq('level_id', level_id).eq('level_type', level_type).single().execute()
            return handle_supabase_error(response)
        except Exception as e:
            logger.debug(f"No progress found for user {user_id}, level {level_id}: {e}")
            return None
    
    @staticmethod
    def create_or_update_progress(user_id: int, level_id: int, data: Dict[str, Any]) -> Dict[str, Any]:
        """Create or update progress for a level."""
        try:
            supabase = get_supabase()
            
            # Set default values
            progress_data = {
                'user_id': user_id,
                'level_id': level_id,
                'level_type': data.get('level_type', 'simulation'),
                'status': data.get('status', 'not_started'),
                'score': data.get('score', 0),
                'max_score': data.get('max_score', 100),
                'completion_percentage': data.get('completion_percentage', 0.0),
                'time_spent': data.get('time_spent', 0),
                'attempts': data.get('attempts', 1),
                'xp_earned': data.get('xp_earned', 0),
                'hints_used': data.get('hints_used', 0),
                'mistakes_made': data.get('mistakes_made', 0),
                'updated_at': datetime.utcnow().isoformat()
            }
            
            # Set completion timestamp if completed
            if data.get('status') == 'completed':
                progress_data['completed_at'] = data.get('completed_at', datetime.utcnow().isoformat())
            
            # Set start timestamp if starting
            if data.get('status') == 'in_progress' and not UserProgress.get_level_progress(user_id, level_id):
                progress_data['started_at'] = datetime.utcnow().isoformat()
            
            # Use upsert to handle both create and update
            response = supabase.table('user_progress').upsert(progress_data, on_conflict='user_id,level_id,level_type').execute()
            return handle_supabase_error(response)[0]
            
        except Exception as e:
            logger.error(f"Error creating/updating progress for user {user_id}, level {level_id}: {e}")
            raise DatabaseError(f"Failed to update progress: {e}")
    
    @staticmethod
    def mark_level_completed(user_id: int, level_id: int, score: int = 100, xp_earned: int = 0, time_spent: int = 0) -> Dict[str, Any]:
        """Mark a level as completed."""
        completion_data = {
            'status': 'completed',
            'score': score,
            'completion_percentage': 100.0,
            'xp_earned': xp_earned,
            'time_spent': time_spent,
            'completed_at': datetime.utcnow().isoformat()
        }
        return UserProgress.create_or_update_progress(user_id, level_id, completion_data)
    
    @staticmethod
    def start_level(user_id: int, level_id: int) -> Dict[str, Any]:
        """Mark a level as started."""
        start_data = {
            'status': 'in_progress',
            'started_at': datetime.utcnow().isoformat()
        }
        return UserProgress.create_or_update_progress(user_id, level_id, start_data)
    
    @staticmethod
    def get_user_stats(user_id: int) -> Dict[str, Any]:
        """Get comprehensive user statistics."""
        try:
            progress_records = UserProgress.get_user_progress(user_id)
            
            stats = {
                'total_levels': 5,  # Total available levels
                'completed_levels': 0,
                'in_progress_levels': 0,
                'total_xp': 0,
                'total_time_spent': 0,
                'average_score': 0,
                'completion_percentage': 0,
                'level_progress': {}
            }
            
            completed_scores = []
            
            for progress in progress_records:
                level_id = progress['level_id']
                stats['level_progress'][level_id] = progress
                
                if progress['status'] == 'completed':
                    stats['completed_levels'] += 1
                    stats['total_xp'] += progress.get('xp_earned', 0)
                    completed_scores.append(progress.get('score', 0))
                elif progress['status'] == 'in_progress':
                    stats['in_progress_levels'] += 1
                
                stats['total_time_spent'] += progress.get('time_spent', 0)
            
            # Calculate averages
            if completed_scores:
                stats['average_score'] = sum(completed_scores) / len(completed_scores)
            
            stats['completion_percentage'] = (stats['completed_levels'] / stats['total_levels']) * 100
            
            return stats
            
        except Exception as e:
            logger.error(f"Error getting user stats for user {user_id}: {e}")
            return {
                'total_levels': 5,
                'completed_levels': 0,
                'in_progress_levels': 0,
                'total_xp': 0,
                'total_time_spent': 0,
                'average_score': 0,
                'completion_percentage': 0,
                'level_progress': {}
            }

    @staticmethod
    def clear_level_progress(user_id: int, level_id: int, level_type: str = 'simulation') -> bool:
        """Clear all progress data for a specific level."""
        try:
            supabase = get_supabase()
            response = supabase.table('user_progress').delete().eq('user_id', user_id).eq('level_id', level_id).eq('level_type', level_type).execute()
            handle_supabase_error(response)
            logger.info(f"Cleared progress for user {user_id}, level {level_id}")
            return True
        except Exception as e:
            logger.error(f"Error clearing level progress for user {user_id}, level {level_id}: {e}")
            return False

class LearningAnalytics:
    """Model for tracking detailed learning analytics."""
    
    @staticmethod
    def log_action(user_id: int, session_id: str, level_id: int, action_type: str, action_data: Dict = None, level_type: str = 'simulation'):
        """Log a user action for analytics."""
        try:
            supabase = get_supabase()
            
            analytics_data = {
                'user_id': user_id,
                'session_id': session_id,
                'level_id': level_id,
                'level_type': level_type,
                'action_type': action_type,
                'action_data': action_data or {},
                'timestamp': datetime.utcnow().isoformat()
            }
            
            response = supabase.table('learning_analytics').insert(analytics_data).execute()
            return handle_supabase_error(response)
            
        except Exception as e:
            logger.error(f"Error logging analytics action: {e}")
            # Don't raise error for analytics - just log it
            pass

class SkillAssessment:
    """Model for tracking skill-specific assessments."""
    
    @staticmethod
    def update_skill_assessment(user_id: int, skill_name: str, level_id: int, assessment_score: float, max_score: float = 100.0):
        """Update or create a skill assessment."""
        try:
            supabase = get_supabase()
            
            # Determine proficiency level based on score percentage
            score_percentage = (assessment_score / max_score) * 100
            if score_percentage >= 90:
                proficiency = 'expert'
            elif score_percentage >= 80:
                proficiency = 'advanced'
            elif score_percentage >= 70:
                proficiency = 'intermediate'
            elif score_percentage >= 50:
                proficiency = 'beginner'
            else:
                proficiency = 'novice'
            
            assessment_data = {
                'user_id': user_id,
                'skill_name': skill_name,
                'level_id': level_id,
                'assessment_score': assessment_score,
                'max_score': max_score,
                'proficiency_level': proficiency,
                'updated_at': datetime.utcnow().isoformat()
            }
            
            response = supabase.table('skill_assessments').upsert(assessment_data, on_conflict='user_id,skill_name,level_id').execute()
            return handle_supabase_error(response)
            
        except Exception as e:
            logger.error(f"Error updating skill assessment: {e}")
            return None