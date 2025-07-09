export class AnalysisSection {
    static create(articleData = null) {
        const aiAnalysis = articleData?.ai_analysis?.article_analysis;
        const hasAiAnalysis = aiAnalysis && Object.keys(aiAnalysis).length > 0;
        
        const educationalFocus = aiAnalysis?.educational_focus || 
                               'Use the CyberQuest Analysis Tools to evaluate this article\'s credibility.';
        
        const redFlags = aiAnalysis?.primary_red_flags || [];
        const credibilityFactors = aiAnalysis?.credibility_factors || [];
        const verificationTips = aiAnalysis?.verification_tips || [];
        
        return `
            <div style="background: #f9fafb; border: 2px solid #e5e7eb; border-radius: 8px; padding: 20px; margin: 30px 0;">
                <h3 style="color: #374151; margin-bottom: 15px; display: flex; align-items: center; gap: 8px;">
                    <span style="background: #10b981; color: white; padding: 4px 8px; border-radius: 4px; font-size: 12px;">
                        ${hasAiAnalysis ? 'AI-POWERED' : 'TRAINING'}
                    </span>
                    Analyze This Article
                </h3>
                
                <div style="font-size: 14px; color: #6b7280; margin-bottom: 15px;">
                    ${educationalFocus}
                </div>
                
                ${redFlags.length > 0 ? `
                    <div style="background: #fef2f2; border: 1px solid #fecaca; border-radius: 6px; padding: 15px; margin-bottom: 15px;">
                        <h4 style="color: #dc2626; margin: 0 0 10px 0; font-size: 14px; display: flex; align-items: center; gap: 6px;">
                            🚩 Potential Red Flags:
                        </h4>
                        <ul style="color: #7f1d1d; font-size: 13px; margin: 0; padding-left: 20px; line-height: 1.5;">
                            ${redFlags.map(flag => `<li>${flag}</li>`).join('')}
                        </ul>
                    </div>
                ` : ''}
                
                ${credibilityFactors.length > 0 ? `
                    <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 6px; padding: 15px; margin-bottom: 15px;">
                        <h4 style="color: #166534; margin: 0 0 10px 0; font-size: 14px; display: flex; align-items: center; gap: 6px;">
                            ✅ Credibility Indicators:
                        </h4>
                        <ul style="color: #166534; font-size: 13px; margin: 0; padding-left: 20px; line-height: 1.5;">
                            ${credibilityFactors.map(factor => `<li>${factor}</li>`).join('')}
                        </ul>
                    </div>
                ` : ''}
                
                <!-- Critical Analysis Questions -->
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
                
                ${verificationTips.length > 0 ? `
                    <div style="background: #f0f9ff; border: 1px solid #bae6fd; border-radius: 6px; padding: 15px; margin-top: 15px;">
                        <h4 style="color: #0369a1; margin: 0 0 10px 0; font-size: 14px; display: flex; align-items: center; gap: 6px;">
                            🔍 Verification Tips:
                        </h4>
                        <ul style="color: #0369a1; font-size: 13px; margin: 0; padding-left: 20px; line-height: 1.5;">
                            ${verificationTips.map(tip => `<li>${tip}</li>`).join('')}
                        </ul>
                    </div>
                ` : ''}
            </div>
        `;
    }
}
