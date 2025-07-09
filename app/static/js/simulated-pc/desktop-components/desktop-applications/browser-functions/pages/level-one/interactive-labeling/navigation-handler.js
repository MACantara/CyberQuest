export class NavigationHandler {
    constructor(labelingSystem) {
        this.labelingSystem = labelingSystem;
    }

    async nextArticle() {
        this.labelingSystem.modalManager.removeModal();
        await this.labelingSystem.nextArticleHandler();
    }

    continueToNextLevel() {
        this.labelingSystem.modalManager.removeModal();
        this.labelingSystem.cleanup();
        this.navigateToLevel(2);
    }

    navigateToLevel(levelId) {
        console.log(`Navigating to Level ${levelId}...`);
        
        const completionData = {
            levelId: 1,
            completed: true,
            score: localStorage.getItem('cyberquest_level1_score'),
            timestamp: new Date().toISOString(),
            results: this.labelingSystem.articleResults
        };
        
        localStorage.setItem('cyberquest_level_1_completion', JSON.stringify(completionData));
        localStorage.setItem('cyberquest_level_1_completed', 'true');
        
        console.log('Level 1 completion stored in localStorage:', {
            completion_flag: localStorage.getItem('cyberquest_level_1_completed'),
            completion_data: localStorage.getItem('cyberquest_level_1_completion')
        });
        
        if (window.location.pathname.includes('/levels/1/start')) {
            window.location.href = `/levels/${levelId}`;
        } else {
            if (window.history && window.history.pushState) {
                window.history.pushState({}, '', `/levels/${levelId}`);
                window.location.reload();
            } else {
                window.location.href = `/levels/${levelId}`;
            }
        }
    }

    markLevelCompleted() {
        const overallScore = this.labelingSystem.analysisCalculator.getOverallPerformance()?.averageScore || 0;
        
        localStorage.setItem('cyberquest_challenge1_completed', 'true');
        localStorage.setItem('cyberquest_challenge1_interactive_results', JSON.stringify(this.labelingSystem.articleResults));
        localStorage.setItem('cyberquest_level1_score', overallScore.toString());
        
        console.log('Challenge 1 marked as completed with score:', overallScore);
    }

    canProceedToNextLevel() {
        const overallPerformance = this.labelingSystem.analysisCalculator.getOverallPerformance();
        return overallPerformance && overallPerformance.averageScore >= 60; // 60% minimum to proceed
    }

    getNavigationState() {
        return {
            currentArticle: this.labelingSystem.currentArticleIndex,
            totalArticles: this.labelingSystem.totalArticles,
            hasNextArticle: this.labelingSystem.currentArticleIndex < this.labelingSystem.totalArticles - 1,
            isLastArticle: this.labelingSystem.currentArticleIndex >= this.labelingSystem.totalArticles - 1,
            canProceed: this.canProceedToNextLevel()
        };
    }
}
