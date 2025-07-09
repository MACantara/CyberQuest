export class NavigationControls {
    static create(currentIndex, totalArticles) {
        return `
            <div style="background: rgba(255,255,255,0.1); padding: 15px 20px; border-radius: 8px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                    <div style="color: #10b981; font-size: 14px; font-weight: 500;">Training Progress</div>
                    <span style="color: #e5e7eb; font-size: 13px;">
                        Article ${currentIndex + 1} of ${totalArticles}
                    </span>
                </div>
                
                <!-- Progress Bar -->
                <div style="background: rgba(255,255,255,0.2); height: 6px; border-radius: 3px; overflow: hidden;">
                    <div style="
                        background: linear-gradient(90deg, #10b981 0%, #34d399 100%); 
                        height: 100%; 
                        width: ${((currentIndex + 1) / totalArticles) * 100}%; 
                        transition: width 0.3s ease;
                        border-radius: 3px;
                    "></div>
                </div>
                
                <div style="color: #9ca3af; font-size: 12px; margin-top: 6px; text-align: center;">
                    ${Math.round(((currentIndex + 1) / totalArticles) * 100)}% Complete
                </div>
            </div>
        `;
    }
}
