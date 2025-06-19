import { BootSequence } from './boot-sequence.js';
import { LoadingScreen } from './loading-screen.js';
import { ShutdownSequence } from './shutdown-sequence.js';
import { Desktop } from './desktop.js';

export class SimulatedPC {
    constructor(level = null) {
        this.level = level;
        this.isActive = false;
        this.container = null;
        this.bootSequence = null;
        this.loadingScreen = null;
        this.desktop = null;
    }

    async initialize() {
        // Create fullscreen overlay
        this.container = document.createElement('div');
        this.container.className = 'fixed inset-0 w-full h-full overflow-hidden z-50 bg-black';
        document.body.appendChild(this.container);

        try {
            // Step 1: Boot sequence
            const bootContainer = document.createElement('div');
            bootContainer.className = 'w-full h-full';
            this.container.appendChild(bootContainer);

            this.bootSequence = new BootSequence(bootContainer);
            await this.bootSequence.start();

            // Step 2: Loading screen
            this.container.innerHTML = '';
            const loadingContainer = document.createElement('div');
            loadingContainer.className = 'w-full h-full';
            this.container.appendChild(loadingContainer);

            this.loadingScreen = new LoadingScreen(loadingContainer);
            await this.loadingScreen.show();

            // Step 3: Initialize desktop directly
            await this.initializeDesktop();
            this.isActive = true;
        } catch (error) {
            console.error('Failed to initialize simulated PC:', error);
            this.destroy();
        }
    }

    async initializeDesktop() {
        // Clear loading screen
        this.container.innerHTML = '';
        
        // Initialize desktop
        this.desktop = new Desktop(this.container);

        // Listen for exit events
        window.addEventListener('exitSimulation', () => {
            this.exit();
        });

        // Prevent escape key and other shortcuts
        document.addEventListener('keydown', this.handleKeyDown.bind(this));
    }

    handleKeyDown(event) {
        // Prevent common shortcuts that might break the simulation
        if (event.key === 'Escape' || 
            (event.ctrlKey && event.key === 'w') ||
            (event.ctrlKey && event.key === 't') ||
            (event.altKey && event.key === 'Tab')) {
            
            if (event.key === 'Escape') {
                // Allow escape to show exit confirmation
                this.desktop.exitSimulation();
            } else {
                event.preventDefault();
            }
        }
    }

    exit() {
        if (confirm('Are you sure you want to exit the simulation?')) {
            this.runShutdownSequence();
        }
    }

    async runShutdownSequence() {
        try {
            // Clear current content and show shutdown sequence
            this.container.innerHTML = '';
            
            const shutdownContainer = document.createElement('div');
            shutdownContainer.className = 'w-full h-full';
            this.container.appendChild(shutdownContainer);

            // Run shutdown sequence
            await ShutdownSequence.runShutdown(shutdownContainer);
            
            // After shutdown completes, redirect
            this.destroy();
            window.location.href = '/levels';
        } catch (error) {
            console.error('Error during shutdown sequence:', error);
            // Fallback to immediate exit
            this.destroy();
            window.location.href = '/levels';
        }
    }

    destroy() {
        if (this.container && this.container.parentNode) {
            this.container.parentNode.removeChild(this.container);
        }
        
        // Remove event listeners
        document.removeEventListener('keydown', this.handleKeyDown);
        window.removeEventListener('exitSimulation', this.exit);
        
        this.isActive = false;
    }

    // Scenario-specific methods
    loadScenario(scenarioData) {
        if (this.desktop) {
            // Customize desktop based on scenario
            // This can be extended for different levels
            console.log('Loading scenario:', scenarioData);
        }
    }

    updateProgress(progress) {
        // Update mission progress
        console.log('Progress updated:', progress);
    }

    showNotification(message, type = 'info') {
        // Show system notification with Tailwind classes
        const notification = document.createElement('div');
        
        let typeClasses = '';
        let iconClass = '';
        
        switch(type) {
            case 'error':
                typeClasses = 'bg-red-900 border-red-600 text-red-200';
                iconClass = 'bi-exclamation-triangle';
                break;
            case 'warning':
                typeClasses = 'bg-yellow-900 border-yellow-600 text-yellow-200';
                iconClass = 'bi-exclamation-circle';
                break;
            case 'success':
                typeClasses = 'bg-green-900 border-green-600 text-green-200';
                iconClass = 'bi-check-circle';
                break;
            default:
                typeClasses = 'bg-blue-900 border-blue-600 text-blue-200';
                iconClass = 'bi-info-circle';
        }
        
        notification.className = `fixed top-5 right-5 ${typeClasses} border rounded-lg p-3 shadow-lg animate-slide-in-right z-50`;
        notification.innerHTML = `
            <div class="flex items-center space-x-2">
                <i class="bi ${iconClass}"></i>
                <span class="font-medium">${message}</span>
            </div>
        `;
        
        this.container.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 5000);
    }
}

// Global instance
window.simulatedPC = null;

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Check if we should start simulation based on URL params
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('start_simulation') === 'true') {
        startSimulation();
    }
});

// Export function to start simulation
window.startSimulation = async function(level = null) {
    if (window.simulatedPC && window.simulatedPC.isActive) {
        console.warn('Simulation already running');
        return;
    }

    try {
        window.simulatedPC = new SimulatedPC(level);
        await window.simulatedPC.initialize();
    } catch (error) {
        console.error('Failed to start simulation:', error);
        alert('Failed to start simulation. Please try again.');
    }
};

// Export function to stop simulation
window.stopSimulation = function() {
    if (window.simulatedPC) {
        window.simulatedPC.destroy();
        window.simulatedPC = null;
    }
};
