from flask import Blueprint, render_template, current_app, flash, redirect, url_for, request, jsonify
from flask_login import login_required, current_user
import json
import requests
import csv
import random
import os
from urllib.parse import urlparse

levels_bp = Blueprint('levels', __name__, url_prefix='/levels')

# Cache for CSV data to avoid reading file multiple times
_csv_cache = None

# Define all levels with their metadata
CYBERSECURITY_LEVELS = [
    {
        'id': 1,
        'name': 'The Misinformation Maze',
        'description': 'Debunk fake news and stop misinformation from influencing an election.',
        'difficulty': 'Beginner',
        'xp_reward': 100,
        'icon': 'bi-newspaper',
        'category': 'Information Literacy',
        'estimated_time': '15 minutes',
        'skills': ['Critical Thinking', 'Source Verification', 'Fact Checking'],
        'unlocked': True
    },
    {
        'id': 2,
        'name': 'Shadow in the Inbox',
        'description': 'Spot phishing attempts and practice safe email protocols.',
        'difficulty': 'Beginner',
        'xp_reward': 150,
        'icon': 'bi-envelope-exclamation',
        'category': 'Email Security',
        'estimated_time': '20 minutes',
        'skills': ['Phishing Detection', 'Email Analysis', 'Social Engineering'],
        'unlocked': True
    },
    {
        'id': 3,
        'name': 'Malware Mayhem',
        'description': 'Isolate infections and perform digital cleanup during a gaming tournament.',
        'difficulty': 'Intermediate',
        'xp_reward': 200,
        'icon': 'bi-bug',
        'category': 'Threat Detection',
        'estimated_time': '25 minutes',
        'skills': ['Malware Recognition', 'System Security', 'Threat Analysis'],
        'unlocked': True
    },
    {
        'id': 4,
        'name': 'The White Hat Test',
        'description': 'Practice ethical hacking and responsible vulnerability disclosure.',
        'difficulty': 'Expert',
        'xp_reward': 350,
        'icon': 'bi-terminal',
        'category': 'Ethical Hacking',
        'estimated_time': '30 minutes',
        'skills': ['Penetration Testing', 'Vulnerability Assessment', 'Ethical Hacking'],
        'unlocked': True
    },
    {
        'id': 5,
        'name': 'The Hunt for The Null',
        'description': 'Final mission: Use advanced digital forensics to expose The Null\'s identity.',
        'difficulty': 'Master',
        'xp_reward': 500,
        'icon': 'bi-trophy',
        'category': 'Digital Forensics',
        'estimated_time': '40 minutes',
        'skills': ['Digital Forensics', 'Evidence Analysis', 'Advanced Investigation'],
        'unlocked': True
    }
]

def load_fake_news_data():
    """Load and cache data from both Fake.csv and True.csv files"""
    global _csv_cache
    if _csv_cache is not None:
        return _csv_cache
    
    try:
        # Get the data directory path
        data_dir = os.path.join(
            os.path.dirname(os.path.dirname(__file__)), 
            'static', 'js', 'simulated-pc', 'levels', 'level-one', 'data'
        )
        
        fake_csv_path = os.path.join(data_dir, 'Fake.csv')
        true_csv_path = os.path.join(data_dir, 'True.csv')
        
        _csv_cache = []
        
        # Load fake news data
        if os.path.exists(fake_csv_path):
            with open(fake_csv_path, 'r', encoding='utf-8') as file:
                reader = csv.DictReader(file)
                for row in reader:
                    # Only include rows with required fields
                    if row.get('title') and row.get('text') and row.get('date'):
                        _csv_cache.append({
                            'title': row.get('title', '').strip(),
                            'text': row.get('text', '').strip(),
                            'date': row.get('date', '').strip(),
                            'is_real': False,  # Fake news
                            'source': 'Fake.csv'
                        })
        else:
            print(f"Warning: Fake.csv not found at {fake_csv_path}")
        
        # Load true news data
        if os.path.exists(true_csv_path):
            with open(true_csv_path, 'r', encoding='utf-8') as file:
                reader = csv.DictReader(file)
                for row in reader:
                    # Only include rows with required fields
                    if row.get('title') and row.get('text') and row.get('date'):
                        _csv_cache.append({
                            'title': row.get('title', '').strip(),
                            'text': row.get('text', '').strip(),
                            'date': row.get('date', '').strip(),
                            'is_real': True,  # Real news
                            'source': 'True.csv'
                        })
        else:
            print(f"Warning: True.csv not found at {true_csv_path}")
        
        print(f"Loaded {len(_csv_cache)} news articles from CSV files")
        print(f"Fake news articles: {len([a for a in _csv_cache if not a['is_real']])}")
        print(f"Real news articles: {len([a for a in _csv_cache if a['is_real']])}")
        
        return _csv_cache
        
    except Exception as e:
        print(f"Error loading news CSV files: {e}")
        return []

