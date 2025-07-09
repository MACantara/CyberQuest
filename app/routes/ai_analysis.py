from flask import Blueprint, jsonify, request, current_app
from google import genai
import json
import os
from typing import Dict, List, Optional

ai_analysis_bp = Blueprint('ai_analysis', __name__, url_prefix='/api/ai-analysis')

def get_gemini_client():
    """Initialize and return Gemini AI client"""
    api_key = os.getenv('GEMINI_API_KEY')
    if not api_key:
        raise ValueError("GEMINI_API_KEY environment variable not set")
    
    client = genai.Client()
    return client

@ai_analysis_bp.route('/analyze-article', methods=['POST'])
def analyze_article():
    """Analyze an article using Gemini AI to identify clickable elements for labeling"""
    try:
        data = request.get_json()
        
        if not data or 'article' not in data:
            return jsonify({
                'success': False,
                'error': 'Article data is required'
            }), 400
        
        article = data['article']
        
        # Validate required article fields
        required_fields = ['title', 'author', 'text', 'is_real']
        for field in required_fields:
            if field not in article:
                return jsonify({
                    'success': False,
                    'error': f'Missing required field: {field}'
                }), 400
        
        client = get_gemini_client()
        
        # Create a detailed prompt for Gemini AI
        prompt = f"""
        Analyze this news article and identify specific clickable elements that users should be able to label as "fake" or "real" for a cybersecurity training exercise.

        Article Details:
        - Title: {article['title']}
        - Author: {article['author']}
        - Published: {article.get('published', 'Unknown')}
        - Text: {article['text'][:1000]}...
        - Actual Classification: {'Real News' if article['is_real'] else 'Misinformation'}

        Please provide a JSON response with the following structure:
        {{
            "clickable_elements": [
                {{
                    "element_id": "unique_identifier",
                    "element_name": "Human-readable name",
                    "selector": "CSS selector for the element",
                    "expected_fake": boolean,
                    "reasoning": "Brief explanation of why this element should be labeled as fake or real",
                    "difficulty": "easy|medium|hard"
                }}
            ],
            "article_analysis": {{
                "overall_credibility": "high|medium|low",
                "key_indicators": ["list of key indicators"],
                "red_flags": ["list of red flags if fake"],
                "educational_notes": "Key learning points for users"
            }}
        }}

        Focus on these types of elements:
        1. Title/Headline - Check for sensationalism, clickbait, emotional manipulation
        2. Author Information - Check for credibility, attribution, expertise
        3. Publication Date - Check for timeliness, relevance
        4. Article Content - Check for factual accuracy, bias, sources
        5. Images/Media - Check for manipulation, relevance, attribution
        6. Social Sharing Elements - Check for pressure tactics, urgency
        7. Source Citations - Check for credible references, verification

        Make sure the analysis is educational and helps users learn to identify misinformation patterns.
        """

        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt,
        )

        # Parse the AI response
        try:
            ai_analysis = json.loads(response.text)
        except json.JSONDecodeError:
            # If JSON parsing fails, create a fallback response
            ai_analysis = create_fallback_analysis(article)
        
        # Validate and sanitize the AI response
        validated_analysis = validate_ai_analysis(ai_analysis, article)
        
        return jsonify({
            'success': True,
            'analysis': validated_analysis,
            'article_id': article.get('id', 'unknown'),
            'processing_time': 'completed'
        })
        
    except Exception as e:
        current_app.logger.error(f"Error in AI article analysis: {str(e)}")
        
        # Return fallback analysis if AI fails
        if 'article' in locals():
            fallback_analysis = create_fallback_analysis(article)
            return jsonify({
                'success': True,
                'analysis': fallback_analysis,
                'article_id': article.get('id', 'unknown'),
                'fallback': True,
                'error_message': 'AI analysis failed, using fallback logic'
            })
        
        return jsonify({
            'success': False,
            'error': f'Analysis failed: {str(e)}'
        }), 500

def create_fallback_analysis(article: Dict) -> Dict:
    """Create a fallback analysis when AI fails"""
    is_real = article.get('is_real', False)
    
    clickable_elements = [
        {
            "element_id": "title",
            "element_name": "Article Title",
            "selector": "h2",
            "expected_fake": not is_real,
            "reasoning": "Fake news often uses sensational or emotionally charged headlines" if not is_real else "Real news typically uses factual, professional headlines",
            "difficulty": "easy"
        },
        {
            "element_id": "author",
            "element_name": "Author Information",
            "selector": "main > div:nth-child(2)",
            "expected_fake": not is_real,
            "reasoning": "Check for proper author attribution and credentials" if is_real else "Fake news often lacks proper author information",
            "difficulty": "medium"
        },
        {
            "element_id": "content",
            "element_name": "Article Content",
            "selector": "main > div:nth-child(4)",
            "expected_fake": not is_real,
            "reasoning": "Analyze the content for factual accuracy and bias" if is_real else "Look for emotional manipulation and unsubstantiated claims",
            "difficulty": "hard"
        },
        {
            "element_id": "sharing",
            "element_name": "Social Sharing Section",
            "selector": ".sharing-box, [style*='sharing']",
            "expected_fake": not is_real,
            "reasoning": "Legitimate news doesn't pressure immediate sharing" if is_real else "Fake news often uses urgent sharing tactics",
            "difficulty": "medium"
        }
    ]
    
    return {
        "clickable_elements": clickable_elements,
        "article_analysis": {
            "overall_credibility": "high" if is_real else "low",
            "key_indicators": [
                "Proper attribution and sourcing",
                "Professional language and tone",
                "Factual reporting without bias"
            ] if is_real else [
                "Sensational headlines",
                "Emotional manipulation",
                "Lack of credible sources",
                "Urgent sharing pressure"
            ],
            "red_flags": [] if is_real else [
                "Clickbait headline",
                "Anonymous or questionable author",
                "Emotional rather than factual content",
                "Pressure to share immediately"
            ],
            "educational_notes": "This article demonstrates " + ("professional journalism standards" if is_real else "common misinformation tactics used to manipulate readers")
        }
    }

