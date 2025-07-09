from flask import Blueprint, jsonify, current_app
import json
import random
import os
from pathlib import Path

news_api_bp = Blueprint('news_api', __name__, url_prefix='/api/news')

# Cache for JSON data to avoid reading file multiple times
_batch_cache = None

def load_batch_data():
    """Load and cache the batch-1.json data"""
    global _batch_cache
    if _batch_cache is not None:
        return _batch_cache
    
    try:
        # Load the processed batch data
        batch_path = os.path.join(
            os.path.dirname(os.path.dirname(os.path.dirname(__file__))), 
            'data', 'processed_batches', 'batch-1.json'
        )
        
        with open(batch_path, 'r', encoding='utf-8') as file:
            _batch_cache = json.load(file)
        
        print(f"Loaded {len(_batch_cache)} articles from batch-1.json")
        
        return _batch_cache
        
    except Exception as e:
        print(f"Error loading batch-1.json: {e}")
        return []

def convert_batch_to_article_format(batch_data):
    """Convert batch JSON format to article format expected by frontend"""
    articles = []
    
    for item in batch_data:
        if not item.get('article_metadata'):
            continue
            
        metadata = item['article_metadata']
        
        # Extract article data
        article = {
            'id': f'article_{len(articles)}',
            'author': metadata.get('author', 'Unknown'),
            'published': metadata.get('published_date', ''),
            'title': metadata.get('title', ''),
            'text': 'Sample article text for training purposes. This is a placeholder for the actual article content.',
            'main_img_url': 'https://via.placeholder.com/400x200/10b981/ffffff?text=News+Article',
            'is_real': metadata.get('actual_label', '').lower() == 'real',
            'source': metadata.get('source', 'unknown'),
            'article_type': metadata.get('article_type', 'unknown'),
            'ai_analysis': {
                'clickable_elements': item.get('clickable_elements', []),
                'article_analysis': {
                    'overall_credibility': 'medium',
                    'primary_red_flags': [],
                    'credibility_factors': [],
                    'educational_focus': f'This article demonstrates how to analyze {metadata.get("article_type", "news")} content for credibility.',
                    'misinformation_tactics': [],
                    'verification_tips': [
                        'Check the source reputation',
                        'Verify author credentials',
                        'Cross-reference with other sources',
                        'Look for emotional manipulation'
                    ]
                }
            }
        }
        
        # Extract insights from clickable elements for article analysis
        if item.get('clickable_elements'):
            red_flags = []
            credibility_factors = []
            
            for element in item['clickable_elements']:
                if element.get('expected_label') == 'fake':
                    red_flags.extend(element.get('red_flags', []))
                else:
                    credibility_factors.extend(element.get('credibility_indicators', []))
            
            article['ai_analysis']['article_analysis']['primary_red_flags'] = list(set(red_flags))
            article['ai_analysis']['article_analysis']['credibility_factors'] = list(set(credibility_factors))
            
            # Determine overall credibility
            fake_count = sum(1 for el in item['clickable_elements'] if el.get('expected_label') == 'fake')
            total_count = len(item['clickable_elements'])
            
            if fake_count > total_count / 2:
                article['ai_analysis']['article_analysis']['overall_credibility'] = 'low'
            elif fake_count > 0:
                article['ai_analysis']['article_analysis']['overall_credibility'] = 'medium'
            else:
                article['ai_analysis']['article_analysis']['overall_credibility'] = 'high'
        
        articles.append(article)
    
    return articles

@news_api_bp.route('/mixed-articles', methods=['GET'])
def get_mixed_news_articles():
    """Get a balanced mix of news articles from batch-1.json with AI analysis"""
    try:
        batch_data = load_batch_data()
        
        if not batch_data:
            return jsonify({
                'success': False,
                'error': 'No batch data available'
            }), 500
        
        # Convert to article format
        articles = convert_batch_to_article_format(batch_data)
        
        if not articles:
            return jsonify({
                'success': False,
                'error': 'No articles could be processed from batch data'
            }), 500
        
        # Shuffle articles for variety
        random.shuffle(articles)
        
        # Take up to 15 articles (or all if less than 15)
        selected_articles = articles[:15]
        
        # Calculate summary stats
        real_count = sum(1 for article in selected_articles if article['is_real'])
        fake_count = len(selected_articles) - real_count
        ai_analysis_count = sum(1 for article in selected_articles if article.get('ai_analysis'))
        
        return jsonify({
            'success': True,
            'articles': selected_articles,
            'summary': {
                'total': len(selected_articles),
                'real_count': real_count,
                'fake_count': fake_count,
                'ai_analysis_available': ai_analysis_count
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
    """Get statistics about the batch dataset"""
    try:
        batch_data = load_batch_data()
        articles = convert_batch_to_article_format(batch_data)
        
        real_count = sum(1 for article in articles if article['is_real'])
        fake_count = len(articles) - real_count
        
        return jsonify({
            'success': True,
            'stats': {
                'total_articles': len(articles),
                'real_articles': real_count,
                'fake_articles': fake_count,
                'real_percentage': round((real_count / len(articles)) * 100, 2) if articles else 0,
                'fake_percentage': round((fake_count / len(articles)) * 100, 2) if articles else 0
            }
        })
        
    except Exception as e:
        print(f"Error getting news stats: {e}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@news_api_bp.route('/analysis-status', methods=['GET'])
def get_analysis_status():
    """Get status of AI analysis data"""
    try:
        ai_analysis = load_ai_analysis_data()
        
        if not ai_analysis:
            return jsonify({
                'success': True,
                'ai_analysis_available': False,
                'message': 'No AI analysis data available'
            })
        
        metadata = ai_analysis.get('metadata', {})
        analyses = ai_analysis.get('analyses', [])
        
        return jsonify({
            'success': True,
            'ai_analysis_available': True,
            'metadata': metadata,
            'total_analyses': len(analyses),
            'completion_status': metadata.get('completion_status', 'unknown')
        })
        
    except Exception as e:
        print(f"Error getting analysis status: {e}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500
