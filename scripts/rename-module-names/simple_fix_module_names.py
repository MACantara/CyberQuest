#!/usr/bin/env python3
"""
Simple script to replace spaces in module_name fields within JSON test plan files.

This is a streamlined version that focuses on the core functionality.

Usage:
    python scripts/simple_fix_module_names.py [--dry-run] [--replacement-char CHAR]

Examples:
    python scripts/simple_fix_module_names.py                    # Replace spaces with underscores
    python scripts/simple_fix_module_names.py --dry-run          # Preview changes without applying
    python scripts/simple_fix_module_names.py --replacement-char "-"  # Use hyphens instead
"""

import json
import sys
import argparse
from pathlib import Path


def process_json_files(json_dir, replacement_char='-', dry_run=False):
    """Process all JSON files in the directory."""
    
    json_files = list(Path(json_dir).glob('*.json'))
    total_changes = 0
    
    print(f"Found {len(json_files)} JSON files")
    
    for file_path in json_files:
        try:
            # Read JSON file
            with open(file_path, 'r', encoding='utf-8') as f:
                data = json.load(f)
            
            file_changes = 0
            
            # Process each test plan
            if isinstance(data, list):
                for test_plan in data:
                    if isinstance(test_plan, dict) and 'module_name' in test_plan:
                        original_name = test_plan['module_name']
                        if ' ' in original_name:
                            new_name = original_name.replace(' ', replacement_char)
                            print(f"  {file_path.name}: '{original_name}' → '{new_name}'")
                            
                            if not dry_run:
                                test_plan['module_name'] = new_name
                            
                            file_changes += 1
            
            # Write changes back to file
            if file_changes > 0 and not dry_run:
                with open(file_path, 'w', encoding='utf-8') as f:
                    json.dump(data, f, indent=2, ensure_ascii=False)
            
            total_changes += file_changes
            
        except Exception as e:
            print(f"Error processing {file_path.name}: {e}")
    
    return total_changes


def main():
    parser = argparse.ArgumentParser(
        description='Replace spaces in module_name fields in JSON test files'
    )
    parser.add_argument(
        '--dry-run', 
        action='store_true',
        help='Preview changes without applying them'
    )
    parser.add_argument(
        '--replacement-char',
        default='-',
        help='Character to replace spaces with (default: underscore)'
    )
    
    args = parser.parse_args()
    
    # Current script directory (C:\Programming-Projects\CyberQuest\scripts\rename-module-names)
    script_dir = Path(__file__).resolve().parent

    # Go up two levels to reach project root (C:\Programming-Projects\CyberQuest)
    project_root = script_dir.parent.parent

    # Point to the JSON files directory
    json_dir = project_root / 'docs' / 'system-test-plans' / 'json-files'
    
    if not json_dir.exists():
        print(f"Error: Directory not found: {json_dir}")
        sys.exit(1)
    
    print(f"Processing JSON files in: {json_dir}")
    print(f"Replacement character: '{args.replacement_char}'")
    print(f"Dry run: {'Yes' if args.dry_run else 'No'}")
    print("-" * 40)
    
    total_changes = process_json_files(json_dir, args.replacement_char, args.dry_run)
    
    print("-" * 40)
    if args.dry_run:
        print(f"Would make {total_changes} changes (dry run mode)")
    else:
        print(f"Made {total_changes} changes")


if __name__ == "__main__":
    main()
