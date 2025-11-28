// ===================== QUARTZ Tech Store — Checkout Logic =====================

// ---------- State ----------
let cartItems = [];
let shippingMethod = 'standard';
let paymentMethod = 'credit-card';
let discountCode = null;
let orderData = null;

// Promo codes
const promoCodes = {
  'SAVE10': { type: 'percentage', value: 10, description: 'ลด 10%' },
  'SAVE100': { type: 'fixed', value: 100, description: 'ลด 100 บาท' },
  'FREESHIP': { type: 'freeship', value: 0, description: 'จัดส่งฟรี' }
};

// Shipping costs
const shippingCosts = {
  'standard': 0,
  'express': 150,
  'same-day': 300
};

// ---------- Initialize ----------
document.addEventListener('DOMContentLoaded', () => {
  loadCartData();
  setupEventListeners();
  renderOrderItems();
  updateSummary();
  prefillUserData();
});

// ---------- Load Cart Data ----------
function loadCartData() {
  const savedCart = localStorage.getItem('quartz_cart');
  if (savedCart) {
    cartItems = JSON.parse(savedCart);
  }

  // ถ้าตะกร้าว่าง
  if (cartItems.length === 0) {
    showEmptyCart();
  }
}

// ---------- Prefill User Data ----------
function prefillUserData() {
  const userEmail = sessionStorage.getItem('user_email');
  const userName = sessionStorage.getItem('user_name');

  if (userEmail) {
    document.getElementById('email').value = userEmail;
  }

  if (userName) {
    document.getElementById('fullName').value = userName;
  }
}

// ---------- Event Listeners ----------
function setupEventListeners() {
  // Shipping method
  document.querySelectorAll('input[name="shipping"]').forEach(radio => {
    radio.addEventListener('change', (e) => {
      shippingMethod = e.target.value;
      updateSummary();
    });
  });

  // Payment method
  document.querySelectorAll('input[name="payment"]').forEach(radio => {
    radio.addEventListener('change', (e) => {
      paymentMethod = e.target.value;
      toggleCreditCardForm();
    });
  });

  // Apply promo code
  document.getElementById('applyPromo').addEventListener('click', applyPromoCode);
  document.getElementById('promoCode').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      applyPromoCode();
    }
  });

  // Place order
  document.getElementById('btnPlaceOrder').addEventListener('click', placeOrder);

  // View receipt
  document.getElementById('btnViewReceipt').addEventListener('click', viewReceipt);

  // Format card inputs
  setupCardFormatting();
}

// ---------- Toggle Credit Card Form ----------
function toggleCreditCardForm() {
  const form = document.getElementById('creditCardForm');
  if (paymentMethod === 'credit-card') {
    form.style.display = 'block';
  } else {
    form.style.display = 'none';
  }
}

// ---------- Setup Card Formatting ----------
function setupCardFormatting() {
  const cardNumber = document.getElementById('cardNumber');
  const cardExpiry = document.getElementById('cardExpiry');
  const cardCVV = document.getElementById('cardCVV');

  // Format card number (1234 5678 9012 3456)
  cardNumber.addEventListener('input', (e) => {
    let value = e.target.value.replace(/\s/g, '');
    value = value.replace(/\D/g, '');
    value = value.match(/.{1,4}/g)?.join(' ') || value;
    e.target.value = value;
  });

  // Format expiry (MM/YY)
  cardExpiry.addEventListener('input', (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length >= 2) {
      value = value.slice(0, 2) + '/' + value.slice(2, 4);
    }
    e.target.value = value;
  });

  // CVV numbers only
  cardCVV.addEventListener('input', (e) => {
    e.target.value = e.target.value.replace(/\D/g, '');
  });
}

// ---------- Render Order Items ----------
function renderOrderItems() {
  const container = document.getElementById('orderItems');
  
  if (cartItems.length === 0) {
    container.innerHTML = '<p class="text-muted text-center py-4">ไม่มีสินค้าในตะกร้า</p>';
    return;
  }

  container.innerHTML = cartItems.map(item => `
    <div class="order-item">
      <div class="order-item-image">
        ${item.image ? 
          `<img src="${item.image}" alt="${item.name}">` : 
          `<i class="bi ${item.icon || 'bi-box'}"></i>`
        }
      </div>
      <div class="order-item-info">
        <div class="order-item-name">${item.name}</div>
        <div class="order-item-qty">จำนวน: ${item.quantity}</div>
      </div>
      <div class="order-item-price">
        ฿${(item.price * item.quantity).toLocaleString()}
      </div>
    </div>
  `).join('');
}

