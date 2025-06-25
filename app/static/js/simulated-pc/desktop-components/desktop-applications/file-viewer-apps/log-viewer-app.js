import { WindowBase } from '../../window-base.js';

export class LogViewerApp extends WindowBase {
    constructor(fileName, fileData, fileContent) {
        super(`log-viewer-${fileName}`, `Log Viewer - ${fileName}`, {
            width: '85%',
            height: '70%'
        });
        
        this.fileName = fileName;
        this.fileData = fileData;
        this.fileContent = fileContent;
        this.filterLevel = 'all';
        this.searchTerm = '';
    }

    createContent() {
        return `
            <div class="h-full flex flex-col bg-gray-800">
                <!-- Toolbar -->
                <div class="bg-gray-700 p-2 border-b border-gray-600 flex items-center justify-between flex-shrink-0">
                    <div class="flex items-center space-x-3">
                        <i class="bi bi-journal-text text-yellow-400 text-xl"></i>
                        <div>
                            <h3 class="text-white text-sm font-semibold">${this.fileName}</h3>
                            <p class="text-gray-400 text-xs">${this.fileData.size || 'Unknown size'} • Log File</p>
                        </div>
                    </div>
                    
                    <div class="flex items-center space-x-2">
                        <input type="text" 
                               id="search-input"
                               class="px-2 py-1 bg-gray-800 text-white border border-gray-600 rounded text-xs"
                               placeholder="Search logs..."
                               value="${this.searchTerm}">
                        <select id="filter-level" 
                                class="px-2 py-1 bg-gray-800 text-white border border-gray-600 rounded text-xs cursor-pointer">
                            <option value="all">All Levels</option>
                            <option value="error">Errors Only</option>
                            <option value="warning">Warnings</option>
                            <option value="info">Info</option>
                            <option value="debug">Debug</option>
                        </select>
                        <button id="export-btn" 
                                class="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-xs cursor-pointer">
                            Export
                        </button>
                    </div>
                </div>
                
                <!-- Log Content -->
                <div class="flex-1 overflow-hidden flex">
                    <!-- Line Numbers -->
                    <div class="bg-gray-900 border-r border-gray-600 p-2 text-gray-500 text-xs font-mono select-none w-16" id="line-numbers">
                        ${this.generateLineNumbers()}
                    </div>
                    
                    <!-- Log Lines -->
                    <div class="flex-1 overflow-auto bg-black p-2" id="log-content">
                        ${this.renderLogContent()}
                    </div>
                </div>
                
                <!-- Stats Bar -->
                <div class="bg-gray-700 p-2 border-t border-gray-600 flex justify-between items-center text-xs text-gray-300 flex-shrink-0">
                    <div class="flex items-center space-x-4">
                        <span id="total-lines">Total: ${this.getTotalLines()}</span>
                        <span id="error-count" class="text-red-400">Errors: ${this.getErrorCount()}</span>
                        <span id="warning-count" class="text-yellow-400">Warnings: ${this.getWarningCount()}</span>
                    </div>
                    <div class="flex items-center space-x-2">
                        <span>Last Updated: ${this.fileData.modified || 'Unknown'}</span>
                    </div>
                </div>
            </div>
        `;
    }

    generateLineNumbers() {
        const lines = this.fileContent.split('\n');
        const lineNumberElements = [];
        
        lines.forEach((line, index) => {
            const logLevel = this.detectLogLevel(line);
            const isMatch = this.searchTerm === '' || line.toLowerCase().includes(this.searchTerm.toLowerCase());
            const shouldShow = (this.filterLevel === 'all' || logLevel === this.filterLevel) && isMatch;
            
            if (shouldShow) {
                lineNumberElements.push(`<div class="line-number text-xs py-1 text-right pr-2">${(index + 1).toString().padStart(4, ' ')}</div>`);
            }
        });
        
        return lineNumberElements.join('');
    }

