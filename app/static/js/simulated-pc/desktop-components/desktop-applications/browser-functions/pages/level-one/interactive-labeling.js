export class InteractiveLabeling {
    constructor(browserApp, pageRegistry) {
        this.browserApp = browserApp;
        this.pageRegistry = pageRegistry;
        this.currentPageConfig = null;
        this.labeledElements = new Map();
        this.articleResults = [];
        this.isActive = false;
        this.currentArticleIndex = 0;
        this.totalArticles = 0;
        this.batchAnalysis = null;
        this.analysisSource = 'batch-json'; // Track that we're using batch JSON data
    }

    async initializeForArticle(pageConfig, articleIndex, totalArticles) {
        this.currentPageConfig = pageConfig;
        this.currentArticleIndex = articleIndex;
        this.totalArticles = totalArticles;
        this.labeledElements.clear();
        this.isActive = true;
        
        // Add styles for interactive elements
        this.addInteractiveStyles();
        
        // Load analysis from batch JSON data
        this.loadAnalysisFromBatch(pageConfig.articleData);
        
        // Make article elements interactive
        this.makeElementsInteractive();
        
        // Show instructions
        this.showInstructions();
    }

    loadAnalysisFromBatch(articleData) {
        // Check if article data has the new nested structure with numeric ID
        if (articleData && typeof articleData === 'object') {
            // Look for numeric keys (article IDs) in the data
            const articleIds = Object.keys(articleData).filter(key => !isNaN(key));
            
            if (articleIds.length > 0) {
                // Use the first numeric key found (should match current article index)
                const articleId = articleIds[this.currentArticleIndex] || articleIds[0];
                const articleContent = articleData[articleId];
                
                if (articleContent && articleContent.clickable_elements && Array.isArray(articleContent.clickable_elements)) {
                    this.batchAnalysis = articleContent;
                    this.analysisSource = 'batch-json';
                    console.log(`Using batch-1.json analysis for article ID ${articleId}:`, articleContent.article_metadata?.title?.substring(0, 50) || 'Unknown');
                    console.log('Clickable elements found:', articleContent.clickable_elements.length);
                    
                    // Log the clickable elements for debugging
                    articleContent.clickable_elements.forEach((element, index) => {
                        console.log(`Element ${index}:`, {
                            id: element.element_id,
                            name: element.element_name,
                            expected: element.expected_label,
                            text_sample: element.element_text?.substring(0, 30) || 'No text'
                        });
                    });
                    return;
                }
            }
            
            // Fallback: check for direct clickable_elements (old structure)
            if (articleData.clickable_elements && Array.isArray(articleData.clickable_elements)) {
                this.batchAnalysis = articleData;
                this.analysisSource = 'batch-json';
                console.log('Using legacy batch structure for article:', articleData.article_metadata?.title?.substring(0, 50) || 'Unknown');
                console.log('Clickable elements found:', articleData.clickable_elements.length);
                return;
            }
        }
        
        console.error('No clickable_elements found in article data');
        console.log('Available articleData structure:', {
            keys: Object.keys(articleData || {}),
            numericKeys: Object.keys(articleData || {}).filter(key => !isNaN(key)),
            hasClickableElements: !!(articleData?.clickable_elements),
            isArray: Array.isArray(articleData?.clickable_elements)
        });
        this.batchAnalysis = null;
        this.analysisSource = 'none';
    }

    addInteractiveStyles() {
        if (document.getElementById('interactive-labeling-styles')) return;
        
        const style = document.createElement('style');
        style.id = 'interactive-labeling-styles';
        style.textContent = `
            .interactive-element {
                cursor: pointer;
                transition: all 0.3s ease;
                position: relative;
                border-radius: 4px;
                padding: 2px 4px;
                margin: -2px -4px;
            }
            
            .interactive-element:hover {
                background-color: rgba(59, 130, 246, 0.1);
                box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.3);
            }
            
            .interactive-element.labeled-fake {
                background-color: rgba(239, 68, 68, 0.2);
                border: 2px solid #ef4444;
            }
            
            .interactive-element.labeled-real {
                background-color: rgba(34, 197, 94, 0.2);
                border: 2px solid #22c55e;
            }
            
            .interactive-element.correct {
                background-color: rgba(34, 197, 94, 0.3);
                border: 2px solid #22c55e;
            }
            
            .interactive-element.incorrect {
                background-color: rgba(239, 68, 68, 0.3);
                border: 2px solid #ef4444;
            }
            
            .labeling-instructions {
                position: fixed;
                top: 80px;
                right: 20px;
                width: 320px;
                background: rgba(31, 41, 55, 0.95);
                backdrop-filter: blur(10px);
                border-radius: 12px;
                border: 2px solid #10b981;
                color: white;
                padding: 20px;
                font-family: 'Inter', sans-serif;
                z-index: 1000;
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
            }
            
            .instructions-header {
                color: #10b981;
                font-size: 16px;
                font-weight: 600;
                margin-bottom: 15px;
                display: flex;
                align-items: center;
                gap: 8px;
            }
            
            .instructions-content {
                font-size: 14px;
                line-height: 1.5;
                color: #d1d5db;
                margin-bottom: 15px;
            }
            
            .labeling-legend {
                display: flex;
                flex-direction: column;
                gap: 8px;
                margin-bottom: 15px;
            }
            
            .legend-item {
                display: flex;
                align-items: center;
                gap: 8px;
                font-size: 13px;
            }
            
            .legend-color {
                width: 16px;
                height: 16px;
                border-radius: 4px;
                border: 2px solid;
            }
            
            .legend-fake {
                background: rgba(239, 68, 68, 0.2);
                border-color: #ef4444;
            }
            
            .legend-real {
                background: rgba(34, 197, 94, 0.2);
                border-color: #22c55e;
            }
            
            .progress-info {
                font-size: 12px;
                color: #9ca3af;
                text-align: center;
                padding: 8px;
                background: rgba(55, 65, 81, 0.5);
                border-radius: 6px;
                margin-bottom: 15px;
            }
            
            .submit-analysis-btn {
                width: 100%;
                background: linear-gradient(135deg, #10b981 0%, #059669 100%);
                color: white;
                border: none;
                padding: 12px;
                border-radius: 8px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.2s ease;
            }
            
            .submit-analysis-btn:hover {
                background: linear-gradient(135deg, #059669 0%, #047857 100%);
                transform: translateY(-1px);
            }
            
            .submit-analysis-btn:disabled {
                background: #6b7280;
                cursor: not-allowed;
                transform: none;
            }
            
            .feedback-modal {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.8);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 2000;
            }
            
            .feedback-content {
                background: white;
                border-radius: 16px;
                padding: 30px;
                max-width: 500px;
                width: 90%;
                max-height: 80vh;
                overflow-y: auto;
                text-align: center;
            }
            
            .feedback-score {
                font-size: 48px;
                font-weight: bold;
                margin: 20px 0;
            }
            
            .feedback-score.good {
                color: #22c55e;
            }
            
            .feedback-score.medium {
                color: #f59e0b;
            }
            
            .feedback-score.poor {
                color: #ef4444;
            }
            
            .feedback-details {
                text-align: left;
                margin: 20px 0;
            }
            
            .feedback-item {
                margin: 10px 0;
                padding: 10px;
                border-radius: 8px;
                border-left: 4px solid;
            }
            
            .feedback-item.correct {
                background: #f0fdf4;
                border-color: #22c55e;
            }
            
            .feedback-item.incorrect {
                background: #fef2f2;
                border-color: #ef4444;
            }
            
            .feedback-item.unlabeled {
                background: #f8fafc;
                border-color: #6b7280;
            }
            
            .final-summary {
                background: white;
                border-radius: 16px;
                padding: 40px;
                max-width: 700px;
                width: 95%;
                max-height: 90vh;
                overflow-y: auto;
            }
            
            .summary-header {
                text-align: center;
                margin-bottom: 30px;
            }
            
            .overall-score {
                font-size: 64px;
                font-weight: bold;
                margin: 20px 0;
            }
            
            .article-summary {
                margin: 20px 0;
                padding: 20px;
                border-radius: 12px;
                background: #f8fafc;
                border: 1px solid #e2e8f0;
            }
            
            .article-title {
                font-weight: 600;
                color: #1f2937;
                margin-bottom: 10px;
            }
            
            .article-score {
                font-size: 24px;
                font-weight: bold;
                margin-bottom: 10px;
            }
            
            .ai-insights {
                background: #f0f9ff;
                border: 1px solid #0ea5e9;
                border-radius: 8px;
                padding: 15px;
                margin: 15px 0;
            }
            
            .ai-insights h3 {
                color: #0ea5e9;
                margin: 0 0 10px 0;
            }
            
            .ai-insights ul {
                margin: 0;
                padding-left: 20px;
            }
            
            .ai-warnings {
                background: #fef2f2;
                border: 1px solid #ef4444;
                border-radius: 8px;
                padding: 15px;
                margin: 15px 0;
            }
            
            .ai-warnings h3 {
                color: #ef4444;
                margin: 0 0 10px 0;
            }
            
            .ai-warnings ul {
                margin: 0;
                padding-left: 20px;
            }
        `;
        document.head.appendChild(style);
    }

    makeElementsInteractive() {
        // Wait for DOM to be ready
        setTimeout(() => {
            if (!this.batchAnalysis || !this.batchAnalysis.clickable_elements || !Array.isArray(this.batchAnalysis.clickable_elements)) {
                console.warn('No valid clickable_elements array found in batch analysis data');
                return;
            }
            
            console.log('Processing clickable elements from batch-1.json:', this.batchAnalysis.clickable_elements.length);
            
            // Map batch-1.json clickable_elements to interactive elements
            const interactiveElements = this.batchAnalysis.clickable_elements.map(element => {
                return {
                    selector: `[data-element-id="${element.element_id}"]`,
                    id: element.element_id,
                    expectedFake: element.expected_label === 'fake',
                    label: element.element_name,
                    reasoning: element.reasoning || 'No reasoning provided',
                    elementText: element.element_text || ''
                };
            });
            
            console.log('Mapped interactive elements:', interactiveElements.map(el => ({
                id: el.id,
                label: el.label,
                expectedFake: el.expectedFake
            })));
            
            interactiveElements.forEach(elementDef => {
                const element = document.querySelector(elementDef.selector);
                if (element) {
                    element.classList.add('interactive-element');
                    element.setAttribute('data-element-id', elementDef.id);
                    element.setAttribute('data-label', elementDef.label);
                    element.setAttribute('data-reasoning', elementDef.reasoning);
                    element.setAttribute('title', `Click to label "${elementDef.label}" as fake or real`);
                    
                    // Log text matching for debugging
                    const elementText = element.textContent?.trim().toLowerCase() || '';
                    const batchText = elementDef.elementText.toLowerCase();
                    console.log(`Element ${elementDef.id} text matching:`, {
                        displayed_sample: elementText.substring(0, 50),
                        batch_sample: batchText.substring(0, 50),
                        lengths: { displayed: elementText.length, batch: batchText.length },
                        exact_match: elementText === batchText,
                        contains_batch: elementText.includes(batchText),
                        batch_contains: batchText.includes(elementText)
                    });
                    
                    // Initialize in labeledElements
                    this.labeledElements.set(elementDef.id, {
                        labeled: false,
                        labeledAsFake: false,
                        expectedFake: elementDef.expectedFake,
                        label: elementDef.label,
                        reasoning: elementDef.reasoning,
                        element: element,
                        elementText: elementDef.elementText
                    });
                    
                    element.addEventListener('click', (e) => {
                        e.preventDefault();
                        this.handleElementClick(elementDef.id);
                    });
                    
                    console.log(`✅ Successfully made element ${elementDef.id} interactive`);
                } else {
                    console.warn(`❌ Element not found for selector: ${elementDef.selector} (element_id: ${elementDef.id})`);
                }
            });
            
            console.log(`Interactive labeling initialized with ${this.labeledElements.size} elements`);
        }, 100);
    }

    mapElementIdToSelector(elementId) {
        // Simply use element_id directly as data attribute selector
        return `[data-element-id="${elementId}"]`;
    }

    handleElementClick(elementId) {
        const elementData = this.labeledElements.get(elementId);
        if (!elementData) return;
        
        // Toggle between fake/real/unlabeled
        if (!elementData.labeled) {
            // First click - mark as fake
            elementData.labeled = true;
            elementData.labeledAsFake = true;
            elementData.element.classList.add('labeled-fake');
            elementData.element.classList.remove('labeled-real');
        } else if (elementData.labeledAsFake) {
            // Second click - mark as real
            elementData.labeledAsFake = false;
            elementData.element.classList.add('labeled-real');
            elementData.element.classList.remove('labeled-fake');
        } else {
            // Third click - remove label
            elementData.labeled = false;
            elementData.element.classList.remove('labeled-real', 'labeled-fake');
        }
        
        this.updateInstructions();
    }

    showInstructions() {
        // Remove existing instructions
        const existing = document.querySelector('.labeling-instructions');
        if (existing) existing.remove();
        
        // Get educational notes from batch analysis
        const educationalNotes = this.batchAnalysis?.educational_focus || 
                               'Click on different parts of the article to label them as fake or real. This data comes from pre-analyzed batch training data.';
        
        const analysisSourceText = this.analysisSource === 'batch-json' ? 
            '📊 Batch Analysis Data' : '❌ No Analysis Data';
        
        const instructions = document.createElement('div');
        instructions.className = 'labeling-instructions';
        instructions.innerHTML = `
            <div class="instructions-header">
                <span>🎯</span>
                <span>Interactive Analysis</span>
            </div>
            <div class="instructions-content">
                ${educationalNotes}
            </div>
            <div class="labeling-legend">
                <div class="legend-item">
                    <div class="legend-color legend-fake"></div>
                    <span>Fake/Suspicious</span>
                </div>
                <div class="legend-item">
                    <div class="legend-color legend-real"></div>
                    <span>Real/Legitimate</span>
                </div>
            </div>
            <div class="progress-info">
                Article ${this.currentArticleIndex + 1} of ${this.totalArticles}
                <br>${analysisSourceText}
            </div>
            <button class="submit-analysis-btn" onclick="window.interactiveLabeling?.submitAnalysis()">
                Submit Analysis
            </button>
        `;
        
        document.body.appendChild(instructions);
        
        // Store global reference
        window.interactiveLabeling = this;
    }

    updateInstructions() {
        const progressInfo = document.querySelector('.progress-info');
        if (progressInfo) {
            const labeledCount = Array.from(this.labeledElements.values()).filter(el => el.labeled).length;
            const totalCount = this.labeledElements.size;
            progressInfo.innerHTML = `
                Article ${this.currentArticleIndex + 1} of ${this.totalArticles}<br>
                Labeled: ${labeledCount}/${totalCount} elements
            `;
        }
    }

    submitAnalysis() {
        const results = this.calculateResults();
        this.showFeedback(results);
        
        // Store results for final summary
        this.articleResults.push({
            articleIndex: this.currentArticleIndex,
            articleData: this.currentPageConfig.articleData,
            results: results,
            timestamp: new Date().toISOString()
        });
        
        // Check if this is the last article
        if (this.currentArticleIndex >= this.totalArticles - 1) {
            setTimeout(() => {
                this.showFinalSummary();
            }, 3000);
        }
    }

    calculateResults() {
        const results = {
            totalElements: this.labeledElements.size,
            correctLabels: 0,
            incorrectLabels: 0,
            unlabeledElements: 0,
            details: []
        };
        
        this.labeledElements.forEach((elementData, elementId) => {
            const isCorrect = elementData.labeled ? 
                (elementData.labeledAsFake === elementData.expectedFake) : 
                false;
            
            if (!elementData.labeled) {
                results.unlabeledElements++;
                results.details.push({
                    label: elementData.label,
                    status: 'unlabeled',
                    expected: elementData.expectedFake ? 'fake' : 'real',
                    actual: 'not labeled'
                });
            } else if (isCorrect) {
                results.correctLabels++;
                results.details.push({
                    label: elementData.label,
                    status: 'correct',
                    expected: elementData.expectedFake ? 'fake' : 'real',
                    actual: elementData.labeledAsFake ? 'fake' : 'real'
                });
                // Visual feedback
                elementData.element.classList.add('correct');
            } else {
                results.incorrectLabels++;
                results.details.push({
                    label: elementData.label,
                    status: 'incorrect',
                    expected: elementData.expectedFake ? 'fake' : 'real',
                    actual: elementData.labeledAsFake ? 'fake' : 'real'
                });
                // Visual feedback
                elementData.element.classList.add('incorrect');
            }
        });
        
        results.percentage = Math.round((results.correctLabels / results.totalElements) * 100);
        
        return results;
    }

    showFeedback(results) {
        const modal = document.createElement('div');
        modal.className = 'feedback-modal';
        
        const scoreClass = results.percentage >= 75 ? 'good' : results.percentage >= 50 ? 'medium' : 'poor';
        const emoji = results.percentage >= 75 ? '🎉' : results.percentage >= 50 ? '👍' : '🤔';
        
        modal.innerHTML = `
            <div class="feedback-content">
                <h2>${emoji} Analysis Complete!</h2>
                <div class="feedback-score ${scoreClass}">${results.percentage}%</div>
                <p>You correctly identified ${results.correctLabels} out of ${results.totalElements} elements.</p>
                
                <div class="feedback-details">
                    <h3>Detailed Results:</h3>
                    ${results.details.map(detail => {
                        const elementData = this.labeledElements.get(
                            Object.keys(Object.fromEntries(this.labeledElements))
                                .find(key => this.labeledElements.get(key).label === detail.label)
                        );
                        const reasoning = elementData?.reasoning || 'No reasoning available';
                        return `
                            <div class="feedback-item ${detail.status}">
                                <strong>${detail.label}:</strong> 
                                ${detail.status === 'unlabeled' ? 'Not labeled' : 
                                  detail.status === 'correct' ? '✅ Correct' : '❌ Incorrect'}
                                ${detail.status !== 'unlabeled' ? `<br><small>Expected: ${detail.expected}, You labeled: ${detail.actual}</small>` : ''}
                                <br><small><em>Insight: ${reasoning}</em></small>
                            </div>
                        `;
                    }).join('')}
                </div>
                
                <div style="margin-top: 20px; padding: 15px; background: #f0f9ff; border-radius: 8px; border: 1px solid #0ea5e9;">
                    <p style="margin: 0; font-size: 14px; color: #0369a1;">
                        <strong>📊 Analysis Source:</strong> This feedback is based on pre-analyzed batch training data from batch-1.json<br>
                        <small>Note: Text matching handles case differences between displayed and batch data</small>
                    </p>
                </div>
                
                <button onclick="this.closest('.feedback-modal').remove(); window.interactiveLabeling?.nextArticle()" 
                        style="background: #10b981; color: white; border: none; padding: 12px 24px; border-radius: 8px; cursor: pointer; font-weight: 600;">
                    ${this.currentArticleIndex >= this.totalArticles - 1 ? 'View Final Summary' : 'Next Article'}
                </button>
            </div>
        `;
        
        document.body.appendChild(modal);
    }

    nextArticle() {
        // Remove instructions
        const instructions = document.querySelector('.labeling-instructions');
        if (instructions) instructions.remove();
        
        // Clear interactive elements
        document.querySelectorAll('.interactive-element').forEach(el => {
            el.classList.remove('interactive-element', 'labeled-fake', 'labeled-real', 'correct', 'incorrect');
            el.removeAttribute('data-element-id');
            el.removeAttribute('data-label');
            el.removeAttribute('title');
        });
        
        // Navigate to next article
        if (window.challenge1Page && this.currentArticleIndex < this.totalArticles - 1) {
            window.challenge1Page.nextArticle();
        }
    }

    showFinalSummary() {
        const modal = document.createElement('div');
        modal.className = 'feedback-modal';
        
        const overallScore = Math.round(
            this.articleResults.reduce((sum, result) => sum + result.results.percentage, 0) / 
            this.articleResults.length
        );
        
        const overallClass = overallScore >= 75 ? 'good' : overallScore >= 50 ? 'medium' : 'poor';
        const batchAnalysisCount = this.articleResults.filter(result => 
            result.articleData.clickable_elements || 
            (result.articleData.batchAnalysis && Object.keys(result.articleData.batchAnalysis).length > 0)
        ).length;
        
        modal.innerHTML = `
            <div class="final-summary">
                <div class="summary-header">
                    <h1>🎯 Level 1 Complete!</h1>
                    <div class="overall-score ${overallClass}">${overallScore}%</div>
                    <p>Overall Performance Across All Articles</p>
                    <p style="font-size: 14px; color: #6b7280;">
                        ${batchAnalysisCount} articles used batch analysis data
                    </p>
                </div>
                
                <div class="article-summaries">
                    ${this.articleResults.map((articleResult, index) => `
                        <div class="article-summary">
                            <div class="article-title">Article ${index + 1}: ${articleResult.articleData.title?.substring(0, 60) || articleResult.articleData.article_metadata?.title?.substring(0, 60) || 'Unknown Article'}...</div>
                            <div class="article-score ${articleResult.results.percentage >= 75 ? 'good' : articleResult.results.percentage >= 50 ? 'medium' : 'poor'}">
                                ${articleResult.results.percentage}%
                            </div>
                            <div class="article-explanation">
                                <strong>Article Type:</strong> ${articleResult.articleData.is_real ? 'Real News' : articleResult.articleData.article_metadata?.actual_label || 'Unknown'}<br>
                                <strong>Analysis Source:</strong> ${articleResult.articleData.clickable_elements || (articleResult.articleData.batchAnalysis && Object.keys(articleResult.articleData.batchAnalysis).length > 0) ? 'Batch Analysis' : 'No Analysis'}<br>
                                <strong>Key Indicators:</strong> ${this.getKeyIndicators(articleResult.articleData)}
                            </div>
                        </div>
                    `).join('')}
                </div>
                
                <div style="text-align: center; margin-top: 30px;">
                    <button onclick="this.closest('.feedback-modal').remove(); window.challenge1EventHandlers?.completeLevelOne?.()" 
                            style="background: #10b981; color: white; border: none; padding: 15px 30px; border-radius: 8px; cursor: pointer; font-weight: 600; font-size: 16px;">
                        Continue to Next Level
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Mark challenge as completed
        localStorage.setItem('cyberquest_challenge1_completed', 'true');
        localStorage.setItem('cyberquest_challenge1_interactive_results', JSON.stringify(this.articleResults));
    }

    getKeyIndicators(articleData) {
        if (!articleData) return "No article data available";
        
        // Check for new nested structure with numeric IDs
        if (typeof articleData === 'object') {
            const articleIds = Object.keys(articleData).filter(key => !isNaN(key));
            if (articleIds.length > 0) {
                const articleId = articleIds[this.currentArticleIndex] || articleIds[0];
                const articleContent = articleData[articleId];
                
                if (articleContent?.clickable_elements && Array.isArray(articleContent.clickable_elements)) {
                    const indicators = articleContent.clickable_elements
                        .map(element => element.reasoning)
                        .filter(reasoning => reasoning && reasoning.length > 0)
                        .slice(0, 2);
                    return indicators.join(', ') || 'Batch analysis available';
                }
            }
        }
        
        // Fallback: Use clickable_elements directly from old structure
        if (articleData.clickable_elements && Array.isArray(articleData.clickable_elements)) {
            const indicators = articleData.clickable_elements
                .map(element => element.reasoning)
                .filter(reasoning => reasoning && reasoning.length > 0)
                .slice(0, 2);
            return indicators.join(', ') || 'Batch analysis available';
        }
        
        return 'No clickable elements available';
    }

    cleanup() {
        // Remove instructions
        const instructions = document.querySelector('.labeling-instructions');
        if (instructions) instructions.remove();
        
        // Clear interactive elements
        document.querySelectorAll('.interactive-element').forEach(el => {
            el.classList.remove('interactive-element', 'labeled-fake', 'labeled-real', 'correct', 'incorrect');
            el.removeAttribute('data-element-id');
            el.removeAttribute('data-label');
            el.removeAttribute('title');
        });
        
        // Remove styles
        const styles = document.getElementById('interactive-labeling-styles');
        if (styles) styles.remove();
        
        this.isActive = false;
        this.labeledElements.clear();
        window.interactiveLabeling = null;
    }
}
