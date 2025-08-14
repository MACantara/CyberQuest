// Introduction Page JavaScript for Blue Team vs Red Team Mode
class IntroductionManager {
    constructor() {
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.startAnimations();
        
        console.log('🎮 Introduction Manager initialized');
    }
    
    setupEventListeners() {
        // Start simulation button
        const startButton = document.getElementById('start-simulation');
        if (startButton) {
            startButton.addEventListener('click', () => this.startSimulation());
        }
        
        // Tutorial button
        const tutorialButton = document.querySelector('a[href="/blue-vs-red/tutorial"]');
        if (tutorialButton) {
            tutorialButton.addEventListener('click', (e) => {
                // Let the default navigation happen, just add loading feedback
                tutorialButton.innerHTML = '<i class="bi bi-hourglass-split animate-spin mr-2"></i>Loading Tutorial...';
            });
        }
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => this.handleKeyNavigation(e));
    }
    
    startAnimations() {
        // Simple fade in for subtitle with safer selection
        setTimeout(() => {
            const subtitle = document.querySelector('section .text-xl');
            if (subtitle) {
                subtitle.style.opacity = '1';
                subtitle.style.transition = 'opacity 1s ease';
            }
        }, 1000);
        
        // Add hover effects to feature cards
        this.setupHoverEffects();
        
        // Ensure body doesn't have unnecessary overflow
        document.body.style.overflowX = 'hidden';
    }
    
    setupHoverEffects() {
        const featureCards = document.querySelectorAll('.bg-gray-800\\/50, .bg-blue-900\\/40, .bg-red-900\\/40');
        featureCards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.borderColor = 'rgba(59, 130, 246, 0.5)';
                card.style.transition = 'border-color 0.3s ease';
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.borderColor = '';
            });
        });
    }
    
    startSimulation() {
        // Show loading state
        const startButton = document.getElementById('start-simulation');
        const originalContent = startButton.innerHTML;
        
        startButton.innerHTML = '<i class="bi bi-hourglass-split animate-spin mr-2"></i>Loading Simulation...';
        startButton.disabled = true;
        
        // Redirect to dashboard
        setTimeout(() => {
            window.location.href = '/blue-vs-red/dashboard';
        }, 500); // Small delay for user feedback
    }
    
    handleKeyNavigation(e) {
        if (e.key === 'Enter') {
            this.startSimulation();
        }
    }
    
    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg transform transition-all duration-300 translate-x-full ${
            type === 'error' ? 'bg-red-600 text-white' : 
            type === 'success' ? 'bg-green-600 text-white' : 
            'bg-blue-600 text-white'
        }`;
        
        notification.innerHTML = `
            <div class="flex items-center space-x-2">
                <i class="bi bi-${type === 'error' ? 'exclamation-triangle' : type === 'success' ? 'check-circle' : 'info-circle'}"></i>
                <span>${message}</span>
                <button class="ml-2 hover:opacity-75" onclick="this.parentElement.parentElement.remove()">
                    <i class="bi bi-x-lg"></i>
                </button>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentElement) {
                notification.style.transform = 'translateX(100%)';
                setTimeout(() => {
                    if (notification.parentElement) {
                        notification.remove();
                    }
                }, 300);
            }
        }, 5000);
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new IntroductionManager();
});

// Export for potential external use
window.IntroductionManager = IntroductionManager;