// ---------- Apply Promo Code ----------
function applyPromoCode() {
  const input = document.getElementById('promoCode');
  const code = input.value.trim().toUpperCase();

  if (!code) {
    showNotification('กรุณากรอกรหัสส่วนลด', 'warning');
    return;
  }

  if (promoCodes[code]) {
    discountCode = code;
    updateSummary();
    showNotification(`ใช้รหัส ${code} สำเร็จ: ${promoCodes[code].description}`, 'success');
    input.value = '';
  } else {
    showNotification('รหัสส่วนลดไม่ถูกต้อง', 'danger');
  }
}

// ---------- Update Summary ----------
function updateSummary() {
  // Calculate subtotal
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  // Calculate shipping
  let shipping = shippingCosts[shippingMethod];

  // Calculate discount
  let discount = 0;
  if (discountCode && promoCodes[discountCode]) {
    const promo = promoCodes[discountCode];
    if (promo.type === 'percentage') {
      discount = subtotal * (promo.value / 100);
    } else if (promo.type === 'fixed') {
      discount = promo.value;
    } else if (promo.type === 'freeship') {
      shipping = 0;
    }
  }

  // Calculate total
  const total = subtotal + shipping - discount;

  // Update UI
  document.getElementById('subtotal').textContent = `฿${subtotal.toLocaleString()}`;
  document.getElementById('shippingCost').textContent = shipping === 0 ? 'ฟรี' : `฿${shipping.toLocaleString()}`;
  document.getElementById('grandTotal').textContent = `฿${total.toLocaleString()}`;

  // Show/hide discount row
  const discountRow = document.getElementById('discountRow');
  if (discount > 0) {
    discountRow.style.display = 'flex';
    document.getElementById('discountAmount').textContent = `-฿${discount.toLocaleString()}`;
  } else {
    discountRow.style.display = 'none';
  }
}

// ---------- Validate Form ----------
function validateForm() {
  const form = document.getElementById('shippingForm');
  
  if (!form.checkValidity()) {
    form.reportValidity();
    return false;
  }

  // Additional validation for credit card
  if (paymentMethod === 'credit-card') {
    const cardNumber = document.getElementById('cardNumber').value.replace(/\s/g, '');
    const cardName = document.getElementById('cardName').value.trim();
    const cardExpiry = document.getElementById('cardExpiry').value;
    const cardCVV = document.getElementById('cardCVV').value;

    if (!cardNumber || cardNumber.length < 13) {
      showNotification('กรุณากรอกหมายเลขบัตรให้ถูกต้อง', 'warning');
      return false;
    }

    if (!cardName) {
      showNotification('กรุณากรอกชื่อบนบัตร', 'warning');
      return false;
    }

    if (!cardExpiry || cardExpiry.length < 5) {
      showNotification('กรุณากรอกวันหมดอายุบัตร', 'warning');
      return false;
    }

    if (!cardCVV || cardCVV.length < 3) {
      showNotification('กรุณากรอก CVV', 'warning');
      return false;
    }
  }

  return true;
}

// ---------- Place Order ----------
function placeOrder() {
  // Validate
  if (!validateForm()) {
    return;
  }

  if (cartItems.length === 0) {
    showNotification('ตะกร้าสินค้าว่างเปล่า', 'warning');
    return;
  }

  // Collect form data
  const formData = {
    customer: {
      fullName: document.getElementById('fullName').value.trim(),
      phone: document.getElementById('phone').value.trim(),
      email: document.getElementById('email').value.trim(),
      address: document.getElementById('address').value.trim(),
      district: document.getElementById('district').value.trim(),
      province: document.getElementById('province').value,
      zipcode: document.getElementById('zipcode').value.trim(),
      notes: document.getElementById('notes').value.trim()
    },
    shipping: {
      method: shippingMethod,
      cost: shippingCosts[shippingMethod]
    },
    payment: {
      method: paymentMethod
    },
    items: cartItems,
    discount: discountCode ? promoCodes[discountCode] : null,
    discountCode: discountCode
  };

  // Calculate totals
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  let shipping = shippingCosts[shippingMethod];
  let discount = 0;

  if (discountCode && promoCodes[discountCode]) {
    const promo = promoCodes[discountCode];
    if (promo.type === 'percentage') {
      discount = subtotal * (promo.value / 100);
    } else if (promo.type === 'fixed') {
      discount = promo.value;
    } else if (promo.type === 'freeship') {
      shipping = 0;
    }
  }

  const total = subtotal + shipping - discount;

  formData.summary = {
    subtotal,
    shipping,
    discount,
    total
  };

  // Show loading
  const btn = document.getElementById('btnPlaceOrder');
  btn.classList.add('loading');
  btn.innerHTML = '<span style="opacity:0">กำลังประมวลผล...</span>';

  // Simulate payment processing
  setTimeout(() => {
    // Generate order number
    const orderNumber = 'QTZ' + Date.now().toString().slice(-8);
    formData.orderNumber = orderNumber;
    formData.orderDate = new Date().toISOString();
    formData.status = 'confirmed';

    // Save order data
    orderData = formData;
    saveOrder(formData);

    // Clear cart
    localStorage.removeItem('quartz_cart');
    cartItems = [];

    // Update cart badge
    if (window.opener) {
      window.opener.postMessage({ type: 'cartUpdated', count: 0 }, '*');
    }

    // Show success modal
    document.getElementById('orderNumber').textContent = orderNumber;
    const modal = new bootstrap.Modal(document.getElementById('successModal'));
    modal.show();

    // Reset button
    btn.classList.remove('loading');
    btn.innerHTML = '<i class="bi bi-check-circle me-2"></i>ยืนยันคำสั่งซื้อ';
  }, 2000);
}

