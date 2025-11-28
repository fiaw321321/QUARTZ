// ===================== QUARTZ Tech Store — Login Logic =====================

// ---------- DOM Elements ----------
const loginForm = document.getElementById('loginForm');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const togglePasswordBtn = document.getElementById('togglePassword');
const rememberMeCheckbox = document.getElementById('rememberMe');

// ---------- Initialize ----------
document.addEventListener('DOMContentLoaded', () => {
  setupEventListeners();
  checkRememberedEmail();
});

// ---------- Event Listeners ----------
function setupEventListeners() {
  // Form submission
  loginForm.addEventListener('submit', handleLogin);

  // Password toggle
  togglePasswordBtn.addEventListener('click', togglePasswordVisibility);

  // Social login buttons
  document.querySelector('.btn-google').addEventListener('click', () => {
    handleSocialLogin('Google');
  });

  document.querySelector('.btn-facebook').addEventListener('click', () => {
    handleSocialLogin('Facebook');
  });

  // Input validation on blur
  emailInput.addEventListener('blur', validateEmail);
  passwordInput.addEventListener('blur', validatePassword);

  // Clear error on input
  emailInput.addEventListener('input', clearErrorMessage);
  passwordInput.addEventListener('input', clearErrorMessage);
}

// ---------- Password Toggle ----------
function togglePasswordVisibility() {
  const type = passwordInput.type === 'password' ? 'text' : 'password';
  passwordInput.type = type;
  
  const icon = togglePasswordBtn.querySelector('i');
  if (type === 'text') {
    icon.classList.remove('bi-eye');
    icon.classList.add('bi-eye-slash');
  } else {
    icon.classList.remove('bi-eye-slash');
    icon.classList.add('bi-eye');
  }
}

// ---------- Form Validation ----------
function validateEmail() {
  const email = emailInput.value.trim();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  if (!email) {
    showInputError(emailInput, 'กรุณากรอกอีเมล');
    return false;
  }
  
  if (!emailRegex.test(email)) {
    showInputError(emailInput, 'รูปแบบอีเมลไม่ถูกต้อง');
    return false;
  }
  
  clearInputError(emailInput);
  return true;
}

function validatePassword() {
  const password = passwordInput.value;
  
  if (!password) {
    showInputError(passwordInput, 'กรุณากรอกรหัสผ่าน');
    return false;
  }
  
  if (password.length < 6) {
    showInputError(passwordInput, 'รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร');
    return false;
  }
  
  clearInputError(passwordInput);
  return true;
}

function showInputError(input, message) {
  input.style.borderColor = '#dc2626';
  
  // Remove existing error message if any
  const existingError = input.parentElement.querySelector('.input-error');
  if (existingError) existingError.remove();
  
  // Add error message
  const errorDiv = document.createElement('div');
  errorDiv.className = 'input-error';
  errorDiv.style.cssText = 'color:#dc2626;font-size:.85rem;margin-top:4px;';
  errorDiv.textContent = message;
  input.parentElement.appendChild(errorDiv);
}

function clearInputError(input) {
  input.style.borderColor = '';
  const errorDiv = input.parentElement.querySelector('.input-error');
  if (errorDiv) errorDiv.remove();
}

function clearErrorMessage() {
  const errorMsg = document.querySelector('.error-message');
  if (errorMsg) errorMsg.classList.remove('show');
}

