# Data Preprocessing Scripts

This directory contains scripts for preprocessing the news articles dataset used in CyberQuest Level 1.

## Scripts

### preprocess_english_articles.py

Filters the news articles dataset to only include English language articles with valid data.

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
- Saves filtered dataset to `data/processed/english_news_articles.csv`
- Provides statistics on the filtering process

**Output:**
- Creates `data/processed/english_news_articles.csv` with only English articles
- Shows statistics including:
  - Total articles processed
  - Number of English articles found
  - Real vs fake news distribution
  - Articles with valid image URLs

## Requirements

- Python 3.6+
- Standard library modules (csv, os, sys, pathlib)
- `requests` library (for image accessibility verification)

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
