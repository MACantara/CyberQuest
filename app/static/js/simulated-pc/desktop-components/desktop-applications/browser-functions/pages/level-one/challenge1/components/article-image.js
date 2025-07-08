export class ArticleImage {
    static create(article, isFakeNews) {
        const imageUrl = article.main_img_url || '/static/images/level-one/news-placeholder.jpg';
        
        return `
            <div style="width: 100%; height: 300px; margin-bottom: 20px; border-radius: 8px; overflow: hidden; position: relative;">
                <img src="${imageUrl}" 
                     alt="News article image" 
                     style="width: 100%; height: 100%; object-fit: cover;"
                     onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                <div style="display: none; width: 100%; height: 100%; background: ${isFakeNews ? 'linear-gradient(135deg, #dc2626, #ea580c)' : '#f3f4f6'}; align-items: center; justify-content: center; color: ${isFakeNews ? 'white' : '#6b7280'}; font-size: 18px;">
                    ${isFakeNews ? '📸 SHOCKING EXCLUSIVE FOOTAGE' : '📸 News Image'}
                </div>
            </div>
        `;
    }
}
