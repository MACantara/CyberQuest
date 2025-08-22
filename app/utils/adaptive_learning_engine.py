"""
Adaptive Learning Engine Utilities
Provides intelligent learning path recommendations and difficulty adjustments
"""

import json
import math
from datetime import datetime, timedelta
from typing import Dict, List, Any, Tuple, Optional
from app.models.adaptive_learning import (
    UserProgress, LearningAnalytics, AdaptivePreferences, 
    SkillAssessment, LearningRecommendation
)

class AdaptiveLearningEngine:
    """Core engine for adaptive learning recommendations and adjustments."""
    
    # Skill mappings for each level
    LEVEL_SKILLS = {
        1: ['critical_thinking', 'source_verification', 'fact_checking'],
        2: ['phishing_detection', 'email_analysis', 'social_engineering'],
        3: ['malware_recognition', 'system_security', 'threat_analysis'],
        4: ['penetration_testing', 'vulnerability_assessment', 'ethical_hacking'],
        5: ['digital_forensics', 'evidence_analysis', 'advanced_investigation']
    }
    
    # XP rewards for different difficulty levels
    XP_MULTIPLIERS = {
        'easy': 0.8,
        'normal': 1.0,
        'hard': 1.5,
        'expert': 2.0
    }
    
    @classmethod
    def calculate_adaptive_difficulty(cls, user_id: int, level_id: int, level_type: str = 'simulation') -> str:
        """Calculate the optimal difficulty for a user on a specific level."""
        try:
            # Get user's historical performance
            progress_summary = UserProgress.get_user_progress_summary(user_id)
            preferences = AdaptivePreferences.get_by_user(user_id)
            
            # Default to normal if no data
            if not progress_summary or progress_summary['completed_levels'] == 0:
                return preferences.difficulty_preference if preferences else 'normal'
            
            avg_score = progress_summary.get('average_score', 75)
            completion_rate = progress_summary['completed_levels'] / max(1, progress_summary['total_levels'])
            
            # Calculate difficulty score (0-100)
            difficulty_score = (avg_score * 0.6) + (completion_rate * 100 * 0.4)
            
            # Adjust based on user preferences
            if preferences and preferences.difficulty_preference != 'adaptive':
                return preferences.difficulty_preference
            
            # Map score to difficulty level
            if difficulty_score >= 85:
                return 'hard'
            elif difficulty_score >= 70:
                return 'normal'
            elif difficulty_score >= 55:
                return 'easy'
            else:
                return 'easy'
                
        except Exception as e:
            return 'normal'
    
    @classmethod
    def calculate_hint_timing(cls, user_id: int, current_struggle_time: int) -> bool:
        """Determine if a hint should be offered based on user preferences and struggle time."""
        try:
            preferences = AdaptivePreferences.get_by_user(user_id)
            
            if not preferences:
                base_time = 60  # 1 minute default
            else:
                hint_frequency = preferences.hint_frequency
                if hint_frequency == 'minimal':
                    base_time = 180  # 3 minutes
                elif hint_frequency == 'frequent':
                    base_time = 30   # 30 seconds
                else:
                    base_time = 60   # 1 minute normal
            
            return current_struggle_time >= base_time
            
        except Exception as e:
            return current_struggle_time >= 60
    
    @classmethod
    def calculate_xp_reward(cls, base_xp: int, difficulty: str, performance_score: float, 
                           time_bonus: bool = False, no_hints_bonus: bool = False) -> int:
        """Calculate XP reward based on difficulty and performance."""
        try:
            # Base XP with difficulty multiplier
            xp = base_xp * cls.XP_MULTIPLIERS.get(difficulty, 1.0)
            
            # Performance multiplier (0.5 to 1.5 based on score percentage)
            performance_multiplier = 0.5 + (performance_score / 100.0)
            xp *= performance_multiplier
            
            # Bonus multipliers
            if time_bonus:
                xp *= 1.2  # 20% bonus for fast completion
            
            if no_hints_bonus:
                xp *= 1.1  # 10% bonus for not using hints
            
            return int(xp)
            
        except Exception as e:
            return base_xp
    
    @classmethod
    def analyze_learning_patterns(cls, user_id: int, days: int = 30) -> Dict[str, Any]:
        """Analyze user's learning patterns and provide insights."""
        try:
            analytics = LearningAnalytics.get_user_analytics(user_id, days)
            
            if not analytics:
                return {'status': 'insufficient_data'}
            
            # Group by day and analyze patterns
            daily_activity = {}
            action_counts = {}
            
            for record in analytics:
                timestamp = datetime.fromisoformat(record['timestamp'].replace('Z', ''))
                day_key = timestamp.date().isoformat()
                action_type = record['action_type']
                
                if day_key not in daily_activity:
                    daily_activity[day_key] = 0
                daily_activity[day_key] += 1
                
                if action_type not in action_counts:
                    action_counts[action_type] = 0
                action_counts[action_type] += 1
            
            # Calculate patterns
            avg_daily_activity = sum(daily_activity.values()) / max(1, len(daily_activity))
            most_active_day = max(daily_activity.items(), key=lambda x: x[1]) if daily_activity else None
            
            # Determine preferred learning time (simplified - would need hour analysis)
            preferred_time = cls._determine_preferred_time(analytics)
            
            # Calculate engagement score
            engagement_score = min(100, (avg_daily_activity / 10) * 100)
            
            return {
                'status': 'success',
                'avg_daily_activity': round(avg_daily_activity, 1),
                'total_sessions': len(set(r['session_id'] for r in analytics)),
                'most_active_day': most_active_day,
                'preferred_time': preferred_time,
                'engagement_score': round(engagement_score, 1),
                'action_breakdown': action_counts,
                'recommendations': cls._generate_pattern_recommendations(
                    avg_daily_activity, engagement_score, action_counts
                )
            }
            
        except Exception as e:
            return {'status': 'error', 'message': str(e)}
    
    @classmethod
    def _determine_preferred_time(cls, analytics: List[Dict]) -> str:
        """Determine user's preferred learning time."""
        try:
            hour_counts = {}
            
            for record in analytics:
                timestamp = datetime.fromisoformat(record['timestamp'].replace('Z', ''))
                hour = timestamp.hour
                
                if hour not in hour_counts:
                    hour_counts[hour] = 0
                hour_counts[hour] += 1
            
            if not hour_counts:
                return 'unknown'
            
            peak_hour = max(hour_counts.items(), key=lambda x: x[1])[0]
            
            if 6 <= peak_hour < 12:
                return 'morning'
            elif 12 <= peak_hour < 18:
                return 'afternoon'
            elif 18 <= peak_hour < 22:
                return 'evening'
            else:
                return 'night'
                
        except Exception:
            return 'unknown'
    
    @classmethod
    def _generate_pattern_recommendations(cls, avg_activity: float, engagement: float, 
                                        actions: Dict[str, int]) -> List[str]:
        """Generate recommendations based on learning patterns."""
        recommendations = []
        
        if avg_activity < 2:
            recommendations.append("Try to engage with learning materials more frequently for better retention.")
        
        if engagement < 50:
            recommendations.append("Consider shorter, more focused learning sessions.")
        
        if actions.get('hint_used', 0) > actions.get('complete', 0):
            recommendations.append("Try solving challenges without hints first to build confidence.")
        
        if actions.get('mistake', 0) > actions.get('complete', 0) * 2:
            recommendations.append("Consider reviewing fundamental concepts before tackling new challenges.")
        
        return recommendations
    
    @classmethod
    def suggest_next_activity(cls, user_id: int) -> Dict[str, Any]:
        """Suggest the next best learning activity for the user."""
        try:
            progress_summary = UserProgress.get_user_progress_summary(user_id)
            skills = SkillAssessment.get_user_skills(user_id)
            preferences = AdaptivePreferences.get_by_user(user_id)
            
            # Find current level progression
            completed_levels = progress_summary.get('completed_levels', 0)
            
            # Suggest next simulation level if available
            if completed_levels < 5:
                next_level = completed_levels + 1
                difficulty = cls.calculate_adaptive_difficulty(user_id, next_level)
                
                return {
                    'type': 'simulation',
                    'level_id': next_level,
                    'difficulty': difficulty,
                    'reason': f'Continue your cybersecurity journey with level {next_level}',
                    'estimated_time': cls._estimate_completion_time(user_id, next_level),
                    'xp_potential': cls.calculate_xp_reward(
                        cls._get_base_xp_for_level(next_level), difficulty, 85
                    )
                }
            
            # Suggest blue team vs red team mode for variety
            blue_team_progress = UserProgress.get_by_user_and_level(user_id, 1, 'blue_team_vs_red_team')
            if not blue_team_progress or blue_team_progress.status != 'completed':
                return {
                    'type': 'blue_team_vs_red_team',
                    'level_id': 1,
                    'difficulty': cls.calculate_adaptive_difficulty(user_id, 1, 'blue_team_vs_red_team'),
                    'reason': 'Try a different learning approach with team-based scenarios',
                    'estimated_time': 20,
                    'xp_potential': 200
                }
            
            # Suggest skill practice for weak areas
            weak_skills = [name for name, assessment in skills.items() 
                          if assessment.proficiency_level in ['novice', 'beginner']]
            
            if weak_skills:
                target_skill = weak_skills[0]
                return {
                    'type': 'skill_practice',
                    'skill': target_skill,
                    'reason': f'Strengthen your {target_skill.replace("_", " ")} abilities',
                    'estimated_time': 15,
                    'xp_potential': 50
                }
            
            # Default: recommend review of completed levels
            return {
                'type': 'review',
                'level_id': completed_levels,
                'reason': 'Review previous levels to reinforce learning',
                'estimated_time': 10,
                'xp_potential': 25
            }
            
        except Exception as e:
            return {
                'type': 'error',
                'reason': 'Unable to generate recommendation',
                'error': str(e)
            }
    
    @classmethod
    def _estimate_completion_time(cls, user_id: int, level_id: int) -> int:
        """Estimate completion time based on user's past performance."""
        try:
            # Get user's average completion time for similar levels
            progress_summary = UserProgress.get_user_progress_summary(user_id)
            
            if progress_summary.get('total_time_minutes', 0) > 0:
                avg_time = progress_summary['total_time_minutes'] / max(1, progress_summary['completed_levels'])
                return int(avg_time)
            
            # Default estimates by level
            default_times = {1: 15, 2: 20, 3: 25, 4: 30, 5: 40}
            return default_times.get(level_id, 20)
            
        except Exception:
            return 20
    
    @classmethod
    def _get_base_xp_for_level(cls, level_id: int) -> int:
        """Get base XP reward for a level."""
        base_xp = {1: 100, 2: 150, 3: 200, 4: 350, 5: 500}
        return base_xp.get(level_id, 100)
    
    @classmethod
    def update_learning_path(cls, user_id: int, level_id: int, performance_data: Dict[str, Any]) -> bool:
        """Update the user's learning path based on performance."""
        try:
            # Extract performance metrics
            score = performance_data.get('score', 0)
            time_spent = performance_data.get('time_spent', 0)
            hints_used = performance_data.get('hints_used', 0)
            mistakes = performance_data.get('mistakes_made', 0)
            difficulty = performance_data.get('difficulty', 'normal')
            level_type = performance_data.get('level_type', 'simulation')
            
            # Update user progress
            progress = UserProgress.get_by_user_and_level(user_id, level_id, level_type)
            if not progress:
                progress = UserProgress({
                    'user_id': user_id,
                    'level_id': level_id,
                    'level_type': level_type,
                    'status': 'completed' if score >= 70 else 'failed'
                })
            
            progress.score = score
            progress.time_spent = time_spent
            progress.hints_used = hints_used
            progress.mistakes_made = mistakes
            progress.attempts += 1
            progress.xp_earned = cls.calculate_xp_reward(
                cls._get_base_xp_for_level(level_id), 
                difficulty, 
                score, 
                time_spent < cls._estimate_completion_time(user_id, level_id) * 60,
                hints_used == 0
            )
            
            if score >= 70:
                progress.status = 'completed'
                progress.completion_percentage = 100.0
            else:
                progress.status = 'failed'
                progress.completion_percentage = min(100.0, (score / 70) * 100)
            
            progress.save()
            
            # Update skill assessments for this level
            skills = cls.LEVEL_SKILLS.get(level_id, [])
            for skill in skills:
                SkillAssessment.assess_skill(user_id, skill, level_id, score, 100, level_type)
            
            # Generate new recommendations
            LearningRecommendation.generate_recommendations(user_id)
            
            return True
            
        except Exception as e:
            return False

