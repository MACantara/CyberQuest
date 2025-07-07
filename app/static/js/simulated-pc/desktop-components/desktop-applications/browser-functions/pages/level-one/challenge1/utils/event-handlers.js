export class EventHandlers {
    constructor(pageInstance) {
        this.pageInstance = pageInstance;
    }

    bindAllEvents(contentElement) {
        this.bindVerificationTools(contentElement);
        this.bindSubmitButton(contentElement);
    }

    bindVerificationTools(contentElement) {
        // Handle cross-reference tool
        const crossRefBtn = contentElement.querySelector('#cross-reference-tool');
        if (crossRefBtn) {
            crossRefBtn.addEventListener('click', () => {
                const url = crossRefBtn.getAttribute('data-url');
                if (url) {
                    window.dispatchEvent(new CustomEvent('navigate-browser', { detail: { url } }));
                }
            });
        }
    }

    bindSubmitButton(contentElement) {
        const submitBtn = contentElement.querySelector('#submit-analysis');
        if (submitBtn) {
            submitBtn.addEventListener('click', () => {
                this.handleSubmitAnalysis(contentElement);
            });
        }
    }

    handleSubmitAnalysis(contentElement) {
        // Mark challenge 1 as completed
        localStorage.setItem('cyberquest_challenge1_completed', 'true');
        
        // Show completion message
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-black/75 flex items-center justify-center z-50';
        modal.innerHTML = `
            <div class="bg-white rounded-lg p-6 max-w-md mx-4">
                <div class="text-center">
                    <i class="bi bi-check-circle text-6xl text-green-500 mb-4"></i>
                    <h2 class="text-xl font-bold text-green-600 mb-4">✅ Challenge 1 Complete!</h2>
                    <p class="text-gray-700 mb-4">
                        Great work! You've successfully identified this as misinformation. 
                        You've completed Level 1: The Misinformation Maze!
                    </p>
                    <button onclick="this.closest('.fixed').remove(); window.challenge1EventHandlers?.completeLevelOne?.()" 
                            class="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition-colors">
                        Complete Level
                    </button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);

        // Store reference for cleanup
        window.challenge1EventHandlers = this;
    }

    completeLevelOne() {
        // Mark Level 1 as completed
        localStorage.setItem('cyberquest_level_1_completed', 'true');
        
        // Navigate back to main dashboard
        if (window.desktop?.windowManager) {
            try {
                const browserApp = window.desktop.windowManager.applications.get('browser');
                if (browserApp) {
                    browserApp.navigation.navigateToUrl('https://cyberquest.com');
                }
            } catch (error) {
                console.error('Failed to navigate to dashboard:', error);
            }
        }
    }
}