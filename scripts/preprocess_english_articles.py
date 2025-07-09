import csv
import os
import sys
from pathlib import Path

def filter_english_articles():
    """
    Filter news_articles.csv to only include articles with language='english'
    and save the filtered dataset to a new file.
    """
    
    # Get the project root directory
    project_root = Path(__file__).parent.parent
    
    # Define input and output file paths
    input_file = project_root / 'app' / 'static' / 'js' / 'simulated-pc' / 'levels' / 'level-one' / 'data' / 'news_articles.csv'
    output_file = project_root / 'data' / 'processed' / 'english_news_articles.csv'
    
    # Create output directory if it doesn't exist
    output_file.parent.mkdir(parents=True, exist_ok=True)
    
    print(f"Input file: {input_file}")
    print(f"Output file: {output_file}")
    
    # Check if input file exists
    if not input_file.exists():
        print(f"Error: Input file not found: {input_file}")
        return False
    
    english_articles = []
    total_articles = 0
    
    try:
        # Read the CSV file
        with open(input_file, 'r', encoding='utf-8') as infile:
            reader = csv.DictReader(infile)
            
            # Get the fieldnames for the output file
            fieldnames = reader.fieldnames
            
            print(f"CSV columns: {fieldnames}")
            
            for row in reader:
                total_articles += 1
                
                # Filter for English language articles only
                language = row.get('language', '').strip().lower()
                
                if language == 'english':
                    # Additional validation for required fields
                    if (row.get('title') and 
                        row.get('text') and 
                        row.get('author') and 
                        row.get('label')):
                        english_articles.append(row)
                
                # Print progress every 1000 articles
                if total_articles % 1000 == 0:
                    print(f"Processed {total_articles} articles, found {len(english_articles)} English articles")
        
        # Write filtered articles to new CSV file
        with open(output_file, 'w', newline='', encoding='utf-8') as outfile:
            writer = csv.DictWriter(outfile, fieldnames=fieldnames)
            writer.writeheader()
            writer.writerows(english_articles)
        
        # Print summary statistics
        print("\n" + "="*50)
        print("FILTERING COMPLETE")
        print("="*50)
        print(f"Total articles processed: {total_articles:,}")
        print(f"English articles found: {len(english_articles):,}")
        print(f"Filtering ratio: {(len(english_articles)/total_articles)*100:.2f}%")
        
        # Analyze the filtered dataset
        real_count = sum(1 for article in english_articles if article.get('label', '').lower() == 'real')
        fake_count = len(english_articles) - real_count
        
        print(f"\nDataset composition:")
        print(f"Real news articles: {real_count:,} ({(real_count/len(english_articles))*100:.1f}%)")
        print(f"Fake news articles: {fake_count:,} ({(fake_count/len(english_articles))*100:.1f}%)")
        
        # Check for valid image URLs
        valid_images = sum(1 for article in english_articles 
                          if article.get('main_img_url', '').startswith(('http://', 'https://')))
        print(f"Articles with valid image URLs: {valid_images:,} ({(valid_images/len(english_articles))*100:.1f}%)")
        
        print(f"\nFiltered dataset saved to: {output_file}")
        
        return True
        
    except Exception as e:
        print(f"Error processing files: {e}")
        return False

def analyze_language_distribution():
    """
    Analyze the language distribution in the original dataset
    """
    project_root = Path(__file__).parent.parent
    input_file = project_root / 'app' / 'static' / 'js' / 'simulated-pc' / 'levels' / 'level-one' / 'data' / 'news_articles.csv'
    
    if not input_file.exists():
        print(f"Error: Input file not found: {input_file}")
        return
    
    language_counts = {}
    total_articles = 0
    
    try:
        with open(input_file, 'r', encoding='utf-8') as infile:
            reader = csv.DictReader(infile)
            
            for row in reader:
                total_articles += 1
                language = row.get('language', '').strip().lower()
                
                if language:
                    language_counts[language] = language_counts.get(language, 0) + 1
                else:
                    language_counts['<empty>'] = language_counts.get('<empty>', 0) + 1
        
        print("\n" + "="*50)
        print("LANGUAGE DISTRIBUTION ANALYSIS")
        print("="*50)
        print(f"Total articles: {total_articles:,}")
        print(f"Unique languages: {len(language_counts)}")
        print("\nLanguage breakdown:")
        
        # Sort by count (descending)
        sorted_languages = sorted(language_counts.items(), key=lambda x: x[1], reverse=True)
        
        for language, count in sorted_languages:
            percentage = (count / total_articles) * 100
            print(f"  {language:15} {count:8,} ({percentage:5.1f}%)")
            
    except Exception as e:
        print(f"Error analyzing language distribution: {e}")

def main():
    """
    Main function to run the preprocessing script
    """
    print("News Articles Dataset Preprocessing")
    print("=" * 40)
    
    if len(sys.argv) > 1 and sys.argv[1] == '--analyze':
        analyze_language_distribution()
    else:
        # First show language distribution
        analyze_language_distribution()
        
        # Then filter English articles
        success = filter_english_articles()
        
        if success:
            print("\n✅ Preprocessing completed successfully!")
        else:
            print("\n❌ Preprocessing failed!")
            sys.exit(1)

if __name__ == "__main__":
    main()
