/**
 * hCaptcha Validator Utility
 * Prevents form submission without solved captcha
 */

class HCaptchaValidator {
    constructor() {
        this.captchaWidgets = new Map();
        this.forms = new Set();
        this.init();
    }

    init() {
        // Wait for DOM and hCaptcha to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setup());
        } else {
            this.setup();
        }
    }

    setup() {
        // Find all forms with hCaptcha
        this.findCaptchaForms();
        
        // Setup form listeners
        this.setupFormListeners();
        
        // Setup hCaptcha callbacks if hcaptcha is available
        if (typeof hcaptcha !== 'undefined') {
            this.setupHCaptchaCallbacks();
        } else {
            // Wait for hCaptcha to load
            this.waitForHCaptcha();
        }
    }

    waitForHCaptcha() {
        const checkHCaptcha = () => {
            if (typeof hcaptcha !== 'undefined') {
                this.setupHCaptchaCallbacks();
            } else {
                setTimeout(checkHCaptcha, 100);
            }
        };
        checkHCaptcha();
    }

    findCaptchaForms() {
        // Find all hCaptcha containers
        const captchaContainers = document.querySelectorAll('.h-captcha');
        
        captchaContainers.forEach(container => {
            const form = container.closest('form');
            if (form) {
                this.forms.add(form);
                
                // Store widget info
                const widgetId = container.getAttribute('data-widget-id') || 
                                container.id || 
                                `hcaptcha-${Math.random().toString(36).substr(2, 9)}`;
                
                this.captchaWidgets.set(form, {
                    container: container,
                    widgetId: widgetId,
                    solved: false,
                    token: null
                });
            }
        });
    }

    setupFormListeners() {
        this.forms.forEach(form => {
            // Prevent form submission if captcha not solved
            form.addEventListener('submit', (e) => {
                if (!this.isCaptchaSolved(form)) {
                    e.preventDefault();
                    e.stopImmediatePropagation();
                    
                    this.showCaptchaError(form);
                    return false;
                }
            });

            // Also listen for any programmatic form submissions
            const originalSubmit = form.submit;
            form.submit = () => {
                if (this.isCaptchaSolved(form)) {
                    originalSubmit.call(form);
                } else {
                    this.showCaptchaError(form);
                }
            };
        });
    }

    setupHCaptchaCallbacks() {
        this.captchaWidgets.forEach((widget, form) => {
            const container = widget.container;
            
            // Set up success callback
            const successCallback = (token) => {
                widget.solved = true;
                widget.token = token;
                this.onCaptchaSolved(form);
            };
            
            // Set up error callback
            const errorCallback = () => {
                widget.solved = false;
                widget.token = null;
                this.onCaptchaError(form);
            };
            
            // Set up expired callback
            const expiredCallback = () => {
                widget.solved = false;
                widget.token = null;
                this.onCaptchaExpired(form);
            };

            // Update container attributes
            container.setAttribute('data-callback', 'hcaptchaSuccess');
            container.setAttribute('data-error-callback', 'hcaptchaError');
            container.setAttribute('data-expired-callback', 'hcaptchaExpired');

            // Set global callbacks
            window.hcaptchaSuccess = successCallback;
            window.hcaptchaError = errorCallback;
            window.hcaptchaExpired = expiredCallback;
        });
    }

    isCaptchaSolved(form) {
        const widget = this.captchaWidgets.get(form);
        if (!widget) return true; // No captcha required
        
        // Check if we have a valid token
        if (widget.solved && widget.token) {
            return true;
        }
        
        // Also check for h-captcha-response input (fallback)
        const responseInput = form.querySelector('textarea[name="h-captcha-response"]');
        if (responseInput && responseInput.value.trim()) {
            widget.solved = true;
            widget.token = responseInput.value;
            return true;
        }
        
        return false;
    }

    showCaptchaError(form) {
        const widget = this.captchaWidgets.get(form);
        if (!widget) return;

        // Remove any existing error messages
        this.clearCaptchaError(form);

        // Create error message
        const errorDiv = document.createElement('div');
        errorDiv.className = 'hcaptcha-error-message p-3 mb-4 text-sm text-red-800 bg-red-50 border border-red-200 rounded-lg dark:text-red-400 dark:bg-red-900/20 dark:border-red-800';
        errorDiv.innerHTML = `
            <div class="flex items-center">
                <i class="bi bi-exclamation-triangle-fill mr-2"></i>
                <span>Please complete the captcha verification before submitting.</span>
            </div>
        `;

        // Insert error message before the captcha container
        widget.container.parentNode.insertBefore(errorDiv, widget.container);

        // Scroll to captcha if not visible
        this.scrollToCaptcha(widget.container);

        // Show toast notification if available
        if (window.toastManager) {
            window.toastManager.showToast('Please complete the captcha verification.', 'error');
        } else if (typeof showAlert === 'function') {
            showAlert('Please complete the captcha verification.', 'error');
        }

        // Auto-remove error after 10 seconds
        setTimeout(() => {
            this.clearCaptchaError(form);
        }, 10000);
    }

    clearCaptchaError(form) {
        const widget = this.captchaWidgets.get(form);
        if (!widget) return;

        const existingError = widget.container.parentNode.querySelector('.hcaptcha-error-message');
        if (existingError) {
            existingError.remove();
        }
    }

    scrollToCaptcha(container) {
        if (this.isElementInViewport(container)) return;

        container.scrollIntoView({
            behavior: 'smooth',
            block: 'center'
        });
    }

    isElementInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }

    onCaptchaSolved(form) {
        // Clear any error messages
        this.clearCaptchaError(form);

        // Show success indicator briefly
        const widget = this.captchaWidgets.get(form);
        if (widget) {
            const successDiv = document.createElement('div');
            successDiv.className = 'hcaptcha-success-message p-2 mb-2 text-sm text-green-800 bg-green-50 border border-green-200 rounded-lg dark:text-green-400 dark:bg-green-900/20 dark:border-green-800';
            successDiv.innerHTML = `
                <div class="flex items-center">
                    <i class="bi bi-check-circle-fill mr-2"></i>
                    <span>Captcha verified successfully!</span>
                </div>
            `;

            widget.container.parentNode.insertBefore(successDiv, widget.container);

            // Remove success message after 3 seconds
            setTimeout(() => {
                if (successDiv.parentNode) {
                    successDiv.remove();
                }
            }, 3000);
        }
    }

    onCaptchaError(form) {
        const widget = this.captchaWidgets.get(form);
        if (widget) {
            widget.solved = false;
            widget.token = null;
        }

        // Show error toast
        if (window.toastManager) {
            window.toastManager.showToast('Captcha verification failed. Please try again.', 'error');
        }
    }

    onCaptchaExpired(form) {
        const widget = this.captchaWidgets.get(form);
        if (widget) {
            widget.solved = false;
            widget.token = null;
        }

        // Show warning toast
        if (window.toastManager) {
            window.toastManager.showToast('Captcha has expired. Please solve it again.', 'warning');
        }
    }

    // Public method to manually validate a specific form
    validateForm(form) {
        return this.isCaptchaSolved(form);
    }

    // Public method to reset captcha for a form
    resetCaptcha(form) {
        const widget = this.captchaWidgets.get(form);
        if (widget && typeof hcaptcha !== 'undefined') {
            try {
                hcaptcha.reset(widget.widgetId);
                widget.solved = false;
                widget.token = null;
            } catch (e) {
                console.warn('Failed to reset hCaptcha:', e);
            }
        }
    }

    // Public method to check if captcha is required for a form
    isCaptchaRequired(form) {
        return this.captchaWidgets.has(form);
    }
}

// Create global instance
const hcaptchaValidator = new HCaptchaValidator();

// Export for module usage
export default hcaptchaValidator;

// Make available globally
if (typeof window !== 'undefined') {
    window.hcaptchaValidator = hcaptchaValidator;
}
