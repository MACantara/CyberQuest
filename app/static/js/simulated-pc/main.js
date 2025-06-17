import { BootSequence } from './boot-sequence.js';
import { Desktop } from './desktop.js';

export class SimulatedPC {
    constructor(level = null) {
        this.level = level;
        this.isActive = false;
        this.container = null;
        this.bootSequence = null;
        this.desktop = null;
    }

    async initialize() {
        // Create fullscreen overlay
        this.container = document.createElement('div');
        this.container.className = 'simulated-pc';
        document.body.appendChild(this.container);

        // Start boot sequence
        const bootContainer = document.createElement('div');
        bootContainer.className = 'boot-sequence';
        this.container.appendChild(bootContainer);

        this.bootSequence = new BootSequence(bootContainer);
        
        try {
            await this.bootSequence.start();
            await this.initializeDesktop();
            this.isActive = true;
        } catch (error) {
            console.error('Failed to initialize simulated PC:', error);
            this.destroy();
        }
    }

    async initializeDesktop() {
        // Clear boot sequence
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
        if (confirm('Exit simulation and return to levels?')) {
            this.destroy();
            // Redirect back to levels page
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
        // Show system notification
        const notification = document.createElement('div');
        notification.className = `pc-notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="bi bi-${type === 'error' ? 'exclamation-triangle' : 'info-circle'}"></i>
                <span>${message}</span>
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
