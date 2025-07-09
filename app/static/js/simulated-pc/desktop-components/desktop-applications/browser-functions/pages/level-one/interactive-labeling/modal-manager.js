export class ModalManager {
    constructor(labelingSystem) {
        this.labelingSystem = labelingSystem;
    }

    showFeedback(results) {
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-black/75 flex items-center justify-center z-50 feedback-modal';
        
        const scoreClass = results.percentage >= 75 ? 'text-green-400' : results.percentage >= 50 ? 'text-yellow-400' : 'text-red-400';
        const emoji = results.percentage >= 75 ? '🎉' : results.percentage >= 50 ? '👍' : '🤔';
        
        modal.innerHTML = `
            <div class="bg-gray-800 text-white rounded-lg p-6 max-w-md mx-4 border border-gray-600 max-h-96 overflow-y-auto">
                <h2 class="text-center text-xl font-bold mb-4">${emoji} Analysis Complete!</h2>
                <div class="text-center text-4xl font-bold my-4 ${scoreClass}">${results.percentage}%</div>
                <p class="text-center mb-4">You correctly identified ${results.correctLabels} out of ${results.totalElements} elements.</p>
                
                <div class="space-y-3">
                    <h3 class="font-semibold">Detailed Results:</h3>
                    ${results.details.map(detail => {
                        const elementData = this.labelingSystem.labeledElements.get(
                            Object.keys(Object.fromEntries(this.labelingSystem.labeledElements))
                                .find(key => this.labelingSystem.labeledElements.get(key).label === detail.label)
                        );
                        const reasoning = elementData?.reasoning || 'No reasoning available';
                        const itemClass = detail.status === 'correct' ? 'bg-green-900 border-l-4 border-green-500' : 
                                         detail.status === 'incorrect' ? 'bg-red-900 border-l-4 border-red-500' : 
                                         'bg-gray-700 border-l-4 border-gray-500';
                        return `
                            <div class="${itemClass} p-3 rounded">
                                <strong>${detail.label}:</strong> 
                                ${detail.status === 'unlabeled' ? 'Not labeled' : 
                                  detail.status === 'correct' ? '✅ Correct' : '❌ Incorrect'}
                                ${detail.status !== 'unlabeled' ? `<br><small class="text-gray-300">Expected: ${detail.expected}, You labeled: ${detail.actual}</small>` : ''}
                                <br><small class="text-gray-400"><em>Insight: ${reasoning}</em></small>
                            </div>
                        `;
                    }).join('')}
                </div>
                
                <div class="bg-blue-900/30 border border-blue-600 rounded p-3 mt-4">
                    <p class="text-sm">
                        <strong>📊 Analysis Source:</strong> This feedback is based on pre-analyzed batch training data from batch-1.json<br>
                        <small class="text-gray-300">Note: Text matching handles case differences between displayed and batch data</small>
                    </p>
                </div>
                
                <button onclick="window.interactiveLabeling?.nextArticle()" class="w-full bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition-colors mt-4 cursor-pointer">
                    ${this.labelingSystem.currentArticleIndex >= this.labelingSystem.totalArticles - 1 ? 'View Final Summary' : 'Next Article'}
                </button>
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
            <div class="bg-gray-800 text-white rounded-lg p-8 max-w-4xl mx-4 max-h-screen overflow-y-auto border border-gray-600">
                <div class="text-center mb-8">
                    <h1 class="text-3xl font-bold mb-4">🎯 Level 1 Complete!</h1>
                    <div class="text-6xl font-bold mb-4 ${overallClass}">${overallScore}%</div>
                    <p class="text-lg">Overall Performance Across All Articles</p>
                    <p class="text-sm text-gray-400 mt-2">
                        ${batchAnalysisCount} articles used batch analysis data
                    </p>
                </div>
                
                <div class="space-y-4">
                    ${this.labelingSystem.articleResults.map((articleResult, index) => {
                        const articleScoreClass = articleResult.results.percentage >= 75 ? 'text-green-400' : 
                                                 articleResult.results.percentage >= 50 ? 'text-yellow-400' : 'text-red-400';
                        return `
                            <div class="bg-gray-700 border border-gray-600 rounded-lg p-4">
                                <div class="font-semibold text-white mb-2">Article ${index + 1}: ${articleResult.articleData.title?.substring(0, 60) || articleResult.articleData.article_metadata?.title?.substring(0, 60) || 'Unknown Article'}...</div>
                                <div class="text-2xl font-bold mb-2 ${articleScoreClass}">
                                    ${articleResult.results.percentage}%
                                </div>
                                <div class="text-gray-300 text-sm">
                                    <strong>Article Type:</strong> ${articleResult.articleData.is_real ? 'Real News' : articleResult.articleData.article_metadata?.actual_label || 'Unknown'}<br>
                                    <strong>Analysis Source:</strong> ${articleResult.articleData.clickable_elements || (articleResult.articleData.batchAnalysis && Object.keys(articleResult.articleData.batchAnalysis).length > 0) ? 'Batch Analysis' : 'No Analysis'}<br>
                                    <strong>Key Indicators:</strong> ${this.getKeyIndicators(articleResult.articleData)}
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>
                
                <div class="text-center mt-8">
                    <button onclick="window.interactiveLabeling?.continueToNextLevel()" class="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition-colors font-semibold text-lg cursor-pointer">
                        Continue to Next Level
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
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
