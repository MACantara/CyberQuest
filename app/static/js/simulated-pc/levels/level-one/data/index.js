/**
 * Level 1 Data
 * Misinformation detection scenario data
 */

export const Level1Data = {
    // Fake news articles for detection
    fakeArticles: [
        {
            id: 'fake_001',
            title: 'Local Election Rigged by Voting Machine Hack',
            source: 'UnverifiedNews.com',
            content: 'Claims about election interference...',
            indicators: ['unverified source', 'sensational headline', 'no evidence']
        }
    ],
    
    // Real news articles for comparison
    realArticles: [
        {
            id: 'real_001',
            title: 'Election Security Measures Updated',
            source: 'Reuters',
            content: 'Official election security update...',
            indicators: ['verified source', 'factual reporting', 'official quotes']
        }
    ],
    
    // Source verification database
    sourceDatabase: {
        'reuters.com': { credibility: 'high', bias: 'center' },
        'UnverifiedNews.com': { credibility: 'low', bias: 'unknown' }
    }
};

export default Level1Data;
