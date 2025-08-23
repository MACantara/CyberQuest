from datetime import datetime, timedelta
from typing import Optional, List, Dict, Any, Union
import json
from app.database import get_supabase, Tables, handle_supabase_error, DatabaseError

class UserProgress:
    def __init__(self, data: Dict[str, Any]):
        """Initialize UserProgress from Supabase data."""
        self.id = data.get('id')
        self.user_id = data.get('user_id')
        self.level_id = data.get('level_id')
        self.level_type = data.get('level_type', 'simulation')
        self.status = data.get('status', 'not_started')
        self.score = data.get('score', 0)
        self.max_score = data.get('max_score', 100)
        self.completion_percentage = float(data.get('completion_percentage', 0.0))
        self.time_spent = data.get('time_spent', 0)
        self.attempts = data.get('attempts', 0)
        self.completed_at = data.get('completed_at')
        self.started_at = data.get('started_at')
        self.updated_at = data.get('updated_at')
        self.created_at = data.get('created_at')
        self.xp_earned = data.get('xp_earned', 0)
        self.hints_used = data.get('hints_used', 0)
        self.mistakes_made = data.get('mistakes_made', 0)

    @classmethod
    def get_by_user_and_level(cls, user_id: int, level_id: int, level_type: str = 'simulation') -> Optional['UserProgress']:
        """Get user progress for a specific level."""
        try:
            supabase = get_supabase()
            if not supabase:
                return None
            
            response = supabase.table('user_progress').select('*').eq('user_id', user_id).eq('level_id', level_id).eq('level_type', level_type).single().execute()
            
            if response.data:
                return cls(response.data)
            return None
        except Exception as e:
            return None

    @classmethod
    def get_user_progress_summary(cls, user_id: int) -> Dict[str, Any]:
        """Get comprehensive progress summary for a user."""
        try:
            supabase = get_supabase()
            if not supabase:
                return {}
            
            # Get all progress records for user
            response = supabase.table('user_progress').select('*').eq('user_id', user_id).execute()
            
            progress_data = response.data or []
            
            # Calculate summary statistics
            total_levels = len(progress_data)
            completed_levels = len([p for p in progress_data if p['status'] == 'completed'])
            total_xp = sum([p.get('xp_earned', 0) for p in progress_data])
            total_time = sum([p.get('time_spent', 0) for p in progress_data])
            avg_score = sum([p.get('score', 0) for p in progress_data if p.get('score', 0) > 0]) / max(1, len([p for p in progress_data if p.get('score', 0) > 0]))
            
            # Determine user rank based on XP
            if total_xp < 100:
                user_rank = "Novice"
            elif total_xp < 500:
                user_rank = "Apprentice"
            elif total_xp < 1000:
                user_rank = "Guardian"
            elif total_xp < 2000:
                user_rank = "Expert"
            else:
                user_rank = "Master"
            
            # Calculate learning streak (simplified - consecutive days with activity)
            learning_streak = cls._calculate_learning_streak(user_id)
            
            return {
                'total_levels': total_levels,
                'completed_levels': completed_levels,
                'total_xp': total_xp,
                'total_time_minutes': total_time // 60,
                'average_score': round(avg_score, 1),
                'user_rank': user_rank,
                'learning_streak': learning_streak,
                'progress_data': progress_data
            }
        except Exception as e:
            return {}

    @classmethod
    def _calculate_learning_streak(cls, user_id: int) -> int:
        """Calculate consecutive days of learning activity."""
        try:
            supabase = get_supabase()
            if not supabase:
                return 0
            
            # Get recent learning analytics
            seven_days_ago = (datetime.now() - timedelta(days=7)).isoformat()
            response = supabase.table('learning_analytics').select('timestamp').eq('user_id', user_id).gte('timestamp', seven_days_ago).order('timestamp', desc=True).execute()
            
            if not response.data:
                return 0
            
            # Count consecutive days with activity
            dates = set()
            for record in response.data:
                timestamp = datetime.fromisoformat(record['timestamp'].replace('Z', ''))
                dates.add(timestamp.date())
            
            # Simple streak calculation
            streak = 0
            current_date = datetime.now().date()
            while current_date in dates:
                streak += 1
                current_date -= timedelta(days=1)
            
            return streak
        except Exception:
            return 0

    def save(self) -> bool:
        """Save or update user progress."""
        try:
            supabase = get_supabase()
            if not supabase:
                return False
            
            data = {
                'user_id': self.user_id,
                'level_id': self.level_id,
                'level_type': self.level_type,
                'status': self.status,
                'score': self.score,
                'max_score': self.max_score,
                'completion_percentage': self.completion_percentage,
                'time_spent': self.time_spent,
                'attempts': self.attempts,
                'xp_earned': self.xp_earned,
                'hints_used': self.hints_used,
                'mistakes_made': self.mistakes_made,
                'updated_at': datetime.now().isoformat()
            }
            
            if self.status == 'completed' and not self.completed_at:
                data['completed_at'] = datetime.now().isoformat()
                self.completed_at = data['completed_at']
            
            if self.id:
                # Update existing record
                response = supabase.table('user_progress').update(data).eq('id', self.id).execute()
            else:
                # Create new record
                data['created_at'] = datetime.now().isoformat()
                response = supabase.table('user_progress').insert(data).execute()
                if response.data:
                    self.id = response.data[0]['id']
            
            return True
        except Exception as e:
            return False

