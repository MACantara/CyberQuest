export class SharingBox {
    static create(isFakeNews) {
        const boxStyle = isFakeNews 
            ? 'background: #f3f4f6; color: #374151; padding: 20px; margin: 20px 0; border-radius: 8px; text-align: center; border: 2px solid #d97706;'
            : 'background: #f3f4f6; color: #374151; padding: 20px; margin: 20px 0; border-radius: 8px; text-align: center; border: 1px solid #e5e7eb;';
        
        const headingText = isFakeNews ? 'Share This Important Story' : 'Share This Story';
        const descriptionText = isFakeNews 
            ? 'Help spread awareness by sharing this story with your network.'
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
                <h3 style="color: #374151; margin-bottom: 15px;">Reader Comments:</h3>
                <blockquote style="margin: 15px 0; padding: 10px; border-left: 3px solid #10b981; background: white;">
                    "This really opened my eyes. Thanks for the information!" - NewsReader2024
                </blockquote>
                <blockquote style="margin: 15px 0; padding: 10px; border-left: 3px solid #10b981; background: white;">
                    "Finally, someone reporting on this topic!" - TruthSeeker99
                </blockquote>
                <blockquote style="margin: 15px 0; padding: 10px; border-left: 3px solid #10b981; background: white;">
                    "Shared this with everyone I know." - ConcernedCitizen
                </blockquote>
            </div>
        `;
    }
}
