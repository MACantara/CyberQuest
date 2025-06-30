export class EventHandlers {
    constructor(pageInstance) {
        this.pageInstance = pageInstance;
    }

    bindAllEvents(contentElement) {
        this.bindVerificationToolEvents(contentElement);
        this.bindAnalysisEvents(contentElement);
    }

    bindVerificationToolEvents(contentElement) {
        // Handle cross-reference tool button
        const crossRefBtn = contentElement.querySelector('#try-cross-reference');
        if (crossRefBtn) {
            crossRefBtn.addEventListener('click', () => {
                const url = crossRefBtn.getAttribute('data-url');
                window.dispatchEvent(new CustomEvent('navigate-browser', { detail: { url } }));
                this.showVerificationResults(contentElement);
            });
        }

        // Handle image search tool button
        const imageSearchBtn = contentElement.querySelector('#try-image-search');
        if (imageSearchBtn) {
            imageSearchBtn.addEventListener('click', () => {
                const url = imageSearchBtn.getAttribute('data-url');
                window.dispatchEvent(new CustomEvent('navigate-browser', { detail: { url } }));
                this.showVerificationResults(contentElement);
            });
        }
    }

    bindAnalysisEvents(contentElement) {
        // Handle submit analysis button
        const submitBtn = contentElement.querySelector('#submitAnalysis');
        if (submitBtn) {
            submitBtn.addEventListener('click', () => {
                this.showAnalysisResults(contentElement);
            });
        }
    }

    showVerificationResults(contentElement) {
        // Show the results section after a short delay to simulate tool usage
        setTimeout(() => {
            const resultsSection = contentElement.querySelector('#verification-results');
            if (resultsSection) {
                resultsSection.classList.remove('hidden');
                resultsSection.scrollIntoView({ behavior: 'smooth' });
            }
        }, 1000);
    }

    showAnalysisResults(contentElement) {
        const credibleChoice = contentElement.querySelector('input[name="credible"]:checked');
        
        let message = '';
        let bgColor = '';
        let textColor = '';
        
        if (credibleChoice) {
            if (credibleChoice.id === 'credible-no') {
                message = '🎉 Excellent work! You correctly identified this as misinformation. The cross-reference tool shows no credible sources are reporting this story, and it has multiple red flags.';
                bgColor = 'bg-green-100';
                textColor = 'text-green-800';
            } else if (credibleChoice.id === 'credible-yes') {
                message = '⚠️ Not quite. This story is actually misinformation. Review the cross-reference results - no credible news sources are reporting this story, which is a major red flag.';
                bgColor = 'bg-orange-100';
                textColor = 'text-orange-800';
            } else {
                message = '🤔 Good to be cautious! The verification tools show clear evidence this is misinformation - check the cross-reference results showing zero credible sources.';
                bgColor = 'bg-blue-100';
                textColor = 'text-blue-800';
            }
        } else {
            message = 'Please select whether you think this story is credible based on your investigation.';
            bgColor = 'bg-gray-100';
            textColor = 'text-gray-800';
            return;
        }

        // Show results modal
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50';
        modal.innerHTML = `
            <div class="bg-white rounded-lg p-6 max-w-lg mx-4">
                <div class="text-center">
                    <div class="${bgColor} p-4 rounded-lg mb-4">
                        <p class="${textColor} font-medium">${message}</p>
                    </div>
                    <div class="text-sm text-gray-600 mb-4">
                        <p><strong>Key Learning Points:</strong></p>
                        <ul class="text-left mt-2 space-y-1">
                            <li>• Always cross-reference suspicious claims with credible sources</li>
                            <li>• Be wary of emotional language and urgent calls to action</li>
                            <li>• Check the website's credibility and security status</li>
                            <li>• Verify images and their original context</li>
                        </ul>
                    </div>
                    <button onclick="this.closest('.fixed').remove()" 
                            class="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors">
                        Continue Training
                    </button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }
}
