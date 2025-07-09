export class ModalManager {
    constructor(labelingSystem) {
        this.labelingSystem = labelingSystem;
    }

    showFeedback(results) {
        const modal = document.createElement('div');
        modal.className = 'feedback-modal fixed inset-0 bg-black/75 flex items-center justify-center z-50';
        
        const scoreClass = results.percentage >= 75 ? 'good' : results.percentage >= 50 ? 'medium' : 'poor';
        const emoji = results.percentage >= 75 ? '🎉' : results.percentage >= 50 ? '👍' : '🤔';
        
        modal.innerHTML = `
            <div class="feedback-content bg-gray-800 text-white rounded-lg p-6 max-w-md mx-4 border border-gray-600">
                <h2>${emoji} Analysis Complete!</h2>
                <div class="feedback-score ${scoreClass} text-4xl font-bold my-4">${results.percentage}%</div>
                <p>You correctly identified ${results.correctLabels} out of ${results.totalElements} elements.</p>
                
                <div class="feedback-details">
                    <h3>Detailed Results:</h3>
                    ${results.details.map(detail => {
                        const elementData = this.labelingSystem.labeledElements.get(
                            Object.keys(Object.fromEntries(this.labelingSystem.labeledElements))
                                .find(key => this.labelingSystem.labeledElements.get(key).label === detail.label)
                        );
                        const reasoning = elementData?.reasoning || 'No reasoning available';
                        return `
                            <div class="feedback-item ${detail.status} p-3 m-2 rounded border-l-4">
                                <strong>${detail.label}:</strong> 
                                ${detail.status === 'unlabeled' ? 'Not labeled' : 
                                  detail.status === 'correct' ? '✅ Correct' : '❌ Incorrect'}
                                ${detail.status !== 'unlabeled' ? `<br><small>Expected: ${detail.expected}, You labeled: ${detail.actual}</small>` : ''}
                                <br><small><em>Insight: ${reasoning}</em></small>
                            </div>
                        `;
                    }).join('')}
                </div>
                
                <div class="analysis-source-info bg-blue-900/30 border border-blue-600 rounded p-3 mt-4">
                    <p>
                        <strong>📊 Analysis Source:</strong> This feedback is based on pre-analyzed batch training data from batch-1.json<br>
                        <small>Note: Text matching handles case differences between displayed and batch data</small>
                    </p>
                </div>
                
                <button onclick="window.interactiveLabeling?.nextArticle()" class="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition-colors mt-4">
                    ${this.labelingSystem.currentArticleIndex >= this.labelingSystem.totalArticles - 1 ? 'View Final Summary' : 'Next Article'}
                </button>
            </div>
        `;
        
        document.body.appendChild(modal);
    }

    showFinalSummary() {
        const modal = document.createElement('div');
        modal.className = 'feedback-modal fixed inset-0 bg-black/75 flex items-center justify-center z-50';
        
        const overallScore = Math.round(
            this.labelingSystem.articleResults.reduce((sum, result) => sum + result.results.percentage, 0) / 
            this.labelingSystem.articleResults.length
        );
        
        const overallClass = overallScore >= 75 ? 'good' : overallScore >= 50 ? 'medium' : 'poor';
        const batchAnalysisCount = this.labelingSystem.articleResults.filter(result => 
            result.articleData.clickable_elements || 
            (result.articleData.batchAnalysis && Object.keys(result.articleData.batchAnalysis).length > 0)
        ).length;
        
        modal.innerHTML = `
            <div class="final-summary bg-gray-800 text-white rounded-lg p-8 max-w-4xl mx-4 max-h-90vh overflow-y-auto border border-gray-600">
                <div class="summary-header text-center mb-8">
                    <h1 class="text-3xl font-bold mb-4">🎯 Level 1 Complete!</h1>
                    <div class="overall-score ${overallClass} text-6xl font-bold mb-4">${overallScore}%</div>
                    <p class="text-lg">Overall Performance Across All Articles</p>
                    <p class="text-sm text-gray-400 mt-2">
                        ${batchAnalysisCount} articles used batch analysis data
                    </p>
                </div>
                
                <div class="article-summaries">
                    ${this.labelingSystem.articleResults.map((articleResult, index) => `
                        <div class="article-summary bg-gray-700 border border-gray-600 rounded-lg p-4 mb-4">
                            <div class="article-title font-semibold text-white mb-2">Article ${index + 1}: ${articleResult.articleData.title?.substring(0, 60) || articleResult.articleData.article_metadata?.title?.substring(0, 60) || 'Unknown Article'}...</div>
                            <div class="article-score ${articleResult.results.percentage >= 75 ? 'good' : articleResult.results.percentage >= 50 ? 'medium' : 'poor'} text-2xl font-bold mb-2">
                                ${articleResult.results.percentage}%
                            </div>
                            <div class="article-explanation text-gray-300 text-sm">
                                <strong>Article Type:</strong> ${articleResult.articleData.is_real ? 'Real News' : articleResult.articleData.article_metadata?.actual_label || 'Unknown'}<br>
                                <strong>Analysis Source:</strong> ${articleResult.articleData.clickable_elements || (articleResult.articleData.batchAnalysis && Object.keys(articleResult.articleData.batchAnalysis).length > 0) ? 'Batch Analysis' : 'No Analysis'}<br>
                                <strong>Key Indicators:</strong> ${this.getKeyIndicators(articleResult.articleData)}
                            </div>
                        </div>
                    `).join('')}
                </div>
                
                <div class="text-center mt-8">
                    <button onclick="window.interactiveLabeling?.continueToNextLevel()" class="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition-colors font-semibold text-lg">
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
        const modal = document.querySelector('.feedback-modal');
        if (modal) modal.remove();
    }
}
