import { BaseTutorial } from './base-tutorial.js';
import { tutorialInteractionManager } from './tutorial-interaction-manager.js';

export class NetworkMonitorTutorial extends BaseTutorial {
    constructor(desktop) {
        super(desktop);
        this.steps = [
            {
                target: '#network-toolbar',
                title: 'Network Monitor Toolbar',
                content: 'This toolbar controls network packet capture. The "Live Capture" button starts monitoring network traffic in real-time.',
                action: 'highlight',
                position: 'bottom'
            },
            {
                target: '#live-capture-btn',
                title: 'Live Capture Control',
                content: 'Click "Live Capture" to start monitoring network traffic. This shows all data packets flowing through your network connection.',
                action: 'pulse',
                position: 'bottom'
            },
            {
                target: '#filters-btn',
                title: 'Packet Filtering',
                content: 'Use filters to focus on specific types of network traffic. This helps identify suspicious activity among normal network communications.',
                action: 'highlight',
                position: 'bottom'
            },
            {
                target: '#statistics-btn',
                title: 'Network Statistics',
                content: 'View network statistics to analyze traffic patterns and identify potential security threats or network anomalies.',
                action: 'highlight',
                position: 'bottom'
            },
            {
                target: '#clear-packets-btn',
                title: 'Clear Packet History',
                content: 'Use this button to clear the packet history when you need a fresh start for monitoring new network activity.',
                action: 'highlight',
                position: 'bottom'
            },
            {
                target: '#packet-headers',
                title: 'Packet Information Headers',
                content: 'These columns show packet details: Time (when sent), Source (sender IP), Destination (receiver IP), Protocol (communication type), and Info (packet contents).',
                action: 'highlight',
                position: 'bottom'
            },
            {
                target: '#packet-data',
                title: 'Packet Analysis Area',
                content: 'This area displays captured network packets. Look for suspicious destinations, unusual protocols, or unexpected file transfers that could indicate security threats.',
                action: 'highlight',
                position: 'right'
            },
            {
                target: '#packet-list',
                title: 'Network Security Complete!',
                content: 'Excellent! You\'ve learned to use network monitoring tools: packet capture controls, filtering options, statistics analysis, and how to identify suspicious network traffic patterns. Watch for red-highlighted suspicious traffic and unusual destinations!',
                action: 'highlight',
                position: 'left',
                final: true
            }
        ];
    }

    async start() {
        // Ensure network monitor is open
        if (!this.desktop.windowManager.windows.has('wireshark')) {
            try {
                await this.desktop.windowManager.openNetworkMonitor();
                // Wait for the window to fully render
                await new Promise(resolve => setTimeout(resolve, 1000));
            } catch (error) {
                console.error('Network Monitor application not found:', error);
                return;
            }
        }

        // Initialize CSS first
        this.initializeCSS();
        
        // Enable tutorial mode
        tutorialInteractionManager.enableTutorialMode();
        
        // Set tutorial state
        this.isActive = true;
        this.stepManager.reset();
        
        // Create overlay before showing any steps
        this.createOverlay();
        
        // Ensure network monitor window is in front
        this.ensureNetworkMonitorInFront();
        
        // Set global reference
        window.networkMonitorTutorial = this;
        window.currentTutorial = this;
        
        // Wait for network monitor to be fully loaded and then start showing steps
        setTimeout(() => {
            this.showStep();
        }, 1000);
    }

    ensureNetworkMonitorInFront() {
        const networkMonitorWindow = document.querySelector('.window[data-window-id="wireshark"]') || 
                                    document.querySelector('.window .wireshark') ||
                                    document.querySelector('[id*="wireshark"]')?.closest('.window');
        
        if (networkMonitorWindow) {
            networkMonitorWindow.style.zIndex = '51';
            networkMonitorWindow.style.position = 'relative';
        }
    }

    showStep() {
        if (this.currentStep >= this.steps.length) {
            this.complete();
            return;
        }

        const step = this.steps[this.currentStep];
        let target = document.querySelector(step.target);
        
        // Special handling for live capture step - ensure capture is ready
        if (step.target === '#live-capture-btn') {
            // Make sure the network monitor is ready for capture
            const captureBtn = document.querySelector('#live-capture-btn');
            if (captureBtn && captureBtn.textContent.includes('Stop')) {
                // If already capturing, that's fine - continue with tutorial
            }
            target = captureBtn;
        }

        // Special handling for packet data area - ensure it's visible
        if (step.target === '#packet-data') {
            const packetData = document.querySelector('#packet-data');
            if (packetData && packetData.querySelector('.text-center')) {
                // If showing initial message, that's expected - continue
            }
            target = packetData;
        }
        
        if (!target) {
            console.warn(`Tutorial target not found: ${step.target}`);
            this.nextStep();
            return;
        }

        // Clear previous highlights and interactions
        this.clearHighlights();
        this.clearStepInteractions();
        
        // Highlight target element
        this.highlightElement(target, step.action);
        
        // Setup interactions for this step
        this.setupStepInteraction(step, target);
        
        // Position and show tooltip
        this.showTooltip(target, step);
    }

    complete() {
        super.complete();
        
        // Store completion in localStorage
        localStorage.setItem('cyberquest_networkmonitor_tutorial_completed', 'true');
    }

    // Override base class methods for proper tutorial flow
    getSkipTutorialHandler() {
        return 'window.networkMonitorTutorial.showSkipModal()';
    }

    getPreviousStepHandler() {
        return 'window.networkMonitorTutorial.previousStep()';
    }

    getNextStepHandler() {
        return 'window.networkMonitorTutorial.nextStep()';
    }

    getFinalStepHandler() {
        return 'window.networkMonitorTutorial.complete()';
    }

    getFinalButtonText() {
        return 'Finish Tutorial';
    }

    // Static methods for auto-start functionality
    static shouldAutoStart() {
        const tutorialCompleted = localStorage.getItem('cyberquest_networkmonitor_tutorial_completed');
        const networkMonitorOpened = localStorage.getItem('cyberquest_networkmonitor_opened');
        
        return networkMonitorOpened && !tutorialCompleted;
    }

    static startTutorial(desktop) {
        console.log('Starting Network Monitor tutorial...');
        const tutorial = new NetworkMonitorTutorial(desktop);
        window.networkMonitorTutorial = tutorial;
        tutorial.start();
        return tutorial;
    }

    static restart() {
        localStorage.removeItem('cyberquest_networkmonitor_tutorial_completed');
        localStorage.removeItem('cyberquest_networkmonitor_opened');
    }
}