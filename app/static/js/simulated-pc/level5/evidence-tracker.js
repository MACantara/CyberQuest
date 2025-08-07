export class EvidenceTracker {
    constructor() {
        this.evidenceFiles = new Set();
        this.patterns = new Set();
        this.requiredEvidence = [
            'bot_logs.txt',
            'email_headers.txt', 
            'malware_code.txt',
            'login_logs.txt',
            'hidden_message.txt'
        ];
        this.requiredPatterns = [
            'ip_address_192.168.1.100',
            'signature_n4ll',
            'timing_tuesday_2am'
        ];
        this.createTrackerUI();
    }

    createTrackerUI() {
        // Create a floating evidence tracker panel
        const tracker = document.createElement('div');
        tracker.id = 'evidence-tracker';
        tracker.className = `
            fixed top-20 right-4 w-80 bg-white dark:bg-gray-800 
            border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg 
            p-4 z-40 max-h-96 overflow-y-auto
        `;
        tracker.style.display = 'none'; // Initially hidden

        tracker.innerHTML = `
            <div class="flex items-center justify-between mb-3">
                <h3 class="font-bold text-gray-900 dark:text-white">
                    🔍 Evidence Tracker
                </h3>
                <button id="toggle-tracker" class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                    <i class="bi bi-dash-lg"></i>
                </button>
            </div>
            
            <div class="mb-4">
                <div class="flex items-center justify-between text-sm mb-2">
                    <span class="text-gray-600 dark:text-gray-400">Progress</span>
                    <span id="evidence-progress" class="font-medium text-blue-600 dark:text-blue-400">0/5</span>
                </div>
                <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div id="evidence-progress-bar" class="bg-blue-500 h-2 rounded-full transition-all duration-300" style="width: 0%"></div>
                </div>
            </div>

            <div class="space-y-3">
                <div>
                    <h4 class="font-medium text-gray-900 dark:text-white text-sm mb-2">📁 Evidence Files</h4>
                    <div id="evidence-list" class="space-y-1 text-sm">
                        ${this.requiredEvidence.map(file => `
                            <div id="evidence-${file.replace('.', '-')}" class="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                                <i class="bi bi-square w-4"></i>
                                <span>${file}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <div>
                    <h4 class="font-medium text-gray-900 dark:text-white text-sm mb-2">🔗 Key Patterns</h4>
                    <div id="patterns-list" class="space-y-1 text-sm">
                        <div id="pattern-ip" class="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                            <i class="bi bi-square w-4"></i>
                            <span>IP: 192.168.1.100</span>
                        </div>
                        <div id="pattern-signature" class="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                            <i class="bi bi-square w-4"></i>
                            <span>Signature: N4LL</span>
                        </div>
                        <div id="pattern-timing" class="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                            <i class="bi bi-square w-4"></i>
                            <span>Timing: Tuesday 2AM</span>
                        </div>
                    </div>
                </div>

                <div class="border-t border-gray-200 dark:border-gray-600 pt-3">
                    <div class="text-xs text-gray-500 dark:text-gray-400 space-y-1">
                        <div>💡 <strong>Tip:</strong> Find 4+ evidence files to solve the case</div>
                        <div>🎯 <strong>Goal:</strong> Identify The Null's true identity</div>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(tracker);

        // Add toggle functionality
        document.getElementById('toggle-tracker').addEventListener('click', () => {
            tracker.style.display = tracker.style.display === 'none' ? 'block' : 'none';
        });

        this.trackerElement = tracker;
    }

    showTracker() {
        if (this.trackerElement) {
            this.trackerElement.style.display = 'block';
        }
    }

    hideTracker() {
        if (this.trackerElement) {
            this.trackerElement.style.display = 'none';
        }
    }

    markEvidenceFound(filename) {
        this.evidenceFiles.add(filename);
        this.updateUI();
        
        // Update the specific evidence item
        const elementId = `evidence-${filename.replace('.', '-')}`;
        const element = document.getElementById(elementId);
        if (element) {
            const icon = element.querySelector('i');
            const text = element.querySelector('span');
            icon.className = 'bi bi-check-square-fill w-4 text-green-500';
            text.className = 'text-green-600 dark:text-green-400 font-medium';
            element.className = 'flex items-center space-x-2 text-green-600 dark:text-green-400';
        }
        
        console.log(`Evidence found: ${filename} (${this.evidenceFiles.size}/${this.requiredEvidence.length})`);
    }

    markPatternFound(patternId) {
        this.patterns.add(patternId);
        this.updateUI();
        
        // Update the specific pattern item
        let elementId = '';
        switch(patternId) {
            case 'ip_address_192.168.1.100':
                elementId = 'pattern-ip';
                break;
            case 'signature_n4ll':
                elementId = 'pattern-signature';
                break;
            case 'timing_tuesday_2am':
                elementId = 'pattern-timing';
                break;
        }
        
        const element = document.getElementById(elementId);
        if (element) {
            const icon = element.querySelector('i');
            const text = element.querySelector('span');
            icon.className = 'bi bi-check-square-fill w-4 text-blue-500';
            text.className = 'text-blue-600 dark:text-blue-400 font-medium';
            element.className = 'flex items-center space-x-2 text-blue-600 dark:text-blue-400';
        }
        
        console.log(`Pattern identified: ${patternId}`);
    }

    updateUI() {
        const progressElement = document.getElementById('evidence-progress');
        const progressBarElement = document.getElementById('evidence-progress-bar');
        
        if (progressElement && progressBarElement) {
            const progress = this.evidenceFiles.size;
            const total = this.requiredEvidence.length;
            const percentage = Math.round((progress / total) * 100);
            
            progressElement.textContent = `${progress}/${total}`;
            progressBarElement.style.width = `${percentage}%`;
            
            // Change color based on progress
            if (percentage >= 80) {
                progressBarElement.className = 'bg-green-500 h-2 rounded-full transition-all duration-300';
            } else if (percentage >= 60) {
                progressBarElement.className = 'bg-yellow-500 h-2 rounded-full transition-all duration-300';
            } else {
                progressBarElement.className = 'bg-blue-500 h-2 rounded-full transition-all duration-300';
            }
        }
    }

    getCompletionRate() {
        return Math.round((this.evidenceFiles.size / this.requiredEvidence.length) * 100);
    }

    isInvestigationComplete() {
        return this.evidenceFiles.size >= 4; // Need 4 out of 5 evidence files
    }

    getFoundEvidence() {
        return Array.from(this.evidenceFiles);
    }

    getFoundPatterns() {
        return Array.from(this.patterns);
    }

    getSummary() {
        return {
            evidenceFound: this.getFoundEvidence(),
            patternsFound: this.getFoundPatterns(),
            completionRate: this.getCompletionRate(),
            isComplete: this.isInvestigationComplete(),
            totalEvidence: this.requiredEvidence.length,
            foundCount: this.evidenceFiles.size
        };
    }

    reset() {
        this.evidenceFiles.clear();
        this.patterns.clear();
        this.updateUI();
        
        // Reset all UI elements
        this.requiredEvidence.forEach(file => {
            const elementId = `evidence-${file.replace('.', '-')}`;
            const element = document.getElementById(elementId);
            if (element) {
                const icon = element.querySelector('i');
                const text = element.querySelector('span');
                icon.className = 'bi bi-square w-4';
                text.className = '';
                element.className = 'flex items-center space-x-2 text-gray-600 dark:text-gray-400';
            }
        });
        
        ['pattern-ip', 'pattern-signature', 'pattern-timing'].forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                const icon = element.querySelector('i');
                const text = element.querySelector('span');
                icon.className = 'bi bi-square w-4';
                text.className = '';
                element.className = 'flex items-center space-x-2 text-gray-600 dark:text-gray-400';
            }
        });
    }

    // Static method to create floating tracker button
    static createTrackerButton() {
        const button = document.createElement('button');
        button.id = 'evidence-tracker-button';
        button.className = `
            fixed top-4 right-4 bg-blue-600 hover:bg-blue-700 text-white 
            p-3 rounded-full shadow-lg z-50 transition-all duration-200
        `;
        button.innerHTML = '<i class="bi bi-search text-lg"></i>';
        button.title = 'Evidence Tracker';
        
        button.addEventListener('click', () => {
            const tracker = document.getElementById('evidence-tracker');
            if (tracker) {
                tracker.style.display = tracker.style.display === 'none' ? 'block' : 'none';
            }
        });
        
        document.body.appendChild(button);
        return button;
    }
}

// Create global evidence tracker instance for Level 5
window.evidenceTracker = null;

// Initialize tracker when Level 5 starts
export function initializeEvidenceTracker() {
    if (!window.evidenceTracker) {
        window.evidenceTracker = new EvidenceTracker();
        EvidenceTracker.createTrackerButton();
        console.log('Evidence tracker initialized for Level 5');
        
        // Auto-start Level 5 tutorial if conditions are met
        setTimeout(() => {
            if (window.tutorialManager && typeof window.tutorialManager.shouldAutoStartLevel5Forensics === 'function') {
                if (window.tutorialManager.shouldAutoStartLevel5Forensics()) {
                    window.tutorialManager.startLevel5ForensicsTutorial();
                }
            }
        }, 2000); // Delay to ensure everything is loaded
    }
    return window.evidenceTracker;
}
