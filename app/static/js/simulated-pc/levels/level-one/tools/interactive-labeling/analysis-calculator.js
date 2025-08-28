export class AnalysisCalculator {
    constructor(labelingSystem) {
        this.labelingSystem = labelingSystem;
    }

    calculateResults() {
        const results = {
            totalElements: this.labelingSystem.labeledElements.size,
            correctLabels: 0,
            incorrectLabels: 0,
            unlabeledElements: 0,
            details: []
        };
        
        this.labelingSystem.labeledElements.forEach((elementData, elementId) => {
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
                elementData.element.classList.add('correct');
            } else {
                results.incorrectLabels++;
                results.details.push({
                    label: elementData.label,
                    status: 'incorrect',
                    expected: elementData.expectedFake ? 'fake' : 'real',
                    actual: elementData.labeledAsFake ? 'fake' : 'real'
                });
                elementData.element.classList.add('incorrect');
            }
        });
        
        results.percentage = Math.round((results.correctLabels / results.totalElements) * 100);
        
        return results;
    }

    validateElementLabeling(elementId, labeledAsFake) {
        const elementData = this.labelingSystem.labeledElements.get(elementId);
        if (!elementData) return false;
        
        return labeledAsFake === elementData.expectedFake;
    }

    getCompletionStats() {
        const labeledCount = Array.from(this.labelingSystem.labeledElements.values()).filter(el => el.labeled).length;
        const totalCount = this.labelingSystem.labeledElements.size;
        const completionPercentage = totalCount > 0 ? Math.round((labeledCount / totalCount) * 100) : 0;
        
        return {
            labeled: labeledCount,
            total: totalCount,
            remaining: totalCount - labeledCount,
            percentage: completionPercentage,
            isComplete: labeledCount === totalCount
        };
    }

    getOverallPerformance() {
        if (this.labelingSystem.articleResults.length === 0) return null;
        
        const totalScore = this.labelingSystem.articleResults.reduce((sum, result) => sum + result.results.percentage, 0);
        const averageScore = Math.round(totalScore / this.labelingSystem.articleResults.length);
        
        return {
            averageScore,
            totalArticles: this.labelingSystem.articleResults.length,
            scoreDistribution: this.getScoreDistribution(),
            performanceLevel: this.getPerformanceLevel(averageScore)
        };
    }

    getScoreDistribution() {
        const distribution = { excellent: 0, good: 0, fair: 0, poor: 0 };
        
        this.labelingSystem.articleResults.forEach(result => {
            if (result.results.percentage >= 90) distribution.excellent++;
            else if (result.results.percentage >= 75) distribution.good++;
            else if (result.results.percentage >= 60) distribution.fair++;
            else distribution.poor++;
        });
        
        return distribution;
    }

    getPerformanceLevel(score) {
        if (score >= 90) return 'excellent';
        if (score >= 75) return 'good';
        if (score >= 60) return 'fair';
        return 'needs_improvement';
    }
}
