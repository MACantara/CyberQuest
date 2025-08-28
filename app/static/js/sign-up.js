import PasswordStrengthChecker from "./components/password-strength.js";
import PasswordValidator from "./components/password-validator.js";
import hcaptchaValidator from "./utils/hcaptcha-validator.js";

class CyberQuestSignup {
    constructor() {
        this.currentStep = 1;
        this.totalSteps = 4;
        this.formData = {};
        
        this.initializeComponents();
        this.setupEventListeners();
        this.updateNavigationButtons();
    }

    initializeComponents() {
        // Initialize password strength checker with cybersecurity theme
        this.strengthChecker = new PasswordStrengthChecker("password", {
            showMeter: true,
            showFeedback: true,
            userInputs: [],
            customClasses: {
                container: 'mt-3 p-3 bg-gray-800/50 rounded-lg border border-purple-500/30',
                meter: 'h-2 rounded-full overflow-hidden bg-gray-700',
                feedback: 'text-sm text-gray-300 mt-2'
            }
        });

        // Initialize password validator
        this.passwordValidator = new PasswordValidator("password", "confirm_password", {
            showValidation: true,
            showMatching: true,
            minLength: 8,
            requireUppercase: true,
            requireLowercase: true,
            requireNumbers: true,
            requireSpecialChars: true,
            customClasses: {
                valid: 'text-green-400',
                invalid: 'text-red-400',
                container: 'mt-2 text-sm'
            }
        });

        // Get form elements
        this.form = document.getElementById('cyberquest-signup');
        this.nextBtn = document.getElementById('next-btn');
        this.prevBtn = document.getElementById('prev-btn');
        this.usernameInput = document.getElementById('username');
        this.emailInput = document.getElementById('email');
    }

    setupEventListeners() {
        // Navigation buttons
        this.nextBtn.addEventListener('click', (e) => this.handleNext(e));
        this.prevBtn.addEventListener('click', () => this.goToPreviousStep());
        
        // Form inputs for live validation
        this.usernameInput.addEventListener('input', () => {
            this.updateUserInputs();
            this.validateUsernameRealTime();
        });
        this.emailInput.addEventListener('input', () => {
            this.updateUserInputs();
            this.validateEmailRealTime();
        });
        
        // Add focus and blur events for better UX
        this.usernameInput.addEventListener('focus', () => this.handleFieldFocus('username'));
        this.usernameInput.addEventListener('blur', () => this.handleFieldBlur('username'));
        this.emailInput.addEventListener('focus', () => this.handleFieldFocus('email'));
        this.emailInput.addEventListener('blur', () => this.handleFieldBlur('email'));
        
        // Real-time summary updates
        this.usernameInput.addEventListener('input', () => this.updateSummary());
        this.emailInput.addEventListener('input', () => this.updateSummary());
        
        // Focus level radio buttons
        document.querySelectorAll('input[name="focus"]').forEach(radio => {
            radio.addEventListener('change', () => this.updateSummary());
        });

        // Form submission
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
    }

    updateUserInputs() {
        const userInputs = [];
        if (this.usernameInput.value) userInputs.push(this.usernameInput.value);
        if (this.emailInput.value) userInputs.push(this.emailInput.value.split("@")[0]);
        this.strengthChecker.setUserInputs(userInputs);
    }

    updateSummary() {
        document.getElementById('summary-username').textContent = this.usernameInput.value || '-';
        document.getElementById('summary-email').textContent = this.emailInput.value || '-';
        
        const selectedFocus = document.querySelector('input[name="focus"]:checked');
        if (selectedFocus) {
            const focusLabels = {
                'beginner': 'Beginner',
                'intermediate': 'Intermediate', 
                'advanced': 'Advanced',
                'expert': 'Expert'
            };
            document.getElementById('summary-focus').textContent = focusLabels[selectedFocus.value] || '-';
        }
    }

    async handleNext(e) {
        e.preventDefault();
        
        if (this.currentStep === this.totalSteps) {
            // Final step - submit form
            this.handleSubmit(e);
            return;
        }

        // Validate current step
        if (await this.validateCurrentStep()) {
            this.saveCurrentStepData();
            this.goToNextStep();
        }
    }

    async validateCurrentStep() {
        switch (this.currentStep) {
            case 1:
                return this.validateStep1();
            case 2:
                return this.validateStep2();
            case 3:
                return this.validateStep3();
            case 4:
                return this.validateStep4();
            default:
                return true;
        }
    }

