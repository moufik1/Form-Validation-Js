document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('myForm');
    const passwordInput = document.getElementById('password');
    const passwordStrengthBar = document.querySelector('.strength-bar');
    const passwordStrengthText = document.querySelector('.strength-text');
    const submitBtn = document.querySelector('.submit-btn');
    const btnText = document.querySelector('.btn-text');
    const loadingIcon = document.querySelector('.loading-icon');

    // Toggle password visibility
    document.querySelectorAll('.toggle-password').forEach(icon => {
        icon.addEventListener('click', function() {
            const targetId = this.getAttribute('data-target');
            const input = document.getElementById(targetId);
            const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
            input.setAttribute('type', type);
            this.classList.toggle('fa-eye-slash');
        });
    });

    // Password strength indicator
    passwordInput.addEventListener('input', function() {
        const strength = calculatePasswordStrength(this.value);
        updateStrengthIndicator(strength);
    });

    // Form submission
    form.addEventListener('submit', function(event) {
        event.preventDefault();
        clearErrors();
        
        const isNameValid = validateName();
        const isEmailValid = validateEmail();
        const isPasswordValid = validatePassword();
        const isConfirmPasswordValid = validateConfirmPassword();
        
        if (isNameValid && isEmailValid && isPasswordValid && isConfirmPasswordValid) {
            // Show loading state
            btnText.textContent = 'Processing...';
            loadingIcon.style.display = 'block';
            submitBtn.disabled = true;
            
            // Simulate API call
            setTimeout(() => {
                // Hide loading state
                btnText.textContent = 'Sign Up Successful!';
                loadingIcon.style.display = 'none';
                submitBtn.style.backgroundColor = '#4bb543';
                
                // Reset after 2 seconds
                setTimeout(() => {
                    btnText.textContent = 'Sign Up';
                    submitBtn.style.backgroundColor = '';
                    submitBtn.disabled = false;
                    form.reset();
                    passwordStrengthBar.style.width = '0';
                    passwordStrengthText.textContent = 'Password strength';
                }, 2000);
            }, 1500);
        } else {
            form.classList.add('shake');
            setTimeout(() => form.classList.remove('shake'), 400);
        }
    });

    // Real-time validation on blur
    document.getElementById('name').addEventListener('blur', validateName);
    document.getElementById('email').addEventListener('blur', validateEmail);
    document.getElementById('password').addEventListener('blur', validatePassword);
    document.getElementById('confirmPassword').addEventListener('blur', validateConfirmPassword);
});

function validateName() {
    const nameInput = document.getElementById('name');
    const nameError = document.getElementById('nameError');
    const nameValue = nameInput.value.trim();
    
    if (nameValue === '') {
        showError(nameInput, nameError, 'Name is required');
        return false;
    }
    
    if (nameValue.length < 3) {
        showError(nameInput, nameError, 'Name must be at least 3 characters');
        return false;
    }
    
    showSuccess(nameInput, nameError);
    return true;
}

function validateEmail() {
    const emailInput = document.getElementById('email');
    const emailError = document.getElementById('emailError');
    const emailValue = emailInput.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (emailValue === '') {
        showError(emailInput, emailError, 'Email is required');
        return false;
    }
    
    if (!emailRegex.test(emailValue)) {
        showError(emailInput, emailError, 'Please enter a valid email address');
        return false;
    }
    
    showSuccess(emailInput, emailError);
    return true;
}

function validatePassword() {
    const passwordInput = document.getElementById('password');
    const passwordError = document.getElementById('passwordError');
    const passwordValue = passwordInput.value;
    
    if (passwordValue === '') {
        showError(passwordInput, passwordError, 'Password is required');
        return false;
    }
    
    if (passwordValue.length < 8) {
        showError(passwordInput, passwordError, 'Password must be at least 8 characters');
        return false;
    }
    
    showSuccess(passwordInput, passwordError);
    return true;
}

function validateConfirmPassword() {
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const confirmPasswordError = document.getElementById('confirmPasswordError');
    const confirmPasswordValue = confirmPasswordInput.value;
    
    if (confirmPasswordValue === '') {
        showError(confirmPasswordInput, confirmPasswordError, 'Please confirm your password');
        return false;
    }
    
    if (confirmPasswordValue !== passwordInput.value) {
        showError(confirmPasswordInput, confirmPasswordError, 'Passwords do not match');
        return false;
    }
    
    showSuccess(confirmPasswordInput, confirmPasswordError);
    return true;
}

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

function clearErrors() {
    document.querySelectorAll('.error').forEach(element => {
        element.classList.remove('show');
    });
    
    document.querySelectorAll('input').forEach(input => {
        input.classList.remove('invalid');
        input.classList.remove('valid');
    });
}

function calculatePasswordStrength(password) {
    let strength = 0;
    
    // Length contributes up to 50%
    strength += Math.min(5, Math.floor(password.length / 2)) * 10;
    
    // Contains both lower and uppercase letters
    if (password.match(/([a-z].*[A-Z])|([A-Z].*[a-z])/)) strength += 10;
    
    // Contains numbers
    if (password.match(/[0-9]/)) strength += 10;
    
    // Contains special characters
    if (password.match(/[^a-zA-Z0-9]/)) strength += 10;
    
    // Contains both letters and numbers
    if (password.match(/[a-zA-Z]/) && password.match(/[0-9]/)) strength += 10;
    
    return Math.min(100, strength);
}

function updateStrengthIndicator(strength) {
    const bar = document.querySelector('.strength-bar');
    const text = document.querySelector('.strength-text');
    
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