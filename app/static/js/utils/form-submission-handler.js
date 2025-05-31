/**
 * Form Submission Handler Utility
 * Provides visual feedback for form submissions with loading states
 */

class FormSubmissionHandler {
    constructor(options = {}) {
        this.options = {
            timeout: 5000, // Default fallback timeout
            buttonSelector: 'button[type="submit"]',
            iconSelector: '.submit-icon',
            spinnerSelector: '.submit-spinner',
            textSelector: '.submit-text',
            loadingTextSelector: '.submit-loading-text',
            ajaxButtonSelector: '[data-ajax-action]',
            adminButtonSelector: '.admin-action-btn',
            ...options
        };
        
        this.init();
    }

    init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setup());
        } else {
            this.setup();
        }
    }

    setup() {
        this.setupFormSubmissionHandlers();
        this.setupAjaxButtonHandlers();
        this.setupAdminButtonHandlers();
    }

    setupFormSubmissionHandlers() {
        const forms = document.querySelectorAll('form');
        
        forms.forEach(form => {
            const submitButton = form.querySelector(this.options.buttonSelector);
            if (submitButton && !submitButton.hasAttribute('data-submission-handler')) {
                // Mark as handled to prevent duplicate handlers
                submitButton.setAttribute('data-submission-handler', 'true');
                
                form.addEventListener('submit', (e) => {
                    this.handleFormSubmission(submitButton);
                });
            }
        });
    }

    setupAjaxButtonHandlers() {
        const ajaxButtons = document.querySelectorAll(this.options.ajaxButtonSelector);
        
        ajaxButtons.forEach(button => {
            if (!button.hasAttribute('data-ajax-handler')) {
                button.setAttribute('data-ajax-handler', 'true');
                
                button.addEventListener('click', (e) => {
                    if (!button.disabled) {
                        this.handleAjaxAction(button);
                    }
                });
            }
        });
    }

    setupAdminButtonHandlers() {
        const adminButtons = document.querySelectorAll(this.options.adminButtonSelector);
        
        adminButtons.forEach(button => {
            const form = button.closest('form');
            if (form && !button.hasAttribute('data-admin-handler')) {
                button.setAttribute('data-admin-handler', 'true');
                
                form.addEventListener('submit', (e) => {
                    this.handleAdminAction(button);
                });
            }
        });
    }

    handleFormSubmission(button) {
        // Check for structured spinner elements
        const icon = button.querySelector(this.options.iconSelector);
        const spinner = button.querySelector(this.options.spinnerSelector);
        const text = button.querySelector(this.options.textSelector);
        const loadingText = button.querySelector(this.options.loadingTextSelector);

        if (icon && spinner && text && loadingText) {
            // Use structured spinner approach
            this.showStructuredLoading(button, { icon, spinner, text, loadingText });
        } else {
            // Use generic loading approach
            this.showGenericLoading(button);
        }
    }

    handleAjaxAction(button) {
        this.showGenericLoading(button, 3000); // Shorter timeout for AJAX
    }

    handleAdminAction(button) {
        // Check for structured elements first
        const icon = button.querySelector(this.options.iconSelector);
        const spinner = button.querySelector(this.options.spinnerSelector);
        
        if (icon && spinner) {
            this.handleFormSubmission(button);
        } else {
            this.showGenericLoading(button);
        }
    }

    showStructuredLoading(button, elements) {
        const { icon, spinner, text, loadingText } = elements;
        
        // Hide original elements
        icon.classList.add('hidden');
        text.classList.add('hidden');
        
        // Show loading elements
        spinner.classList.remove('hidden');
        loadingText.classList.remove('hidden');
        
        // Disable button
        this.disableButton(button);
        
        // Set up reset
        setTimeout(() => {
            this.resetStructuredLoading(button, elements);
        }, this.options.timeout);
    }

    showGenericLoading(button, timeout = null) {
        const timeoutDuration = timeout || this.options.timeout;
        
        // Store original content
        if (!button.dataset.originalContent) {
            button.dataset.originalContent = button.innerHTML;
        }
        
        // Create loading content
        const loadingContent = this.createLoadingContent();
        
        // Apply loading state
        button.innerHTML = loadingContent;
        this.disableButton(button);
        
        // Set up reset
        setTimeout(() => {
            this.resetGenericLoading(button);
        }, timeoutDuration);
    }

    resetStructuredLoading(button, elements) {
        const { icon, spinner, text, loadingText } = elements;
        
        // Show original elements
        icon.classList.remove('hidden');
        text.classList.remove('hidden');
        
        // Hide loading elements
        spinner.classList.add('hidden');
        loadingText.classList.add('hidden');
        
        // Enable button
        this.enableButton(button);
    }

    resetGenericLoading(button) {
        if (button.dataset.originalContent) {
            button.innerHTML = button.dataset.originalContent;
            delete button.dataset.originalContent;
        }
        
        this.enableButton(button);
    }

    disableButton(button) {
        button.disabled = true;
        button.classList.add('opacity-75', 'cursor-not-allowed');
        button.classList.remove('hover:scale-105', 'hover:shadow-2xl', 'hover:shadow-lg');
    }

    enableButton(button) {
        button.disabled = false;
        button.classList.remove('opacity-75', 'cursor-not-allowed');
        button.classList.add('hover:scale-105');
        
        // Re-add shadow classes based on button type
        if (button.classList.contains('shadow-xl')) {
            button.classList.add('hover:shadow-2xl');
        } else if (button.classList.contains('shadow-lg')) {
            button.classList.add('hover:shadow-lg');
        }
    }

    createLoadingContent() {
        return `
            <div class="inline-flex items-center">
                <div class="animate-spin mr-2">
                    <i class="bi bi-arrow-clockwise"></i>
                </div>
                <span>Processing...</span>
            </div>
        `;
    }

    // Public methods for manual control
    showLoading(buttonSelector) {
        const button = document.querySelector(buttonSelector);
        if (button) {
            this.handleFormSubmission(button);
        }
    }

    hideLoading(buttonSelector) {
        const button = document.querySelector(buttonSelector);
        if (button) {
            const elements = {
                icon: button.querySelector(this.options.iconSelector),
                spinner: button.querySelector(this.options.spinnerSelector),
                text: button.querySelector(this.options.textSelector),
                loadingText: button.querySelector(this.options.loadingTextSelector)
            };

            if (elements.icon && elements.spinner) {
                this.resetStructuredLoading(button, elements);
            } else {
                this.resetGenericLoading(button);
            }
        }
    }

    // Method to handle dynamic content (for admin pages with AJAX)
    reinitialize() {
        this.setup();
    }
}

// Create global instance with default settings
const formSubmissionHandler = new FormSubmissionHandler();

// Export for module usage
export default FormSubmissionHandler;

// Make available globally
if (typeof window !== 'undefined') {
    window.FormSubmissionHandler = FormSubmissionHandler;
    window.formSubmissionHandler = formSubmissionHandler;
}
