import os
import sys
from pathlib import Path

# Add the parent directory to the path to import from the main app
sys.path.append(str(Path(__file__).parent.parent))

from ai_analysis import batch_analyze_articles_dataset

def main():
    """
    Run batch analysis on the english_news_articles.csv dataset
    """
    print("CyberQuest Dataset AI Analysis")
    print("=" * 50)
    
    # Check if Gemini API key is set
    api_key = os.getenv('GEMINI_API_KEY')
    if not api_key:
        print("❌ Error: GEMINI_API_KEY environment variable not set")
        print("Please set your Gemini API key:")
        print("export GEMINI_API_KEY='your-api-key-here'")
        sys.exit(1)
    
    try:
        print("🚀 Starting batch analysis of news articles dataset...")
        result = batch_analyze_articles_dataset()
        
        print("\n✅ Analysis completed successfully!")
        print(f"📊 Analyzed {result['metadata']['total_articles']} articles")
        print(f"💾 Results saved to: data/processed/english_news_articles_analysis.json")
        
    except Exception as e:
        print(f"\n❌ Analysis failed: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
