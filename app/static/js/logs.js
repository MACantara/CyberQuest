import { paginationHelper } from './utils/pagination.js';

document.addEventListener('DOMContentLoaded', function() {
    // Initialize log-specific functionality
    initializeLogTypeChange();
    initializeLogPagination();
});

// Initialize log type change functionality
function initializeLogTypeChange() {
    const logTypeSelect = document.getElementById('logType');
    if (logTypeSelect) {
        logTypeSelect.addEventListener('change', function() {
            changeLogType();
        });
        
        // Add focus and blur effects for better UX
        logTypeSelect.addEventListener('focus', function() {
            this.parentElement.classList.add('ring-2', 'ring-blue-500', 'dark:ring-blue-400');
        });
        
        logTypeSelect.addEventListener('blur', function() {
            this.parentElement.classList.remove('ring-2', 'ring-blue-500', 'dark:ring-blue-400');
        });
    }
}

// Handle log type filter change
function changeLogType() {
    const select = document.getElementById('logType');
    if (select) {
        const selectedType = select.value;
        // Get the current URL and update the type parameter
        const currentUrl = new URL(window.location);
        currentUrl.searchParams.set('type', selectedType);
        currentUrl.searchParams.delete('page'); // Reset to first page when changing type
        window.location.href = currentUrl.toString();
    }
}

/**
 * Initialize pagination functionality for logs
 */
function initializeLogPagination() {
    // Initialize pagination containers using centralized system
    const paginationContainers = document.querySelectorAll('.pagination-container');
    paginationContainers.forEach(container => {
        paginationHelper.initializePagination(container);
    });
    
    // Handle legacy per page filter if it exists without pagination container
    const perPageFilter = document.getElementById('perPageFilter');
    if (perPageFilter && !perPageFilter.closest('.pagination-container')) {
        perPageFilter.addEventListener('change', function() {
            changeItemsPerPage(this.value);
        });
        
        // Add focus and blur effects
        perPageFilter.addEventListener('focus', function() {
            this.parentElement.classList.add('ring-2', 'ring-blue-500', 'dark:ring-blue-400');
        });
        
        perPageFilter.addEventListener('blur', function() {
            this.parentElement.classList.remove('ring-2', 'ring-blue-500', 'dark:ring-blue-400');
        });
    }
}

/**
 * Change items per page for logs
 * @param {string} perPage - Number of items per page
 */
function changeItemsPerPage(perPage) {
    const currentUrl = new URL(window.location);
    currentUrl.searchParams.set('per_page', perPage);
    currentUrl.searchParams.delete('page'); // Reset to first page when changing items per page
    
    // Show loading state
    showLoadingState('Updating page size...');
    
    window.location.href = currentUrl.toString();
}

/**
 * Show loading state for log operations
 * @param {string} message - Loading message to display
 */
function showLoadingState(message = 'Loading...') {
    // Create or update loading overlay
    let loadingOverlay = document.getElementById('log-loading-overlay');
    
    if (!loadingOverlay) {
        loadingOverlay = document.createElement('div');
        loadingOverlay.id = 'log-loading-overlay';
        loadingOverlay.className = 'fixed inset-0 flex items-center justify-center z-50';
        loadingOverlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
        loadingOverlay.style.backdropFilter = 'blur(2px)';
        
        loadingOverlay.innerHTML = `
            <div class="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-sm mx-4 shadow-xl">
                <div class="flex items-center space-x-3">
                    <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                    <span class="text-gray-900 dark:text-white font-medium" id="loading-message">${message}</span>
                </div>
            </div>
        `;
        
        document.body.appendChild(loadingOverlay);
    } else {
        document.getElementById('loading-message').textContent = message;
        loadingOverlay.classList.remove('hidden');
    }
}

// Hide loading state
function hideLoadingState() {
    const loadingOverlay = document.getElementById('log-loading-overlay');
    if (loadingOverlay) {
        loadingOverlay.classList.add('hidden');
    }
}

/**
 * Show log-specific alerts
 * @param {string} message - The message to display
 * @param {string} type - The type of alert (success, error, warning, info)
 */
function showLogAlert(message, type = 'info') {
    const alertDiv = document.createElement('div');
    alertDiv.className = `fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg max-w-md log-alert-${type}`;
    
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

// Initialize log export functionality
function initializeLogExport() {
    const exportButton = document.querySelector('a[href*="export_logs"]');
    if (exportButton) {
        exportButton.addEventListener('click', function(e) {
            showLoadingState('Preparing export...');
            
            // The export will happen via the link, so we just show loading
            // The loading state will be hidden when the page reloads or user navigates back
            setTimeout(hideLoadingState, 3000); // Fallback to hide loading
        });
    }
}

// Handle keyboard shortcuts for logs
function initializeLogKeyboardShortcuts() {
    document.addEventListener('keydown', function(e) {
        // Ctrl/Cmd + K to focus on log type filter
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            const logTypeSelect = document.getElementById('logType');
            if (logTypeSelect) {
                logTypeSelect.focus();
                showLogAlert('Log type filter focused. Use arrow keys to navigate.', 'info');
            }
        }
        
        // Ctrl/Cmd + P to focus on per page selector
        if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
            e.preventDefault();
            const perPageFilter = document.getElementById('perPageFilter');
            if (perPageFilter) {
                perPageFilter.focus();
                showLogAlert('Per page selector focused. Use arrow keys to navigate.', 'info');
            }
        }
    });
}

// Initialize all log functionality
function initializeLogFunctionality() {
    initializeLogTypeChange();
    initializeLogPagination();
    initializeLogExport();
    initializeLogKeyboardShortcuts();
}

// Auto-initialize if on logs page
if (window.location.pathname.includes('/logs')) {
    document.addEventListener('DOMContentLoaded', initializeLogFunctionality);
}

/**
 * Export functions for use in other scripts if needed
 */
window.logsJS = {
    changeLogType,
    changeItemsPerPage,
    showLogAlert,
    showLoadingState,
    hideLoadingState,
    paginationHelper
};

// Register log-specific alert and loading functions for pagination
if (typeof window !== 'undefined') {
    window.showPaginationAlert = showLogAlert;
    window.showPaginationLoadingState = showLoadingState;
}
