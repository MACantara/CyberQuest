export class ArticleImage {
    static create(article, isFakeNews) {
        const imageUrl = article.main_img_url || '/static/images/level-one/news-placeholder.jpg';
        
        // Get image-related analysis if available
        const sourceAnalysis = article?.ai_analysis?.clickable_elements?.find(
            el => el.element_id === 'source_analysis'
        );
        
        const hasAnalysis = sourceAnalysis ? 'data-analysis-available="true"' : '';
        const expectedLabel = sourceAnalysis ? `data-expected-label="${sourceAnalysis.expected_label}"` : '';
        
        return `
            <div style="width: 100%; height: 300px; margin-bottom: 20px; border-radius: 8px; overflow: hidden; position: relative;" 
                 ${hasAnalysis} ${expectedLabel} data-element-type="image">
                <img src="${imageUrl}" 
                     alt="News article image" 
                     style="width: 100%; height: 100%; object-fit: cover;"
                     onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                <div style="display: none; width: 100%; height: 100%; background: #f3f4f6; align-items: center; justify-content: center; color: #6b7280; font-size: 18px;">
                    📸 News Image
                </div>
            </div>
        `;
    }
}
