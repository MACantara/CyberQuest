import pandas as pd
import numpy as np
import os
from pathlib import Path

def create_balanced_batches(csv_file_path, batch_size=15, output_dir="batches"):
    """
    Create balanced batches of articles with 50% fake and 50% real articles.
    
    Args:
        csv_file_path (str): Path to the CSV file containing articles
        batch_size (int): Number of articles per batch (default: 15)
        output_dir (str): Directory to save batch files
    """
    
    # Load the dataset
    print(f"Loading dataset from: {csv_file_path}")
    df = pd.read_csv(csv_file_path)
    
    # Display basic info about the dataset
    print(f"Total articles in dataset: {len(df)}")
    print(f"Label distribution:")
    print(df['label'].value_counts())
    
    # Separate real and fake articles
    real_articles = df[df['label'] == 'Real'].copy()
    fake_articles = df[df['label'] == 'Fake'].copy()
    
    print(f"\nReal articles: {len(real_articles)}")
    print(f"Fake articles: {len(fake_articles)}")
    
    # Shuffle the articles to ensure random distribution
    real_articles = real_articles.sample(frac=1).reset_index(drop=True)
    fake_articles = fake_articles.sample(frac=1).reset_index(drop=True)
    
    # Calculate articles per batch (50/50 split)
    real_per_batch = batch_size // 2
    fake_per_batch = batch_size - real_per_batch
    
    print(f"\nBatch configuration:")
    print(f"Articles per batch: {batch_size}")
    print(f"Real articles per batch: {real_per_batch}")
    print(f"Fake articles per batch: {fake_per_batch}")
    
    # Create output directory
    output_path = Path(output_dir)
    output_path.mkdir(exist_ok=True)
    
    # Calculate maximum number of batches possible
    max_batches_real = len(real_articles) // real_per_batch
    max_batches_fake = len(fake_articles) // fake_per_batch
    max_batches = min(max_batches_real, max_batches_fake)
    
    print(f"\nCan create {max_batches} balanced batches")
    
    # Create batches
    batches_created = 0
    real_index = 0
    fake_index = 0
    
    for batch_num in range(max_batches):
        # Get articles for this batch
        batch_real = real_articles.iloc[real_index:real_index + real_per_batch]
        batch_fake = fake_articles.iloc[fake_index:fake_index + fake_per_batch]
        
        # Combine and shuffle the batch
        batch_df = pd.concat([batch_real, batch_fake], ignore_index=True)
        batch_df = batch_df.sample(frac=1).reset_index(drop=True)
        
        # Save batch to file
        batch_filename = f"batch_{batch_num + 1:03d}.csv"
        batch_filepath = output_path / batch_filename
        batch_df.to_csv(batch_filepath, index=False)
        
        print(f"Created {batch_filename}: {len(batch_df)} articles ({len(batch_real)} real, {len(batch_fake)} fake)")
        
        # Update indices
        real_index += real_per_batch
        fake_index += fake_per_batch
        batches_created += 1
    
    # Report remaining articles
    remaining_real = len(real_articles) - real_index
    remaining_fake = len(fake_articles) - fake_index
    
    print(f"\nBatch creation complete!")
    print(f"Batches created: {batches_created}")
    print(f"Articles used: {batches_created * batch_size}")
    print(f"Remaining articles: {remaining_real} real, {remaining_fake} fake")
    
    # Create summary file
    summary_data = {
        'batch_number': range(1, batches_created + 1),
        'filename': [f"batch_{i:03d}.csv" for i in range(1, batches_created + 1)],
        'total_articles': [batch_size] * batches_created,
        'real_articles': [real_per_batch] * batches_created,
        'fake_articles': [fake_per_batch] * batches_created
    }
    
    summary_df = pd.DataFrame(summary_data)
    summary_filepath = output_path / "batch_summary.csv"
    summary_df.to_csv(summary_filepath, index=False)
    
    print(f"\nSummary saved to: {summary_filepath}")
    print(f"Batch files saved to: {output_path}")

def main():
    """
    Main function to run the batch creation process.
    """
    # Configuration
    CSV_FILE = "data/processed/english_news_articles.csv"
    BATCH_SIZE = 15
    OUTPUT_DIR = "data/batches"
    
    # Check if input file exists
    if not os.path.exists(CSV_FILE):
        print(f"Error: Input file not found: {CSV_FILE}")
        print("Please ensure the CSV file exists in the correct location.")
        return
    
    try:
        create_balanced_batches(CSV_FILE, BATCH_SIZE, OUTPUT_DIR)
        print("\n✅ Batch creation completed successfully!")
        
    except Exception as e:
        print(f"\n❌ Error during batch creation: {e}")
        print("Please check the input file format and try again.")

if __name__ == "__main__":
    main()
