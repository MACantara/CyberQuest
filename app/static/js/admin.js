import dropdownManager from './utils/dropdown-toggle.js';
import { paginationHelper } from './utils/pagination.js';

document.addEventListener('DOMContentLoaded', function() {
    // Initialize dropdown manager
    dropdownManager.init();
    
    // Initialize admin functionality
    initializeConfirmationDialogs();
    initializeTabSwitching();
    initializeAdminPagination();
    initializeAdminDropdowns();
});

/**
 * Initialize confirmation dialogs for destructive actions
 */
function initializeConfirmationDialogs() {
    // Handle cleanup logs confirmation
    const cleanupForm = document.querySelector('form[action*="cleanup"]');
    if (cleanupForm) {
        const submitButton = cleanupForm.querySelector('button[type="submit"]');
        if (submitButton) {
            submitButton.addEventListener('click', function(e) {
                if (!confirm('Are you sure you want to clean up old logs? This action cannot be undone.')) {
                    e.preventDefault();
                }
            });
        }
    }

    // Handle user status toggle confirmations
    const statusToggleForms = document.querySelectorAll('form[action*="toggle-status"]');
    statusToggleForms.forEach(form => {
        form.addEventListener('submit', function(e) {
            const button = form.querySelector('button[type="submit"]');
            const action = button.textContent.trim();
            if (!confirm(`Are you sure you want to ${action.toLowerCase()}?`)) {
                e.preventDefault();
            }
        });
    });

    // Handle admin privilege toggle confirmations
    const adminToggleForms = document.querySelectorAll('form[action*="toggle-admin"]');
    adminToggleForms.forEach(form => {
        form.addEventListener('submit', function(e) {
            const button = form.querySelector('button[type="submit"]');
            const action = button.textContent.trim();
            if (!confirm(`Are you sure you want to ${action.toLowerCase()}?`)) {
                e.preventDefault();
            }
        });
    });
}

/**
 * Initialize tab switching functionality for user detail pages
 */
function initializeTabSwitching() {
    // Add event listeners to tab buttons
    const tabButtons = document.querySelectorAll('.tab-button');
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const tabName = this.id.replace('tab-', '');
            switchTab(tabName);
        });
    });

    // Initialize first tab as active if tabs exist
    if (tabButtons.length > 0) {
        const firstTabId = tabButtons[0].id.replace('tab-', '');
        switchTab(firstTabId);
    }
}

/**
 * Switch between tabs in user detail view
 * @param {string} tabName - The name of the tab to switch to
 */
function switchTab(tabName) {
    // Hide all tab contents
    const tabContents = document.querySelectorAll('.tab-content');
    tabContents.forEach(content => {
        content.classList.add('hidden');
    });
    
    // Remove active styles from all tab buttons
    const tabButtons = document.querySelectorAll('.tab-button');
    tabButtons.forEach(button => {
        button.classList.remove('border-blue-500', 'text-blue-600', 'dark:text-blue-400');
        button.classList.add('border-transparent', 'text-gray-500', 'hover:text-gray-700', 'hover:border-gray-300', 'dark:text-gray-400', 'dark:hover:text-gray-300');
    });
    
    // Show selected tab content
    const selectedContent = document.getElementById('content-' + tabName);
    if (selectedContent) {
        selectedContent.classList.remove('hidden');
    }
    
    // Add active styles to selected tab button
    const selectedButton = document.getElementById('tab-' + tabName);
    if (selectedButton) {
        selectedButton.classList.add('border-blue-500', 'text-blue-600', 'dark:text-blue-400');
        selectedButton.classList.remove('border-transparent', 'text-gray-500', 'hover:text-gray-700', 'hover:border-gray-300', 'dark:text-gray-400', 'dark:hover:text-gray-300');
    }
}

/**
 * Initialize pagination functionality for admin pages
 */
function initializeAdminPagination() {
    // Initialize pagination containers
    const paginationContainers = document.querySelectorAll('.pagination-container');
    paginationContainers.forEach(container => {
        paginationHelper.initializePagination(container);
    });
    
    // Handle items per page change for admin user pages (legacy support)
    const perPageSelects = document.querySelectorAll('#perPage:not([id="perPageFilter"])');
    perPageSelects.forEach(select => {
        select.addEventListener('change', function() {
            changeAdminItemsPerPage(this.value);
        });
    });
}

/**
 * Change items per page for admin pages
 * @param {string} perPage - Number of items per page
 */
function changeAdminItemsPerPage(perPage) {
    const currentUrl = new URL(window.location);
    currentUrl.searchParams.set('per_page', perPage);
    currentUrl.searchParams.delete('page'); // Reset to first page when changing items per page
    
    showAdminLoadingState('Updating page size...');
    window.location.href = currentUrl.toString();
}

/**
 * Show loading state for admin operations
 * @param {string} message - Loading message to display
 */
