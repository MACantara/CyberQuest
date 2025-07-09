export class ModalManager {
    constructor(labelingSystem) {
        this.labelingSystem = labelingSystem;
    }

    showFeedback(results) {
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-black/75 flex items-center justify-center z-50 feedback-modal';
        
        const scoreClass = results.percentage >= 75 ? 'text-green-400' : results.percentage >= 50 ? 'text-yellow-400' : 'text-red-400';
        const iconClass = results.percentage >= 75 ? 'bi-trophy-fill' : results.percentage >= 50 ? 'bi-hand-thumbs-up-fill' : 'bi-question-circle-fill';
        
        modal.innerHTML = `
            <div class="bg-gray-800 text-white rounded p-6 max-w-md mx-4 border border-gray-600">
                <div class="text-center">
                    <i class="bi ${iconClass} text-4xl ${scoreClass} mb-4"></i>
                    <h2 class="text-xl font-bold mb-4">Analysis Complete!</h2>
                    <div class="text-4xl font-bold my-4 ${scoreClass}">${results.percentage}%</div>
                    <p class="text-gray-300 mb-4">You correctly identified ${results.correctLabels} out of ${results.totalElements} elements.</p>
                    
                    <!-- Quick Summary -->
                    <div class="bg-gray-700 rounded p-4 mb-4">
                        <div class="grid grid-cols-3 gap-4 text-sm">
                            <div class="text-center">
                                <div class="text-green-400 font-bold flex items-center justify-center gap-1">
                                    <i class="bi bi-check-circle-fill"></i>
                                    ${results.correctLabels}
                                </div>
                                <div class="text-gray-400">Correct</div>
                            </div>
                            <div class="text-center">
                                <div class="text-red-400 font-bold flex items-center justify-center gap-1">
                                    <i class="bi bi-x-circle-fill"></i>
                                    ${results.incorrectLabels}
                                </div>
                                <div class="text-gray-400">Incorrect</div>
                            </div>
                            <div class="text-center">
                                <div class="text-yellow-400 font-bold flex items-center justify-center gap-1">
                                    <i class="bi bi-dash-circle-fill"></i>
                                    ${results.unlabeledElements}
                                </div>
                                <div class="text-gray-400">Unlabeled</div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Performance Message -->
                    <div class="text-sm mb-4">
                        ${results.percentage >= 75 ? 
                            '<span class="text-green-400 flex items-center justify-center gap-1"><i class="bi bi-check-circle"></i>Excellent analysis! You have strong detection skills.</span>' :
                            results.percentage >= 50 ?
                            '<span class="text-yellow-400 flex items-center justify-center gap-1"><i class="bi bi-hand-thumbs-up"></i>Good work! Review the final summary for improvement tips.</span>' :
                            '<span class="text-red-400 flex items-center justify-center gap-1"><i class="bi bi-book"></i>Keep learning! The final summary will help you improve.</span>'
                        }
                    </div>
                    
                    <button onclick="window.interactiveLabeling?.nextArticle()" class="w-full bg-green-600 text-white px-6 py-3 rounded hover:bg-green-700 transition-colors font-semibold cursor-pointer flex items-center justify-center gap-2">
                        ${this.labelingSystem.currentArticleIndex >= this.labelingSystem.totalArticles - 1 ? 
                            '<i class="bi bi-bar-chart-fill"></i>View Detailed Summary' : 
                            '<i class="bi bi-arrow-right-circle-fill"></i>Continue to Next Article'}
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
    }

    showFinalSummary() {
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-black/75 flex items-center justify-center z-50';
        
        const overallScore = Math.round(
            this.labelingSystem.articleResults.reduce((sum, result) => sum + result.results.percentage, 0) / 
            this.labelingSystem.articleResults.length
        );
        
        const overallClass = overallScore >= 75 ? 'text-green-400' : overallScore >= 50 ? 'text-yellow-400' : 'text-red-400';
        const batchAnalysisCount = this.labelingSystem.articleResults.filter(result => 
            result.articleData.clickable_elements || 
            (result.articleData.batchAnalysis && Object.keys(result.articleData.batchAnalysis).length > 0)
        ).length;
        
        modal.innerHTML = `
            <div class="bg-gray-800 text-white rounded p-8 max-w-4xl mx-4 max-h-150 overflow-y-auto border border-gray-600">
                <div class="text-center mb-8">
                    <div class="flex items-center justify-center gap-2 mb-4">
                        <i class="bi bi-bullseye text-3xl text-blue-400"></i>
                        <h1 class="text-3xl font-bold">Level 1 Complete!</h1>
                    </div>
                    <div class="text-6xl font-bold mb-4 ${overallClass}">${overallScore}%</div>
                    <p class="text-lg">Overall Performance Across All Articles</p>
                    <p class="text-sm text-gray-400 mt-2 flex items-center justify-center gap-1">
                        <i class="bi bi-cpu-fill text-blue-400"></i>
                        ${batchAnalysisCount} articles analyzed with AI-powered detection training
                    </p>
                </div>
                
                <!-- Detailed Article Analysis -->
                <div class="space-y-4 mb-8">
                    <h2 class="text-xl font-semibold text-white mb-4 flex items-center">
                        <i class="bi bi-clipboard-data text-blue-400 mr-2"></i>
                        Detailed Article Analysis
                    </h2>
                    
                    ${this.labelingSystem.articleResults.map((articleResult, index) => {
                        const articleScoreClass = articleResult.results.percentage >= 75 ? 'text-green-400' : 
                                                 articleResult.results.percentage >= 50 ? 'text-yellow-400' : 'text-red-400';
                        return `
                            <div class="bg-gray-700 border border-gray-600 rounded p-4">
                                <div class="flex justify-between items-start mb-3">
                                    <div class="flex-1">
                                        <div class="font-semibold text-white mb-1 flex items-center gap-2">
                                            <i class="bi bi-file-text text-gray-400"></i>
                                            Article ${index + 1}: ${articleResult.articleData.title?.substring(0, 60) || articleResult.articleData.article_metadata?.title?.substring(0, 60) || 'Unknown Article'}...
                                        </div>
                                        <div class="text-gray-400 text-sm flex items-center gap-2">
                                            <i class="bi bi-tag-fill text-gray-500"></i>
                                            <strong>Type:</strong> ${articleResult.articleData.is_real ? 'Real News' : articleResult.articleData.article_metadata?.actual_label || 'Unknown'} • 
                                            <i class="bi bi-globe text-gray-500"></i>
                                            <strong>Source:</strong> ${articleResult.articleData.article_metadata?.source || 'Unknown'}
                                        </div>
                                    </div>
                                    <div class="text-2xl font-bold ${articleScoreClass} ml-4">
                                        ${articleResult.results.percentage}%
                                    </div>
                                </div>
                                
                                <!-- Element Breakdown -->
                                <div class="grid grid-cols-3 gap-4 text-sm mb-3">
                                    <div class="bg-green-900/30 border border-green-600/30 rounded p-2 text-center">
                                        <div class="text-green-400 font-bold flex items-center justify-center gap-1">
                                            <i class="bi bi-check-circle-fill"></i>
                                            ${articleResult.results.correctLabels}
                                        </div>
                                        <div class="text-green-300 text-xs">Correct</div>
                                    </div>
                                    <div class="bg-red-900/30 border border-red-600/30 rounded p-2 text-center">
                                        <div class="text-red-400 font-bold flex items-center justify-center gap-1">
                                            <i class="bi bi-x-circle-fill"></i>
                                            ${articleResult.results.incorrectLabels}
                                        </div>
                                        <div class="text-red-300 text-xs">Incorrect</div>
                                    </div>
                                    <div class="bg-yellow-900/30 border border-yellow-600/30 rounded p-2 text-center">
                                        <div class="text-yellow-400 font-bold flex items-center justify-center gap-1">
                                            <i class="bi bi-dash-circle-fill"></i>
                                            ${articleResult.results.unlabeledElements}
                                        </div>
                                        <div class="text-yellow-300 text-xs">Unlabeled</div>
                                    </div>
                                </div>
                                
                                <!-- Key Learning Points -->
                                <div class="bg-gray-800 rounded p-3">
                                    <div class="text-xs text-gray-400 mb-2 flex items-start gap-1">
                                        <i class="bi bi-key-fill text-yellow-400 mt-0.5"></i>
                                        <div>
                                            <strong>Key Indicators:</strong> ${this.getKeyIndicators(articleResult.articleData)}
                                        </div>
                                    </div>
                                    ${articleResult.results.percentage < 75 ? `
                                        <div class="text-xs text-blue-300 flex items-start gap-1">
                                            <i class="bi bi-lightbulb-fill text-blue-400 mt-0.5"></i>
                                            <div>
                                                <strong>Learning Tip:</strong> ${this.generateLearningTip(articleResult.results)}
                                            </div>
                                        </div>
                                    ` : ''}
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>
                
                <!-- Performance Summary -->
                <div class="bg-gray-700 border border-gray-600 rounded p-6 mb-6">
                    <h3 class="text-lg font-semibold text-white mb-4 flex items-center">
                        <i class="bi bi-trophy text-yellow-400 mr-2"></i>
                        Performance Summary
                    </h3>
                    <div class="grid md:grid-cols-3 gap-4">
                        <div class="text-center">
                            <div class="text-3xl font-bold ${overallClass} mb-2 flex items-center justify-center gap-2">
                                <i class="bi bi-percent"></i>
                                ${overallScore}
                            </div>
                            <div class="text-gray-400 text-sm">Overall Score</div>
                        </div>
                        <div class="text-center">
                            <div class="text-3xl font-bold text-blue-400 mb-2 flex items-center justify-center gap-2">
                                <i class="bi bi-file-earmark-text-fill"></i>
                                ${this.labelingSystem.articleResults.length}
                            </div>
                            <div class="text-gray-400 text-sm">Articles Analyzed</div>
                        </div>
                        <div class="text-center">
                            <div class="text-3xl font-bold text-purple-400 mb-2 flex items-center justify-center gap-2">
                                <i class="bi bi-collection-fill"></i>
                                ${this.getTotalElementsAnalyzed()}
                            </div>
                            <div class="text-gray-400 text-sm">Elements Reviewed</div>
                        </div>
                    </div>
                </div>
                
                <div class="text-center">
                    <button onclick="window.interactiveLabeling?.continueToNextLevel()" class="bg-green-600 text-white px-8 py-3 rounded hover:bg-green-700 transition-colors font-semibold text-lg cursor-pointer flex items-center justify-center gap-2 mx-auto">
                        <i class="bi bi-rocket-takeoff-fill"></i>
                        Continue to Level 2
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
    }

    generateLearningTip(results) {
        if (results.incorrectLabels > results.correctLabels) {
            return "Focus on identifying suspicious patterns like emotional language, urgent calls to action, and unverified sources.";
        } else if (results.unlabeledElements > 2) {
            return "Try to analyze all elements - practice helps build your detection skills.";
        } else {
            return "Good effort! Pay attention to source credibility and factual consistency.";
        }
    }

    getTotalElementsAnalyzed() {
        return this.labelingSystem.articleResults.reduce((total, result) => total + result.results.totalElements, 0);
    }

    getKeyIndicators(articleData) {
        if (!articleData) return "No article data available";
        
        if (articleData.batchAnalysis && articleData.batchAnalysis.clickable_elements) {
            const indicators = articleData.batchAnalysis.clickable_elements
                .map(element => element.reasoning)
                .filter(reasoning => reasoning && reasoning.length > 0)
                .slice(0, 2);
            return indicators.join(', ') || 'Batch analysis available';
        }
        
        if (typeof articleData === 'object') {
            const articleIds = Object.keys(articleData).filter(key => !isNaN(key));
            if (articleIds.length > 0) {
                const articleId = articleIds[this.labelingSystem.currentArticleIndex] || articleIds[0];
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
        
        if (articleData.clickable_elements && Array.isArray(articleData.clickable_elements)) {
            const indicators = articleData.clickable_elements
                .map(element => element.reasoning)
                .filter(reasoning => reasoning && reasoning.length > 0)
                .slice(0, 2);
            return indicators.join(', ') || 'Batch analysis available';
        }
        
        return 'No clickable elements available';
    }

    removeModal() {
        // Remove any feedback modal by class name
        const modal = document.querySelector('.feedback-modal');
        if (modal) {
            modal.remove();
            return;
        }
        
        // Fallback: remove by combined selector
        const modalAlt = document.querySelector('.fixed.inset-0.bg-black');
        if (modalAlt) {
            modalAlt.remove();
        }
    }
}
