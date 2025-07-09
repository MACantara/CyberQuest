export class SharingBox {
    static create(isFakeNews) {
        const boxStyle = isFakeNews 
            ? 'background: #dc2626; color: white; padding: 20px; margin: 20px 0; border-radius: 8px; text-align: center; border: 3px solid #f59e0b;'
            : 'background: #f3f4f6; color: #374151; padding: 20px; margin: 20px 0; border-radius: 8px; text-align: center; border: 1px solid #e5e7eb;';
        
        const headingText = isFakeNews ? 'URGENT: YOUR ACTION NEEDED' : 'Share This Story';
        const descriptionText = isFakeNews 
            ? 'Share this story immediately! Don\'t let the mainstream media hide the truth!'
            : 'Found this article interesting? Share it with your friends and family.';
        
        return `
            <div style="${boxStyle}">
                <h3 style="margin: 0 0 10px 0;">${headingText}</h3>
                <p style="margin: 0 0 15px 0;">${descriptionText}</p>
                <button style="background: #1d4ed8; color: white; padding: 12px 24px; border: none; border-radius: 4px; margin: 5px; font-weight: bold; cursor: pointer;">Share on Facebook</button>
                <button style="background: #1da1f2; color: white; padding: 12px 24px; border: none; border-radius: 4px; margin: 5px; font-weight: bold; cursor: pointer;">Tweet Now</button>
            </div>
        `;
    }

    static createFakeTestimonials() {
        return `
            <div style="background: #f9fafb; padding: 20px; margin: 20px 0; border-radius: 8px;">
                <h3 style="color: #374151; margin-bottom: 15px;">What People Are Saying:</h3>
                <blockquote style="margin: 15px 0; padding: 10px; border-left: 3px solid #10b981; background: white;">
                    "I KNEW something was fishy! Thanks for exposing the TRUTH!" - PatriotFreedom2024
                </blockquote>
                <blockquote style="margin: 15px 0; padding: 10px; border-left: 3px solid #10b981; background: white;">
                    "Finally, REAL journalism! The mainstream media would never report this!" - TruthSeeker99
                </blockquote>
                <blockquote style="margin: 15px 0; padding: 10px; border-left: 3px solid #10b981; background: white;">
                    "Shared this everywhere! Everyone needs to know!" - WakeUpAmerica
                </blockquote>
            </div>
        `;
    }
}
