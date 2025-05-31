import PasswordStrengthChecker from "./components/password-strength.js";
import PasswordValidator from "./components/password-validator.js";
import hcaptchaValidator from "./utils/hcaptcha-validator.js";

document.addEventListener("DOMContentLoaded", function () {
    const usernameInput = document.getElementById("username");
    const emailInput = document.getElementById("email");

    // Initialize password strength checker
    const strengthChecker = new PasswordStrengthChecker("password", {
        showMeter: true,
        showFeedback: true,
        userInputs: [],
    });

    // Initialize password validator for requirements and matching
    const passwordValidator = new PasswordValidator("password", "confirm_password", {
        showValidation: true,
        showMatching: true,
        minLength: 8,
        requireUppercase: true,
        requireLowercase: true,
        requireNumbers: true,
        requireSpecialChars: true
    });

    // Update user inputs when username or email changes
    function updateUserInputs() {
        const userInputs = [];
        if (usernameInput.value) userInputs.push(usernameInput.value);
        if (emailInput.value) userInputs.push(emailInput.value.split("@")[0]);
        strengthChecker.setUserInputs(userInputs);
    }

    usernameInput.addEventListener("input", updateUserInputs);
    emailInput.addEventListener("input", updateUserInputs);

    // Form validation on submit
    const form = document.querySelector('form');
    if (form) {
        form.addEventListener('submit', function(e) {
            let isValid = true;
            
            // Check password validation
            if (!passwordValidator.isValid()) {
                isValid = false;
                const errors = passwordValidator.getValidationErrors();
                
                // Show first error as toast notification if available
                if (window.toastManager && errors.length > 0) {
                    window.toastManager.showToast(errors[0], 'error');
                }
            }
            
            // Check hCaptcha validation
            if (!hcaptchaValidator.validateForm(form)) {
                isValid = false;
                // hcaptchaValidator will handle showing the error
            }
            
            if (!isValid) {
                e.preventDefault();
            }
        });
    }
});