// ---------- Login Handler ----------
function handleLogin(e) {
  e.preventDefault();
  
  // Clear previous messages
  clearErrorMessage();
  
  // Validate inputs
  const isEmailValid = validateEmail();
  const isPasswordValid = validatePassword();
  
  if (!isEmailValid || !isPasswordValid) {
    return;
  }
  
  const email = emailInput.value.trim();
  const password = passwordInput.value;
  const rememberMe = rememberMeCheckbox.checked;
  
  // Show loading state
  const loginBtn = document.querySelector('.btn-login');
  loginBtn.classList.add('loading');
  loginBtn.innerHTML = '<span style="opacity:0">เข้าสู่ระบบ</span>';
  
  // Simulate API call
  setTimeout(() => {
    // Demo credentials (in production, this would be a real API call)
    if (email === 'demo@quartz.com' && password === 'demo123') {
      // Success
      if (rememberMe) {
        localStorage.setItem('remembered_email', email);
      } else {
        localStorage.removeItem('remembered_email');
      }
      
      // Store user session (in production, use proper authentication)
      sessionStorage.setItem('user_logged_in', 'true');
      sessionStorage.setItem('user_email', email);
      
      showSuccessMessage('เข้าสู่ระบบสำเร็จ! กำลังเปลี่ยนหน้า...');
      
      // Redirect to main page
      setTimeout(() => {
        window.location.href = 'index.html';
      }, 1500);
    } else {
      // Error
      loginBtn.classList.remove('loading');
      loginBtn.innerHTML = '<i class="bi bi-box-arrow-in-right me-2"></i>เข้าสู่ระบบ';
      showErrorMessage('อีเมลหรือรหัสผ่านไม่ถูกต้อง');
    }
  }, 1500);
}

// ---------- Social Login ----------
function handleSocialLogin(provider) {
  showNotification(`กำลังเข้าสู่ระบบด้วย ${provider}...`);
  
  // In production, this would redirect to OAuth provider
  setTimeout(() => {
    showErrorMessage(`การเข้าสู่ระบบด้วย ${provider} ยังไม่เปิดใช้งาน (Demo)`);
  }, 1000);
}

// ---------- Remember Me ----------
function checkRememberedEmail() {
  const rememberedEmail = localStorage.getItem('remembered_email');
  if (rememberedEmail) {
    emailInput.value = rememberedEmail;
    rememberMeCheckbox.checked = true;
  }
}

// ---------- Messages ----------
function showErrorMessage(message) {
  let errorDiv = document.querySelector('.error-message');
  
  if (!errorDiv) {
    errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    loginForm.insertBefore(errorDiv, loginForm.firstChild);
  }
  
  errorDiv.innerHTML = `<i class="bi bi-exclamation-circle me-2"></i>${message}`;
  errorDiv.classList.add('show');
}

function showSuccessMessage(message) {
  let successDiv = document.querySelector('.success-message');
  
  if (!successDiv) {
    successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    loginForm.insertBefore(successDiv, loginForm.firstChild);
  }
  
  successDiv.innerHTML = `<i class="bi bi-check-circle me-2"></i>${message}`;
  successDiv.classList.add('show');
}

function showNotification(message) {
  const notification = document.createElement('div');
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: linear-gradient(135deg, #0ea5e9, #1e40af);
    color: #fff;
    padding: 12px 18px;
    border-radius: 10px;
    z-index: 9999;
    box-shadow: 0 8px 22px rgba(2, 6, 23, .25);
    animation: slideInRight .3s ease;
  `;
  notification.innerHTML = `<i class="bi bi-info-circle me-2"></i>${message}`;
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.style.opacity = '0';
    notification.style.transition = '.25s';
    setTimeout(() => notification.remove(), 250);
  }, 3000);
}

// ---------- Demo Info ----------
// Show demo credentials hint
setTimeout(() => {
  const hint = document.createElement('div');
  hint.style.cssText = `
    background: #dbeafe;
    color: #1e40af;
    padding: 12px 16px;
    border-radius: 10px;
    margin-top: 16px;
    font-size: .9rem;
    border-left: 4px solid #0ea5e9;
  `;
  hint.innerHTML = `
    <strong><i class="bi bi-info-circle me-1"></i> สำหรับทดสอบ:</strong><br>
    Email: <code style="background:#fff;padding:2px 6px;border-radius:4px">demo@quartz.com</code><br>
    Password: <code style="background:#fff;padding:2px 6px;border-radius:4px">demo123</code>
  `;
  
  const formWrapper = document.querySelector('.login-form');
  formWrapper.appendChild(hint);
}, 500);

// ---------- Keyboard Shortcuts ----------
document.addEventListener('keydown', (e) => {
  // Alt + L to focus email
  if (e.altKey && e.key === 'l') {
    e.preventDefault();
    emailInput.focus();
  }
  
  // Alt + P to focus password
  if (e.altKey && e.key === 'p') {
    e.preventDefault();
    passwordInput.focus();
  }
});
