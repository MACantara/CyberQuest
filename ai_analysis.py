from flask import Blueprint, jsonify, request, current_app
from google import genai
from google.genai import types
import json
import os
import csv
from pathlib import Path
from typing import Dict, List, Optional
import time

ai_analysis_bp = Blueprint('ai_analysis', __name__, url_prefix='/api/ai-analysis')

def get_gemini_client():
    """Initialize and return Gemini AI client"""
    api_key = os.getenv('GEMINI_API_KEY')
    if not api_key:
        raise ValueError("GEMINI_API_KEY environment variable not set")
    
    client = genai.Client()
    return client

def generate_content_with_config(client, prompt):
    """Generate content with thinking budget disabled and low temperature for consistent responses"""
    return client.models.generate_content(
        model="gemini-2.5-flash",
        contents=prompt,
        config=types.GenerateContentConfig(
            thinking_config=types.ThinkingConfig(thinking_budget=0),  # Disables thinking for faster responses
            temperature=0.1  # Low temperature for more consistent and focused responses
        )
    )

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

        response = generate_content_with_config(client, prompt)

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
    
    response = generate_content_with_config(client, prompt)
    
    try:
        return json.loads(response.text)
    except json.JSONDecodeError:
        return create_fallback_analysis(article)

def batch_analyze_articles_dataset():
    """
    Analyze the entire english_news_articles.csv dataset and generate taggable elements
    Save results to JSON file in the same directory
    """
    project_root = Path(__file__).parent
    input_file = project_root / 'data' / 'processed' / 'english_news_articles.csv'
    output_file = project_root / 'data' / 'processed' / 'english_news_articles_analysis.json'
    
    if not input_file.exists():
        raise FileNotFoundError(f"Input file not found: {input_file}")
    
    print(f"Loading articles from: {input_file}")
    print(f"Analysis will be saved to: {output_file}")
    
    # Load all articles
    articles = []
    with open(input_file, 'r', encoding='utf-8') as file:
        reader = csv.DictReader(file)
        for row in reader:
            articles.append(row)
    
    print(f"Loaded {len(articles)} articles for analysis")
    
    # Process in batches to avoid rate limits
    batch_size = 5  # Conservative batch size for API limits
    analysis_results = []
    
    client = get_gemini_client()
    
    for i in range(0, len(articles), batch_size):
        batch = articles[i:i + batch_size]
        batch_num = (i // batch_size) + 1
        total_batches = (len(articles) + batch_size - 1) // batch_size
        
        print(f"\nProcessing batch {batch_num}/{total_batches} ({len(batch)} articles)...")
        
        try:
            batch_results = analyze_article_batch(client, batch)
            analysis_results.extend(batch_results)
            
            print(f"✓ Batch {batch_num} completed successfully")
            
            # Rate limiting between batches
            if i + batch_size < len(articles):
                print("Waiting 3 seconds before next batch...")
                time.sleep(3)
                
        except Exception as e:
            print(f"✗ Error in batch {batch_num}: {e}")
            # Create fallback analysis for failed batch
            for article in batch:
                fallback_analysis = create_fallback_analysis_for_dataset(article)
                analysis_results.append({
                    'article_index': len(analysis_results),
                    'title': article.get('title', ''),
                    'author': article.get('author', ''),
                    'label': article.get('label', ''),
                    'analysis': fallback_analysis,
                    'analysis_method': 'fallback',
                    'error': str(e)
                })
            continue
    
    # Save results
    output_data = {
        'metadata': {
            'total_articles': len(articles),
            'analysis_timestamp': time.strftime('%Y-%m-%d %H:%M:%S'),
            'model_used': 'gemini-2.5-flash',
            'batch_size': batch_size
        },
        'analyses': analysis_results
    }
    
    with open(output_file, 'w', encoding='utf-8') as file:
        json.dump(output_data, file, indent=2, ensure_ascii=False)
    
    print(f"\n✅ Analysis complete! Results saved to: {output_file}")
    print(f"📊 Successfully analyzed {len(analysis_results)} articles")
    
    return output_data

def analyze_article_batch(client, batch):
    """
    Analyze a batch of articles using Gemini AI
    """
    batch_results = []
    
    for article in batch:
        try:
            analysis = analyze_single_article_for_dataset(client, article)
            batch_results.append({
                'article_index': len(batch_results),
                'title': article.get('title', ''),
                'author': article.get('author', ''),
                'label': article.get('label', ''),
                'analysis': analysis,
                'analysis_method': 'gemini-ai'
            })
        except Exception as e:
            print(f"  Warning: Failed to analyze article '{article.get('title', 'Unknown')[:50]}...': {e}")
            # Use fallback for individual article failure
            fallback_analysis = create_fallback_analysis_for_dataset(article)
            batch_results.append({
                'article_index': len(batch_results),
                'title': article.get('title', ''),
                'author': article.get('author', ''),
                'label': article.get('label', ''),
                'analysis': fallback_analysis,
                'analysis_method': 'fallback',
                'error': str(e)
            })
    
    return batch_results

def analyze_single_article_for_dataset(client, article):
    """
    Analyze a single article from the dataset using Gemini AI
    """
    is_real = article.get('label', '').lower() == 'real'
    title = article.get('title', '').strip()
    author = article.get('author', '').strip()
    text = article.get('text', '').strip()[:1500]  # Limit text length for API
    
    prompt = f"""
    Analyze this news article for cybersecurity training. Identify specific parts that users should be able to label as "fake" or "real" elements.

    Article Details:
    - Title: {title}
    - Author: {author}  
    - Text Preview: {text}
    - Actual Classification: {'Real News' if is_real else 'Misinformation/Fake News'}

    Generate a JSON response with clickable elements for training purposes:
    {{
        "clickable_elements": [
            {{
                "element_id": "unique_identifier",
                "element_name": "Human-readable name",
                "css_selector": "CSS selector for element",
                "expected_label": "fake" or "real",
                "reasoning": "Brief explanation of why this should be labeled as fake/real",
                "difficulty": "easy|medium|hard",
                "red_flags": ["list of specific warning signs if fake"],
                "credibility_factors": ["list of credibility signs if real"]
            }}
        ],
        "article_analysis": {{
            "overall_credibility": "high|medium|low",
            "primary_red_flags": ["main warning signs for fake news"],
            "credibility_factors": ["main trust indicators for real news"],
            "educational_focus": "Key learning points for cybersecurity training",
            "misinformation_tactics": ["specific tactics used if fake news"],
            "verification_tips": ["how users can verify this type of content"]
        }}
    }}

    Focus on these taggable elements:
    1. **Title/Headline** - sensationalism, emotional manipulation, clickbait
    2. **Author Information** - credibility, proper attribution, expertise
    3. **Article Content** - factual accuracy, bias, unsupported claims  
    4. **Source/Publication** - domain credibility, contact information
    5. **Social Elements** - sharing pressure, urgency tactics

    Make the analysis educational for cybersecurity awareness training.
    """

    response = generate_content_with_config(client, prompt)

    try:
        analysis = json.loads(response.text)
        return validate_analysis_structure(analysis, article)
    except json.JSONDecodeError:
        print(f"  Warning: Invalid JSON response for article, using fallback")
        return create_fallback_analysis_for_dataset(article)

def validate_analysis_structure(analysis, article):
    """
    Validate and clean the AI analysis response
    """
    validated = {
        "clickable_elements": [],
        "article_analysis": {
            "overall_credibility": "medium",
            "primary_red_flags": [],
            "credibility_factors": [],
            "educational_focus": "",
            "misinformation_tactics": [],
            "verification_tips": []
        }
    }
    
    # Validate clickable elements
    if 'clickable_elements' in analysis and isinstance(analysis['clickable_elements'], list):
        for element in analysis['clickable_elements']:
            if all(key in element for key in ['element_id', 'element_name', 'expected_label']):
                validated_element = {
                    'element_id': str(element['element_id']),
                    'element_name': str(element['element_name']),
                    'css_selector': str(element.get('css_selector', 'div')),
                    'expected_label': str(element['expected_label']).lower(),
                    'reasoning': str(element.get('reasoning', 'Analysis not provided')),
                    'difficulty': str(element.get('difficulty', 'medium')),
                    'red_flags': [str(flag) for flag in element.get('red_flags', [])],
                    'credibility_indicators': [str(ind) for ind in element.get('credibility_indicators', [])]
                }
                validated['clickable_elements'].append(validated_element)
    
    # If no valid elements found, use fallback
    if not validated['clickable_elements']:
        fallback = create_fallback_analysis_for_dataset(article)
        validated['clickable_elements'] = fallback['clickable_elements']
    
    # Validate article analysis
    if 'article_analysis' in analysis and isinstance(analysis['article_analysis'], dict):
        article_analysis = analysis['article_analysis']
        validated['article_analysis'] = {
            'overall_credibility': str(article_analysis.get('overall_credibility', 'medium')),
            'primary_red_flags': [str(flag) for flag in article_analysis.get('primary_red_flags', [])],
            'credibility_factors': [str(factor) for factor in article_analysis.get('credibility_factors', [])],
            'educational_focus': str(article_analysis.get('educational_focus', 'General news analysis training')),
            'misinformation_tactics': [str(tactic) for tactic in article_analysis.get('misinformation_tactics', [])],
            'verification_tips': [str(tip) for tip in article_analysis.get('verification_tips', [])]
        }
    
    return validated

def create_fallback_analysis_for_dataset(article):
    """
    Create fallback analysis when AI fails
    """
    is_real = article.get('label', '').lower() == 'real'
    
    clickable_elements = [
        {
            "element_id": "title",
            "element_name": "Article Title",
            "css_selector": "h2",
            "expected_label": "fake" if not is_real else "real",
            "reasoning": "Fake news often uses sensational headlines" if not is_real else "Real news uses factual headlines",
            "difficulty": "easy",
            "red_flags": ["Sensational language", "All caps", "Emotional manipulation"] if not is_real else [],
            "credibility_indicators": ["Professional tone", "Factual language", "Proper grammar"] if is_real else []
        },
        {
            "element_id": "author",
            "element_name": "Author Information",
            "css_selector": "main > div:nth-child(2)",
            "expected_label": "fake" if not is_real else "real",
            "reasoning": "Check author credibility and attribution" if is_real else "Fake news often lacks proper author info",
            "difficulty": "medium",
            "red_flags": ["Anonymous author", "No credentials", "Suspicious name"] if not is_real else [],
            "credibility_indicators": ["Named author", "Clear attribution", "Verifiable credentials"] if is_real else []
        },
        {
            "element_id": "content",
            "element_name": "Article Content",
            "css_selector": "main > div:nth-child(4)",
            "expected_label": "fake" if not is_real else "real",
            "reasoning": "Analyze content for accuracy and bias" if is_real else "Look for unsubstantiated claims",
            "difficulty": "hard",
            "red_flags": ["Unsupported claims", "Emotional language", "No sources"] if not is_real else [],
            "credibility_indicators": ["Cited sources", "Balanced reporting", "Factual claims"] if is_real else []
        }
    ]
    
    return {
        "clickable_elements": clickable_elements,
        "article_analysis": {
            "overall_credibility": "high" if is_real else "low",
            "primary_red_flags": [
                "Sensational headlines",
                "Emotional manipulation", 
                "Lack of credible sources"
            ] if not is_real else [],
            "credibility_factors": [
                "Professional sourcing",
                "Factual reporting",
                "Proper attribution"
            ] if is_real else [],
            "educational_focus": f"This article demonstrates {'professional journalism standards' if is_real else 'common misinformation tactics'}",
            "misinformation_tactics": [
                "Emotional manipulation",
                "False urgency",
                "Unverified claims"
            ] if not is_real else [],
            "verification_tips": [
                "Check multiple sources",
                "Verify author credentials", 
                "Look for official sources",
                "Check publication date"
            ]
        }
    }

@ai_analysis_bp.route('/batch-analyze-dataset', methods=['POST'])
def batch_analyze_dataset():
    """
    Trigger batch analysis of the entire dataset
    """
    try:
        # Check if Gemini API key is available
        api_key = os.getenv('GEMINI_API_KEY')
        if not api_key:
            return jsonify({
                'success': False,
                'error': 'GEMINI_API_KEY environment variable not set'
            }), 400
        
        # Start batch analysis
        result = batch_analyze_articles_dataset()
        
        return jsonify({
            'success': True,
            'message': 'Dataset analysis completed',
            'total_articles': result['metadata']['total_articles'],
            'output_file': 'data/processed/english_news_articles_analysis.json'
        })
        
    except Exception as e:
        current_app.logger.error(f"Error in batch dataset analysis: {str(e)}")
        return jsonify({
            'success': False,
            'error': f'Analysis failed: {str(e)}'
        }), 500

@ai_analysis_bp.route('/dataset-analysis-status', methods=['GET'])
def get_dataset_analysis_status():
    """
    Check if dataset analysis file exists and get metadata
    """
    try:
        project_root = Path(__file__).parent
        analysis_file = project_root / 'data' / 'processed' / 'english_news_articles_analysis.json'
        
        if analysis_file.exists():
            with open(analysis_file, 'r', encoding='utf-8') as file:
                data = json.load(file)
                
            return jsonify({
                'success': True,
                'exists': True,
                'metadata': data.get('metadata', {}),
                'total_analyses': len(data.get('analyses', []))
            })
        else:
            return jsonify({
                'success': True,
                'exists': False,
                'message': 'Analysis file not found'
            })
            
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@ai_analysis_bp.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint for AI analysis service"""
    try:
        # Test Gemini AI connection
        client = get_gemini_client()
        response = generate_content_with_config(client, "Test connection - respond with 'OK'")
        
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
