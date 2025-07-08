export class ArticleService {
    static async fetchMixedNewsArticles() {
        try {
            console.log('Fetching mixed news articles (15 total: 50% fake, 50% real)...');
            
            const response = await fetch('/levels/get-mixed-news-articles');
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();
            
            if (data.success && data.articles) {
                console.log('Mixed news articles loaded:', {
                    total: data.articles.length,
                    fakeCount: data.articles.filter(a => !a.is_real).length,
                    realCount: data.articles.filter(a => a.is_real).length,
                    firstArticle: {
                        title: data.articles[0].title.substring(0, 50) + '...',
                        isReal: data.articles[0].is_real,
                        source: data.articles[0].source,
                        author: data.articles[0].author
                    }
                });
                
                return data.articles;
            } else {
                throw new Error(data.error || 'Failed to get mixed news articles');
            }
        } catch (error) {
            console.error('Error fetching mixed news articles:', error);
            throw error;
        }
    }

    static createErrorContent() {
        return `
            <div style="font-family: Arial, sans-serif; background: #ffffff; min-height: 100vh; display: flex; align-items: center; justify-content: center;">
                <div style="text-align: center; max-width: 500px; padding: 20px;">
                    <h1 style="color: #dc2626; font-size: 24px; margin-bottom: 16px;">⚠️ Error Loading Articles</h1>
                    <p style="color: #6b7280; margin-bottom: 20px;">
                        Unable to load news articles. This could be due to missing CSV data files or a server error.
                    </p>
                    <button onclick="location.reload()" style="background: #10b981; color: white; padding: 12px 24px; border: none; border-radius: 6px; cursor: pointer;">
                        Try Again
                    </button>
                </div>
            </div>
        `;
    }
}
