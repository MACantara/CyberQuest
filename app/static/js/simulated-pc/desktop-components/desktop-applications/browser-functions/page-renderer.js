import { PageRegistry } from './pages/page-registry.js';

export class PageRenderer {
    constructor(browserApp) {
        this.browserApp = browserApp;
        this.pageRegistry = new PageRegistry();
    }

    async renderPage(url) {
        const pageConfig = this.pageRegistry.getPage(url) || this.pageRegistry.createNotFoundPage(url);
        const contentElement = this.browserApp.windowElement?.querySelector('#browser-content');
        
        if (contentElement) {
            this.showLoadingState(contentElement);
            
            try {
                let htmlContent;
                
                // For challenge1 page, create static content instead of fetching
                if (url === 'https://daily-politico-news.com/breaking-news') {
                    htmlContent = await this.createChallenge1Content();
                } else {
                    htmlContent = pageConfig.createContent();
                }
                
                contentElement.innerHTML = htmlContent;
                
                // Create overlay for CyberQuest training tools if this is challenge1
                if (url === 'https://daily-politico-news.com/breaking-news') {
                    this.addTrainingOverlay(contentElement, pageConfig);
                }
                
                this.updatePageTitle(pageConfig.title);
                this.bindPageEvents(url);
                
            } catch (error) {
                console.error('Error rendering page:', error);
                contentElement.innerHTML = this.createErrorContent(error.message);
            }
        }
    }

    async createChallenge1Content() {
        // Create static misinformation content for training
        return `
            <div style="font-family: Arial, sans-serif; background: #ffffff; min-height: 100vh;">
                <!-- Urgent Banner -->
                <div style="background: linear-gradient(90deg, #dc2626, #ea580c); color: white; padding: 15px; text-align: center; font-weight: bold; animation: pulse 2s infinite;">
                    🚨 BREAKING: EXCLUSIVE STORY! SHARE BEFORE IT'S CENSORED! 🚨
                </div>
                
                <!-- Header -->
                <header style="background: #1f2937; color: white; padding: 20px;">
                    <h1 style="margin: 0; font-size: 28px;">Daily Politico News</h1>
                    <p style="margin: 5px 0 0 0; color: #9ca3af;">Your Source for REAL News</p>
                </header>
                
                <!-- Main Content -->
                <main style="padding: 30px; max-width: 800px; margin: 0 auto;">
                    <h2 style="color: #dc2626; font-size: 32px; margin-bottom: 10px;">
                        SHOCKING: Senator Johnson Caught in Massive Hacking Scandal!
                    </h2>
                    
                    <div style="color: #6b7280; margin-bottom: 20px; font-size: 14px;">
                        Published: Today | By: Anonymous Source | Category: EXCLUSIVE
                    </div>
                    
                    <img src="/static/images/level-one/fake-news-image.jpg" 
                         alt="Fake scandal image" 
                         style="width: 100%; height: 300px; object-fit: cover; margin-bottom: 20px; border-radius: 8px;"
                         onerror="this.style.background='#f3f4f6'; this.alt='Image not available';">
                    
                    <div style="font-size: 18px; line-height: 1.6; color: #374151;">
                        <p><strong>EXCLUSIVE BREAKING NEWS:</strong> Senator Margaret Johnson has been caught red-handed in a massive cyber-attack scandal that will SHOCK you to your core!</p>
                        
                        <p>According to our EXCLUSIVE sources (who must remain anonymous for their safety), Senator Johnson has been secretly working with foreign hackers to steal classified government documents!</p>
                        
                        <p style="background: #fef3c7; padding: 15px; border-left: 4px solid #f59e0b; margin: 20px 0;">
                            <strong>WARNING:</strong> The mainstream media is trying to HIDE this story! Share this immediately before they take it down!
                        </p>
                        
                        <p>Our investigation reveals:</p>
                        <ul style="margin: 20px 0; padding-left: 30px;">
                            <li>🔥 SECRET meetings with known cyber-criminals</li>
                            <li>🔥 MILLIONS of dollars in suspicious transactions</li>
                            <li>🔥 CLASSIFIED documents found on her personal devices</li>
                            <li>🔥 Cover-up attempts by government officials</li>
                        </ul>
                        
                        <p style="color: #dc2626; font-weight: bold;">This story is EXPLOSIVE and could change everything! The deep state doesn't want you to know the TRUTH!</p>
                    </div>
                    
                    <!-- Sharing Urgency Box -->
                    <div style="background: #dc2626; color: white; padding: 20px; margin: 20px 0; border-radius: 8px; text-align: center; border: 3px solid #f59e0b;">
                        <h3 style="margin: 0 0 10px 0;">URGENT: YOUR ACTION NEEDED</h3>
                        <p style="margin: 0 0 15px 0;">Share this story immediately! Don't let the mainstream media hide the truth!</p>
                        <button style="background: #1d4ed8; color: white; padding: 12px 24px; border: none; border-radius: 4px; margin: 5px; font-weight: bold; cursor: pointer;">Share on Facebook</button>
                        <button style="background: #1da1f2; color: white; padding: 12px 24px; border: none; border-radius: 4px; margin: 5px; font-weight: bold; cursor: pointer;">Tweet Now</button>
                    </div>
                    
                    <!-- Fake Testimonials -->
                    <div style="background: #f9fafb; padding: 20px; margin: 20px 0; border-radius: 8px;">
                        <h3 style="color: #374151; margin-bottom: 15px;">What People Are Saying:</h3>
                        <blockquote style="margin: 15px 0; padding: 10px; border-left: 3px solid #10b981; background: white;">
                            "I KNEW something was fishy about her! Thanks for exposing the TRUTH!" - PatriotFreedom2024
                        </blockquote>
                        <blockquote style="margin: 15px 0; padding: 10px; border-left: 3px solid #10b981; background: white;">
                            "Finally, REAL journalism! The mainstream media would never report this!" - TruthSeeker99
                        </blockquote>
                        <blockquote style="margin: 15px 0; padding: 10px; border-left: 3px solid #10b981; background: white;">
                            "Shared this everywhere! Everyone needs to know!" - WakeUpAmerica
                        </blockquote>
                    </div>
                </main>
                
                <!-- Footer -->
                <footer style="background: #f3f4f6; padding: 20px; text-align: center; color: #6b7280;">
                    <p>© 2024 Daily Politico News | "No catch, totally legitimate" | Contact: tips@daily-politico-news.com</p>
                    <p style="font-size: 12px;">This website is for CyberQuest training purposes and contains simulated misinformation.</p>
                </footer>
            </div>
        `;
    }

