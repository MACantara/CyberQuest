import csv
import os
import sys
import requests
from pathlib import Path
from urllib.parse import urlparse
import time

def check_image_accessibility(url, timeout=10):
    """
    Check if an image URL is accessible by making a HEAD request
    Returns True if accessible, False otherwise
    """
    try:
        # Parse URL to check if it's valid
        parsed = urlparse(url)
        if not parsed.scheme or not parsed.netloc:
            return False
        
        # Make HEAD request to check if image exists
        response = requests.head(url, timeout=timeout, allow_redirects=True)
        
        # Check if response is successful and content type is image
        if response.status_code == 200:
            content_type = response.headers.get('content-type', '').lower()
            if any(img_type in content_type for img_type in ['image/', 'jpeg', 'jpg', 'png', 'gif', 'webp']):
                return True
        
        return False
        
    except (requests.RequestException, requests.Timeout, Exception) as e:
        print(f"  Warning: Could not verify image {url[:60]}... - {str(e)}")
        return False

def filter_english_articles():
    """
    Filter news_articles.csv to only include articles with language='english'
    and save the filtered dataset to a new file.
    """
    
    # Get the project root directory
    project_root = Path(__file__).parent.parent
    
    # Define input and output file paths
    input_file = project_root / 'data' / 'news_articles.csv'
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
    skipped_no_image = 0
    skipped_inaccessible_image = 0
    
    try:
        # Read the CSV file
        with open(input_file, 'r', encoding='utf-8') as infile:
            reader = csv.DictReader(infile)
            
            # Get the fieldnames for the output file
            fieldnames = reader.fieldnames
            
            print(f"CSV columns: {fieldnames}")
            print("Starting image accessibility verification...")
            
            for row in reader:
                total_articles += 1
                
                # Filter for English language articles only
                language = row.get('language', '').strip().lower()
                
                if language == 'english':
                    # Additional validation for required fields including title and image URL
                    title = row.get('title', '').strip()
                    main_img_url = row.get('main_img_url', '').strip()
                    
                    # Check basic requirements
                    if (title and  # Title must exist and not be empty
                        title.lower() not in ['no title', 'untitled', ''] and  # Exclude common placeholder titles
                        main_img_url and  # Image URL must exist
                        main_img_url.lower() not in ['no image url', 'no image', ''] and  # Exclude placeholder image URLs
                        main_img_url.startswith(('http://', 'https://')) and  # Must be valid HTTP/HTTPS URL
                        row.get('text') and 
                        row.get('author') and 
                        row.get('label')):
                        
                        # Check if image is accessible
                        print(f"  Checking image for article: {title[:50]}...")
                        if check_image_accessibility(main_img_url):
                            english_articles.append(row)
                            print(f"    ✓ Image accessible, article included")
                        else:
                            skipped_inaccessible_image += 1
                            print(f"    ✗ Image not accessible, article skipped")
                        
                        # Add small delay to avoid overwhelming servers
                        time.sleep(0.5)
                    else:
                        if not main_img_url or main_img_url.lower() in ['no image url', 'no image', '']:
                            skipped_no_image += 1
                
                # Print progress every 100 articles
                if total_articles % 100 == 0:
                    print(f"Processed {total_articles} articles, found {len(english_articles)} English articles with accessible images")
                    print(f"  Skipped {skipped_no_image} with no image, {skipped_inaccessible_image} with inaccessible images")
        
        # Write filtered articles to new CSV file
        with open(output_file, 'w', newline='', encoding='utf-8') as outfile:
            writer = csv.DictWriter(outfile, fieldnames=fieldnames)
            writer.writeheader()
            writer.writerows(english_articles)
        
        # Print summary statistics
        print("\n" + "="*70)
        print("FILTERING COMPLETE")
        print("="*70)
        print(f"Total articles processed: {total_articles:,}")
        print(f"English articles with accessible images: {len(english_articles):,}")
        print(f"Filtering ratio: {(len(english_articles)/total_articles)*100:.2f}%")
        
        print(f"\nFiltering breakdown:")
        print(f"Articles without valid image URLs: {skipped_no_image:,}")
        print(f"Articles with inaccessible images: {skipped_inaccessible_image:,}")
        print(f"Articles with accessible images (included): {len(english_articles):,}")
        
        # Analyze the filtered dataset
        real_count = sum(1 for article in english_articles if article.get('label', '').lower() == 'real')
        fake_count = len(english_articles) - real_count
        
        print(f"\nDataset composition:")
        print(f"Real news articles: {real_count:,} ({(real_count/len(english_articles))*100:.1f}%)")
        print(f"Fake news articles: {fake_count:,} ({(fake_count/len(english_articles))*100:.1f}%)")
        
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
    print("News Articles Dataset Preprocessing with Image Verification")
    print("=" * 60)
    
    # Check if requests library is available
    try:
        import requests
    except ImportError:
        print("Error: 'requests' library is required for image verification.")
        print("Install it with: pip install requests")
        sys.exit(1)
    
    if len(sys.argv) > 1 and sys.argv[1] == '--analyze':
        analyze_language_distribution()
    else:
        # First show language distribution
        analyze_language_distribution()
        
        # Then filter English articles with image verification
        success = filter_english_articles()
        
        if success:
            print("\n✅ Preprocessing completed successfully!")
            print("Note: Image accessibility was verified for all included articles.")
        else:
            print("\n❌ Preprocessing failed!")
            sys.exit(1)

if __name__ == "__main__":
    main()