class TutorialAdaptationEngine:
    """Engine for adapting tutorial experiences based on user behavior."""
    
    @classmethod
    def should_skip_tutorial(cls, user_id: int, tutorial_type: str) -> bool:
        """Determine if tutorial should be skipped based on user preferences and experience."""
        try:
            preferences = AdaptivePreferences.get_by_user(user_id)
            
            # Check user preference
            if preferences and preferences.tutorial_skip_allowed:
                # Check if user has experience with similar tutorials
                analytics = LearningAnalytics.get_user_analytics(user_id, 7)
                tutorial_completions = len([a for a in analytics if a['action_type'] == 'tutorial_complete'])
                
                return tutorial_completions >= 2
            
            return False
            
        except Exception:
            return False
    
    @classmethod
    def get_tutorial_pace(cls, user_id: int) -> str:
        """Get recommended tutorial pace for user."""
        try:
            preferences = AdaptivePreferences.get_by_user(user_id)
            
            if preferences:
                return preferences.preferred_pace
            
            # Analyze past behavior to determine pace
            analytics = LearningAnalytics.get_user_analytics(user_id, 14)
            
            if not analytics:
                return 'normal'
            
            # Calculate average session duration
            sessions = {}
            for record in analytics:
                session_id = record['session_id']
                if session_id not in sessions:
                    sessions[session_id] = []
                sessions[session_id].append(record)
            
            avg_session_length = 0
            if sessions:
                total_time = 0
                for session_records in sessions.values():
                    if len(session_records) >= 2:
                        start_time = min(r['timestamp'] for r in session_records)
                        end_time = max(r['timestamp'] for r in session_records)
                        start_dt = datetime.fromisoformat(start_time.replace('Z', ''))
                        end_dt = datetime.fromisoformat(end_time.replace('Z', ''))
                        total_time += (end_dt - start_dt).total_seconds()
                
                avg_session_length = total_time / len(sessions)
            
            # Determine pace based on session length
            if avg_session_length > 1800:  # 30+ minutes
                return 'slow'
            elif avg_session_length < 600:  # <10 minutes
                return 'fast'
            else:
                return 'normal'
                
        except Exception:
            return 'normal'
    
    @classmethod
    def get_tutorial_style(cls, user_id: int) -> str:
        """Get recommended tutorial style for user."""
        try:
            preferences = AdaptivePreferences.get_by_user(user_id)
            
            if preferences:
                return preferences.learning_style
            
            # Default to balanced for new users
            return 'balanced'
            
        except Exception:
            return 'balanced'