    addTrainingOverlay(contentElement, pageConfig) {
        const overlay = document.createElement('div');
        overlay.className = 'cyberquest-training-overlay';
        overlay.innerHTML = this.createTrainingOverlay();
        
        // Position overlay relative to content
        contentElement.style.position = 'relative';
        contentElement.appendChild(overlay);
        
        // Add styles for the overlay
        this.addOverlayStyles();
        
        // Bind overlay events
        this.bindOverlayEvents(overlay, pageConfig);
    }

    createTrainingOverlay() {
        return `
            <div class="training-tools-panel">
                <div class="panel-header">
                    <h3>🔍 CyberQuest Analysis Tools</h3>
                    <button class="toggle-panel">−</button>
                </div>
                <div class="panel-content">
                    <p>Analyze this news story for authenticity and credibility.</p>
                    
                    <div class="tool-buttons">
                        <button id="cross-reference-tool" class="tool-btn primary" 
                                data-url="https://fact-checker.cyberquest.academy/cross-reference">
                            <i class="bi bi-search"></i> Cross-Reference Story
                        </button>
                        <button id="source-analysis-tool" class="tool-btn secondary">
                            <i class="bi bi-shield-check"></i> Analyze Source
                        </button>
                        <button id="check-article-metadata" class="tool-btn secondary">
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
                position: absolute;
                top: 20px;
                right: 20px;
                width: 350px;
                background: rgba(31, 41, 55, 0.95);
                backdrop-filter: blur(10px);
                border-radius: 12px;
                border: 2px solid #10b981;
                font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
                box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
                z-index: 1000;
                transition: all 0.3s ease;
            }
            
            .training-tools-panel {
                color: white;
            }
            
            .panel-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 16px 20px;
                border-bottom: 1px solid rgba(16, 185, 129, 0.3);
            }
            
            .panel-header h3 {
                color: #10b981;
                margin: 0;
                font-size: 16px;
                font-weight: 600;
            }
            
            .toggle-panel {
                background: none;
                border: none;
                color: #10b981;
                font-size: 18px;
                font-weight: bold;
                cursor: pointer;
                padding: 4px 8px;
                border-radius: 4px;
                transition: background-color 0.2s;
            }
            
            .toggle-panel:hover {
                background: rgba(16, 185, 129, 0.1);
            }
            
            .panel-content {
                padding: 20px;
            }
            
            .panel-content p {
                color: #d1d5db;
                font-size: 14px;
                margin: 0 0 16px 0;
                line-height: 1.5;
            }
            
            .tool-buttons {
                display: flex;
                flex-direction: column;
                gap: 8px;
                margin-bottom: 20px;
            }
            
            .tool-btn {
                padding: 10px 14px;
                border: none;
                border-radius: 6px;
                font-size: 14px;
                font-weight: 500;
                cursor: pointer;
                transition: all 0.2s;
                display: flex;
                align-items: center;
                gap: 8px;
            }
            
            .tool-btn.primary {
                background: #10b981;
                color: white;
            }
            
            .tool-btn.primary:hover {
                background: #059669;
                transform: translateY(-1px);
            }
            
            .tool-btn.secondary {
                background: rgba(16, 185, 129, 0.1);
                color: #10b981;
                border: 1px solid rgba(16, 185, 129, 0.3);
            }
            
            .tool-btn.secondary:hover {
                background: rgba(16, 185, 129, 0.2);
            }
            
            .tool-btn.full-width {
                width: 100%;
                justify-content: center;
                margin-top: 16px;
            }
            
            .analysis-form {
                background: rgba(55, 65, 81, 0.6);
                padding: 16px;
                border-radius: 8px;
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
                border-radius: 6px;
                padding: 10px;
                font-size: 12px;
                resize: vertical;
                min-height: 60px;
                margin-bottom: 16px;
                font-family: inherit;
            }
            
            .analysis-form textarea:focus {
                outline: none;
                border-color: #10b981;
                box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.2);
            }
            
            .credibility-options {
                margin: 12px 0;
            }
            
            .radio-label {
                display: flex !important;
                align-items: center;
                margin: 8px 0 !important;
                cursor: pointer;
                font-size: 12px !important;
            }
            
            .radio-label input[type="radio"] {
                margin-right: 8px;
                accent-color: #10b981;
            }
            
            .radio-label span {
                color: #d1d5db;
            }
            
            /* Collapsed state */
            .training-tools-panel.collapsed .panel-content {
                display: none;
            }
            
            .training-tools-panel.collapsed {
                width: auto;
                min-width: 200px;
            }
            
            /* Responsive adjustments */
            @media (max-width: 768px) {
                .cyberquest-training-overlay {
                    position: fixed;
                    bottom: 20px;
                    right: 20px;
                    top: auto;
                    width: calc(100vw - 40px);
                    max-width: 350px;
                }
            }
        `;
        document.head.appendChild(style);
    }

