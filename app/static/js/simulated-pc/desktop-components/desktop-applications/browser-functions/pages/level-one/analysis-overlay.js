export class AnalysisOverlay {
    constructor(browserApp, pageRegistry) {
        this.browserApp = browserApp;
        this.pageRegistry = pageRegistry;
        this.currentOverlay = null;
        this.isCollapsed = false;
        this.currentPageConfig = null;
    }

    addToContent(contentElement, pageConfig) {
        // Remove existing overlay if present
        this.removeExistingOverlay();
        
        // Store current page config
        this.currentPageConfig = pageConfig;
        
        const overlay = document.createElement('div');
        overlay.className = 'cyberquest-training-overlay';
        overlay.innerHTML = this.createOverlayHTML();
        
        // Position overlay relative to content
        contentElement.style.position = 'relative';
        contentElement.appendChild(overlay);
        
        // Store reference to current overlay
        this.currentOverlay = overlay;
        
        // Add styles for the overlay
        this.addOverlayStyles();
        
        // Bind overlay events
        this.bindOverlayEvents(overlay, pageConfig);
        
        // Apply collapsed state if it was previously collapsed
        if (this.isCollapsed) {
            this.toggleCollapsed();
        }
        
        // Add smooth entrance animation
        setTimeout(() => {
            overlay.style.transform = 'translateX(0)';
            overlay.style.opacity = '1';
        }, 100);
    }

    removeExistingOverlay() {
        if (this.currentOverlay) {
            this.currentOverlay.remove();
            this.currentOverlay = null;
        }
    }

    updateForNewArticle(pageConfig) {
        if (this.currentOverlay) {
            // Update the page config
            this.currentPageConfig = pageConfig;
            
            // Update the overlay content to reflect the new article
            this.updateOverlayContent();
            
            // Re-bind events with new page config
            this.bindOverlayEvents(this.currentOverlay, pageConfig);
            
            // Show a subtle indication that the overlay has been updated
            this.showUpdateAnimation();
        }
    }

    updateOverlayContent() {
        if (!this.currentOverlay) return;
        
        // Update the article-specific content in the overlay
        const analysisNotes = this.currentOverlay.querySelector('#analysis-notes');
        if (analysisNotes) {
            analysisNotes.placeholder = `Analyze this article for credibility and authenticity...`;
        }
        
        // Reset form state for new article
        this.resetAnalysisForm();
    }

    resetAnalysisForm() {
        if (!this.currentOverlay) return;
        
        const form = this.currentOverlay.querySelector('.analysis-form');
        if (form) {
            // Clear textarea
            const textarea = form.querySelector('#analysis-notes');
            if (textarea) textarea.value = '';
            
            // Clear radio buttons
            const radios = form.querySelectorAll('input[name="credibility"]');
            radios.forEach(radio => radio.checked = false);
        }
    }

    showUpdateAnimation() {
        if (!this.currentOverlay) return;
        
        const panel = this.currentOverlay.querySelector('.training-tools-panel');
        if (panel) {
            panel.style.transform = 'scale(1.02)';
            panel.style.boxShadow = '0 25px 50px rgba(0, 0, 0, 0.4)';
            
            setTimeout(() => {
                panel.style.transform = 'scale(1)';
                panel.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.3)';
            }, 200);
        }
    }

    toggleCollapsed() {
        if (!this.currentOverlay) return;
        
        const panel = this.currentOverlay.querySelector('.training-tools-panel');
        const toggleBtn = this.currentOverlay.querySelector('.toggle-panel');
        
        if (panel && toggleBtn) {
            this.isCollapsed = !this.isCollapsed;
            panel.classList.toggle('collapsed', this.isCollapsed);
            toggleBtn.textContent = this.isCollapsed ? '+' : '−';
        }
    }

    createOverlayHTML() {
        return `
            <div class="training-tools-panel">
                <div class="panel-header">
                    <h3>🔍 CyberQuest Analysis Tools</h3>
                    <button class="toggle-panel" title="Toggle panel">−</button>
                </div>
                <div class="panel-content">
                    <p>Analyze this news story for authenticity and credibility.</p>
                    
                    <div class="tool-buttons">
                        <button id="cross-reference-tool" class="tool-btn primary" 
                                data-url="https://fact-checker.cyberquest.academy/cross-reference"
                                title="Cross-reference this story with other sources">
                            <i class="bi bi-search"></i> Cross-Reference Story
                        </button>
                        <button id="source-analysis-tool" class="tool-btn secondary"
                                title="Analyze the source credibility">
                            <i class="bi bi-shield-check"></i> Analyze Source
                        </button>
                        <button id="check-article-metadata" class="tool-btn secondary"
                                title="Check article metadata and details">
                            <i class="bi bi-info-circle"></i> Check Article Info
                        </button>
                    </div>

                    <div class="analysis-form">
                        <label><strong>Your Analysis:</strong></label>
                        <textarea rows="3" placeholder="What did you discover about this story?" id="analysis-notes"></textarea>
                        
                        <div class="credibility-options">
                            <label><strong>Is this story credible?</strong></label>
                            <label class="radio-label">
                                <input type="radio" name="credibility" value="yes">
                                <span>Yes, appears legitimate</span>
                            </label>
                            <label class="radio-label">
                                <input type="radio" name="credibility" value="no">
                                <span>No, appears to be misinformation</span>
                            </label>
                            <label class="radio-label">
                                <input type="radio" name="credibility" value="unsure">
                                <span>Need more information</span>
                            </label>
                        </div>
                        
                        <button id="submit-analysis" class="tool-btn primary full-width">
                            Submit Analysis
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    addOverlayStyles() {
        if (document.getElementById('cyberquest-overlay-styles')) return;
        
        const style = document.createElement('style');
        style.id = 'cyberquest-overlay-styles';
        style.textContent = `
            .cyberquest-training-overlay {
                position: fixed;
                top: 140px;
                right: 20px;
                width: 360px;
                background: rgba(31, 41, 55, 0.96);
                backdrop-filter: blur(12px);
                border-radius: 16px;
                border: 2px solid #10b981;
                font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
                box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
                z-index: 999;
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                transform: translateX(100%);
                opacity: 0;
                max-height: calc(100vh - 160px);
                overflow: hidden;
            }
            
            .training-tools-panel {
                color: white;
                height: 100%;
                display: flex;
                flex-direction: column;
                transition: all 0.3s ease;
            }
            
            .panel-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 18px 22px;
                border-bottom: 1px solid rgba(16, 185, 129, 0.3);
                background: rgba(16, 185, 129, 0.1);
                border-radius: 14px 14px 0 0;
            }
            
            .panel-header h3 {
                color: #10b981;
                margin: 0;
                font-size: 16px;
                font-weight: 600;
            }
            
            .toggle-panel {
                background: rgba(16, 185, 129, 0.2);
                border: 1px solid rgba(16, 185, 129, 0.4);
                color: #10b981;
                font-size: 16px;
                font-weight: bold;
                cursor: pointer;
                padding: 6px 10px;
                border-radius: 6px;
                transition: all 0.2s ease;
                min-width: 32px;
                height: 32px;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            
            .toggle-panel:hover {
                background: rgba(16, 185, 129, 0.3);
                transform: scale(1.05);
            }
            
            .panel-content {
                padding: 22px;
                flex: 1;
                overflow-y: auto;
            }
            
            .panel-content p {
                color: #d1d5db;
                font-size: 14px;
                margin: 0 0 18px 0;
                line-height: 1.6;
            }
            
            .tool-buttons {
                display: flex;
                flex-direction: column;
                gap: 10px;
                margin-bottom: 22px;
            }
            
            .tool-btn {
                padding: 12px 16px;
                border: none;
                border-radius: 8px;
                font-size: 14px;
                font-weight: 500;
                cursor: pointer;
                transition: all 0.2s ease;
                display: flex;
                align-items: center;
                gap: 10px;
                position: relative;
                overflow: hidden;
            }
            
            .tool-btn::before {
                content: '';
                position: absolute;
                top: 0;
                left: -100%;
                width: 100%;
                height: 100%;
                background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
                transition: left 0.5s ease;
            }
            
            .tool-btn:hover::before {
                left: 100%;
            }
            
            .tool-btn.primary {
                background: linear-gradient(135deg, #10b981 0%, #059669 100%);
                color: white;
                box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
            }
            
            .tool-btn.primary:hover {
                background: linear-gradient(135deg, #059669 0%, #047857 100%);
                transform: translateY(-2px);
                box-shadow: 0 6px 16px rgba(16, 185, 129, 0.4);
            }
            
            .tool-btn.secondary {
                background: rgba(16, 185, 129, 0.1);
                color: #10b981;
                border: 1px solid rgba(16, 185, 129, 0.3);
            }
            
            .tool-btn.secondary:hover {
                background: rgba(16, 185, 129, 0.2);
                border-color: rgba(16, 185, 129, 0.5);
                transform: translateY(-1px);
            }
            
            .tool-btn.full-width {
                width: 100%;
                justify-content: center;
                margin-top: 18px;
            }
            
            .analysis-form {
                background: rgba(55, 65, 81, 0.7);
                padding: 18px;
                border-radius: 12px;
                border: 1px solid rgba(16, 185, 129, 0.2);
            }
            
            .analysis-form label {
                color: #d1d5db;
                font-size: 13px;
                font-weight: 500;
                margin-bottom: 8px;
                display: block;
            }
            
            .analysis-form textarea {
                width: 100%;
                background: rgba(75, 85, 99, 0.8);
                color: white;
                border: 1px solid #6b7280;
                border-radius: 8px;
                padding: 12px;
                font-size: 13px;
                resize: vertical;
                min-height: 70px;
                margin-bottom: 18px;
                font-family: inherit;
                transition: all 0.2s ease;
            }
            
            .analysis-form textarea:focus {
                outline: none;
                border-color: #10b981;
                box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.2);
                background: rgba(75, 85, 99, 0.9);
            }
            
            .credibility-options {
                margin: 14px 0;
            }
            
            .radio-label {
                display: flex !important;
                align-items: center;
                margin: 10px 0 !important;
                cursor: pointer;
                font-size: 12px !important;
                padding: 8px;
                border-radius: 6px;
                transition: background-color 0.2s ease;
            }
            
            .radio-label:hover {
                background: rgba(16, 185, 129, 0.1);
            }
            
            .radio-label input[type="radio"] {
                margin-right: 10px;
                accent-color: #10b981;
                width: 16px;
                height: 16px;
            }
            
            .radio-label span {
                color: #d1d5db;
                flex: 1;
            }
            
            /* Collapsed state */
            .training-tools-panel.collapsed .panel-content {
                display: none;
            }
            
            .training-tools-panel.collapsed {
                width: auto;
                min-width: 280px;
            }
            
            /* Responsive adjustments */
            @media (max-width: 768px) {
                .cyberquest-training-overlay {
                    position: fixed;
                    bottom: 20px;
                    right: 20px;
                    top: auto;
                    width: calc(100vw - 40px);
                    max-width: 360px;
                    max-height: 60vh;
                }
            }
            
            @media (max-height: 600px) {
                .cyberquest-training-overlay {
                    top: 80px;
                    max-height: calc(100vh - 100px);
                }
            }
            
            /* Smooth scrollbar */
            .panel-content::-webkit-scrollbar {
                width: 6px;
            }
            
            .panel-content::-webkit-scrollbar-track {
                background: rgba(55, 65, 81, 0.3);
                border-radius: 3px;
            }
            
            .panel-content::-webkit-scrollbar-thumb {
                background: rgba(16, 185, 129, 0.5);
                border-radius: 3px;
            }
            
            .panel-content::-webkit-scrollbar-thumb:hover {
                background: rgba(16, 185, 129, 0.7);
            }
        `;
        document.head.appendChild(style);
    }

    bindOverlayEvents(overlay, pageConfig) {
        // Toggle panel
        const toggleBtn = overlay.querySelector('.toggle-panel');
        if (toggleBtn) {
            toggleBtn.addEventListener('click', () => {
                this.toggleCollapsed();
            });
        }
        
        // Cross-reference tool
        const crossRefBtn = overlay.querySelector('#cross-reference-tool');
        if (crossRefBtn) {
            crossRefBtn.addEventListener('click', () => {
                const url = crossRefBtn.getAttribute('data-url');
                if (url) {
                    this.browserApp.navigation.navigateToUrl(url);
                }
            });
        }
        
        // Source analysis tool
        const sourceBtn = overlay.querySelector('#source-analysis-tool');
        if (sourceBtn) {
            sourceBtn.addEventListener('click', () => {
                this.showSourceAnalysis();
            });
        }
        
        // Check article metadata tool
        const metadataBtn = overlay.querySelector('#check-article-metadata');
        if (metadataBtn) {
            metadataBtn.addEventListener('click', () => {
                this.showArticleMetadata(pageConfig);
            });
        }
        
        // Submit analysis
        const submitBtn = overlay.querySelector('#submit-analysis');
        if (submitBtn) {
            submitBtn.addEventListener('click', () => {
                this.handleAnalysisSubmission(overlay);
            });
        }
        
        // Bind page-specific events if available
        if (pageConfig && typeof pageConfig.bindEvents === 'function') {
            pageConfig.bindEvents(overlay);
        }
    }

    showSourceAnalysis() {
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-black/75 flex items-center justify-center z-50';
        modal.innerHTML = `
            <div class="bg-white rounded-lg p-6 max-w-md mx-4">
                <div class="text-center">
                    <i class="bi bi-shield-exclamation text-6xl text-orange-500 mb-4"></i>
                    <h2 class="text-xl font-bold text-orange-600 mb-4">🔍 Source Analysis</h2>
                    <div class="text-left">
                        <h3 class="font-semibold text-gray-800 mb-2">Analysis Results:</h3>
                        <ul class="text-sm text-gray-700 space-y-1 mb-4">
                            <li>• Domain registered recently (2 weeks ago)</li>
                            <li>• No HTTPS encryption</li>
                            <li>• No contact information visible</li>
                            <li>• Sensational headlines detected</li>
                            <li>• No author attribution</li>
                        </ul>
                        <div class="bg-orange-50 border border-orange-200 rounded p-3">
                            <p class="text-sm text-orange-700">
                                <strong>Warning:</strong> Multiple indicators suggest this may not be a reliable news source.
                            </p>
                        </div>
                    </div>
                    <button onclick="this.closest('.fixed').remove()" 
                            class="mt-4 bg-orange-600 text-white px-6 py-2 rounded hover:bg-orange-700 transition-colors">
                        Close Analysis
                    </button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }

    showArticleMetadata(pageConfig) {
        // Use the current page config or fall back to stored config
        const articleData = pageConfig?.articleData || this.currentPageConfig?.articleData || null;
        
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-black/75 flex items-center justify-center z-50';
        modal.innerHTML = `
            <div class="bg-white rounded-lg p-6 max-w-md mx-4">
                <div class="text-center">
                    <i class="bi bi-info-circle text-6xl text-blue-500 mb-4"></i>
                    <h2 class="text-xl font-bold text-blue-600 mb-4">📊 Article Metadata</h2>
                    <div class="text-left">
                        <h3 class="font-semibold text-gray-800 mb-2">Article Analysis:</h3>
                        <ul class="text-sm text-gray-700 space-y-1 mb-4">
                            ${articleData ? `
                                <li>• <strong>Author:</strong> ${articleData.author || 'Unknown'}</li>
                                <li>• <strong>Published:</strong> ${articleData.published || 'Unknown date'}</li>
                                <li>• <strong>Article Type:</strong> ${articleData.is_real ? 'Real News' : 'Misinformation'}</li>
                                <li>• <strong>Data Source:</strong> ${articleData.source || 'Training Dataset'}</li>
                                <li>• <strong>Image URL:</strong> ${articleData.main_img_url ? 'Available' : 'Not provided'}</li>
                            ` : `
                                <li>• <strong>Source Domain:</strong> daily-politico-news.com</li>
                                <li>• <strong>Domain Age:</strong> Recently registered</li>
                                <li>• <strong>Author:</strong> No clear attribution</li>
                                <li>• <strong>Language:</strong> Highly emotional and urgent</li>
                            `}
                        </ul>
                        <div class="bg-red-50 border border-red-200 rounded p-3">
                            <p class="text-sm text-red-700">
                                <strong>Assessment:</strong> ${articleData && articleData.is_real ? 'This appears to be legitimate news content.' : 'Multiple indicators suggest this is misinformation designed to manipulate emotions and encourage rapid sharing.'}
                            </p>
                        </div>
                    </div>
                    <button onclick="this.closest('.fixed').remove()" 
                            class="mt-4 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors">
                        Close Analysis
                    </button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }

    handleAnalysisSubmission(overlay) {
        const notes = overlay.querySelector('#analysis-notes').value;
        const credibility = overlay.querySelector('input[name="credibility"]:checked')?.value;
        
        if (!credibility) {
            alert('Please select whether you think this story is credible or not.');
            return;
        }
        
        // Get the current page's article data using the stored config
        const pageConfig = this.currentPageConfig || {};
        const articleData = pageConfig.articleData;
        
        // Determine if the user's assessment was correct
        let isCorrect = false;
        let feedback = '';
        
        if (articleData) {
            const actuallyReal = articleData.is_real;
            const userSaidReal = credibility === 'yes';
            
            isCorrect = (actuallyReal && userSaidReal) || (!actuallyReal && credibility === 'no');
            
            if (isCorrect) {
                feedback = actuallyReal 
                    ? 'Correct! This was legitimate news from a credible source.'
                    : 'Excellent! You correctly identified this as misinformation.';
            } else {
                feedback = actuallyReal
                    ? 'This was actually legitimate news. Look for credible sources and proper journalism standards.'
                    : 'This was misinformation. Watch for sensational language, urgent calls to action, and lack of credible sources.';
            }
        } else {
            // Fallback for static content - assume it's misinformation training
            isCorrect = credibility === 'no';
            feedback = isCorrect 
                ? 'Excellent! You correctly identified this as misinformation. The urgent language, anonymous sources, emotional manipulation, and lack of credible evidence are all red flags.'
                : 'This was actually misinformation designed for training. Look for: anonymous sources, urgent sharing pressure, emotional language, lack of credible evidence, and new domain registration.';
        }
        
        // Mark challenge as completed
        localStorage.setItem('cyberquest_challenge1_completed', 'true');
        
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-black/75 flex items-center justify-center z-50';
        modal.innerHTML = `
            <div class="bg-white rounded-lg p-6 max-w-md mx-4">
                <div class="text-center">
                    <i class="bi bi-${isCorrect ? 'check-circle text-green-500' : 'info-circle text-orange-500'} text-6xl mb-4"></i>
                    <h2 class="text-xl font-bold ${isCorrect ? 'text-green-600' : 'text-orange-600'} mb-4">
                        ${isCorrect ? '✅ Great Analysis!' : '📚 Learning Opportunity!'}
                    </h2>
                    <p class="text-gray-700 mb-4">${feedback}</p>
                    <div class="bg-blue-50 border border-blue-200 rounded p-3 mb-4">
                        <p class="text-sm text-blue-700">
                            <strong>Key Learning:</strong> Always check multiple sources, look for proper attribution, and be wary of emotionally charged language that pressures you to share immediately.
                        </p>
                    </div>
                    <button onclick="this.closest('.fixed').remove(); window.challenge1EventHandlers?.completeLevelOne?.()" 
                            class="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors">
                        Continue Training
                    </button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        
        // Store analysis results
        localStorage.setItem('cyberquest_challenge1_analysis', JSON.stringify({
            notes,
            credibility,
            correct: isCorrect,
            articleData: articleData,
            timestamp: new Date().toISOString()
        }));
    }
}
