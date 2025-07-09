export class AnalysisSection {
    static create() {
        return `
            <div style="background: #f9fafb; border: 2px solid #e5e7eb; border-radius: 8px; padding: 20px; margin: 30px 0;">
                <h3 style="color: #374151; margin-bottom: 15px; display: flex; align-items: center; gap: 8px;">
                    <span style="background: #10b981; color: white; padding: 4px 8px; border-radius: 4px; font-size: 12px;">TRAINING</span>
                    Analyze This Article
                </h3>
                <div style="font-size: 14px; color: #6b7280; margin-bottom: 15px;">
                    Use the CyberQuest Analysis Tools (top-right panel) to evaluate this article's credibility.
                    Look for signs of bias, sensationalism, lack of sources, and unusual language patterns.
                </div>
                
                <!-- Quick Analysis Questions -->
                <div style="background: white; padding: 15px; border-radius: 6px; border-left: 4px solid #10b981;">
                    <h4 style="color: #374151; margin: 0 0 10px 0; font-size: 14px;">Critical Analysis Questions:</h4>
                    <ul style="color: #6b7280; font-size: 13px; margin: 0; padding-left: 20px; line-height: 1.5;">
                        <li>Is the headline factual or emotionally charged?</li>
                        <li>Are there clear author credentials and publication details?</li>
                        <li>Are claims supported by verifiable sources and evidence?</li>
                        <li>Does the article present multiple perspectives?</li>
                        <li>Are there any logical inconsistencies in the story?</li>
                    </ul>
                </div>
            </div>
        `;
    }
}