    bindOverlayEvents(overlay, pageConfig) {
        // Toggle panel
        const toggleBtn = overlay.querySelector('.toggle-panel');
        const panel = overlay.querySelector('.training-tools-panel');
        
        if (toggleBtn && panel) {
            toggleBtn.addEventListener('click', () => {
                panel.classList.toggle('collapsed');
                toggleBtn.textContent = panel.classList.contains('collapsed') ? '+' : '−';
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
                            <li>• <strong>Source Domain:</strong> daily-politico-news.com</li>
                            <li>• <strong>Domain Age:</strong> Registered 2 weeks ago</li>
                            <li>• <strong>Author:</strong> "Anonymous Source" (Red flag!)</li>
                            <li>• <strong>Verification:</strong> No credible sources cited</li>
                            <li>• <strong>Language:</strong> Highly emotional and urgent</li>
                        </ul>
                        <div class="bg-red-50 border border-red-200 rounded p-3">
                            <p class="text-sm text-red-700">
                                <strong>Warning:</strong> Multiple indicators suggest this is misinformation designed to manipulate emotions and encourage rapid sharing.
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
        
        // For the static training content, we know it's misinformation
        const isCorrect = credibility === 'no';
        const feedback = isCorrect 
            ? 'Excellent! You correctly identified this as misinformation. The urgent language, anonymous sources, emotional manipulation, and lack of credible evidence are all red flags.'
            : 'This was actually misinformation designed for training. Look for: anonymous sources, urgent sharing pressure, emotional language, lack of credible evidence, and new domain registration.';
        
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
            timestamp: new Date().toISOString()
        }));
    }

