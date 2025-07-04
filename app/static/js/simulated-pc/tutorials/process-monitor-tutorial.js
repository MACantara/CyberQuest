import { BaseTutorial } from '../base-tutorial.js';

export class ProcessMonitorTutorial extends BaseTutorial {
    constructor(desktop) {
        super(desktop);
        this.steps = [
            {
                target: '#process-monitor-header',
                title: 'Process Monitor Header',
                content: 'This is the Process Monitor application header. It shows the application name and real-time status indicator.',
                position: 'bottom',
                action: 'highlight'
            },
            {
                target: '#process-monitor-controls',
                title: 'Control Panel',
                content: 'The control panel lets you refresh process data, pause real-time updates, and end suspicious processes.',
                position: 'bottom',
                action: 'highlight'
            },
            {
                target: '#system-stats-panel',
                title: 'System Statistics',
                content: 'Monitor system resource usage including CPU, memory, active processes, and total threads. Watch for unusual spikes that might indicate malware.',
                position: 'bottom',
                action: 'pulse'
            },
            {
                target: '#process-table-header',
                title: 'Process Table Headers',
                content: 'Click column headers to sort processes by name, CPU usage, memory consumption, or other attributes. This helps identify resource-heavy or suspicious processes.',
                position: 'bottom',
                action: 'highlight'
            },
            {
                target: '#process-table-body .process-row:first-child',
                title: 'Process List',
                content: 'Click on any process to view detailed information. Look for suspicious processes marked with warning icons.',
                position: 'right',
                action: 'pulse'
            },
            {
                target: '#kill-process-btn',
                title: 'Process Control',
                content: 'Select a process and use this button to terminate it if it appears suspicious or consumes too many resources.',
                position: 'left',
                action: 'pulse'
            },
            {
                target: '.suspicious-process',
                title: 'Security Alerts',
                content: 'Processes with red borders are flagged as potentially suspicious. These should be investigated carefully as they may be malware.',
                position: 'right',
                action: 'pulse',
                final: true
            }
        ];
    }

    async start() {
        // Ensure process monitor is open
        if (!this.desktop.windowManager.windows.has('process-monitor')) {
            // Open process monitor first
            const processMonitorApp = this.desktop.windowManager.applications.get('process-monitor');
            if (processMonitorApp) {
                await this.desktop.windowManager.openWindow('process-monitor', 'Process Monitor');
                
                // Wait a bit for the window to fully render
                await new Promise(resolve => setTimeout(resolve, 1000));
            } else {
                console.error('Process Monitor application not found');
                return;
            }
        }

        // Start the tutorial
        this.createOverlay();
        this.isActive = true;
        window.currentTutorial = this;
        this.showStep();
    }

    complete() {
        super.complete();
        
        // Mark tutorial as completed
        localStorage.setItem('cyberquest_processmonitor_tutorial_completed', 'true');
        
        // Show completion message
        this.showCompletionMessage();
    }

    showCompletionMessage() {
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-black/75 flex items-center justify-center z-50';
        modal.innerHTML = `
            <div class="bg-gray-800 border border-green-500 rounded-lg p-6 max-w-md mx-4">
                <div class="text-center">
                    <i class="bi bi-cpu text-4xl text-green-400 mb-4"></i>
                    <h2 class="text-xl font-bold text-green-400 mb-4">Tutorial Complete!</h2>
                    <p class="text-gray-300 mb-4">
                        You've learned how to use the Process Monitor to identify and manage system processes. 
                        This is essential for detecting malware and managing system performance.
                    </p>
                    <div class="bg-green-900 border border-green-700 rounded p-3 mb-4">
                        <h4 class="text-green-400 font-semibold mb-2">Key Skills Learned:</h4>
                        <ul class="text-green-300 text-sm text-left list-disc pl-4">
                            <li>Monitoring system processes and resource usage</li>
                            <li>Identifying suspicious or malicious processes</li>
                            <li>Terminating problematic processes</li>
                            <li>Understanding process priorities and status</li>
                        </ul>
                    </div>
                    <button onclick="this.closest('.fixed').remove()" 
                            class="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition-colors cursor-pointer">
                        Continue Training
                    </button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }

    // Override base class methods
    getSkipTutorialHandler() {
        return 'window.processMonitorTutorial.showSkipModal()';
    }

    getPreviousStepHandler() {
        return 'window.processMonitorTutorial.previousStep()';
    }

    getNextStepHandler() {
        return 'window.processMonitorTutorial.nextStep()';
    }

    getFinalStepHandler() {
        return 'window.processMonitorTutorial.complete()';
    }

    getFinalButtonText() {
        return 'Finish Tutorial';
    }

    // Static methods for auto-start functionality
    static shouldAutoStart() {
        const tutorialCompleted = localStorage.getItem('cyberquest_processmonitor_tutorial_completed');
        const processMonitorOpened = localStorage.getItem('cyberquest_process_monitor_opened');
        
        // Debug logging
        console.log('ProcessMonitor Tutorial - shouldAutoStart check:', {
            tutorialCompleted,
            processMonitorOpened,
            shouldStart: processMonitorOpened && !tutorialCompleted
        });
        
        return processMonitorOpened && !tutorialCompleted;
    }

    static startTutorial(desktop) {
        console.log('Starting Process Monitor tutorial...');
        const tutorial = new ProcessMonitorTutorial(desktop);
        window.processMonitorTutorial = tutorial;
        tutorial.start();
        return tutorial;
    }

    static restart() {
        localStorage.removeItem('cyberquest_processmonitor_tutorial_completed');
        localStorage.removeItem('cyberquest_process_monitor_opened');
    }

    showStep() {
        if (this.currentStep >= this.steps.length) {
            this.complete();
            return;
        }

        const step = this.steps[this.currentStep];
        let target = document.querySelector(step.target);
        
        // Special handling for suspicious process - find first suspicious process if it exists
        if (step.target === '.suspicious-process') {
            target = document.querySelector('.suspicious-process');
            if (!target) {
                // If no suspicious process is visible, target the first process row instead
                target = document.querySelector('#process-table-body .process-row:first-child');
                step.content = 'Process rows show system information. Suspicious processes (when present) are highlighted with red borders and warning icons.';
            }
        }
        
        // Special handling for first process row - ensure it exists
        if (step.target === '#process-table-body .process-row:first-child') {
            target = document.querySelector('#process-table-body .process-row');
            if (!target) {
                // If no processes are visible, skip this step
                this.nextStep();
                return;
            }
        }
        
        if (!target) {
            console.warn(`Tutorial target not found: ${step.target}`);
            this.nextStep();
            return;
        }

        // Clear previous highlights
        this.clearHighlights();
        
        // Highlight target element
        this.highlightElement(target, step.action);
        
        // Position and show tooltip
        this.showTooltip(target, step);
    }
}
