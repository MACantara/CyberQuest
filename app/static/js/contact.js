// Contact page specific functionality
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.querySelector('.contact-form, form');
    const submitButton = contactForm?.querySelector('button[type="submit"]');
    
    if (contactForm) {
        // Real-time form validation
        const formInputs = contactForm.querySelectorAll('input, textarea');
        
        formInputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateField(this);
            });
            
            input.addEventListener('input', function() {
                if (this.classList.contains('error')) {
                    validateField(this);
                }
            });
        });
        
        // Form submission handling
        contactForm.addEventListener('submit', function(e) {
            // Check if hCaptcha is required and not solved
            const hcaptchaElement = contactForm.querySelector('.h-captcha');
            if (hcaptchaElement && submitButton && submitButton.disabled) {
                e.preventDefault();
                return false;
            }
            
            e.preventDefault();
            
            let isValid = true;
            formInputs.forEach(input => {
                if (!validateField(input)) {
                    isValid = false;
                }
            });
            
            if (isValid) {
                submitForm();
            }
        });
    }
    
    function validateField(field) {
        const value = field.value.trim();
        let isValid = true;
        let errorMessage = '';
        
        // Remove existing error messages
        const existingError = field.parentNode.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }
        
        // Required field validation
        if (!value) {
            isValid = false;
            errorMessage = 'This field is required.';
        }
        
        // Email validation
        if (field.type === 'email' && value && !validateEmail(value)) {
            isValid = false;
            errorMessage = 'Please enter a valid email address.';
        }
        
        // Message length validation
        if (field.name === 'message' && value && value.length < 10) {
            isValid = false;
            errorMessage = 'Message must be at least 10 characters long.';
        }
        
        // Update field appearance
        if (isValid) {
            field.classList.remove('error');
            field.classList.add('success');
        } else {
            field.classList.remove('success');
            field.classList.add('error');
            
            // Add error message
            const errorDiv = document.createElement('div');
            errorDiv.className = 'error-message text-red-500 text-sm mt-1';
            errorDiv.textContent = errorMessage;
            field.parentNode.appendChild(errorDiv);
        }
        
        return isValid;
    }
    
    function submitForm() {
        if (!submitButton) return;
        
        // Show loading state
        submitButton.classList.add('btn-loading');
        submitButton.disabled = true;
        const originalText = submitButton.textContent;
        submitButton.textContent = 'Sending...';
        
        // Create FormData
        const formData = new FormData(contactForm);
        
        // Submit form using fetch
        fetch(contactForm.action || window.location.pathname, {
            method: 'POST',
            body: formData
        })
        .then(response => {
            if (response.ok) {
                return response.text();
            }
            throw new Error('Network response was not ok');
        })
        .then(html => {
            // Parse response to check for success/error messages
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            const alerts = doc.querySelectorAll('.alert');
            
            if (alerts.length > 0) {
                // Clear form on success
                if (doc.querySelector('.alert-success')) {
                    contactForm.reset();
                    const formInputs = contactForm.querySelectorAll('input, textarea');
                    formInputs.forEach(input => {
                        input.classList.remove('success', 'error');
                    });
                }
                
                // Show alert messages
                alerts.forEach(alert => {
                    const message = alert.textContent.trim();
                    const type = alert.classList.contains('alert-success') ? 'success' : 'error';
                    showAlert(message, type);
                });
            }
        })
        .catch(error => {
            console.error('Error:', error);
            showAlert('An error occurred. Please try again later.', 'error');
        })
        .finally(() => {
            // Reset button state
            submitButton.classList.remove('btn-loading');
            submitButton.disabled = false;
            submitButton.textContent = originalText;
        });
    }
    
    // Add floating label effect
    const formGroups = document.querySelectorAll('.form-group');
    formGroups.forEach(group => {
        const input = group.querySelector('input, textarea');
        const label = group.querySelector('label');
        
        if (input && label) {
            input.addEventListener('focus', function() {
                label.style.color = '#3B82F6';
                label.style.transform = 'scale(0.9)';
            });
            
            input.addEventListener('blur', function() {
                if (!this.value) {
                    label.style.color = '';
                    label.style.transform = '';
                }
            });
        }
    });
    
    const form = document.querySelector('form');
    const inputs = form.querySelectorAll('input, textarea');
    
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
    }
    
    // Real-time validation
    function validateField(field) {
        const value = field.value.trim();
        let isValid = true;
        let errorMessage = '';
        
        // Remove existing error styling
        field.classList.remove('border-red-500', 'border-green-500');
        
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
        
        // Apply styling
        if (value.length > 0) {
            if (isValid) {
                field.classList.add('border-green-500');
            } else {
                field.classList.add('border-red-500');
            }
        }
        
        // Show/hide error message
        let errorDiv = field.parentNode.querySelector('.field-error');
        if (!isValid && value.length > 0) {
            if (!errorDiv) {
                errorDiv = document.createElement('div');
                errorDiv.className = 'field-error text-xs text-red-500 mt-1';
                field.parentNode.appendChild(errorDiv);
            }
            errorDiv.textContent = errorMessage;
        } else if (errorDiv) {
            errorDiv.remove();
        }
        
        return isValid;
    }
    
    // Add blur event listeners for real-time validation
    inputs.forEach(input => {
        input.addEventListener('blur', () => validateField(input));
        input.addEventListener('input', () => {
            // Clear validation styling on input
            if (input.value.trim() === '') {
                input.classList.remove('border-red-500', 'border-green-500');
                const errorDiv = input.parentNode.querySelector('.field-error');
                if (errorDiv) errorDiv.remove();
            }
        });
    });
    
    // Form submission handling
    form.addEventListener('submit', function(e) {
        let isFormValid = true;
        
        // Validate all fields
        inputs.forEach(input => {
            if (!validateField(input)) {
                isFormValid = false;
            }
        });
        
        if (!isFormValid) {
            e.preventDefault();
            
            // Show error message
            const errorDiv = document.createElement('div');
            errorDiv.className = 'bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 text-red-800 dark:text-red-200 px-4 py-3 rounded-xl mb-4';
            errorDiv.innerHTML = '<i class="bi bi-exclamation-triangle mr-2"></i>Please correct the errors above before submitting.';
            
            // Remove existing error message
            const existingError = form.querySelector('.form-error');
            if (existingError) existingError.remove();
            
            errorDiv.className += ' form-error';
            form.insertBefore(errorDiv, form.firstChild);
            
            // Scroll to first error
            const firstError = form.querySelector('.border-red-500');
            if (firstError) {
                firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
                firstError.focus();
            }
            
            return;
        }
        
        // Show loading state
        const originalText = submitButton.innerHTML;
        submitButton.disabled = true;
        submitButton.innerHTML = '<i class="bi bi-arrow-clockwise mr-3 animate-spin"></i><span>Sending...</span>';
        
        // Remove any existing error messages
        const existingError = form.querySelector('.form-error');
        if (existingError) existingError.remove();
        
        // Re-enable button after 3 seconds (fallback)
        setTimeout(() => {
            if (submitButton.disabled) {
                submitButton.disabled = false;
                submitButton.innerHTML = originalText;
            }
        }, 3000);
    });
    
    // Auto-resize textarea
    if (messageTextarea) {
        messageTextarea.addEventListener('input', function() {
            this.style.height = 'auto';
            this.style.height = this.scrollHeight + 'px';
        });
    }
    
    // Form auto-save to localStorage (optional)
    const formData = {};
    
    function saveFormData() {
        inputs.forEach(input => {
            formData[input.id] = input.value;
        });
        localStorage.setItem('contactFormData', JSON.stringify(formData));
    }
    
    function loadFormData() {
        const saved = localStorage.getItem('contactFormData');
        if (saved) {
            const data = JSON.parse(saved);
            inputs.forEach(input => {
                if (data[input.id]) {
                    input.value = data[input.id];
                }
            });
        }
    }
    
    // Load saved data on page load
    loadFormData();
    
    // Save data on input
    inputs.forEach(input => {
        input.addEventListener('input', saveFormData);
    });
    
    // Clear saved data on successful submission
    form.addEventListener('submit', function() {
        if (form.checkValidity()) {
            localStorage.removeItem('contactFormData');
        }
    });
});