    validateStep1() {
        const username = this.usernameInput.value.trim();
        const email = this.emailInput.value.trim();
        
        let isValid = true;
        let errors = [];
        
        // Username validation
        if (!username || username.length < 3) {
            errors.push('Agent username must be at least 3 characters');
            this.showFieldError('username', 'Agent username must be at least 3 characters');
            isValid = false;
        } else if (username.length > 30) {
            errors.push('Agent username must be 30 characters or less');
            this.showFieldError('username', 'Agent username must be 30 characters or less');
            isValid = false;
        } else if (!/^[a-zA-Z0-9_]+$/.test(username)) {
            errors.push('Agent username can only contain letters, numbers, and underscores');
            this.showFieldError('username', 'Agent username can only contain letters, numbers, and underscores');
            isValid = false;
        } else {
            this.clearFieldError('username');
        }
        
        // Email validation using the same regex as backend
        if (!email) {
            errors.push('Agent email is required');
            this.showFieldError('email', 'Agent email is required');
            isValid = false;
        } else if (!this.isValidEmailBackendCompliant(email)) {
            errors.push('Please enter a valid agent email address');
            this.showFieldError('email', 'Please enter a valid agent email address');
            isValid = false;
        } else {
            this.clearFieldError('email');
        }
        
        if (isValid) {
            this.showNotification('Step 1 completed!', 'success');
        } else {
            this.showNotification(errors[0], 'error');
        }
        
        return isValid;
    }

    validateStep2() {
        if (!this.passwordValidator.isValid()) {
            const errors = this.passwordValidator.getValidationErrors();
            this.showNotification(errors[0] || 'Agent password requirements not met', 'error');
            return false;
        }
        
        this.showNotification('Agent password created successfully!', 'success');
        return true;
    }

    validateStep3() {
        const selectedFocus = document.querySelector('input[name="focus"]:checked');
        if (!selectedFocus) {
            this.showNotification('Please select your experience level', 'error');
            return false;
        }
        
        this.showNotification('Experience level set!', 'success');
        return true;
    }

    validateStep4() {
        const termsChecked = document.getElementById('terms-agreement').checked;
        if (!termsChecked) {
            this.showNotification('Please accept the terms and conditions', 'error');
            return false;
        }
        
        // Validate hCaptcha if enabled
        if (!hcaptchaValidator.validateForm(this.form)) {
            return false;
        }
        
        return true;
    }

    saveCurrentStepData() {
        const currentStepElement = document.querySelector(`[data-step="${this.currentStep}"]`);
        const inputs = currentStepElement.querySelectorAll('input, select, textarea');
        
        inputs.forEach(input => {
            if (input.type === 'checkbox' || input.type === 'radio') {
                if (input.checked) {
                    this.formData[input.name] = input.value;
                }
            } else {
                this.formData[input.name] = input.value;
            }
        });
    }

    goToNextStep() {
        if (this.currentStep < this.totalSteps) {
            this.currentStep++;
            this.updateStepDisplay();
            this.updateNavigationButtons();
            this.playStepTransition();
        }
    }

    goToPreviousStep() {
        if (this.currentStep > 1) {
            this.currentStep--;
            this.updateStepDisplay();
            this.updateNavigationButtons();
            this.playStepTransition();
        }
    }

    updateStepDisplay() {
        // Hide all steps
        document.querySelectorAll('.form-step').forEach(step => {
            step.classList.remove('active');
        });
        
        // Show current step
        const currentStepElement = document.querySelector(`.form-step[data-step="${this.currentStep}"]`);
        if (currentStepElement) {
            currentStepElement.classList.add('active');
        }
        
        // Update step indicators
        document.querySelectorAll('.step-indicator').forEach((indicator, index) => {
            const stepNumber = index + 1;
            indicator.classList.remove('step-active', 'step-completed', 'step-inactive');
            
            if (stepNumber < this.currentStep) {
                indicator.classList.add('step-completed');
                indicator.innerHTML = '<i class="bi bi-check text-white"></i>';
            } else if (stepNumber === this.currentStep) {
                indicator.classList.add('step-active');
                indicator.textContent = stepNumber;
            } else {
                indicator.classList.add('step-inactive');
                indicator.textContent = stepNumber;
            }
        });
    }

