// ===================== QUATZ Tech Store — Register Logic =====================

// ---------- DOM Elements ----------
const registerForm = document.getElementById('registerForm');
const fullNameInput = document.getElementById('fullName');
const emailInput = document.getElementById('email');
const phoneInput = document.getElementById('phone');
const passwordInput = document.getElementById('password');
const confirmPasswordInput = document.getElementById('confirmPassword');
const togglePasswordBtn = document.getElementById('togglePassword');
const toggleConfirmPasswordBtn = document.getElementById('toggleConfirmPassword');
const agreeTermsCheckbox = document.getElementById('agreeTerms');

// ---------- Initialize ----------
document.addEventListener('DOMContentLoaded', () => {
  setupEventListeners();
});

// ---------- Event Listeners ----------
function setupEventListeners() {
  // Form submission
  registerForm.addEventListener('submit', handleRegister);

  // Password toggles
  togglePasswordBtn.addEventListener('click', () => togglePasswordVisibility(passwordInput, togglePasswordBtn));
  toggleConfirmPasswordBtn.addEventListener('click', () => togglePasswordVisibility(confirmPasswordInput, toggleConfirmPasswordBtn));

  // Social register buttons
  document.querySelector('.btn-google').addEventListener('click', () => {
    handleSocialRegister('Google');
  });

  document.querySelector('.btn-facebook').addEventListener('click', () => {
    handleSocialRegister('Facebook');
  });

  // Input validation on blur
  fullNameInput.addEventListener('blur', validateFullName);
  emailInput.addEventListener('blur', validateEmail);
  phoneInput.addEventListener('blur', validatePhone);
  passwordInput.addEventListener('blur', validatePassword);
  confirmPasswordInput.addEventListener('blur', validateConfirmPassword);

  // Clear error on input
  [fullNameInput, emailInput, phoneInput, passwordInput, confirmPasswordInput].forEach(input => {
    input.addEventListener('input', () => {
      clearInputError(input);
      clearErrorMessage();
    });
  });
}

// ---------- Password Toggle ----------
function togglePasswordVisibility(input, button) {
  const type = input.type === 'password' ? 'text' : 'password';
  input.type = type;
  
  const icon = button.querySelector('i');
  if (type === 'text') {
    icon.classList.remove('bi-eye');
    icon.classList.add('bi-eye-slash');
  } else {
    icon.classList.remove('bi-eye-slash');
    icon.classList.add('bi-eye');
  }
}

// ---------- Form Validation ----------
function validateFullName() {
  const fullName = fullNameInput.value.trim();
  
  if (!fullName) {
    showInputError(fullNameInput, 'กรุณากรอกชื่อ-นามสกุล');
    return false;
  }
  
  if (fullName.length < 3) {
    showInputError(fullNameInput, 'ชื่อต้องมีอย่างน้อย 3 ตัวอักษร');
    return false;
  }
  
  clearInputError(fullNameInput);
  return true;
}

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