    renderLogContent() {
        const lines = this.fileContent.split('\n');
        const visibleLines = [];
        
        lines.forEach((line, index) => {
            const logLevel = this.detectLogLevel(line);
            const isMatch = this.searchTerm === '' || line.toLowerCase().includes(this.searchTerm.toLowerCase());
            const shouldShow = (this.filterLevel === 'all' || logLevel === this.filterLevel) && isMatch;
            
            if (shouldShow) {
                visibleLines.push(`
                    <div class="log-line font-mono text-xs py-1 ${this.getLogLineClass(logLevel, line)}" data-line="${index + 1}">
                        <span class="text-gray-500 mr-2">[${this.extractTimestamp(line) || 'No Time'}]</span>
                        <span class="log-level-badge ${this.getLevelBadgeClass(logLevel)}">${logLevel.toUpperCase()}</span>
                        <span class="ml-2">${this.highlightSuspiciousContent(line)}</span>
                    </div>
                `);
            }
        });
        
        return visibleLines.join('');
    }

    detectLogLevel(line) {
        const lowerLine = line.toLowerCase();
        if (lowerLine.includes('error') || lowerLine.includes('fail') || lowerLine.includes('exception')) return 'error';
        if (lowerLine.includes('warn') || lowerLine.includes('caution')) return 'warning';
        if (lowerLine.includes('info') || lowerLine.includes('notice')) return 'info';
        if (lowerLine.includes('debug') || lowerLine.includes('trace')) return 'debug';
        return 'info';
    }

    getLogLineClass(level, line) {
        const baseClass = 'hover:bg-gray-700 cursor-pointer';
        const isSuspicious = this.isSuspiciousContent(line);
        
        if (isSuspicious) return `${baseClass} bg-red-900/20 border-l-2 border-red-500`;
        
        switch (level) {
            case 'error': return `${baseClass} text-red-300`;
            case 'warning': return `${baseClass} text-yellow-300`;
            case 'info': return `${baseClass} text-green-300`;
            case 'debug': return `${baseClass} text-blue-300`;
            default: return `${baseClass} text-gray-300`;
        }
    }

    getLevelBadgeClass(level) {
        switch (level) {
            case 'error': return 'bg-red-600 text-white px-1 rounded text-xs';
            case 'warning': return 'bg-yellow-600 text-white px-1 rounded text-xs';
            case 'info': return 'bg-blue-600 text-white px-1 rounded text-xs';
            case 'debug': return 'bg-gray-600 text-white px-1 rounded text-xs';
            default: return 'bg-gray-600 text-white px-1 rounded text-xs';
        }
    }

    extractTimestamp(line) {
        // Extract timestamp patterns
        const timePatterns = [
            /\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}/,
            /\d{2}\/\d{2}\/\d{4} \d{2}:\d{2}:\d{2}/,
            /\d{2}:\d{2}:\d{2}/
        ];
        