class LearningAnalytics:
    def __init__(self, data: Dict[str, Any]):
        """Initialize LearningAnalytics from Supabase data."""
        self.id = data.get('id')
        self.user_id = data.get('user_id')
        self.session_id = data.get('session_id')
        self.level_id = data.get('level_id')
        self.level_type = data.get('level_type', 'simulation')
        self.action_type = data.get('action_type')
        self.action_data = data.get('action_data', {})
        self.timestamp = data.get('timestamp')
        self.ip_address = data.get('ip_address')
        self.user_agent = data.get('user_agent')

    @classmethod
    def log_action(cls, user_id: int, session_id: str, level_id: int, action_type: str, 
                   level_type: str = 'simulation', action_data: Dict = None, 
                   ip_address: str = None, user_agent: str = None) -> bool:
        """Log a learning action."""
        try:
            supabase = get_supabase()
            if not supabase:
                return False
            
            data = {
                'user_id': user_id,
                'session_id': session_id,
                'level_id': level_id,
                'level_type': level_type,
                'action_type': action_type,
                'action_data': action_data or {},
                'timestamp': datetime.now().isoformat(),
                'ip_address': ip_address,
                'user_agent': user_agent
            }
            
            response = supabase.table('learning_analytics').insert(data).execute()
            return True
        except Exception as e:
            return False

    @classmethod
    def get_user_analytics(cls, user_id: int, days: int = 30) -> List[Dict[str, Any]]:
        """Get user analytics for the specified number of days."""
        try:
            supabase = get_supabase()
            if not supabase:
                return []
            
            start_date = (datetime.now() - timedelta(days=days)).isoformat()
            response = supabase.table('learning_analytics').select('*').eq('user_id', user_id).gte('timestamp', start_date).order('timestamp', desc=True).execute()
            
            return response.data or []
        except Exception as e:
            return []

class AdaptivePreferences:
    def __init__(self, data: Dict[str, Any]):
        """Initialize AdaptivePreferences from Supabase data."""
        self.id = data.get('id')
        self.user_id = data.get('user_id')
        self.learning_style = data.get('learning_style', 'balanced')
        self.difficulty_preference = data.get('difficulty_preference', 'adaptive')
        self.hint_frequency = data.get('hint_frequency', 'normal')
        self.preferred_pace = data.get('preferred_pace', 'normal')
        self.tutorial_skip_allowed = data.get('tutorial_skip_allowed', False)
        self.updated_at = data.get('updated_at')
        self.created_at = data.get('created_at')

    @classmethod
    def get_by_user(cls, user_id: int) -> Optional['AdaptivePreferences']:
        """Get adaptive preferences for a user."""
        try:
            supabase = get_supabase()
            if not supabase:
                return None
            
            response = supabase.table('adaptive_preferences').select('*').eq('user_id', user_id).single().execute()
            
            if response.data:
                return cls(response.data)
            return None
        except Exception as e:
            return None

    @classmethod
    def create_default(cls, user_id: int) -> Optional['AdaptivePreferences']:
        """Create default preferences for a new user."""
        try:
            supabase = get_supabase()
            if not supabase:
                return None
            
            data = {
                'user_id': user_id,
                'learning_style': 'balanced',
                'difficulty_preference': 'adaptive',
                'hint_frequency': 'normal',
                'preferred_pace': 'normal',
                'tutorial_skip_allowed': False,
                'created_at': datetime.now().isoformat(),
                'updated_at': datetime.now().isoformat()
            }
            
            response = supabase.table('adaptive_preferences').insert(data).execute()
            
            if response.data:
                return cls(response.data[0])
            return None
        except Exception as e:
            return None

    def save(self) -> bool:
        """Save or update preferences."""
        try:
            supabase = get_supabase()
            if not supabase:
                return False
            
            data = {
                'learning_style': self.learning_style,
                'difficulty_preference': self.difficulty_preference,
                'hint_frequency': self.hint_frequency,
                'preferred_pace': self.preferred_pace,
                'tutorial_skip_allowed': self.tutorial_skip_allowed,
                'updated_at': datetime.now().isoformat()
            }
            
            if self.id:
                response = supabase.table('adaptive_preferences').update(data).eq('id', self.id).execute()
            else:
                data['user_id'] = self.user_id
                data['created_at'] = datetime.now().isoformat()
                response = supabase.table('adaptive_preferences').insert(data).execute()
                if response.data:
                    self.id = response.data[0]['id']
            
            return True
        except Exception as e:
            return False