function validatePhone() {
  const phone = phoneInput.value.trim();
  const phoneRegex = /^[0-9]{10}$/;
  
  if (!phone) {
    showInputError(phoneInput, 'กรุณากรอกเบอร์โทรศัพท์');
    return false;
  }
  
  if (!phoneRegex.test(phone)) {
    showInputError(phoneInput, 'เบอร์โทรศัพท์ต้องเป็นตัวเลข 10 หลัก');
    return false;
  }
  
  clearInputError(phoneInput);
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

function validateConfirmPassword() {
  const password = passwordInput.value;
  const confirmPassword = confirmPasswordInput.value;
  
  if (!confirmPassword) {
    showInputError(confirmPasswordInput, 'กรุณายืนยันรหัสผ่าน');
    return false;
  }
  
  if (password !== confirmPassword) {
    showInputError(confirmPasswordInput, 'รหัสผ่านไม่ตรงกัน');
    return false;
  }
  
  clearInputError(confirmPasswordInput);
  return true;
}

function showInputError(input, message) {
  input.style.borderColor = '#dc2626';
  
  const existingError = input.parentElement.querySelector('.input-error') || 
                        input.parentElement.parentElement.querySelector('.input-error');
  if (existingError) existingError.remove();
  
  const errorDiv = document.createElement('div');
  errorDiv.className = 'input-error';
  errorDiv.style.cssText = 'color:#dc2626;font-size:.85rem;margin-top:4px;';
  errorDiv.textContent = message;
  
  if (input.parentElement.classList.contains('password-wrapper')) {
    input.parentElement.parentElement.appendChild(errorDiv);
  } else {
    input.parentElement.appendChild(errorDiv);
  }
}

function clearInputError(input) {
  input.style.borderColor = '';
  const errorDiv = input.parentElement.querySelector('.input-error') || 
                   input.parentElement.parentElement.querySelector('.input-error');
  if (errorDiv) errorDiv.remove();
}

function clearErrorMessage() {
  const errorMsg = document.querySelector('.error-message');
  if (errorMsg) errorMsg.classList.remove('show');
}

// ---------- Register Handler ----------
function handleRegister(e) {
  e.preventDefault();
  
  clearErrorMessage();
  
  // Validate all inputs
  const isFullNameValid = validateFullName();
  const isEmailValid = validateEmail();
  const isPhoneValid = validatePhone();
  const isPasswordValid = validatePassword();
  const isConfirmPasswordValid = validateConfirmPassword();
  
  if (!isFullNameValid || !isEmailValid || !isPhoneValid || !isPasswordValid || !isConfirmPasswordValid) {
    return;
  }
  
  if (!agreeTermsCheckbox.checked) {
    showErrorMessage('กรุณายอมรับเงื่อนไขการใช้งาน');
    return;
  }
  
  const fullName = fullNameInput.value.trim();
  const email = emailInput.value.trim();
  const phone = phoneInput.value.trim();
  const password = passwordInput.value;
  
  // Show loading state
  const registerBtn = document.querySelector('.btn-login');
  registerBtn.classList.add('loading');
  registerBtn.innerHTML = '<span style="opacity:0">สมัครสมาชิก</span>';
  
  // Simulate API call
  setTimeout(() => {
    // Check if email already exists (demo)
    const existingUsers = JSON.parse(localStorage.getItem('quatz_users') || '[]');
    const emailExists = existingUsers.some(user => user.email === email);
    
    if (emailExists) {
      registerBtn.classList.remove('loading');
      registerBtn.innerHTML = '<i class="bi bi-person-plus me-2"></i>สมัครสมาชิก';
      showErrorMessage('อีเมลนี้ถูกใช้งานแล้ว');
      return;
    }
    
    // Save new user
    const newUser = {
      fullName,
      email,
      phone,
      password, // In production, this should be hashed
      createdAt: new Date().toISOString()
    };
    
    existingUsers.push(newUser);
    localStorage.setItem('quatz_users', JSON.stringify(existingUsers));
    
    // Auto login
    sessionStorage.setItem('user_logged_in', 'true');
    sessionStorage.setItem('user_email', email);
    sessionStorage.setItem('user_name', fullName);
    
    showSuccessMessage('สมัครสมาชิกสำเร็จ! กำลังเข้าสู่ระบบ...');
    
    // Redirect to main page
    setTimeout(() => {
      window.location.href = 'index.html';
    }, 1500);
  }, 1500);
}

// ---------- Social Register ----------
function handleSocialRegister(provider) {
  showNotification(`กำลังสมัครสมาชิกด้วย ${provider}...`);
  
  setTimeout(() => {
    showErrorMessage(`การสมัครสมาชิกด้วย ${provider} ยังไม่เปิดใช้งาน (Demo)`);
  }, 1000);
}

// ---------- Messages ----------
function showErrorMessage(message) {
  let errorDiv = document.querySelector('.error-message');
  
  if (!errorDiv) {
    errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    registerForm.insertBefore(errorDiv, registerForm.firstChild);
  }
  
  errorDiv.innerHTML = `<i class="bi bi-exclamation-circle me-2"></i>${message}`;
  errorDiv.classList.add('show');
}

function showSuccessMessage(message) {
  let successDiv = document.querySelector('.success-message');
  
  if (!successDiv) {
    successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    registerForm.insertBefore(successDiv, registerForm.firstChild);
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
  `;
  notification.innerHTML = `<i class="bi bi-info-circle me-2"></i>${message}`;
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.style.opacity = '0';
    notification.style.transition = '.25s';
    setTimeout(() => notification.remove(), 250);
  }, 3000);
}
