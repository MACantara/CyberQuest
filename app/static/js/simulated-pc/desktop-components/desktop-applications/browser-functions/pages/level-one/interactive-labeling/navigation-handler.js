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
        this.navigateToLevelsOverview();
    }

    navigateToLevelsOverview() {
        console.log('Navigating to levels overview...');
        
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
        
        // Navigate to levels overview instead of specific level
        if (this.labelingSystem.desktop?.windowManager) {
            try {
                const browserApp = this.labelingSystem.desktop.windowManager.applications.get('browser');
                if (browserApp) {
                    browserApp.navigation.navigateToUrl('/levels');
                }
            } catch (error) {
                console.error('Failed to navigate to levels overview:', error);
                window.location.href = '/levels';
            }
        } else {
            window.location.href = '/levels';
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