function showAdminLoadingState(message = 'Loading...') {
    // Create or update loading overlay
    let loadingOverlay = document.getElementById('admin-loading-overlay');
    
    if (!loadingOverlay) {
        loadingOverlay = document.createElement('div');
        loadingOverlay.id = 'admin-loading-overlay';
        loadingOverlay.className = 'fixed inset-0 flex items-center justify-center z-50';
        loadingOverlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
        loadingOverlay.style.backdropFilter = 'blur(2px)';
        
        loadingOverlay.innerHTML = `
            <div class="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-sm mx-4 shadow-xl">
                <div class="flex items-center space-x-3">
                    <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                    <span class="text-gray-900 dark:text-white font-medium" id="admin-loading-message">${message}</span>
                </div>
            </div>
        `;
        
        document.body.appendChild(loadingOverlay);
    } else {
        document.getElementById('admin-loading-message').textContent = message;
        loadingOverlay.classList.remove('hidden');
    }
}

/**
 * Initialize admin-specific dropdown functionality
 */
function initializeAdminDropdowns() {
    // Register admin-specific dropdowns with the dropdown manager
    const adminDropdowns = document.querySelectorAll('[id*="admin"], [id*="user"]');
    adminDropdowns.forEach(dropdown => {
        const toggleButton = document.querySelector(`[data-dropdown-toggle="${dropdown.id}"]`);
        if (toggleButton) {
            // Register with dropdown manager
            dropdownManager.register(dropdown.id, toggleButton, dropdown);
        }
    });

    // Listen for dropdown events for admin-specific logic
    document.addEventListener('dropdown:open', function(event) {
        const { dropdownId } = event.detail;
        if (dropdownId && (dropdownId.includes('admin') || dropdownId.includes('user'))) {
            // Admin-specific logic when dropdown opens
            console.log('Admin dropdown opened:', dropdownId);
        }
    });
}

/**
 * Utility function to show admin alerts
 * @param {string} message - The message to display
 * @param {string} type - The type of alert (success, error, warning, info)
 */
function showAdminAlert(message, type = 'info') {
    const alertDiv = document.createElement('div');
    alertDiv.className = `fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg max-w-md admin-alert-${type}`;
    
    // Set colors based on type
    const colorClasses = {
        success: 'bg-green-100 border border-green-400 text-green-700 dark:bg-green-900/90 dark:border-green-600 dark:text-green-300',
        error: 'bg-red-100 border border-red-400 text-red-700 dark:bg-red-900/90 dark:border-red-600 dark:text-red-300',
        warning: 'bg-yellow-100 border border-yellow-400 text-yellow-700 dark:bg-yellow-900/90 dark:border-yellow-600 dark:text-yellow-300',
        info: 'bg-blue-100 border border-blue-400 text-blue-700 dark:bg-blue-900/90 dark:border-blue-600 dark:text-blue-300'
    };
    
    alertDiv.className += ` ${colorClasses[type] || colorClasses.info}`;
    
    // Add icon based on type
    const icons = {
        success: 'bi-check-circle-fill',
        error: 'bi-exclamation-triangle-fill',
        warning: 'bi-exclamation-triangle-fill',
        info: 'bi-info-circle-fill'
    };
    
    alertDiv.innerHTML = `
        <div class="flex items-center justify-between">
            <div class="flex items-center">
                <i class="bi ${icons[type] || icons.info} mr-2"></i>
                <span>${message}</span>
            </div>
            <button type="button" class="ml-4 text-lg font-bold hover:opacity-70 transition-opacity duration-200" onclick="this.parentElement.parentElement.remove()">
                ×
            </button>
        </div>
    `;
    
    document.body.appendChild(alertDiv);
    
    // Add entrance animation
    setTimeout(() => {
        alertDiv.classList.add('animate-fade-in-right');
    }, 10);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (alertDiv.parentNode) {
            alertDiv.style.opacity = '0';
            alertDiv.style.transform = 'translateX(100%)';
            setTimeout(() => {
                alertDiv.remove();
            }, 300);
        }
    }, 5000);
}

/**
 * Make admin AJAX requests with proper loading states
 * @param {string} url - The URL to request
 * @param {Object} options - Request options
 * @returns {Promise} - The fetch promise
 */
function adminAjaxRequest(url, options = {}) {
    showAdminLoadingState('Processing request...');
    
    return fetch(url, {
        headers: {
            'Content-Type': 'application/json',
            'X-Requested-With': 'XMLHttpRequest',
            ...options.headers
        },
        ...options
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .catch(error => {
        console.error('Admin request failed:', error);
        showAdminAlert('Request failed. Please try again.', 'error');
        throw error;
    })
    .finally(() => {
        const loadingOverlay = document.getElementById('admin-loading-overlay');
        if (loadingOverlay) {
            loadingOverlay.classList.add('hidden');
        }
    });
}

/**
 * Export functions for use in other scripts if needed
 */
export {
    switchTab,
    showAdminAlert,
    adminAjaxRequest,
    initializeAdminDropdowns
};

// Legacy global export
window.adminJS = {
    switchTab,
    showAdminAlert,
    showAdminLoadingState,
    adminAjaxRequest,
    initializeAdminDropdowns,
    paginationHelper
};

// Register admin-specific alert and loading functions for pagination
if (typeof window !== 'undefined') {
    window.showPaginationAlert = showAdminAlert;
    window.showPaginationLoadingState = showAdminLoadingState;
}