class SkillAssessment:
    def __init__(self, data: Dict[str, Any]):
        """Initialize SkillAssessment from Supabase data."""
        self.id = data.get('id')
        self.user_id = data.get('user_id')
        self.skill_name = data.get('skill_name')
        self.level_id = data.get('level_id')
        self.level_type = data.get('level_type', 'simulation')
        self.assessment_score = float(data.get('assessment_score', 0.0))
        self.max_score = float(data.get('max_score', 100.0))
        self.proficiency_level = data.get('proficiency_level', 'novice')
        self.assessed_at = data.get('assessed_at')
        self.updated_at = data.get('updated_at')

    @classmethod
    def assess_skill(cls, user_id: int, skill_name: str, level_id: int, score: float, 
                     max_score: float = 100.0, level_type: str = 'simulation') -> Optional['SkillAssessment']:
        """Create or update a skill assessment."""
        try:
            supabase = get_supabase()
            if not supabase:
                return None
            
            # Calculate proficiency level
            percentage = (score / max_score) * 100
            if percentage < 20:
                proficiency = 'novice'
            elif percentage < 40:
                proficiency = 'beginner'
            elif percentage < 70:
                proficiency = 'intermediate'
            elif percentage < 90:
                proficiency = 'advanced'
            else:
                proficiency = 'expert'
            
            data = {
                'user_id': user_id,
                'skill_name': skill_name,
                'level_id': level_id,
                'level_type': level_type,
                'assessment_score': score,
                'max_score': max_score,
                'proficiency_level': proficiency,
                'assessed_at': datetime.now().isoformat(),
                'updated_at': datetime.now().isoformat()
            }
            
            response = supabase.table('skill_assessments').insert(data).execute()
            
            if response.data:
                return cls(response.data[0])
            return None
        except Exception as e:
            return None

    @classmethod
    def get_user_skills(cls, user_id: int) -> Dict[str, 'SkillAssessment']:
        """Get latest skill assessments for a user."""
        try:
            supabase = get_supabase()
            if not supabase:
                return {}
            
            response = supabase.table('skill_assessments').select('*').eq('user_id', user_id).order('assessed_at', desc=True).execute()
            
            # Get most recent assessment for each skill
            skills = {}
            for assessment_data in response.data or []:
                skill_name = assessment_data['skill_name']
                if skill_name not in skills:
                    skills[skill_name] = cls(assessment_data)
            
            return skills
        except Exception as e:
            return {}

