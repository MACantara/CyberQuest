# Data Preprocessing Scripts

This directory contains scripts for preprocessing the news articles dataset used in CyberQuest Level 1.

## Scripts

### preprocess_english_articles.py

Filters the news articles dataset to only include English language articles with valid data and accessible images.

**Usage:**
```bash
# Run preprocessing (includes analysis + filtering)
python scripts/preprocess_english_articles.py

# Only analyze language distribution
python scripts/preprocess_english_articles.py --analyze
```

**What it does:**
- Reads the original `news_articles.csv` file
- Filters articles where `language == 'english'`
- Validates required fields (title, text, author, label)
- **Batch verifies image accessibility** for improved performance
- Saves filtered dataset to `data/processed/english_news_articles.csv`
- Provides statistics on the filtering process

**Features:**
- **Concurrent image checking** using ThreadPoolExecutor
- **Batch processing** to reduce server load
- **Rate limiting** between batches to be respectful to servers
- **Progress tracking** with detailed statistics
- **Error handling** for network timeouts and failures

**Output:**
- Creates `data/processed/english_news_articles.csv` with only English articles with accessible images
- Shows statistics including:
  - Total articles processed
  - Number of English articles found
  - Real vs fake news distribution
  - Image accessibility verification results
  - Performance metrics for batch processing

## Requirements

- Python 3.6+
- Standard library modules (csv, os, sys, pathlib, threading, concurrent.futures)
- `requests` library (for image accessibility verification)

## Performance

The batch processing approach significantly improves performance:
- **Concurrent checking** of up to 10-20 URLs simultaneously
- **Batch sizes** of 50 URLs to balance speed and server respect
- **Rate limiting** with 2-second pauses between batches
- **Progress reporting** for long-running operations

## Directory Structure

```
CyberQuest/
├── scripts/
│   ├── preprocess_english_articles.py
│   └── README.md
├── data/
│   └── processed/
│       └── english_news_articles.csv (generated)
└── app/
    └── static/js/simulated-pc/levels/level-one/data/
        └── news_articles.csv (original)
```