    updateNavigationButtons() {
        // Previous button
        if (this.currentStep === 1) {
            this.prevBtn.classList.add('hidden');
        } else {
            this.prevBtn.classList.remove('hidden');
        }
        
        // Next/Submit button
        const nextText = this.nextBtn.querySelector('.next-text');
        const submitText = this.nextBtn.querySelector('.submit-text');
        const nextIcon = this.nextBtn.querySelector('.next-icon');
        const submitIcon = this.nextBtn.querySelector('.submit-icon');
        
        if (this.currentStep === this.totalSteps) {
            nextText.classList.add('hidden');
            submitText.classList.remove('hidden');
            nextIcon.classList.add('hidden');
            submitIcon.classList.remove('hidden');
        } else {
            nextText.classList.remove('hidden');
            submitText.classList.add('hidden');
            nextIcon.classList.remove('hidden');
            submitIcon.classList.add('hidden');
        }
    }

    playStepTransition() {
        // Add a subtle animation effect
        const currentStepElement = document.querySelector(`.form-step[data-step="${this.currentStep}"]`);
        if (currentStepElement) {
            currentStepElement.style.opacity = '0';
            currentStepElement.style.transform = 'translateX(20px)';
            
            setTimeout(() => {
                currentStepElement.style.opacity = '1';
                currentStepElement.style.transform = 'translateX(0)';
            }, 50);
        }
    }

    async handleSubmit(e) {
        e.preventDefault();
        
        if (this.currentStep !== this.totalSteps) {
            return;
        }
        
        // Final validation
        if (!await this.validateCurrentStep()) {
            return;
        }
        
        // Show loading state
        this.setSubmissionState(true);
        
        try {
            // Save final step data
            this.saveCurrentStepData();
            
            // Submit form
            this.showNotification('Creating your account...', 'info');
            this.form.submit();
            
        } catch (error) {
            this.showNotification('Failed to create account. Please try again.', 'error');
            this.setSubmissionState(false);
        }
    }

    setSubmissionState(loading) {
        const submitText = this.nextBtn.querySelector('.submit-text');
        const submitIcon = this.nextBtn.querySelector('.submit-icon');
        const spinner = this.nextBtn.querySelector('.submit-spinner');
        
        if (loading) {
            submitText.textContent = 'Creating Account...';
            submitIcon.classList.add('hidden');
            spinner.classList.remove('hidden');
            this.nextBtn.disabled = true;
        } else {
            submitText.textContent = 'Create Account';
            submitIcon.classList.remove('hidden');
            spinner.classList.add('hidden');
            this.nextBtn.disabled = false;
        }
    }

