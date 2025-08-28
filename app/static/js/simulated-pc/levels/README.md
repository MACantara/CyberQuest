# Level-Specific JavaScript Loading Optimization

## Overview
This optimization ensures that only the JavaScript files required for a specific level are loaded, reducing initial bundle size and improving performance.

## Implementation

### Server-Side (Flask)
- **File**: `app/routes/levels.py`
- **Function**: `get_level_js_files(level_id)`
- **Purpose**: Returns an array of JavaScript file paths specific to the requested level

### Level-Specific File Mapping

#### Level 1: The Misinformation Maze
**Applications**: Browser, Email, File Manager
**Focus**: News verification, source checking, fact-checking
**Files Loaded**: ~35 core files + 15 level-specific files

#### Level 2: Shadow in the Inbox  
**Applications**: Email, Browser, System Logs
**Focus**: Phishing detection, email security
**Files Loaded**: ~35 core files + 18 level-specific files

#### Level 3: Malware Mayhem
**Applications**: Malware Scanner, Process Monitor, System Logs, File Manager
**Focus**: Malware detection and system security
**Files Loaded**: ~35 core files + 20 level-specific files

#### Level 4: The White Hat Test
**Applications**: Vulnerability Scanner, Network Monitor, Terminal, Browser
**Focus**: Ethical hacking and vulnerability assessment
**Files Loaded**: ~35 core files + 22 level-specific files

#### Level 5: The Hunt for The Null
**Applications**: All applications (comprehensive forensics)
**Focus**: Digital forensics and evidence analysis
**Files Loaded**: ~35 core files + 30 level-specific files
**Special Features**: Evidence tracker, scoring system

## Performance Benefits

### Before Optimization
- **All Files Loaded**: ~320 JavaScript files
- **Initial Load Time**: High
- **Memory Usage**: High
- **Network Requests**: 320+ requests

### After Optimization (Level 1 Example)
- **Files Loaded**: ~50 JavaScript files (85% reduction)
- **Initial Load Time**: Significantly reduced
- **Memory Usage**: Reduced by ~70%
- **Network Requests**: ~50 requests (85% reduction)

## File Organization Structure

```
levels/
├── level-one/
│   ├── apps/          # Level-specific applications
│   ├── data/          # Level scenario data
│   ├── dialogues/     # Level dialogue files
│   ├── tutorials/     # Level tutorial files
│   └── level-config.js # Level configuration
├── level-two/
├── level-three/
├── level-four/
├── level-five/
└── level-manager.js   # Centralized level management
```

## Template Integration
- **File**: `app/templates/simulated-pc/simulation.html`
- **Dynamic Loading**: JavaScript files are loaded based on `level_js_files` array
- **Conditional Loading**: Only loads files needed for the current level

## Future Enhancements
1. **Lazy Loading**: Load additional modules on-demand within a level
2. **Code Splitting**: Further split large modules into smaller chunks
3. **Caching Strategy**: Implement intelligent caching for frequently used modules
4. **Bundle Analysis**: Monitor and optimize bundle sizes per level

## Developer Notes
- Core files (boot sequence, desktop manager, etc.) are loaded for all levels
- Level-specific files are only loaded when that level is accessed
- The level manager handles dynamic imports and module lifecycle
- Each level has its own configuration file for easy maintenance
