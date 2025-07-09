export class ArticleService {
    static async fetchMixedNewsArticles() {
        try {
            console.log('Fetching news articles with AI analysis...');
            
            const response = await fetch('/api/news/mixed-articles');
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();
            
            if (data.success && data.articles) {
                console.log('News articles loaded:', {
                    total: data.articles.length,
                    aiAnalysisAvailable: data.summary.ai_analysis_available || 0,
                    firstArticle: {
                        title: data.articles[0].title.substring(0, 50) + '...',
                        source: data.articles[0].source,
                        author: data.articles[0].author,
                        hasAiAnalysis: !!data.articles[0].ai_analysis
                    }
                });
                
                return data.articles;
            } else {
                throw new Error(data.error || 'Failed to get news articles');
            }
        } catch (error) {
            console.error('Error fetching news articles:', error);
            throw error;
        }
    }

    static async fetchNewsStats() {
        try {
            const response = await fetch('/api/news/stats');
            const data = await response.json();
            
            if (data.success) {
                return data.stats;
            } else {
                console.error('Failed to fetch news stats:', data.error);
                throw new Error(data.error || 'Failed to fetch stats');
            }
        } catch (error) {
            console.error('Error fetching news stats:', error);
            throw error;
        }
    }

    static async fetchAnalysisStatus() {
        try {
            const response = await fetch('/api/news/analysis-status');
            const data = await response.json();
            
            if (data.success) {
                return data;
            } else {
                console.error('Failed to fetch analysis status:', data.error);
                throw new Error(data.error || 'Failed to fetch analysis status');
            }
        } catch (error) {
            console.error('Error fetching analysis status:', error);
            throw error;
        }
    }

    static createErrorContent() {
        return `
            <div style="font-family: Arial, sans-serif; background: #ffffff; min-height: 100vh; display: flex; align-items: center; justify-content: center;">
                <div style="text-align: center; max-width: 500px; padding: 20px;">
                    <h1 style="color: #dc2626; font-size: 24px; margin-bottom: 16px;">⚠️ Error Loading Articles</h1>
                    <p style="color: #6b7280; margin-bottom: 20px;">
                        Unable to load news articles. This could be due to missing data files or a server error.
                    </p>
                    <button onclick="location.reload()" style="background: #10b981; color: white; padding: 12px 24px; border: none; border-radius: 6px; cursor: pointer;">
                        Try Again
                    </button>
                </div>
            </div>
        `;
    }
}