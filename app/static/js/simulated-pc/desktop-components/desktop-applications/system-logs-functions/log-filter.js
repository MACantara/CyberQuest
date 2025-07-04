export class LogFilter {
    constructor(app) {
        this.app = app;
        this.filters = {
            timeRange: 'all',
            level: 'all',
            source: 'all',
            category: 'all',
            searchTerm: ''
        };
    }

    showAdvancedFilter() {
        const overlay = document.createElement('div');
        overlay.className = 'fixed inset-0 bg-black/50 flex items-center justify-center z-50';
        overlay.innerHTML = `
            <div class="bg-gray-800 rounded-lg p-6 max-w-md mx-4">
                <h3 class="text-white text-lg font-semibold mb-4">Advanced Log Filter</h3>
                
                <div class="space-y-4">
                    <div>
                        <label class="text-gray-300 text-sm">Time Range:</label>
                        <select id="filter-time" class="w-full px-2 py-1 bg-gray-700 text-white border border-gray-600 rounded text-xs">
                            <option value="all">All Time</option>
                            <option value="1h">Last Hour</option>
                            <option value="24h">Last 24 Hours</option>
                            <option value="7d">Last 7 Days</option>
                        </select>
                    </div>
                    
                    <div>
                        <label class="text-gray-300 text-sm">Log Level:</label>
                        <select id="filter-level" class="w-full px-2 py-1 bg-gray-700 text-white border border-gray-600 rounded text-xs">
                            <option value="all">All Levels</option>
                            <option value="critical">Critical Only</option>
                            <option value="error">Error & Above</option>
                            <option value="warn">Warning & Above</option>
                            <option value="info">Info & Above</option>
                        </select>
                    </div>
                    
                    <div>
                        <label class="text-gray-300 text-sm">Search Term:</label>
                        <input type="text" id="filter-search" 
                               class="w-full px-2 py-1 bg-gray-700 text-white border border-gray-600 rounded text-xs"
                               placeholder="Search in messages...">
                    </div>
                </div>
                
                <div class="flex justify-end space-x-2 mt-6">
                    <button onclick="this.closest('.fixed').remove()" 
                            class="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors cursor-pointer">
                        Cancel
                    </button>
                    <button id="apply-filter" 
                            class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors cursor-pointer">
                        Apply Filter
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(overlay);
        
        const applyBtn = overlay.querySelector('#apply-filter');
        applyBtn.addEventListener('click', () => {
            this.applyAdvancedFilter(overlay);
        });
    }

    applyAdvancedFilter(overlay) {
        const timeRange = overlay.querySelector('#filter-time').value;
        const level = overlay.querySelector('#filter-level').value;
        const searchTerm = overlay.querySelector('#filter-search').value;
        
        this.filters = { ...this.filters, timeRange, level, searchTerm };
        
        const entries = this.app.windowElement?.querySelectorAll('.log-entry');
        if (entries) {
            entries.forEach(entry => {
                const shouldShow = this.evaluateEntry(entry);
                entry.style.display = shouldShow ? 'grid' : 'none';
            });
        }
        
        this.app.updateLogCounts();
        overlay.remove();
    }

    applyFilters(levelFilter, sourceFilter, categoryFilter) {
        this.filters.level = levelFilter;
        this.filters.source = sourceFilter;
        this.filters.category = categoryFilter;
        
        const entries = this.app.windowElement?.querySelectorAll('.log-entry');
        if (!entries) return;

        entries.forEach(entry => {
            const shouldShow = this.evaluateEntry(entry);
            entry.style.display = shouldShow ? 'grid' : 'none';
        });
        
        this.app.updateLogCounts();
    }

    evaluateEntry(entry) {
        const entryLevel = entry.dataset.level;
        const entrySource = entry.dataset.source;
        const entryCategory = entry.dataset.category;
        const entryMessage = entry.children[4].textContent.toLowerCase();
        
        // Level filter
        if (this.filters.level !== 'all' && entryLevel !== this.filters.level) {
            return false;
        }
        
        // Source filter
        if (this.filters.source !== 'all' && entrySource !== this.filters.source) {
            return false;
        }
        
        // Category filter
        if (this.filters.category !== 'all' && entryCategory !== this.filters.category) {
            return false;
        }
        
        // Search term filter
        if (this.filters.searchTerm && 
            !entryMessage.includes(this.filters.searchTerm.toLowerCase())) {
            return false;
        }
        
        return true;
    }

    setSearchTerm(searchTerm) {
        this.filters.searchTerm = searchTerm.toLowerCase();
        this.applyCurrentFilters();
    }

    applyCurrentFilters() {
        const entries = this.app.windowElement?.querySelectorAll('.log-entry');
        if (!entries) return;

        entries.forEach(entry => {
            const shouldShow = this.evaluateEntry(entry);
            entry.style.display = shouldShow ? 'grid' : 'none';
        });
        
        this.app.updateLogCounts();
    }

    clearAllFilters() {
        this.filters = {
            timeRange: 'all',
            level: 'all',
            source: 'all',
            category: 'all',
            searchTerm: ''
        };
        
        // Reset filter dropdowns
        const levelSelect = this.app.windowElement?.querySelector('#level-filter');
        const sourceSelect = this.app.windowElement?.querySelector('#source-filter');
        const categorySelect = this.app.windowElement?.querySelector('#category-filter');
        
        if (levelSelect) levelSelect.value = 'all';
        if (sourceSelect) sourceSelect.value = 'all';
        if (categorySelect) categorySelect.value = 'all';
        
        this.applyCurrentFilters();
    }

    getFilterSummary() {
        const activeFilters = [];
        
        if (this.filters.level !== 'all') {
            activeFilters.push(`Level: ${this.filters.level}`);
        }
        
        if (this.filters.source !== 'all') {
            activeFilters.push(`Source: ${this.filters.source}`);
        }
        
        if (this.filters.category !== 'all') {
            activeFilters.push(`Category: ${this.filters.category}`);
        }
        
        if (this.filters.searchTerm) {
            activeFilters.push(`Search: "${this.filters.searchTerm}"`);
        }
        
        return activeFilters.length > 0 ? activeFilters.join(', ') : 'No filters active';
    }

    getFilteredCount() {
        const entries = this.app.windowElement?.querySelectorAll('.log-entry');
        if (!entries) return 0;
        
        return Array.from(entries).filter(entry => entry.style.display !== 'none').length;
    }

    // Advanced filter methods for potential future use
    getAvailableSources() {
        const entries = this.app.windowElement?.querySelectorAll('.log-entry');
        if (!entries) return [];
        
        const sources = new Set();
        entries.forEach(entry => {
            sources.add(entry.dataset.source);
        });
        
        return Array.from(sources).sort();
    }

    getAvailableCategories() {
        const entries = this.app.windowElement?.querySelectorAll('.log-entry');
        if (!entries) return [];
        
        const categories = new Set();
        entries.forEach(entry => {
            categories.add(entry.dataset.category);
        });
        
        return Array.from(categories).sort();
    }

    getAvailableLevels() {
        const entries = this.app.windowElement?.querySelectorAll('.log-entry');
        if (!entries) return [];
        
        const levels = new Set();
        entries.forEach(entry => {
            levels.add(entry.dataset.level);
        });
        
        return Array.from(levels).sort();
    }
}