        for (const pattern of timePatterns) {
            const match = line.match(pattern);
            if (match) return match[0];
        }
        return null;
    }

    isSuspiciousContent(line) {
        const suspiciousPatterns = [
            /failed login/i,
            /unauthorized/i,
            /intrusion/i,
            /malware/i,
            /virus/i,
            /attack/i,
            /breach/i,
            /suspicious/i,
            /blocked/i
        ];
        
        return suspiciousPatterns.some(pattern => pattern.test(line));
    }

    highlightSuspiciousContent(line) {
        if (this.isSuspiciousContent(line)) {
            return line.replace(/(failed|login|unauthorized|intrusion|malware|virus|attack|breach|suspicious|blocked)/gi, 
                '<span class="bg-red-600 text-white px-1 rounded">$1</span>');
        }
        
        // Highlight search terms
        if (this.searchTerm) {
            const regex = new RegExp(`(${this.searchTerm})`, 'gi');
            return line.replace(regex, '<span class="bg-yellow-600 text-black px-1 rounded">$1</span>');
        }
        
        return line;
    }

    getTotalLines() {
        return this.fileContent.split('\n').length;
    }

    getErrorCount() {
        return this.fileContent.split('\n').filter(line => this.detectLogLevel(line) === 'error').length;
    }

    getWarningCount() {
        return this.fileContent.split('\n').filter(line => this.detectLogLevel(line) === 'warning').length;
    }

    initialize() {
        super.initialize();
        this.bindLogViewerEvents();
    }

    bindLogViewerEvents() {
        const windowElement = this.windowElement;
        if (!windowElement) return;

        const searchInput = windowElement.querySelector('#search-input');
        const filterLevel = windowElement.querySelector('#filter-level');
        const exportBtn = windowElement.querySelector('#export-btn');

        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.searchTerm = e.target.value;
                this.updateLogDisplay();
            });
        }

        if (filterLevel) {
            filterLevel.addEventListener('change', (e) => {
                this.filterLevel = e.target.value;
                this.updateLogDisplay();
            });
        }

        if (exportBtn) {
            exportBtn.addEventListener('click', () => {
                this.exportLogs();
            });
        }

        // Click to select log lines
        const logContent = windowElement.querySelector('#log-content');
        if (logContent) {
            logContent.addEventListener('click', (e) => {
                const logLine = e.target.closest('.log-line');
                if (logLine) {
                    this.selectLogLine(logLine);
                }
            });
        }
    }

    updateLogDisplay() {
        const logContent = this.windowElement?.querySelector('#log-content');
        const lineNumbers = this.windowElement?.querySelector('#line-numbers');
        
        if (logContent) {
            logContent.innerHTML = this.renderLogContent();
        }
        
        if (lineNumbers) {
            lineNumbers.innerHTML = this.generateLineNumbers();
        }
        
        this.updateStats();
    }

    updateStats() {
        const lines = this.fileContent.split('\n');
        const visibleLines = lines.filter((line) => {
            const logLevel = this.detectLogLevel(line);
            const isMatch = this.searchTerm === '' || line.toLowerCase().includes(this.searchTerm.toLowerCase());
            return (this.filterLevel === 'all' || logLevel === this.filterLevel) && isMatch;
        });
        
        const visibleErrors = visibleLines.filter(line => this.detectLogLevel(line) === 'error').length;
        const visibleWarnings = visibleLines.filter(line => this.detectLogLevel(line) === 'warning').length;
        
        const totalLines = this.windowElement?.querySelector('#total-lines');
        const errorCount = this.windowElement?.querySelector('#error-count');
        const warningCount = this.windowElement?.querySelector('#warning-count');
        
        if (totalLines) totalLines.textContent = `Visible: ${visibleLines.length}/${this.getTotalLines()}`;
        if (errorCount) errorCount.textContent = `Errors: ${visibleErrors}`;
        if (warningCount) warningCount.textContent = `Warnings: ${visibleWarnings}`;
    }

    selectLogLine(logLine) {
        // Remove previous selection
        const selected = this.windowElement?.querySelector('.log-line.selected');
        if (selected) {
            selected.classList.remove('selected', 'bg-blue-600');
        }
        
        // Select new line
        logLine.classList.add('selected', 'bg-blue-600');
        
        // Show details if suspicious
        const lineText = logLine.textContent;
        if (this.isSuspiciousContent(lineText)) {
            this.showLogLineDetails(lineText, logLine.dataset.line);
        }
    }

    showLogLineDetails(lineText, lineNumber) {
        const overlay = document.createElement('div');
        overlay.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
        overlay.innerHTML = `
            <div class="bg-gray-800 rounded-lg p-6 max-w-2xl mx-4">
                <div class="text-center">
                    <i class="bi bi-exclamation-triangle text-yellow-400 text-4xl mb-3"></i>
                    <h3 class="text-white text-lg font-semibold mb-2">Suspicious Log Entry - Line ${lineNumber}</h3>
                    <div class="bg-black p-3 rounded font-mono text-sm text-left mb-4">
                        <div class="text-red-400">${lineText}</div>
                    </div>
                    <p class="text-gray-300 text-sm mb-4">
                        This log entry contains suspicious content that may indicate a security incident.
                    </p>
                    <button onclick="this.closest('.fixed').remove()" 
                            class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors cursor-pointer">
                        Close
                    </button>
                </div>
            </div>
        `;
        document.body.appendChild(overlay);
    }

    exportLogs() {
        const overlay = document.createElement('div');
        overlay.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
        overlay.innerHTML = `
            <div class="bg-gray-800 rounded-lg p-6 max-w-md mx-4">
                <div class="text-center">
                    <i class="bi bi-download text-blue-400 text-4xl mb-3"></i>
                    <h3 class="text-white text-lg font-semibold mb-2">Export Logs</h3>
                    <p class="text-gray-300 text-sm mb-4">
                        Export filtered log entries for further analysis.
                    </p>
                    <button onclick="this.closest('.fixed').remove(); alert('Logs exported successfully (simulation)');" 
                            class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors cursor-pointer">
                        Export
                    </button>
                </div>
            </div>
        `;
        document.body.appendChild(overlay);
    }
}
