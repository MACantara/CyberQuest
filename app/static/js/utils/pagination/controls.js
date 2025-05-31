/**
 * Pagination Controls
 * Handles previous/next buttons and page number generation
 */

export class PaginationControls {
    constructor(core) {
        this.core = core;
    }

    /**
     * Generate pagination controls wrapper
     */
    generateControls(pagination, buildUrl, position) {
        if (pagination.pages <= 1) {
            return this.generateSinglePageIndicator();
        }

        return `
            <div class="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-4">
                ${this.generatePerPageSelector(pagination)}
                <div class="flex items-center">
                    ${this.generatePreviousButton(pagination, buildUrl)}
                    ${this.generatePageNumbers(pagination, buildUrl, position)}
                    ${this.generateNextButton(pagination, buildUrl)}
                </div>
            </div>
        `;
    }

    /**
     * Generate items per page selector
     */
    generatePerPageSelector(pagination) {
        const currentPerPage = pagination.per_page || this.core.options.defaultPerPage;
        
        return `
            <div class="flex items-center">
                <label for="perPageFilter" class="text-sm text-gray-700 dark:text-gray-300 mr-3">Show:</label>
                <div class="relative">
                    <select id="perPageFilter"
                        class="text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400 pl-3 pr-8 py-2 appearance-none cursor-pointer transition-colors duration-200 hover:bg-gray-50 dark:hover:bg-gray-600">
                        <option value="25" ${currentPerPage == 25 ? 'selected' : ''}>25</option>
                        <option value="50" ${currentPerPage == 50 ? 'selected' : ''}>50</option>
                        <option value="100" ${currentPerPage == 100 ? 'selected' : ''}>100</option>
                    </select>
                    <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <i class="bi bi-chevron-down text-gray-400 dark:text-gray-500 text-sm"></i>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Generate previous button
     */
    generatePreviousButton(pagination, buildUrl) {
        const buttonClass = "inline-flex items-center px-3 py-2 text-sm font-medium";
        const icon = '<i class="bi bi-chevron-left mr-1"></i>';
        
        if (pagination.has_prev) {
            return `
                <a href="${buildUrl(pagination.prev_num)}" 
                   class="${buttonClass} text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-l-lg hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-700 dark:hover:text-gray-300 transition-colors duration-200">
                    ${icon}Previous
                </a>
            `;
        } else {
            return `
                <span class="${buttonClass} text-gray-300 dark:text-gray-600 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-l-lg cursor-not-allowed">
                    ${icon}Previous
                </span>
            `;
        }
    }

    /**
     * Generate next button
     */
    generateNextButton(pagination, buildUrl) {
        const buttonClass = "inline-flex items-center px-3 py-2 text-sm font-medium";
        const icon = '<i class="bi bi-chevron-right ml-1"></i>';
        
        if (pagination.has_next) {
            return `
                <a href="${buildUrl(pagination.next_num)}" 
                   class="${buttonClass} text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-r-lg hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-700 dark:hover:text-gray-300 transition-colors duration-200">
                    Next${icon}
                </a>
            `;
        } else {
            return `
                <span class="${buttonClass} text-gray-300 dark:text-gray-600 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-r-lg cursor-not-allowed">
                    Next${icon}
                </span>
            `;
        }
    }

    /**
     * Generate page numbers
     */
    generatePageNumbers(pagination, buildUrl, position) {
        if (pagination.pages <= this.core.options.maxPagesVisible) {
            return this.generateAllPageNumbers(pagination, buildUrl);
        } else {
            return this.generateTruncatedPageNumbers(pagination, buildUrl, position);
        }
    }

    /**
     * Generate all page numbers (when total pages <= maxVisible)
     */
    generateAllPageNumbers(pagination, buildUrl) {
        let html = '<div class="hidden sm:flex">';
        
        for (let page = 1; page <= pagination.pages; page++) {
            html += this.generatePageButton(page, pagination.page, buildUrl);
        }
        
        html += '</div>';
        return html;
    }

    /**
     * Generate truncated page numbers with dropdown
     */
    generateTruncatedPageNumbers(pagination, buildUrl, position) {
        let html = '<div class="hidden sm:flex">';
        
        // First 2 pages
        for (let page = 1; page <= 2; page++) {
            html += this.generatePageButton(page, pagination.page, buildUrl);
        }

        // Middle section
        if (pagination.page <= 2 || pagination.page >= pagination.pages - 1) {
            html += this.generateMiddleDropdown(pagination, buildUrl, position);
        } else {
            html += this.generatePageButton(pagination.page, pagination.page, buildUrl);
        }

        // Last 2 pages
        for (let page = pagination.pages - 1; page <= pagination.pages; page++) {
            html += this.generatePageButton(page, pagination.page, buildUrl);
        }
        
        html += '</div>';
        return html;
    }

    /**
     * Generate individual page button
     */
    generatePageButton(page, currentPage, buildUrl) {
        const isActive = page === currentPage;
        
        if (isActive) {
            return `
                <span class="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 border-t border-b border-blue-300 dark:border-blue-600 z-10">
                    ${page}
                </span>
            `;
        } else {
            return `
                <a href="${buildUrl(page)}" 
                   class="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 border-t border-b border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-700 dark:hover:text-gray-300 transition-colors duration-200">
                    ${page}
                </a>
            `;
        }
    }

    /**
     * Generate middle dropdown for page selection
     */
    generateMiddleDropdown(pagination, buildUrl, position) {
        const dropdownId = `page-menu-${position}`;
        const buttonId = `page-dropdown-${position}`;
        
        let dropdownItems = '';
        for (let page = 3; page < pagination.pages - 1; page++) {
            dropdownItems += `
                <a href="${buildUrl(page)}"
                   class="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white">
                    Page ${page}
                </a>
            `;
        }

        return `
            <div class="relative inline-block">
                <button type="button" id="${buttonId}" 
                        class="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 border-t border-b border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-700 dark:hover:text-gray-300 transition-colors duration-200 cursor-pointer"
                        data-dropdown-toggle="${dropdownId}">
                    <i class="bi bi-three-dots"></i>
                </button>
                <div id="${dropdownId}" class="hidden absolute top-full left-1/2 transform -translate-x-1/2 mt-1 w-32 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50 max-h-48 overflow-y-auto">
                    <div class="py-1">
                        ${dropdownItems}
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Generate single page indicator
     */
    generateSinglePageIndicator() {
        return `
            <div class="text-sm text-gray-500 dark:text-gray-400">
                Page 1 of 1
            </div>
        `;
    }
}
