// Contact page specific functionality
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.querySelector('form');
    const submitButton = contactForm?.querySelector('button[type="submit"]');
    const formInputs = contactForm?.querySelectorAll('input, textarea');
    
    if (!contactForm) return;
    
    // Form submission handling with loading state
    contactForm.addEventListener('submit', function(e) {
        let isValid = true;
        
        // Validate all fields before submission
        if (formInputs) {
            formInputs.forEach(input => {
                if (!validateField(input)) {
                    isValid = false;
                }
            });
        }
        
        if (!isValid) {
            e.preventDefault();
            
            // Show error message
            showFormError('Please correct the errors above before submitting.');
            
            // Scroll to first error
            const firstError = contactForm.querySelector('.border-red-500');
            if (firstError) {
                firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
                firstError.focus();
            }
            return;
        }
        
        // Show loading state on submit button
        if (submitButton) {
            const originalContent = submitButton.innerHTML;
            submitButton.disabled = true;
            submitButton.innerHTML = '<i class="bi bi-arrow-clockwise mr-3 animate-spin"></i><span>Sending Message...</span>';
            
            // Form will submit normally and redirect will happen server-side
            // Reset button state after a delay as fallback
            setTimeout(() => {
                submitButton.disabled = false;
                submitButton.innerHTML = originalContent;
            }, 5000);
        }
        
        // Clear any existing error messages
        const existingError = contactForm.querySelector('.form-error');
        if (existingError) existingError.remove();
        
        // Clear saved form data since we're submitting
        localStorage.removeItem('contactFormData');
    });
    
    function showFormError(message) {
        // Remove existing error message
        const existingError = contactForm.querySelector('.form-error');
        if (existingError) existingError.remove();
        
        // Create error message
        const errorDiv = document.createElement('div');
        errorDiv.className = 'form-error bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 text-red-800 dark:text-red-200 px-4 py-3 rounded-xl mb-4';
        errorDiv.innerHTML = `<i class="bi bi-exclamation-triangle mr-2"></i>${message}`;
        
        contactForm.insertBefore(errorDiv, contactForm.firstChild);
    }
    
    // Real-time form validation
    if (formInputs) {
        formInputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateField(this);
            });
            
            input.addEventListener('input', function() {
                if (this.classList.contains('border-red-500')) {
                    validateField(this);
                }
            });
        });
    }
    
    function validateField(field) {
        const value = field.value.trim();
        let isValid = true;
        let errorMessage = '';
        
        // Remove existing error styling and messages
        field.classList.remove('border-red-500', 'border-green-500');
        const existingError = field.parentNode.querySelector('.field-error');
        if (existingError) {
            existingError.remove();
        }
        
        // Skip validation if field is empty (required validation will be handled by browser)
        if (!value) {
            return true; // Let browser handle required validation
        }
        
        switch (field.id) {
            case 'name':
                if (value.length < 2) {
                    isValid = false;
                    errorMessage = 'Name must be at least 2 characters';
                } else if (value.length > 100) {
                    isValid = false;
                    errorMessage = 'Name must be less than 100 characters';
                }
                break;
                
            case 'email':
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(value)) {
                    isValid = false;
                    errorMessage = 'Please enter a valid email address';
                } else if (value.length > 120) {
                    isValid = false;
                    errorMessage = 'Email address is too long';
                }
                break;
                
            case 'subject':
                if (value.length < 3) {
                    isValid = false;
                    errorMessage = 'Subject must be at least 3 characters';
                } else if (value.length > 200) {
                    isValid = false;
                    errorMessage = 'Subject must be less than 200 characters';
                }
                break;
                
            case 'message':
                if (value.length < 10) {
                    isValid = false;
                    errorMessage = 'Message must be at least 10 characters';
                } else if (value.length > 2000) {
                    isValid = false;
                    errorMessage = 'Message must be less than 2000 characters';
                }
                break;
        }
        
        // Apply styling and show error message
        if (isValid) {
            field.classList.add('border-green-500');
        } else {
            field.classList.add('border-red-500');
            
            const errorDiv = document.createElement('div');
            errorDiv.className = 'field-error text-xs text-red-500 mt-1';
            errorDiv.textContent = errorMessage;
            field.parentNode.appendChild(errorDiv);
        }
        
        return isValid;
    }
    
    // Character counter for message textarea
    const messageTextarea = document.getElementById('message');
    const maxLength = 2000;
    
    if (messageTextarea) {
        // Create character counter
        const counterDiv = document.createElement('div');
        counterDiv.className = 'text-xs text-gray-500 dark:text-gray-400 mt-1 text-right';
        counterDiv.id = 'message-counter';
        messageTextarea.parentNode.appendChild(counterDiv);
        
        function updateCounter() {
            const remaining = maxLength - messageTextarea.value.length;
            counterDiv.textContent = `${messageTextarea.value.length}/${maxLength} characters`;
            
            if (remaining < 100) {
                counterDiv.className = 'text-xs text-orange-500 dark:text-orange-400 mt-1 text-right';
            } else if (remaining < 50) {
                counterDiv.className = 'text-xs text-red-500 dark:text-red-400 mt-1 text-right';
            } else {
                counterDiv.className = 'text-xs text-gray-500 dark:text-gray-400 mt-1 text-right';
            }
        }
        
        messageTextarea.addEventListener('input', updateCounter);
        updateCounter(); // Initial count
        
        // Auto-resize textarea
        messageTextarea.addEventListener('input', function() {
            this.style.height = 'auto';
            this.style.height = this.scrollHeight + 'px';
        });
    }
    
    // Form auto-save to localStorage
    function saveFormData() {
        if (!formInputs) return;
        
        const formData = {};
        formInputs.forEach(input => {
            if (input.id) {
                formData[input.id] = input.value;
            }
        });
        localStorage.setItem('contactFormData', JSON.stringify(formData));
    }
    
    function loadFormData() {
        const saved = localStorage.getItem('contactFormData');
        if (saved && formInputs) {
            try {
                const data = JSON.parse(saved);
                formInputs.forEach(input => {
                    if (input.id && data[input.id]) {
                        input.value = data[input.id];
                    }
                });
            } catch (e) {
                // Invalid JSON, clear it
                localStorage.removeItem('contactFormData');
            }
        }
    }
    
    // Load saved data on page load
    loadFormData();
    
    // Save data on input (with debouncing)
    let saveTimeout;
    if (formInputs) {
        formInputs.forEach(input => {
            input.addEventListener('input', function() {
                clearTimeout(saveTimeout);
                saveTimeout = setTimeout(saveFormData, 500); // Save after 500ms of no typing
            });
        });
    }
});