// ---------- Save Order ----------
function saveOrder(order) {
  // Save to localStorage (ในระบบจริงจะส่งไป server)
  const orders = JSON.parse(localStorage.getItem('quartz_orders') || '[]');
  orders.push(order);
  localStorage.setItem('quartz_orders', JSON.stringify(orders));

  // Save latest order for receipt
  localStorage.setItem('quartz_latest_order', JSON.stringify(order));
}

// ---------- View Receipt ----------
function viewReceipt() {
  if (orderData) {
    // Encode order data
    const encodedData = btoa(encodeURIComponent(JSON.stringify(orderData)));
    window.location.href = `receipt.html?order=${encodedData}`;
  }
}

// ---------- Show Empty Cart ----------
function showEmptyCart() {
  const main = document.querySelector('.checkout-main .container');
  main.innerHTML = `
    <div class="empty-cart-state">
      <i class="bi bi-cart-x"></i>
      <h3>ตะกร้าสินค้าว่างเปล่า</h3>
      <p>กรุณาเพิ่มสินค้าลงในตะกร้าก่อนทำการชำระเงิน</p>
      <a href="index.html" class="btn btn-primary">
        <i class="bi bi-arrow-left me-2"></i>กลับไปช้อปปิ้ง
      </a>
    </div>
  `;
}

// ---------- Notifications ----------
function showNotification(message, type = 'info') {
  const colors = {
    success: '#10b981',
    danger: '#ef4444',
    warning: '#f59e0b',
    info: '#0ea5e9'
  };

  const icons = {
    success: 'check-circle',
    danger: 'x-circle',
    warning: 'exclamation-triangle',
    info: 'info-circle'
  };

  const notification = document.createElement('div');
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: ${colors[type]};
    color: #fff;
    padding: 14px 20px;
    border-radius: 12px;
    box-shadow: 0 8px 24px rgba(0,0,0,0.2);
    z-index: 9999;
    max-width: 400px;
    animation: slideInRight 0.3s ease;
  `;

  notification.innerHTML = `
    <i class="bi bi-${icons[type]} me-2"></i>${message}
  `;

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.style.animation = 'slideOutRight 0.3s ease';
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

// ---------- CSS Animations ----------
const style = document.createElement('style');
style.textContent = `
  @keyframes slideInRight {
    from {
      transform: translateX(400px);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }

  @keyframes slideOutRight {
    from {
      transform: translateX(0);
      opacity: 1;
    }
    to {
      transform: translateX(400px);
      opacity: 0;
    }
  }
`;
document.head.appendChild(style);

// ---------- Phone Number Formatting ----------
document.getElementById('phone').addEventListener('input', (e) => {
  let value = e.target.value.replace(/\D/g, '');
  if (value.length > 3 && value.length <= 6) {
    value = value.slice(0, 3) + '-' + value.slice(3);
  } else if (value.length > 6) {
    value = value.slice(0, 3) + '-' + value.slice(3, 6) + '-' + value.slice(6, 10);
  }
  e.target.value = value;
});

// ---------- Zipcode Validation ----------
document.getElementById('zipcode').addEventListener('input', (e) => {
  e.target.value = e.target.value.replace(/\D/g, '').slice(0, 5);
});