@levels_bp.route('/')
@login_required
def levels_overview():
    """Display all cybersecurity levels."""
    if current_app.config.get('DISABLE_DATABASE', False):
        # In demo mode, unlock first 3 levels
        demo_levels = CYBERSECURITY_LEVELS.copy()
        for i, level in enumerate(demo_levels):
            if i < 3:
                level['unlocked'] = True
        return render_template('levels/levels.html', levels=demo_levels)
    
    # TODO: In future, determine unlocked levels based on user progress
    # For now, only first level is unlocked for authenticated users
    user_levels = CYBERSECURITY_LEVELS.copy()
    
    return render_template('levels/levels.html', levels=user_levels)

@levels_bp.route('/<int:level_id>')
@login_required  
def level_detail(level_id):
    """Display specific level details and start the level."""
    level = next((l for l in CYBERSECURITY_LEVELS if l['id'] == level_id), None)
    
    if not level:
        return render_template('404.html'), 404
    
    # Check if level is unlocked
    if not level['unlocked'] and not current_app.config.get('DISABLE_DATABASE', False):
        return render_template('levels/level-locked.html', level=level)
    
    return render_template('levels/level-detail.html', level=level)

@levels_bp.route('/<int:level_id>/start')
@login_required
def start_level(level_id):
    """Start the interactive simulation for a specific level."""
    level = next((l for l in CYBERSECURITY_LEVELS if l['id'] == level_id), None)
    
    if not level:
        flash('Level not found.', 'error')
        return redirect(url_for('levels.levels_overview'))
    
    # Check if level is unlocked
    if not level['unlocked'] and not current_app.config.get('DISABLE_DATABASE', False):
        flash('This level is locked. Complete previous levels to unlock it.', 'warning')
        return redirect(url_for('levels.levels_overview'))
    
    # Prepare level data for simulation
    level_data = {
        'id': level['id'],
        'name': level['name'],
        'description': level['description'],
        'category': level['category'],
        'difficulty': level['difficulty'],
        'skills': level['skills']
    }
    
    # Convert level data to JSON string for direct JavaScript usage
    level_json = json.dumps(level_data, default=str)
    
    return render_template('simulated-pc/simulation.html', 
                         level=level, 
                         level_data=level_data,
                         level_json=level_json)

@levels_bp.route('/get-random-news-article', methods=['GET'])
def get_random_news_article():
    """Get a random news article from both CSV datasets"""
    try:
        news_data = load_fake_news_data()
        
        if not news_data:
            return jsonify({
                'success': False,
                'error': 'No news data available'
            }), 500
        
        # Get a random article
        random_article = random.choice(news_data)
        
        return jsonify({
            'success': True,
            'article': {
                'title': random_article['title'],
                'text': random_article['text'],
                'date': random_article['date'],
                'is_real': random_article['is_real'],
                'source': random_article['source']
            }
        })
        
    except Exception as e:
        print(f"Error getting random news article: {e}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@levels_bp.route('/get-mixed-news-articles', methods=['GET'])
def get_mixed_news_articles():
    """Get a balanced mix of 15 news articles (50% fake, 50% real)"""
    try:
        news_data = load_fake_news_data()
        
        if not news_data:
            return jsonify({
                'success': False,
                'error': 'No news data available'
            }), 500
        
        # Separate real and fake news
        real_news = [article for article in news_data if article['is_real']]
        fake_news = [article for article in news_data if not article['is_real']]
        
        # Ensure we have enough articles of each type
        if len(real_news) < 7 or len(fake_news) < 8:
            return jsonify({
                'success': False,
                'error': f'Insufficient articles: {len(real_news)} real, {len(fake_news)} fake'
            }), 500
        
        # Select 7 real and 8 fake articles (totaling 15, with slight favor to fake for training)
        selected_real = random.sample(real_news, 7)
        selected_fake = random.sample(fake_news, 8)
        
        # Combine and shuffle the articles
        mixed_articles = selected_real + selected_fake
        random.shuffle(mixed_articles)
        
        # Format articles for frontend
        formatted_articles = []
        for article in mixed_articles:
            formatted_articles.append({
                'title': article['title'],
                'text': article['text'],
                'date': article['date'],
                'is_real': article['is_real'],
                'source': article['source']
            })
        
        return jsonify({
            'success': True,
            'articles': formatted_articles,
            'summary': {
                'total': len(formatted_articles),
                'real_count': len(selected_real),
                'fake_count': len(selected_fake)
            }
        })
        
    except Exception as e:
        print(f"Error getting mixed news articles: {e}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500