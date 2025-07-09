from flask import Blueprint, jsonify, current_app
import csv
import random
import os

news_api_bp = Blueprint('news_api', __name__, url_prefix='/api/news')

# Cache for CSV data to avoid reading file multiple times
_csv_cache = None

def load_fake_news_data():
    """Load and cache the english_news_articles.csv data"""
    global _csv_cache
    if _csv_cache is not None:
        return _csv_cache
    
    try:
        # Use the processed English articles dataset
        csv_path = os.path.join(
            os.path.dirname(os.path.dirname(os.path.dirname(__file__))), 
            'data', 'processed', 'english_news_articles.csv'
        )
        
        _csv_cache = []
        with open(csv_path, 'r', encoding='utf-8') as file:
            reader = csv.DictReader(file)
            for row in reader:
                # The processed CSV already contains only English articles with valid image URLs
                # Just need to format the data for the frontend
                if (row.get('title') and row.get('text') and row.get('author')):
                    _csv_cache.append({
                        'author': row.get('author', '').strip(),
                        'published': row.get('published', '').strip(),
                        'title': row.get('title', '').strip(),
                        'text': row.get('text', '').strip(),
                        'main_img_url': row.get('main_img_url', '').strip(),
                        'is_real': row.get('label', '').lower() == 'real',  # Use 'label' column to determine authenticity
                        'source': 'english_news_articles.csv'
                    })
        
        print(f"Loaded {len(_csv_cache)} English news articles from processed dataset")
        print(f"Real news articles: {len([a for a in _csv_cache if a['is_real']])}")
        print(f"Fake news articles: {len([a for a in _csv_cache if not a['is_real']])}")
        
        return _csv_cache
        
    except Exception as e:
        print(f"Error loading english_news_articles.csv: {e}")
        # Fallback to original dataset if processed one is not available
        return load_fallback_data()

def load_fallback_data():
    """Fallback to original dataset if processed one is not available"""
    try:
        csv_path = os.path.join(
            os.path.dirname(os.path.dirname(__file__)), 
            'static', 'js', 'simulated-pc', 'levels', 'level-one', 'data', 'news_articles.csv'
        )
        
        fallback_cache = []
        with open(csv_path, 'r', encoding='utf-8') as file:
            reader = csv.DictReader(file)
            for row in reader:
                # Apply same filtering as preprocessing script
                main_img_url = row.get('main_img_url', '').strip()
                language = row.get('language', '').strip().lower()
                title = row.get('title', '').strip()
                
                if (title and 
                    title.lower() not in ['no title', 'untitled', ''] and
                    main_img_url and 
                    main_img_url.lower() not in ['no image url', 'no image', ''] and
                    main_img_url.startswith(('http://', 'https://')) and
                    row.get('text') and row.get('author') and 
                    language == 'english'):
                    
                    fallback_cache.append({
                        'author': row.get('author', '').strip(),
                        'published': row.get('published', '').strip(),
                        'title': title,
                        'text': row.get('text', '').strip(),
                        'main_img_url': main_img_url,
                        'is_real': row.get('label', '').lower() == 'real',
                        'source': 'news_articles.csv (fallback)'
                    })
        
        print(f"Loaded {len(fallback_cache)} articles from fallback dataset")
        return fallback_cache
        
    except Exception as e:
        print(f"Error loading fallback dataset: {e}")
        return []

@news_api_bp.route('/mixed-articles', methods=['GET'])
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
        
        # Format articles for frontend with unique IDs
        formatted_articles = []
        for i, article in enumerate(mixed_articles):
            formatted_articles.append({
                'id': f'article_{i}',
                'author': article['author'],
                'published': article['published'],
                'title': article['title'],
                'text': article['text'],
                'main_img_url': article['main_img_url'],
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

@news_api_bp.route('/stats', methods=['GET'])
def get_news_stats():
    """Get statistics about the news dataset"""
    try:
        news_data = load_fake_news_data()
        
        real_count = len([article for article in news_data if article['is_real']])
        fake_count = len([article for article in news_data if not article['is_real']])
        
        return jsonify({
            'success': True,
            'stats': {
                'total_articles': len(news_data),
                'real_articles': real_count,
                'fake_articles': fake_count,
                'real_percentage': round((real_count / len(news_data)) * 100, 2) if news_data else 0,
                'fake_percentage': round((fake_count / len(news_data)) * 100, 2) if news_data else 0
            }
        })
        
    except Exception as e:
        print(f"Error getting news stats: {e}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500