def validate_ai_analysis(ai_analysis: Dict, article: Dict) -> Dict:
    """Validate and sanitize AI analysis response"""
    validated = {
        "clickable_elements": [],
        "article_analysis": {
            "overall_credibility": "medium",
            "key_indicators": [],
            "red_flags": [],
            "educational_notes": ""
        }
    }
    
    # Validate clickable elements
    if 'clickable_elements' in ai_analysis and isinstance(ai_analysis['clickable_elements'], list):
        for element in ai_analysis['clickable_elements']:
            if all(key in element for key in ['element_id', 'element_name', 'selector', 'expected_fake']):
                validated_element = {
                    'element_id': str(element['element_id']),
                    'element_name': str(element['element_name']),
                    'selector': str(element['selector']),
                    'expected_fake': bool(element['expected_fake']),
                    'reasoning': str(element.get('reasoning', 'Analysis reason not provided')),
                    'difficulty': str(element.get('difficulty', 'medium'))
                }
                validated['clickable_elements'].append(validated_element)
    
    # If no valid elements found, use fallback
    if not validated['clickable_elements']:
        fallback = create_fallback_analysis(article)
        validated['clickable_elements'] = fallback['clickable_elements']
    
    # Validate article analysis
    if 'article_analysis' in ai_analysis and isinstance(ai_analysis['article_analysis'], dict):
        analysis = ai_analysis['article_analysis']
        validated['article_analysis'] = {
            'overall_credibility': str(analysis.get('overall_credibility', 'medium')),
            'key_indicators': [str(item) for item in analysis.get('key_indicators', [])],
            'red_flags': [str(item) for item in analysis.get('red_flags', [])],
            'educational_notes': str(analysis.get('educational_notes', 'Educational analysis not available'))
        }
    
    return validated

@ai_analysis_bp.route('/batch-analyze', methods=['POST'])
def batch_analyze_articles():
    """Analyze multiple articles in batch for better performance"""
    try:
        data = request.get_json()
        
        if not data or 'articles' not in data:
            return jsonify({
                'success': False,
                'error': 'Articles array is required'
            }), 400
        
        articles = data['articles']
        
        if not isinstance(articles, list) or len(articles) == 0:
            return jsonify({
                'success': False,
                'error': 'Articles must be a non-empty array'
            }), 400
        
        results = []
        
        for i, article in enumerate(articles[:10]):  # Limit to 10 articles to prevent timeout
            try:
                # Analyze each article
                analysis_result = analyze_single_article(article)
                results.append({
                    'index': i,
                    'article_id': article.get('id', f'article_{i}'),
                    'success': True,
                    'analysis': analysis_result
                })
            except Exception as e:
                # Create fallback for failed articles
                fallback_analysis = create_fallback_analysis(article)
                results.append({
                    'index': i,
                    'article_id': article.get('id', f'article_{i}'),
                    'success': False,
                    'analysis': fallback_analysis,
                    'error': str(e)
                })
        
        return jsonify({
            'success': True,
            'results': results,
            'total_analyzed': len(results)
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': f'Batch analysis failed: {str(e)}'
        }), 500

def analyze_single_article(article: Dict) -> Dict:
    """Analyze a single article (helper function for batch processing)"""
    client = get_gemini_client()
    
    # Simplified prompt for batch processing
    prompt = f"""
    Analyze this news article for a cybersecurity training exercise.
    
    Title: {article['title']}
    Author: {article['author']}
    Classification: {'Real' if article['is_real'] else 'Fake'}
    
    Return JSON with clickable elements for user labeling:
    {{
        "clickable_elements": [
            {{"element_id": "title", "element_name": "Title", "selector": "h2", "expected_fake": {not article['is_real']}, "reasoning": "brief reason"}},
            {{"element_id": "author", "element_name": "Author", "selector": "main > div:nth-child(2)", "expected_fake": {not article['is_real']}, "reasoning": "brief reason"}},
            {{"element_id": "content", "element_name": "Content", "selector": "main > div:nth-child(4)", "expected_fake": {not article['is_real']}, "reasoning": "brief reason"}}
        ]
    }}
    """
    
    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=prompt,
    )
    
    try:
        return json.loads(response.text)
    except json.JSONDecodeError:
        return create_fallback_analysis(article)

@ai_analysis_bp.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint for AI analysis service"""
    try:
        # Test Gemini AI connection
        client = get_gemini_client()
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents="Test connection - respond with 'OK'",
        )
        
        return jsonify({
            'success': True,
            'status': 'healthy',
            'ai_service': 'gemini',
            'test_response': response.text[:50]  # First 50 chars of response
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'status': 'unhealthy',
            'error': str(e)
        }), 500
