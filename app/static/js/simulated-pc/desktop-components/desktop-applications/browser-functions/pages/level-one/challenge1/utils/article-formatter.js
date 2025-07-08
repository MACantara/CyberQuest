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

    static formatArticleText(text, isFakeNews) {
        // Split text into paragraphs
        const paragraphs = text.split('\n\n').filter(p => p.trim().length > 0);
        
        return paragraphs.map(paragraph => {
            let formattedParagraph = paragraph.trim();
            
            if (isFakeNews) {
                // Add sensational formatting to fake news
                formattedParagraph = formattedParagraph
                    .replace(/\b(BREAKING|EXCLUSIVE|URGENT|SHOCKING|SCANDAL|LEAKED)\b/gi, '<strong style="color: #dc2626;">$1</strong>')
                    .replace(/\b(millions?|billions?|thousands?)\b/gi, '<strong style="color: #ea580c;">$1</strong>');
            }
            
            return `<p style="margin: 0 0 16px 0;">${formattedParagraph}</p>`;
        }).join('');
    }
}