class LearningRecommendation:
    def __init__(self, data: Dict[str, Any]):
        """Initialize LearningRecommendation from Supabase data."""
        self.id = data.get('id')
        self.user_id = data.get('user_id')
        self.recommendation_type = data.get('recommendation_type')
        self.target_level_id = data.get('target_level_id')
        self.target_level_type = data.get('target_level_type')
        self.target_skill = data.get('target_skill')
        self.recommendation_data = data.get('recommendation_data', {})
        self.confidence_score = float(data.get('confidence_score', 0.0))
        self.status = data.get('status', 'pending')
        self.created_at = data.get('created_at')
        self.expires_at = data.get('expires_at')
        self.acted_on_at = data.get('acted_on_at')

    @classmethod
    def generate_recommendations(cls, user_id: int) -> List['LearningRecommendation']:
        """Generate personalized learning recommendations for a user."""
        try:
            # Get user progress and preferences
            progress_summary = UserProgress.get_user_progress_summary(user_id)
            preferences = AdaptivePreferences.get_by_user(user_id)
            skills = SkillAssessment.get_user_skills(user_id)
            
            recommendations = []
            
            # Recommend next level based on progress
            if progress_summary.get('completed_levels', 0) < 5:
                next_level = progress_summary.get('completed_levels', 0) + 1
                recommendations.append(cls._create_next_level_recommendation(user_id, next_level))
            
            # Recommend skill improvement based on weakest skills
            weak_skills = cls._identify_weak_skills(skills)
            for skill in weak_skills[:2]:  # Limit to top 2 recommendations
                recommendations.append(cls._create_skill_improvement_recommendation(user_id, skill))
            
            # Recommend difficulty adjustment if needed
            if cls._should_adjust_difficulty(progress_summary):
                recommendations.append(cls._create_difficulty_adjustment_recommendation(user_id, progress_summary))
            
            # Save recommendations to database
            saved_recommendations = []
            for rec_data in recommendations:
                if rec_data:
                    saved_rec = cls._save_recommendation(rec_data)
                    if saved_rec:
                        saved_recommendations.append(saved_rec)
            
            return saved_recommendations
        except Exception as e:
            return []

    @classmethod
    def _create_next_level_recommendation(cls, user_id: int, level_id: int) -> Dict[str, Any]:
        """Create a next level recommendation."""
        level_names = {
            1: "The Misinformation Maze",
            2: "Shadow in the Inbox", 
            3: "Malware Mayhem",
            4: "The White Hat Test",
            5: "The Hunt for The Null"
        }
        
        return {
            'user_id': user_id,
            'recommendation_type': 'next_level',
            'target_level_id': level_id,
            'target_level_type': 'simulation',
            'recommendation_data': {
                'title': f'Continue Your Journey: {level_names.get(level_id, f"Level {level_id}")}',
                'description': f'You\'re ready to tackle level {level_id}!',
                'reason': 'Based on your current progress'
            },
            'confidence_score': 0.9,
            'expires_at': (datetime.now() + timedelta(days=7)).isoformat()
        }

    @classmethod
    def _create_skill_improvement_recommendation(cls, user_id: int, skill: str) -> Dict[str, Any]:
        """Create a skill improvement recommendation."""
        return {
            'user_id': user_id,
            'recommendation_type': 'skill_improvement',
            'target_skill': skill,
            'recommendation_data': {
                'title': f'Improve Your {skill.replace("_", " ").title()} Skills',
                'description': f'Practice exercises to strengthen your {skill.replace("_", " ")} abilities',
                'reason': 'This skill needs additional practice'
            },
            'confidence_score': 0.7,
            'expires_at': (datetime.now() + timedelta(days=14)).isoformat()
        }

    @classmethod
    def _create_difficulty_adjustment_recommendation(cls, user_id: int, progress_summary: Dict) -> Dict[str, Any]:
        """Create a difficulty adjustment recommendation."""
        avg_score = progress_summary.get('average_score', 0)
        
        if avg_score > 90:
            suggestion = 'increase'
            reason = 'You\'re excelling! Try a higher difficulty for more challenge.'
        else:
            suggestion = 'decrease'
            reason = 'Consider lowering the difficulty to build confidence.'
        
        return {
            'user_id': user_id,
            'recommendation_type': 'difficulty_adjustment',
            'recommendation_data': {
                'title': f'Adjust Difficulty Level',
                'description': f'Consider {suggestion}ing the difficulty level',
                'suggestion': suggestion,
                'reason': reason
            },
            'confidence_score': 0.6,
            'expires_at': (datetime.now() + timedelta(days=30)).isoformat()
        }

    @classmethod
    def _identify_weak_skills(cls, skills: Dict[str, 'SkillAssessment']) -> List[str]:
        """Identify skills that need improvement."""
        weak_skills = []
        for skill_name, assessment in skills.items():
            if assessment.proficiency_level in ['novice', 'beginner']:
                weak_skills.append(skill_name)
        return weak_skills

    @classmethod
    def _should_adjust_difficulty(cls, progress_summary: Dict) -> bool:
        """Determine if difficulty should be adjusted."""
        avg_score = progress_summary.get('average_score', 0)
        return avg_score > 95 or avg_score < 60

    @classmethod
    def _save_recommendation(cls, rec_data: Dict[str, Any]) -> Optional['LearningRecommendation']:
        """Save recommendation to database."""
        try:
            supabase = get_supabase()
            if not supabase:
                return None
            
            rec_data['created_at'] = datetime.now().isoformat()
            response = supabase.table('learning_recommendations').insert(rec_data).execute()
            
            if response.data:
                return cls(response.data[0])
            return None
        except Exception as e:
            return None

    @classmethod
    def get_user_recommendations(cls, user_id: int, active_only: bool = True) -> List['LearningRecommendation']:
        """Get recommendations for a user."""
        try:
            supabase = get_supabase()
            if not supabase:
                return []
            
            query = supabase.table('learning_recommendations').select('*').eq('user_id', user_id)
            
            if active_only:
                query = query.eq('status', 'pending').gte('expires_at', datetime.now().isoformat())
            
            response = query.order('created_at', desc=True).execute()
            
            return [cls(data) for data in response.data or []]
        except Exception as e:
            return []

    def update_status(self, status: str) -> bool:
        """Update recommendation status."""
        try:
            supabase = get_supabase()
            if not supabase:
                return False
            
            data = {
                'status': status,
                'acted_on_at': datetime.now().isoformat()
            }
            
            response = supabase.table('learning_recommendations').update(data).eq('id', self.id).execute()
            
            self.status = status
            self.acted_on_at = data['acted_on_at']
            return True
        except Exception as e:
            return False
