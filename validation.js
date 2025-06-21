document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const authContainer = document.getElementById('authContainer');
    const signupForm = document.getElementById('signupForm');
    const loginForm = document.getElementById('loginForm');
    const forgotPasswordForm = document.getElementById('forgotPasswordForm');
    
    // Toggle links
    const showLogin = document.getElementById('showLogin');
    const showSignup = document.getElementById('showSignup');
    const forgotPassword = document.getElementById('forgotPassword');
    const showLoginFromForgot = document.getElementById('showLoginFromForgot');

    // Initialize forms
    initSignupForm();
    initLoginForm();
    initForgotPasswordForm();

    // Form toggle handlers
    showLogin.addEventListener('click', (e) => {
        e.preventDefault();
        toggleForms(signupForm, loginForm);
    });

    showSignup.addEventListener('click', (e) => {
        e.preventDefault();
        toggleForms(loginForm, signupForm);
    });

    forgotPassword.addEventListener('click', (e) => {
        e.preventDefault();
        toggleForms(loginForm, forgotPasswordForm);
    });

    showLoginFromForgot.addEventListener('click', (e) => {
        e.preventDefault();
        toggleForms(forgotPasswordForm, loginForm);
    });

    function toggleForms(hideForm, showForm) {
        hideForm.classList.add('hidden');
        showForm.classList.remove('hidden');
        // Clear any errors when switching forms
        clearAllErrors();
    }

    function clearAllErrors() {
        document.querySelectorAll('.error').forEach(error => {
            error.classList.remove('show');
        });
        document.querySelectorAll('input').forEach(input => {
            input.classList.remove('invalid');
            input.classList.remove('valid');
        });
    }

    function initSignupForm() {
        const form = document.getElementById('signupFormElement');
        const passwordInput = document.getElementById('signupPassword');
        const passwordStrengthBar = document.querySelector('.strength-bar');
        const passwordStrengthText = document.querySelector('.strength-text');
        
        // Password strength indicator
        passwordInput.addEventListener('input', function() {
            const strength = calculatePasswordStrength(this.value);
            updateStrengthIndicator(strength, passwordStrengthBar, passwordStrengthText);
        });

        // Form submission
        form.addEventListener('submit', function(event) {
            event.preventDefault();
            clearFormErrors('signup');
            
            const isNameValid = validateField('signupName', 'signupNameError', [
                { test: value => value.trim() === '', message: 'Name is required' },
                { test: value => value.trim().length < 3, message: 'Name must be at least 3 characters' }
            ]);
            
            const isEmailValid = validateField('signupEmail', 'signupEmailError', [
                { test: value => value.trim() === '', message: 'Email is required' },
                { test: value => !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value), message: 'Please enter a valid email' }
            ]);
            
            const isPasswordValid = validateField('signupPassword', 'signupPasswordError', [
                { test: value => value === '', message: 'Password is required' },
                { test: value => value.length < 8, message: 'Password must be at least 8 characters' }
            ]);
            
            const isConfirmValid = validateField('signupConfirmPassword', 'signupConfirmPasswordError', [
                { test: value => value === '', message: 'Please confirm your password' },
                { test: value => value !== document.getElementById('signupPassword').value, 
                  message: 'Passwords do not match' }
            ]);
            
            if (isNameValid && isEmailValid && isPasswordValid && isConfirmValid) {
                simulateFormSubmission(form, 'Sign Up');
            }
        });
    }

    function initLoginForm() {
        const form = document.getElementById('loginFormElement');
        
        form.addEventListener('submit', function(event) {
            event.preventDefault();
            clearFormErrors('login');
            
            const isEmailValid = validateField('loginEmail', 'loginEmailError', [
                { test: value => value.trim() === '', message: 'Email is required' },
                { test: value => !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value), message: 'Please enter a valid email' }
            ]);
            
            const isPasswordValid = validateField('loginPassword', 'loginPasswordError', [
                { test: value => value === '', message: 'Password is required' }
            ]);
            
            if (isEmailValid && isPasswordValid) {
                simulateFormSubmission(form, 'Log In');
            }
        });
    }

    function initForgotPasswordForm() {
        const form = document.getElementById('forgotPasswordFormElement');
        
        form.addEventListener('submit', function(event) {
            event.preventDefault();
            clearFormErrors('forgot');
            
            const isEmailValid = validateField('forgotEmail', 'forgotEmailError', [
                { test: value => value.trim() === '', message: 'Email is required' },
                { test: value => !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value), message: 'Please enter a valid email' }
            ]);
            
            if (isEmailValid) {
                simulateFormSubmission(form, 'Send Instructions', true);
            }
        });
    }

    // Generic field validation
    function validateField(inputId, errorId, validations) {
        const input = document.getElementById(inputId);
        const error = document.getElementById(errorId);
        const value = input.type === 'password' ? input.value : input.value.trim();
        
        for (const validation of validations) {
            if (validation.test(value)) {
                showError(input, error, validation.message);
                return false;
            }
        }
        
        showSuccess(input, error);
        return true;
    }

    function clearFormErrors(prefix) {
        document.querySelectorAll(`#${prefix}Form .error`).forEach(error => {
            error.classList.remove('show');
        });
        document.querySelectorAll(`#${prefix}Form input`).forEach(input => {
            input.classList.remove('invalid');
            input.classList.remove('valid');
        });
    }

    function simulateFormSubmission(form, successMessage, isForgotPassword = false) {
        const submitBtn = form.querySelector('.submit-btn');
        const btnText = form.querySelector('.btn-text');
        const loadingIcon = form.querySelector('.loading-icon');
        
        // Show loading state
        btnText.textContent = 'Processing...';
        loadingIcon.style.display = 'block';
        submitBtn.disabled = true;
        
        // Simulate API call
        setTimeout(() => {
            // Hide loading state
            loadingIcon.style.display = 'none';
            
            if (isForgotPassword) {
                btnText.textContent = 'Instructions Sent!';
                // Here you would typically show a success message
                setTimeout(() => {
                    toggleForms(forgotPasswordForm, loginForm);
                    btnText.textContent = successMessage;
                    submitBtn.disabled = false;
                    form.reset();
                }, 1500);
            } else {
                btnText.textContent = 'Success!';
                submitBtn.style.backgroundColor = '#4bb543';
                
                // Reset after 2 seconds
                setTimeout(() => {
                    btnText.textContent = successMessage;
                    submitBtn.style.backgroundColor = '';
                    submitBtn.disabled = false;
                    form.reset();
                    
                    // For signup, switch to login after success
                    if (form.id === 'signupFormElement') {
                        toggleForms(signupForm, loginForm);
                    }
                }, 1500);
            }
        }, 1500);
    }

    // Password toggle functionality
    document.querySelectorAll('.toggle-password').forEach(icon => {
        icon.addEventListener('click', function() {
            const targetId = this.getAttribute('data-target');
            const input = document.getElementById(targetId);
            const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
            input.setAttribute('type', type);
            this.classList.toggle('fa-eye-slash');
        });
    });

    // Helper functions (keep from previous implementation)
    function showError(input, errorElement, message) {
        input.classList.add('invalid');
        input.classList.remove('valid');
        errorElement.textContent = message;
        errorElement.classList.add('show');
    }

    function showSuccess(input, errorElement) {
        input.classList.remove('invalid');
        input.classList.add('valid');
        errorElement.classList.remove('show');
    }

    function calculatePasswordStrength(password) {
        let strength = 0;
        strength += Math.min(5, Math.floor(password.length / 2)) * 10;
        if (password.match(/([a-z].*[A-Z])|([A-Z].*[a-z])/)) strength += 10;
        if (password.match(/[0-9]/)) strength += 10;
        if (password.match(/[^a-zA-Z0-9]/)) strength += 10;
        if (password.match(/[a-zA-Z]/) && password.match(/[0-9]/)) strength += 10;
        return Math.min(100, strength);
    }

    function updateStrengthIndicator(strength, bar, text) {
        bar.style.width = `${strength}%`;
        
        if (strength < 30) {
            bar.style.backgroundColor = '#f72585';
            text.textContent = 'Weak';
        } else if (strength < 70) {
            bar.style.backgroundColor = '#f8961e';
            text.textContent = 'Moderate';
        } else {
            bar.style.backgroundColor = '#4cc9f0';
            text.textContent = 'Strong';
        }
    }
});