    showNotification(message, type = 'info') {
        // Create cyber-themed notification
        const notification = document.createElement('div');
        notification.className = `fixed top-4 right-4 z-50 p-4 rounded-xl shadow-lg max-w-sm animate-fade-in-right`;
        
        const colors = {
            success: 'bg-green-900/90 border border-green-500/50 text-green-100',
            error: 'bg-red-900/90 border border-red-500/50 text-red-100',
            info: 'bg-blue-900/90 border border-blue-500/50 text-blue-100'
        };
        
        const icons = {
            success: 'bi-check-circle',
            error: 'bi-exclamation-triangle',
            info: 'bi-info-circle'
        };
        
        notification.className += ` ${colors[type]}`;
        notification.innerHTML = `
            <div class="flex items-center space-x-3">
                <i class="bi ${icons[type]} text-lg"></i>
                <span class="font-medium">${message}</span>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Auto remove after 4 seconds
        setTimeout(() => {
            notification.remove();
        }, 4000);
    }

    isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    // Backend-compliant email validation (matches auth.py regex)
    isValidEmailBackendCompliant(email) {
        const pattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return pattern.test(email);
    }

    // Real-time username validation
    validateUsernameRealTime() {
        const username = this.usernameInput.value.trim();
        
        if (username.length === 0) {
            this.clearFieldError('username');
            return;
        }
        
        if (username.length < 3) {
            this.showFieldError('username', 'Username must be at least 3 characters');
        } else if (username.length > 30) {
            this.showFieldError('username', 'Username must be 30 characters or less');
        } else if (!/^[a-zA-Z0-9_]+$/.test(username)) {
            this.showFieldError('username', 'Username can only contain letters, numbers, and underscores');
        } else {
            this.clearFieldError('username');
            this.showFieldSuccess('username', 'Username format is valid');
        }
    }

    // Real-time email validation
    validateEmailRealTime() {
        const email = this.emailInput.value.trim();
        
        if (email.length === 0) {
            this.clearFieldError('email');
            return;
        }
        
        // Check for basic email structure first
        if (!email.includes('@')) {
            this.showFieldError('email', 'Email must contain @ symbol');
            return;
        }
        
        // Check for domain
        const parts = email.split('@');
        if (parts.length !== 2 || parts[0].length === 0 || parts[1].length === 0) {
            this.showFieldError('email', 'Email format is incomplete');
            return;
        }
        
        // Check domain has dot
        if (!parts[1].includes('.')) {
            this.showFieldError('email', 'Email domain must contain a dot');
            return;
        }
        
        // Full backend-compliant validation
        if (!this.isValidEmailBackendCompliant(email)) {
            this.showFieldError('email', 'Please enter a valid email address');
        } else {
            this.clearFieldError('email');
            this.showFieldSuccess('email', 'Email format is valid');
        }
    }

    // Show field-specific error
    showFieldError(fieldName, message) {
        const field = document.getElementById(fieldName);
        const errorContainer = this.getOrCreateErrorContainer(fieldName);
        
        // Update field styling
        field.classList.remove('border-green-300', 'dark:border-green-500/30', 'border-blue-300', 'dark:border-blue-500/30');
        field.classList.add('border-red-500', 'dark:border-red-500');
        
        // Show error message
        errorContainer.className = 'mt-2 text-xs text-red-600 dark:text-red-400 flex items-center';
        errorContainer.innerHTML = `<i class="bi bi-exclamation-circle mr-1"></i>${message}`;
    }

    // Show field success
    showFieldSuccess(fieldName, message) {
        const field = document.getElementById(fieldName);
        const errorContainer = this.getOrCreateErrorContainer(fieldName);
        
        // Update field styling
        field.classList.remove('border-red-500', 'dark:border-red-500');
        if (fieldName === 'username') {
            field.classList.add('border-green-300', 'dark:border-green-500/30');
        } else if (fieldName === 'email') {
            field.classList.add('border-blue-300', 'dark:border-blue-500/30');
        }
        
        // Show success message
        errorContainer.className = 'mt-2 text-xs text-green-600 dark:text-green-400 flex items-center';
        errorContainer.innerHTML = `<i class="bi bi-check-circle mr-1"></i>${message}`;
        
        // Auto-hide success message after 2 seconds
        setTimeout(() => {
            if (errorContainer.classList.contains('text-green-600')) {
                errorContainer.innerHTML = '';
                errorContainer.className = 'mt-2 text-xs';
            }
        }, 2000);
    }

    // Clear field error
    clearFieldError(fieldName) {
        const field = document.getElementById(fieldName);
        const errorContainer = this.getOrCreateErrorContainer(fieldName);
        
        // Reset field styling
        field.classList.remove('border-red-500', 'dark:border-red-500');
        if (fieldName === 'username') {
            field.classList.add('border-green-300', 'dark:border-green-500/30');
        } else if (fieldName === 'email') {
            field.classList.add('border-blue-300', 'dark:border-blue-500/30');
        }
        
        // Clear error message
        errorContainer.innerHTML = '';
        errorContainer.className = 'mt-2 text-xs';
    }

    // Get or create error container for field
    getOrCreateErrorContainer(fieldName) {
        const field = document.getElementById(fieldName);
        let existingError = field.parentNode.querySelector('.field-error');
        
        if (existingError) {
            return existingError;
        }
        
        const errorContainer = document.createElement('div');
        errorContainer.className = 'mt-2 text-xs field-error';
        
        // Find the help text element (the <p> tag after the input)
        const helpText = field.nextElementSibling;
        if (helpText && helpText.tagName === 'P') {
            // Insert error container after the help text
            field.parentNode.insertBefore(errorContainer, helpText.nextSibling);
        } else {
            // Insert directly after the input if no help text found
            field.parentNode.insertBefore(errorContainer, field.nextSibling);
        }
        
        return errorContainer;
    }

    // Handle field focus events
    handleFieldFocus(fieldName) {
        const field = document.getElementById(fieldName);
        field.classList.add('ring-2');
        if (fieldName === 'username') {
            field.classList.add('ring-green-500');
        } else if (fieldName === 'email') {
            field.classList.add('ring-blue-500');
        }
    }

    // Handle field blur events
    handleFieldBlur(fieldName) {
        const field = document.getElementById(fieldName);
        field.classList.remove('ring-2', 'ring-green-500', 'ring-blue-500');
        
        // Trigger validation on blur to give immediate feedback
        if (fieldName === 'username') {
            this.validateUsernameRealTime();
        } else if (fieldName === 'email') {
            this.validateEmailRealTime();
        }
    }
}

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", function () {
    new CyberQuestSignup();
});