    showLoadingState(contentElement) {
        contentElement.innerHTML = `
            <div class="min-h-screen bg-white flex items-center justify-center">
                <div class="text-center">
                    <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <h2 class="text-xl font-semibold text-gray-800 mb-2">Loading page...</h2>
                    <p class="text-gray-600">Please wait while we fetch the content</p>
                </div>
            </div>
        `;
    }

    createErrorContent(errorMessage) {
        return `
            <div class="min-h-screen bg-white flex items-center justify-center">
                <div class="text-center max-w-md mx-auto p-6">
                    <div class="text-red-500 mb-4">
                        <i class="bi bi-exclamation-triangle text-6xl"></i>
                    </div>
                    <h2 class="text-xl font-semibold text-gray-800 mb-2">Error Loading Page</h2>
                    <p class="text-gray-600 mb-4">${errorMessage}</p>
                    <button onclick="window.location.reload()" 
                            class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors">
                        Try Again
                    </button>
                </div>
            </div>
        `;
    }

    updatePageTitle(title) {
        const windowTitle = this.browserApp.windowElement?.querySelector('.window-title span');
        if (windowTitle) {
            windowTitle.textContent = `Web Browser - ${title}`;
        }
    }
    
    bindPageEvents(url) {
        const contentElement = this.browserApp.windowElement?.querySelector('#browser-content');
        if (!contentElement) return;

        // Get the page configuration for event binding
        const pageConfig = this.pageRegistry.getPage(url);
        
        // Bind page-specific events if the page has a bindEvents method
        if (pageConfig && typeof pageConfig.bindEvents === 'function') {
            pageConfig.bindEvents(contentElement);
        }

        // Handle scam button clicks
        const scamButton = contentElement.querySelector('#scam-button');
        if (scamButton) {
            scamButton.addEventListener('click', () => {
                this.showScamWarning();
            });
        }

        // Handle form submissions
        const forms = contentElement.querySelectorAll('form');
        forms.forEach(form => {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleFormSubmission(form, url);
            });
        });

        // Handle link clicks
        const links = contentElement.querySelectorAll('a[href]');
        links.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const href = link.getAttribute('href');
                if (href && href !== '#') {
                    this.browserApp.navigation.navigateToUrl(href);
                }
            });
        });
    }

    showScamWarning() {
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-black/75 flex items-center justify-center z-50';
        modal.innerHTML = `
            <div class="bg-white rounded-lg p-6 max-w-md mx-4">
                <div class="text-center">
                    <i class="bi bi-shield-x text-6xl text-red-500 mb-4"></i>
                    <h2 class="text-xl font-bold text-red-600 mb-4">🚨 SCAM DETECTED! 🚨</h2>
                    <p class="text-gray-700 mb-4">
                        Good job! You've identified a scam website. In real life, clicking this button would 
                        likely lead to identity theft or financial fraud.
                    </p>
                    <div class="bg-red-50 border border-red-200 rounded p-3 mb-4">
                        <p class="text-sm text-red-700">
                            <strong>Red flags you should notice:</strong><br>
                            • Too good to be true offers<br>
                            • Urgent/pressure language<br>
                            • Suspicious domain name<br>
                            • Poor grammar/spelling
                        </p>
                    </div>
                    <button onclick="this.closest('.fixed').remove()" 
                            class="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition-colors">
                        Continue Training
                    </button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }

    handleFormSubmission(form, url) {
        // Show warning for sensitive forms
        if (url.includes('suspicious') || form.querySelector('input[type="password"]')) {
            const modal = document.createElement('div');
            modal.className = 'fixed inset-0 bg-black/75 flex items-center justify-center z-50';
            modal.innerHTML = `
                <div class="bg-white rounded-lg p-6 max-w-md mx-4">
                    <div class="text-center">
                        <i class="bi bi-exclamation-triangle text-6xl text-yellow-500 mb-4"></i>
                        <h2 class="text-xl font-bold text-yellow-600 mb-4">⚠️ SECURITY WARNING</h2>
                        <p class="text-gray-700 mb-4">
                            You're about to submit sensitive information. In a real scenario, 
                            make sure you trust the website and verify the URL before proceeding.
                        </p>
                        <div class="space-x-3">
                            <button onclick="this.closest('.fixed').remove()" 
                                    class="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition-colors">
                                Cancel
                            </button>
                            <button onclick="this.closest('.fixed').remove()" 
                                    class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors">
                                Continue (Training)
                            </button>
                        </div>
                    </div>
                </div>
            `;
            document.body.appendChild(modal);
        }
    }

    generateSuspiciousSiteHTML() {
        return `
            <div class="bg-gradient-to-br from-red-500 via-orange-500 to-yellow-500 min-h-full p-8 text-center">
                <div class="max-w-4xl mx-auto">
                    <div class="mb-8">
                        <h1 class="text-6xl font-bold text-white mb-4 animate-bounce" id="scam-headline">
                            🎉 CONGRATULATIONS! 🎉
                        </h1>
                        <h2 class="text-3xl font-bold text-yellow-300 mb-6" id="scam-subheading">
                            You've Won $10,000,000!
                        </h2>
                        <p class="text-xl text-white mb-8" id="scam-description">
                            You are the 1,000,000th visitor to this website! Click below to claim your prize NOW!
                        </p>
                    </div>
                    
                    <div class="bg-white/90 backdrop-blur-sm rounded-lg p-6 mb-8 shadow-2xl">
                        <div class="flex justify-center items-center mb-6">
                            <div class="animate-pulse bg-green-500 text-white px-6 py-3 rounded-full text-xl font-bold" id="timer-display">
                                ⏰ LIMITED TIME: 05:43 remaining!
                            </div>
                        </div>
                        
                        <button class="bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-12 rounded-full text-2xl animate-pulse shadow-lg transform hover:scale-105 transition-all duration-200 cursor-pointer" id="scam-button">
                            🚨 CLAIM NOW - FREE MONEY! 🚨
                        </button>
                        
                        <div class="mt-6 space-y-3">
                            <div class="flex items-center justify-center text-green-600 font-semibold">
                                <i class="bi bi-check-circle-fill mr-2"></i>
                                <span>100% Guaranteed</span>
                            </div>
                            <div class="flex items-center justify-center text-green-600 font-semibold" id="fake-disclaimer">
                                <i class="bi bi-shield-check-fill mr-2"></i>
                                <span>No catch, totally legitimate</span>
                            </div>
                            <div class="flex items-center justify-center text-green-600 font-semibold" id="urgency-message">
                                <i class="bi bi-lightning-fill mr-2"></i>
                                <span>Act fast - offer expires soon!</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="grid md:grid-cols-3 gap-6 mb-8">
                        <div class="bg-white/80 rounded-lg p-4 text-center" id="fake-testimonial-1">
                            <div class="text-2xl mb-2">👤</div>
                            <p class="text-sm text-gray-700">"I won $50,000 last week!" - Sarah K.</p>
                        </div>
                        <div class="bg-white/80 rounded-lg p-4 text-center" id="fake-testimonial-2">
                            <div class="text-2xl mb-2">👤</div>
                            <p class="text-sm text-gray-700">"Easy money, no scam!" - Mike R.</p>
                        </div>
                        <div class="bg-white/80 rounded-lg p-4 text-center" id="fake-testimonial-3">
                            <div class="text-2xl mb-2">👤</div>
                            <p class="text-sm text-gray-700">"Received payment instantly!" - Lisa M.</p>
                        </div>
                    </div>
                    
                    <div class="text-xs text-white/70 max-w-2xl mx-auto" id="fine-print">
                        <p class="mb-2">* This is a cybersecurity training simulation. This is not a real offer or legitimate website.</p>
                        <p>Real scam sites use similar tactics: urgent language, fake testimonials, and pressure to act quickly.</p>
                    </div>
                </div>
            </div>
        `;
    }
}
