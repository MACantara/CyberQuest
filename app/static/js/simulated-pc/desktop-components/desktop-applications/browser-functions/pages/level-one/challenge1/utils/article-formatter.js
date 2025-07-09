export class ArticleFormatter {
    static formatDate(dateString) {
        try {
            const date = new Date(dateString);
            if (isNaN(date.getTime())) {
                return dateString; // Return original if parsing fails
            }
            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        } catch (error) {
            return dateString; // Return original on error
        }
    }

    static truncateText(text, maxLength) {
        if (text.length <= maxLength) {
            return text;
        }
        
        // Truncate at word boundary
        const truncated = text.substring(0, maxLength);
        const lastSpace = truncated.lastIndexOf(' ');
        return truncated.substring(0, lastSpace) + '...';
    }

    static toTitleCase(str) {
        return str.replace(/\w\S*/g, (txt) => {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        });
    }

    static formatArticleText(text, isFakeNews) {
        // Split text into paragraphs
        const paragraphs = text.split('\n\n').filter(p => p.trim().length > 0);
        
        return paragraphs.map(paragraph => {
            let formattedParagraph = paragraph.trim();
            
            // Capitalize the first letter
            if (formattedParagraph.length > 0) {
                formattedParagraph = formattedParagraph.charAt(0).toUpperCase() + formattedParagraph.slice(1);
            }
            
            return `<p style="margin: 0 0 16px 0; text-align: justify;">${formattedParagraph}</p>`;
        }).join('');
    }
}