class GameificationEngine:
    """Engine for managing achievements, badges, and gamification elements."""
    
    ACHIEVEMENTS = {
        'first_level': {'name': 'First Steps', 'description': 'Complete your first level', 'xp': 50},
        'speed_demon': {'name': 'Speed Demon', 'description': 'Complete a level in record time', 'xp': 100},
        'perfectionist': {'name': 'Perfectionist', 'description': 'Complete a level with 100% score', 'xp': 150},
        'no_hints': {'name': 'Independent Learner', 'description': 'Complete a level without hints', 'xp': 75},
        'streak_3': {'name': '3-Day Streak', 'description': 'Learn for 3 consecutive days', 'xp': 100},
        'streak_7': {'name': 'Week Warrior', 'description': 'Learn for 7 consecutive days', 'xp': 250},
        'all_levels': {'name': 'Cyber Guardian', 'description': 'Complete all 5 levels', 'xp': 500},
        'blue_team_master': {'name': 'Blue Team Master', 'description': 'Excel in blue team exercises', 'xp': 200}
    }
    
    @classmethod
    def check_achievements(cls, user_id: int, trigger_event: str, event_data: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Check if user has earned any new achievements."""
        try:
            earned_achievements = []
            progress_summary = UserProgress.get_user_progress_summary(user_id)
            
            # Check for various achievement triggers
            if trigger_event == 'level_complete':
                # First level achievement
                if progress_summary.get('completed_levels', 0) == 1:
                    earned_achievements.append(cls.ACHIEVEMENTS['first_level'])
                
                # Perfect score achievement
                if event_data.get('score', 0) == 100:
                    earned_achievements.append(cls.ACHIEVEMENTS['perfectionist'])
                
                # No hints achievement
                if event_data.get('hints_used', 1) == 0:
                    earned_achievements.append(cls.ACHIEVEMENTS['no_hints'])
                
                # Speed achievement (if completed in less than estimated time)
                estimated_time = AdaptiveLearningEngine._estimate_completion_time(
                    user_id, event_data.get('level_id', 1)
                )
                if event_data.get('time_spent', 999) < estimated_time * 60 * 0.7:  # 70% of estimated time
                    earned_achievements.append(cls.ACHIEVEMENTS['speed_demon'])
                
                # All levels complete
                if progress_summary.get('completed_levels', 0) >= 5:
                    earned_achievements.append(cls.ACHIEVEMENTS['all_levels'])
            
            elif trigger_event == 'daily_activity':
                # Streak achievements
                streak = progress_summary.get('learning_streak', 0)
                if streak == 3:
                    earned_achievements.append(cls.ACHIEVEMENTS['streak_3'])
                elif streak == 7:
                    earned_achievements.append(cls.ACHIEVEMENTS['streak_7'])
            
            return earned_achievements
            
        except Exception as e:
            return []
