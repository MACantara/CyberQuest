/**
 * Pagination Interactions
 * Handles user interactions like jump to page and per page changes
 */

export class PaginationInteractions {
    constructor(options = {}) {
        this.options = {
            pageParam: 'page',
            perPageParam: 'per_page',
            showJumpToPage: true,
            jumpToPageThreshold: 10,
            ...options
        };
    }

    /**
     * Check if jump to page should be shown
     */
    shouldShowJumpToPage(pagination, position) {
        return this.options.showJumpToPage && 
               pagination.pages > this.options.jumpToPageThreshold && 
               position === 'bottom';
    }

    /**
     * Generate jump to page section
     */
    generateJumpToPage(pagination, position) {
        if (!this.shouldShowJumpToPage(pagination, position)) {
            return '';
        }

        return `
            <div class="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
                <div class="flex items-center justify-center space-x-2">
                    <label for="jumpToPage-${position}" class="text-sm text-gray-500 dark:text-gray-400">Jump to page:</label>
                    <input type="number" id="jumpToPage-${position}" min="1" max="${pagination.pages}"
                        placeholder="${pagination.page}"
                        class="w-20 text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400 text-center">
                    <button id="jumpButton-${position}"
                        class="px-3 py-1 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors duration-200">
                        Go
                    </button>
                </div>
            </div>
        `;
    }

    /**
     * Initialize pagination functionality
     */
    initialize(container) {
        this.initializeDropdowns(container);
        this.initializeJumpToPage(container);
        this.initializePerPageSelector(container);
    }

    /**
     * Initialize dropdown functionality
     */
    initializeDropdowns(container) {
        if (window.dropdownManager) {
            const dropdowns = container.querySelectorAll('[id^="page-dropdown-"]');
            dropdowns.forEach(button => {
                const dropdownId = button.getAttribute('data-dropdown-toggle');
                const dropdown = document.getElementById(dropdownId);
                if (dropdown) {
                    window.dropdownManager.register(dropdownId, button, dropdown);
                }
            });
        }
    }

    /**
     * Initialize jump to page functionality
     */
    initializeJumpToPage(container) {
        const jumpInputs = container.querySelectorAll('[id^="jumpToPage-"]');
        const jumpButtons = container.querySelectorAll('[id^="jumpButton-"]');

        jumpInputs.forEach((input, index) => {
            const button = jumpButtons[index];
            if (button) {
                button.addEventListener('click', () => {
                    this.handleJumpToPage(input);
                });

                input.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter') {
                        this.handleJumpToPage(input);
                    }
                });

                // Input validation
                input.addEventListener('input', function() {
                    const value = parseInt(this.value);
                    const max = parseInt(this.getAttribute('max'));
                    const min = parseInt(this.getAttribute('min'));
                    
                    if (value > max) this.value = max;
                    else if (value < min) this.value = min;
                });
            }
        });
    }

    /**
     * Initialize per page selector
     */
    initializePerPageSelector(container) {
        const selector = container.querySelector('#perPageFilter');
        if (selector) {
            selector.addEventListener('change', (e) => {
                this.handlePerPageChange(e.target.value);
            });
        }
    }

    /**
     * Handle jump to page action
     */
    handleJumpToPage(input) {
        const pageNumber = parseInt(input.value);
        const maxPages = parseInt(input.getAttribute('max'));

        if (isNaN(pageNumber) || pageNumber < 1) {
            this.showAlert('Please enter a valid page number.', 'error');
            input.focus();
            return;
        }

        if (pageNumber > maxPages) {
            this.showAlert(`Page number cannot exceed ${maxPages}.`, 'error');
            input.value = maxPages;
            input.focus();
            return;
        }

        const currentUrl = new URL(window.location);
        currentUrl.searchParams.set(this.options.pageParam, pageNumber);
        
        this.showLoadingState(`Jumping to page ${pageNumber}...`);
        window.location.href = currentUrl.toString();
    }

    /**
     * Handle per page change
     */
    handlePerPageChange(perPage) {
        const currentUrl = new URL(window.location);
        currentUrl.searchParams.set(this.options.perPageParam, perPage);
        currentUrl.searchParams.delete(this.options.pageParam); // Reset to page 1
        
        this.showLoadingState(`Changing to ${perPage} items per page...`);
        window.location.href = currentUrl.toString();
    }

    /**
     * Show alert message
     */
    showAlert(message, type = 'info') {
        if (window.showPaginationAlert) {
            window.showPaginationAlert(message, type);
        } else if (window.showAlert) {
            window.showAlert(message, type);
        } else {
            alert(message);
        }
    }

    /**
     * Show loading state
     */
    showLoadingState(message = 'Loading...') {
        if (window.showPaginationLoadingState) {
            window.showPaginationLoadingState(message);
        }
    }
}
