/**
 * Core Pagination Functionality
 * Handles URL building and basic pagination logic
 */

export class PaginationCore {
    constructor(options = {}) {
        this.options = {
            pageParam: 'page',
            perPageParam: 'per_page',
            defaultPerPage: 25,
            maxPagesVisible: 5,
            ...options
        };
    }

    /**
     * Build pagination URL with parameters
     */
    buildUrl(baseUrl, page, extraParams = {}, perPage = null) {
        const url = new URL(baseUrl, window.location.origin);
        
        // Add extra parameters
        Object.entries(extraParams).forEach(([key, value]) => {
            if (value) url.searchParams.set(key, value);
        });
        
        // Add pagination parameters
        if (page) url.searchParams.set(this.options.pageParam, page);
        if (perPage) url.searchParams.set(this.options.perPageParam, perPage);
        else if (extraParams[this.options.perPageParam]) {
            url.searchParams.set(this.options.perPageParam, extraParams[this.options.perPageParam]);
        }
        
        return url.toString();
    }

    /**
     * Generate results info HTML
     */
    generateResultsInfo(pagination) {
        const start = pagination.per_page * (pagination.page - 1) + 1;
        const end = pagination.page < pagination.pages ? 
            pagination.per_page * pagination.page : 
            pagination.total;

        return `
            <div class="text-sm text-gray-500 dark:text-gray-400">
                Showing
                <span class="font-medium text-gray-900 dark:text-white">${start}</span>
                to
                <span class="font-medium text-gray-900 dark:text-white">${end}</span>
                of
                <span class="font-medium text-gray-900 dark:text-white">${pagination.total}</span>
                entries
            </div>
        `;
    }

    /**
     * Generate main pagination container
     */
    generateContainer(pagination, content, position = 'main') {
        if (!pagination || pagination.total === 0) {
            return '';
        }

        return `
            <div class="bg-gray-50 dark:bg-gray-700 px-6 py-${position === 'top' ? '4' : '3'} border ${position === 'top' ? 'border-gray-200 dark:border-gray-600' : 'border-t border-gray-200 dark:border-gray-600'} ${position === 'top' ? 'rounded-t-lg' : 'rounded-b-lg'}">
                <div class="flex flex-col sm:flex-row items-center justify-between space-y-3 sm:space-y-0">
                    ${this.generateResultsInfo(pagination)}
                    ${content}
                </div>
            </div>
        `;
    }
}
