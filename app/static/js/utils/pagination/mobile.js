/**
 * Mobile Pagination Components
 * Handles mobile-specific pagination display
 */

export class PaginationMobile {
    /**
     * Generate mobile page info
     */
    generateMobilePageInfo(pagination) {
        return `
            <div class="flex flex-col items-center">
                <span class="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg">
                    ${pagination.page}
                </span>
                <span class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    of ${pagination.pages}
                </span>
            </div>
        `;
    }

    /**
     * Generate mobile navigation (simplified)
     */
    generateMobileNavigation(pagination, buildUrl) {
        let html = '<div class="sm:hidden flex items-center justify-between w-full">';
        
        // Previous button
        if (pagination.has_prev) {
            html += `
                <a href="${buildUrl(pagination.prev_num)}" 
                   class="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
                    <i class="bi bi-chevron-left mr-1"></i>Prev
                </a>
            `;
        } else {
            html += '<div></div>'; // Spacer
        }
        
        // Page info
        html += this.generateMobilePageInfo(pagination);
        
        // Next button
        if (pagination.has_next) {
            html += `
                <a href="${buildUrl(pagination.next_num)}" 
                   class="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
                    Next<i class="bi bi-chevron-right ml-1"></i>
                </a>
            `;
        } else {
            html += '<div></div>'; // Spacer
        }
        
        html += '</div>';
        return html;
    }
}
