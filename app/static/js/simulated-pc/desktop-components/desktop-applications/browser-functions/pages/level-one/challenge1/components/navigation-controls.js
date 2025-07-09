export class NavigationControls {
    static create(currentIndex, totalArticles) {
        return `
            <div style="background: rgba(255,255,255,0.1); padding: 10px 20px; border-radius: 8px;">
                <div style="color: #10b981; font-size: 14px; margin-bottom: 5px;">News Articles</div>
                <div style="display: flex; align-items: center; gap: 10px;">
                    <button onclick="window.challenge1Page?.previousArticle()" 
                            style="background: #374151; color: white; border: none; padding: 8px 12px; border-radius: 4px; cursor: pointer; ${currentIndex === 0 ? 'opacity: 0.5;' : ''}"
                            ${currentIndex === 0 ? 'disabled' : ''}>
                        ← Previous
                    </button>
                    
                    <span style="color: #e5e7eb; font-size: 14px; min-width: 80px; text-align: center;">
                        ${currentIndex + 1} of ${totalArticles}
                    </span>
                    
                    <button onclick="window.challenge1Page?.nextArticle()" 
                            style="background: #374151; color: white; border: none; padding: 8px 12px; border-radius: 4px; cursor: pointer; ${currentIndex === totalArticles - 1 ? 'opacity: 0.5;' : ''}"
                            ${currentIndex === totalArticles - 1 ? 'disabled' : ''}>
                        Next →
                    </button>
                </div>
                
                <!-- Progress Bar -->
                <div style="background: rgba(255,255,255,0.2); height: 4px; border-radius: 2px; margin-top: 8px; overflow: hidden;">
                    <div style="background: #10b981; height: 100%; width: ${((currentIndex + 1) / totalArticles) * 100}%; transition: width 0.3s ease;"></div>
                </div>
            </div>
        `;
    }
}
