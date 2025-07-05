// TODO: Fix tutorial flow for the 2nd and 3rd to the last steps when selecting a process and ending it respectively

import { BaseTutorial } from './base-tutorial.js';
import { tutorialInteractionManager } from './tutorial-interaction-manager.js';

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
                target: '#refresh-btn',
                title: 'Interactive: Refresh Process Data',
                content: 'Click the Refresh button to update the process list and see current system activity.',
                position: 'bottom',
                action: 'pulse',
                interactive: true,
                interaction: {
                    type: 'click',
                    instructions: 'Click the Refresh button',
                    successMessage: 'Great! You refreshed the process data.',
                    autoAdvance: true,
                    advanceDelay: 1000
                }
            },
            {
                target: '#system-stats-panel',
                title: 'System Statistics',
                content: 'Monitor system resource usage including CPU, memory, active processes, and total threads. Watch for unusual spikes that might indicate malware.',
                position: 'bottom',
                action: 'pulse'
            },
            {
                target: '#sort-cpu',
                title: 'Interactive: Sort by CPU Usage',
                content: 'Click the CPU % column header to sort processes by CPU usage. This helps identify resource-heavy processes.',
                position: 'bottom',
                action: 'pulse',
                interactive: true,
                interaction: {
                    type: 'click',
                    instructions: 'Click the CPU % header to sort',
                    successMessage: 'Excellent! Processes are now sorted by CPU usage.',
                    autoAdvance: true,
                    advanceDelay: 1500
                }
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
                title: 'Interactive: Select a Process',
                content: 'Click on any process row to view detailed information. Try selecting the first process in the list.',
                position: 'right',
                action: 'pulse',
                interactive: true,
                interaction: {
                    type: 'click',
                    instructions: 'Click on any process row',
                    successMessage: 'Perfect! You selected a process and can now see its details.',
                    autoAdvance: true,
                    advanceDelay: 2000
                }
            },
            {
                target: '#kill-process-btn',
                title: 'Interactive: End a Process',
                content: 'After selecting a process, click this button to terminate it. This is useful for stopping suspicious or resource-heavy processes.',
                position: 'left',
                action: 'pulse',
                interactive: true,
                interaction: {
                    type: 'click',
                    instructions: 'Click the End Process button',
                    successMessage: 'Good! You learned how to terminate processes.',
                    autoAdvance: true,
                    advanceDelay: 1500
                }
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
            try {
                await this.desktop.windowManager.openProcessMonitor();
                // Wait a bit for the window to fully render
                await new Promise(resolve => setTimeout(resolve, 1000));
            } catch (error) {
                console.error('Process Monitor application not found:', error);
                return;
            }
        }

        // Enable tutorial mode to prevent data refreshing
        this.enableProcessMonitorTutorialMode();

        // Initialize CSS first
        this.initializeCSS();
        
        // Enable tutorial mode
        tutorialInteractionManager.enableTutorialMode();
        
        // Set tutorial state
        this.isActive = true;
        this.stepManager.reset();
        
        // Create overlay before showing any steps
        this.createOverlay();
        
        // Ensure process monitor window is in front
        this.ensureProcessMonitorInFront();
        
        // Set global reference
        window.currentTutorial = this;
        
        // Start showing steps
        this.showStep();
    }

    ensureProcessMonitorInFront() {
        const processMonitorWindow = document.querySelector('.window[data-window-id="process-monitor"]') || 
                                   document.querySelector('.window .process-monitor') ||
                                   document.querySelector('[id*="process-monitor"]')?.closest('.window');
        
        if (processMonitorWindow) {
            processMonitorWindow.style.zIndex = '51';
            processMonitorWindow.style.position = 'relative';
        }
    }

    enableProcessMonitorTutorialMode() {
        // Find the process monitor instance and enable tutorial mode
        const processMonitorWindow = this.desktop.windowManager.windows.get('process-monitor');
        if (processMonitorWindow && processMonitorWindow.processMonitor) {
            const processDataManager = processMonitorWindow.processMonitor.processDataManager;
            if (processDataManager && typeof processDataManager.setTutorialMode === 'function') {
                processDataManager.setTutorialMode(true);
                console.log('Process Monitor tutorial mode enabled');
            }
            
            // Store reference to the app for re-highlighting after updates
            this.processMonitorApp = processMonitorWindow.processMonitor;
            
            // Override the updateContent method to preserve highlighting
            this.overrideUpdateContent();
        }
    }

    disableProcessMonitorTutorialMode() {
        // Find the process monitor instance and disable tutorial mode
        const processMonitorWindow = this.desktop.windowManager.windows.get('process-monitor');
        if (processMonitorWindow && processMonitorWindow.processMonitor) {
            const processDataManager = processMonitorWindow.processMonitor.processDataManager;
            if (processDataManager && typeof processDataManager.setTutorialMode === 'function') {
                processDataManager.setTutorialMode(false);
                console.log('Process Monitor tutorial mode disabled');
            }
            
            // Restore original updateContent method
            this.restoreUpdateContent();
        }
    }

    overrideUpdateContent() {
        if (!this.processMonitorApp || !this.processMonitorApp.updateContent) return;
        
        // Store the original updateContent method
        this.originalUpdateContent = this.processMonitorApp.updateContent.bind(this.processMonitorApp);
        
        // Override with tutorial-aware version
        this.processMonitorApp.updateContent = () => {
            // Save current tutorial state
            const currentStep = this.currentStep;
            const highlightedElement = document.querySelector('.tutorial-highlight');
            const stepTarget = this.steps[currentStep]?.target;
            
            // Call original update
            this.originalUpdateContent();
            
            // Restore tutorial highlighting after DOM update
            setTimeout(() => {
                if (this.isActive && stepTarget) {
                    const newTarget = document.querySelector(stepTarget);
                    if (newTarget) {
                        this.clearHighlights();
                        this.highlightElement(newTarget, this.steps[currentStep].action);
                        
                        // Re-setup step interactions if needed
                        if (this.steps[currentStep].interactive) {
                            this.setupInteractiveStep(this.steps[currentStep], newTarget);
                        }
                    }
                }
            }, 50);
        };
    }

    restoreUpdateContent() {
        if (this.processMonitorApp && this.originalUpdateContent) {
            this.processMonitorApp.updateContent = this.originalUpdateContent;
        }
    }

    complete() {
        // Disable tutorial mode before completing
        this.disableProcessMonitorTutorialMode();
        
        super.complete();
        
        // Mark tutorial as completed
        localStorage.setItem('cyberquest_processmonitor_tutorial_completed', 'true');
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
        const processMonitorOpened = localStorage.getItem('cyberquest_processmonitor_opened');
        
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
        localStorage.removeItem('cyberquest_processmonitor_opened');
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

        // Clear previous highlights and interactions
        this.clearHighlights();
        this.clearStepInteractions();
        
        // For interactive steps, set up additional interaction allowances
        if (step.interactive) {
            this.setupInteractiveStep(step, target);
        }
        
        // Highlight target element
        this.highlightElement(target, step.action);
        
        // Setup interactions for this step
        this.setupStepInteraction(step, target);
        
        // Position and show tooltip
        this.showTooltip(target, step);
    }

    setupInteractiveStep(step, target) {
        // Special handling for different interactive steps
        if (step.target === '#refresh-btn') {
            // Allow interactions with the refresh button and any loading indicators
            const refreshBtn = document.querySelector('#refresh-btn');
            if (refreshBtn) {
                tutorialInteractionManager.allowInteractionFor(refreshBtn);
                // Also allow parent container interactions
                const parentContainer = refreshBtn.closest('.process-monitor-controls, #process-monitor-controls');
                if (parentContainer) {
                    tutorialInteractionManager.allowInteractionFor(parentContainer);
                }
            }
        }
        
        if (step.target === '#sort-cpu') {
            // Allow interactions with all table headers for sorting
            const headers = document.querySelectorAll('#process-table-header th, .process-table-header th');
            headers.forEach(header => {
                tutorialInteractionManager.allowInteractionFor(header);
            });
            
            // Also allow the table header container
            const headerContainer = document.querySelector('#process-table-header, .process-table-header');
            if (headerContainer) {
                tutorialInteractionManager.allowInteractionFor(headerContainer);
            }
        }
        
        if (step.target.includes('.process-row')) {
            // Allow interactions with all process rows
            const processTable = document.querySelector('#process-table-body, .process-table-body');
            if (processTable) {
                tutorialInteractionManager.allowInteractionFor(processTable);
                processTable.querySelectorAll('.process-row, tr').forEach(row => {
                    tutorialInteractionManager.allowInteractionFor(row);
                });
            }
        }

        if (step.target === '#kill-process-btn') {
            // Allow interactions with the kill process button
            const killBtn = document.querySelector('#kill-process-btn');
            if (killBtn) {
                tutorialInteractionManager.allowInteractionFor(killBtn);
            }
        }
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
        const processMonitorOpened = localStorage.getItem('cyberquest_processmonitor_opened');
        
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
        localStorage.removeItem('cyberquest_processmonitor_opened');
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

        // Clear previous highlights and interactions
        this.clearHighlights();
        this.clearStepInteractions();
        
        // For interactive steps, set up additional interaction allowances
        if (step.interactive) {
            this.setupInteractiveStep(step, target);
        }
        
        // Highlight target element
        this.highlightElement(target, step.action);
        
        // Setup interactions for this step
        this.setupStepInteraction(step, target);
        
        // Position and show tooltip
        this.showTooltip(target, step);
    }

    setupInteractiveStep(step, target) {
        // Special handling for different interactive steps
        if (step.target === '#refresh-btn') {
            // Allow interactions with the refresh button and any loading indicators
            const refreshBtn = document.querySelector('#refresh-btn');
            if (refreshBtn) {
                tutorialInteractionManager.allowInteractionFor(refreshBtn);
                // Also allow parent container interactions
                const parentContainer = refreshBtn.closest('.process-monitor-controls, #process-monitor-controls');
                if (parentContainer) {
                    tutorialInteractionManager.allowInteractionFor(parentContainer);
                }
            }
        }
        
        if (step.target === '#sort-cpu') {
            // Allow interactions with all table headers for sorting
            const headers = document.querySelectorAll('#process-table-header th, .process-table-header th');
            headers.forEach(header => {
                tutorialInteractionManager.allowInteractionFor(header);
            });
            
            // Also allow the table header container
            const headerContainer = document.querySelector('#process-table-header, .process-table-header');
            if (headerContainer) {
                tutorialInteractionManager.allowInteractionFor(headerContainer);
            }
        }
        
        if (step.target.includes('.process-row')) {
            // Allow interactions with all process rows
            const processTable = document.querySelector('#process-table-body, .process-table-body');
            if (processTable) {
                tutorialInteractionManager.allowInteractionFor(processTable);
                processTable.querySelectorAll('.process-row, tr').forEach(row => {
                    tutorialInteractionManager.allowInteractionFor(row);
                });
            }
        }

        if (step.target === '#kill-process-btn') {
            // Allow interactions with the kill process button
            const killBtn = document.querySelector('#kill-process-btn');
            if (killBtn) {
                tutorialInteractionManager.allowInteractionFor(killBtn);
            }
        }
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
        const processMonitorOpened = localStorage.getItem('cyberquest_processmonitor_opened');
        
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
        localStorage.removeItem('cyberquest_processmonitor_opened');
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

        // Clear previous highlights and interactions
        this.clearHighlights();
        this.clearStepInteractions();
        
        // For interactive steps, set up additional interaction allowances
        if (step.interactive) {
            this.setupInteractiveStep(step, target);
        }
        
        // Highlight target element
        this.highlightElement(target, step.action);
        
        // Setup interactions for this step
        this.setupStepInteraction(step, target);
        
        // Position and show tooltip
        this.showTooltip(target, step);
    }

    setupInteractiveStep(step, target) {
        // Special handling for different interactive steps
        if (step.target === '#refresh-btn') {
            // Allow interactions with the refresh button and any loading indicators
            const refreshBtn = document.querySelector('#refresh-btn');
            if (refreshBtn) {
                tutorialInteractionManager.allowInteractionFor(refreshBtn);
                // Also allow parent container interactions
                const parentContainer = refreshBtn.closest('.process-monitor-controls, #process-monitor-controls');
                if (parentContainer) {
                    tutorialInteractionManager.allowInteractionFor(parentContainer);
                }
            }
        }
        
        if (step.target === '#sort-cpu') {
            // Allow interactions with all table headers for sorting
            const headers = document.querySelectorAll('#process-table-header th, .process-table-header th');
            headers.forEach(header => {
                tutorialInteractionManager.allowInteractionFor(header);
            });
            
            // Also allow the table header container
            const headerContainer = document.querySelector('#process-table-header, .process-table-header');
            if (headerContainer) {
                tutorialInteractionManager.allowInteractionFor(headerContainer);
            }
        }
        
        if (step.target.includes('.process-row')) {
            // Allow interactions with all process rows
            const processTable = document.querySelector('#process-table-body, .process-table-body');
            if (processTable) {
                tutorialInteractionManager.allowInteractionFor(processTable);
                processTable.querySelectorAll('.process-row, tr').forEach(row => {
                    tutorialInteractionManager.allowInteractionFor(row);
                });
            }
        }

        if (step.target === '#kill-process-btn') {
            // Allow interactions with the kill process button
            const killBtn = document.querySelector('#kill-process-btn');
            if (killBtn) {
                tutorialInteractionManager.allowInteractionFor(killBtn);
            }
        }
    }

    // Override setupStepInteraction to handle process monitor specific interactions
    setupStepInteraction(step, target) {
        const result = super.setupStepInteraction(step, target);
        
        // Additional setup for process monitor interactive steps
        if (step.interactive) {
            switch (step.target) {
                case '#refresh-btn':
                    this.setupRefreshInteraction(step, target);
                    break;
                case '#sort-cpu':
                    this.setupSortInteraction(step, target);
                    break;
                case '#process-table-body .process-row:first-child':
                    this.setupProcessRowInteraction(step, target);
                    break;
                case '#kill-process-btn':
                    this.setupKillProcessInteraction(step, target);
                    break;
            }
        }
        
        return result;
    }

    setupRefreshInteraction(step, target) {
        const interaction = step.interaction;
        
        const clickHandler = (e) => {
            e.stopPropagation();
            e.preventDefault(); // Prevent the actual refresh
            
            // Simulate the visual feedback of clicking the button without refreshing data
            target.classList.add('active');
            setTimeout(() => {
                target.classList.remove('active');
            }, 150);
            
            // Show a brief "refreshing" indicator without actually refreshing
            const originalText = target.textContent;
            target.textContent = 'Refreshing...';
            target.disabled = true;
            
            setTimeout(() => {
                target.textContent = originalText;
                target.disabled = false;
                
                this.showInteractionSuccess(step, interaction);
                
                if (interaction.autoAdvance) {
                    setTimeout(() => {
                        this.nextStep();
                    }, interaction.advanceDelay || 1000);
                }
            }, 500);
        };
        
        target.addEventListener('click', clickHandler, { once: true });
        this.interactionListeners.push({ element: target, event: 'click', handler: clickHandler });
    }

    setupSortInteraction(step, target) {
        const interaction = step.interaction;
        
        const clickHandler = (e) => {
            e.stopPropagation();
            
            // Trigger the actual sort functionality
            if (target.onclick) {
                target.onclick(e);
            } else {
                target.click();
            }
            
            this.showInteractionSuccess(step, interaction);
            
            if (interaction.autoAdvance) {
                setTimeout(() => {
                    this.nextStep();
                }, interaction.advanceDelay || 1500);
            }
        };
        
        target.addEventListener('click', clickHandler, { once: true });
        this.interactionListeners.push({ element: target, event: 'click', handler: clickHandler });
    }

    setupProcessRowInteraction(step, target) {
        const interaction = step.interaction;
        
        const clickHandler = (e) => {
            e.stopPropagation();
            
            // Add selected class to show the process is selected
            document.querySelectorAll('.process-row.selected').forEach(row => {
                row.classList.remove('selected');
            });
            target.classList.add('selected');
            
            this.showInteractionSuccess(step, interaction);
            
            if (interaction.autoAdvance) {
                setTimeout(() => {
                    this.nextStep();
                }, interaction.advanceDelay || 2000);
            }
        };
        
        // Allow clicking on any process row, not just the first one
        const processRows = document.querySelectorAll('.process-row');
        processRows.forEach(row => {
            row.addEventListener('click', clickHandler, { once: true });
            this.interactionListeners.push({ element: row, event: 'click', handler: clickHandler });
        });
    }

    setupKillProcessInteraction(step, target) {
        const interaction = step.interaction;
        
        const clickHandler = (e) => {
            e.stopPropagation();
            
            // Check if a process is selected
            const selectedProcess = document.querySelector('.process-row.selected');
            if (!selectedProcess) {
                // Show message to select a process first
                this.showInteractionMessage('Please select a process first by clicking on any process row.');
                return;
            }
            
            // Simulate ending the process
            target.classList.add('active');
            setTimeout(() => {
                target.classList.remove('active');
            }, 150);
            
            this.showInteractionSuccess(step, interaction);
            
            if (interaction.autoAdvance) {
                setTimeout(() => {
                    this.nextStep();
                }, interaction.advanceDelay || 1500);
            }
        };
        
        target.addEventListener('click', clickHandler, { once: true });
        this.interactionListeners.push({ element: target, event: 'click', handler: clickHandler });
    }
}
