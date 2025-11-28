// ===================== QUATZ Tech Store — Receipt Logic =====================

// ---------- State ----------
let orderData = null;

// Payment method names (Thai)
const paymentMethodNames = {
  'credit-card': 'บัตรเครดิต/เดบิต',
  'promptpay': 'พร้อมเพย์',
  'bank-transfer': 'โอนเงินผ่านธนาคาร',
  'cod': 'เก็บเงินปลายทาง'
};

// Shipping method names (Thai)
const shippingMethodNames = {
  'standard': 'จัดส่งมาตรฐาน (3-5 วันทำการ)',
  'express': 'จัดส่งด่วน (1-2 วันทำการ)',
  'same-day': 'จัดส่งในวันเดียวกัน'
};

// ---------- Initialize ----------
document.addEventListener('DOMContentLoaded', () => {
  loadOrderData();
  if (orderData) {
    renderReceipt();
    showSuccessAnimation();
  } else {
    showError();
  }
  
  setupEventListeners();
});

// ---------- Event Listeners ----------
function setupEventListeners() {
  // Download PDF button
  document.getElementById('btnDownloadPDF').addEventListener('click', downloadPDF);
}

// ---------- Load Order Data ----------
function loadOrderData() {
  // Try to get from URL parameter first
  const urlParams = new URLSearchParams(window.location.search);
  const encodedData = urlParams.get('order');

  if (encodedData) {
    try {
      const decodedData = decodeURIComponent(atob(encodedData));
      orderData = JSON.parse(decodedData);
      return;
    } catch (error) {
      console.error('Error decoding order data:', error);
    }
  }

  // Fallback to localStorage
  const savedOrder = localStorage.getItem('quatz_latest_order');
  if (savedOrder) {
    try {
      orderData = JSON.parse(savedOrder);
    } catch (error) {
      console.error('Error parsing order data:', error);
    }
  }
}

// ---------- Render Receipt ----------
function renderReceipt() {
  if (!orderData) return;

  // Order Number & Date
  document.getElementById('orderNumber').textContent = orderData.orderNumber;
  
  const orderDate = new Date(orderData.orderDate);
  document.getElementById('orderDate').textContent = formatDate(orderDate);
  document.getElementById('footerDate').textContent = formatDate(orderDate);

  // Status
  const statusBadge = document.getElementById('orderStatus');
  statusBadge.textContent = 'ยืนยันแล้ว';
  statusBadge.style.background = '#10b981';

  // Payment Method
  document.getElementById('paymentMethod').textContent = 
    paymentMethodNames[orderData.payment.method] || orderData.payment.method;

  // Customer Info
  document.getElementById('customerName').textContent = orderData.customer.fullName;
  document.getElementById('customerPhone').textContent = orderData.customer.phone;
  document.getElementById('customerEmail').textContent = orderData.customer.email;

  // Shipping Address
  const address = `
    ${orderData.customer.address}
    ตำบล/แขวง ${orderData.customer.district}
    จังหวัด ${orderData.customer.province}
    ${orderData.customer.zipcode}
  `;
  document.getElementById('shippingAddress').textContent = address;

  // Shipping Method
  document.getElementById('shippingMethod').textContent = 
    shippingMethodNames[orderData.shipping.method] || orderData.shipping.method;

  // Items Table
  renderItemsTable();

  // Summary
  document.getElementById('summarySubtotal').textContent = 
    `฿${orderData.summary.subtotal.toLocaleString()}`;
  
  document.getElementById('summaryShipping').textContent = 
    orderData.summary.shipping === 0 ? 'ฟรี' : `฿${orderData.summary.shipping.toLocaleString()}`;
  
  document.getElementById('summaryTotal').textContent = 
    `฿${orderData.summary.total.toLocaleString()}`;

  // Discount (if any)
  if (orderData.summary.discount > 0) {
    const discountRow = document.getElementById('summaryDiscountRow');
    discountRow.style.display = 'flex';
    document.getElementById('summaryDiscount').textContent = 
      `-฿${orderData.summary.discount.toLocaleString()}`;
  }

  // Notes (if any)
  if (orderData.customer.notes && orderData.customer.notes.trim()) {
    const notesSection = document.getElementById('notesSection');
    notesSection.style.display = 'block';
    document.getElementById('orderNotes').textContent = orderData.customer.notes;
  }
}

// ---------- Render Items Table ----------
function renderItemsTable() {
  const tbody = document.getElementById('itemsTableBody');
  
  if (!orderData || !orderData.items) {
    tbody.innerHTML = '<tr><td colspan="5" class="text-center">ไม่มีข้อมูลสินค้า</td></tr>';
    return;
  }

  tbody.innerHTML = orderData.items.map((item, index) => {
    const itemTotal = item.price * item.quantity;
    
    return `
      <tr>
        <td class="text-center" data-label="#">${index + 1}</td>
        <td data-label="รายการ">
          <div class="item-name">${item.name}</div>
          ${item.category ? `<div class="item-description">${item.category}</div>` : ''}
        </td>
        <td class="text-center" data-label="จำนวน">${item.quantity}</td>
        <td class="text-end" data-label="ราคา/หน่วย">฿${item.price.toLocaleString()}</td>
        <td class="text-end" data-label="รวม"><strong>฿${itemTotal.toLocaleString()}</strong></td>
      </tr>
    `;
  }).join('');
}

// ---------- Format Date ----------
function formatDate(date) {
  const options = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  };
  
  return date.toLocaleDateString('th-TH', options);
}

// ---------- Show Success Animation ----------
function showSuccessAnimation() {
  const animation = document.getElementById('successAnimation');
  animation.style.display = 'block';
  
  setTimeout(() => {
    animation.classList.add('hide');
    setTimeout(() => {
      animation.style.display = 'none';
    }, 300);
  }, 2000);
}

// ---------- Download PDF ----------
function downloadPDF() {
  const button = document.getElementById('btnDownloadPDF');
  const originalHTML = button.innerHTML;
  
  // Show loading
  button.disabled = true;
  button.innerHTML = '<i class="bi bi-hourglass-split me-2"></i>กำลังสร้าง PDF...';

  // Get the receipt content
  const element = document.getElementById('receiptContent');
  
  // PDF options
  const options = {
    margin: [10, 10, 10, 10],
    filename: `QUATZ_Receipt_${orderData.orderNumber}.pdf`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { 
      scale: 2,
      useCORS: true,
      logging: false
    },
    jsPDF: { 
      unit: 'mm', 
      format: 'a4', 
      orientation: 'portrait'
    }
  };

  // Generate PDF
  html2pdf().set(options).from(element).save().then(() => {
    // Reset button
    button.disabled = false;
    button.innerHTML = originalHTML;
    
    // Show success notification
    showNotification('ดาวน์โหลด PDF สำเร็จ', 'success');
  }).catch(error => {
    console.error('PDF generation error:', error);
    
    // Reset button
    button.disabled = false;
    button.innerHTML = originalHTML;
    
    // Show error notification
    showNotification('เกิดข้อผิดพลาดในการสร้าง PDF', 'danger');
  });
}

// ---------- Show Error ----------
function showError() {
  const container = document.querySelector('.receipt-container');
  container.innerHTML = `
    <div class="text-center py-5">
      <i class="bi bi-exclamation-triangle" style="font-size: 80px; color: #f59e0b;"></i>
      <h3 class="mt-3">ไม่พบข้อมูลคำสั่งซื้อ</h3>
      <p class="text-muted mb-4">กรุณาทำการสั่งซื้อสินค้าก่อนดูใบเสร็จ</p>
      <a href="index.html" class="btn btn-primary">
        <i class="bi bi-house me-2"></i>กลับหน้าหลัก
      </a>
    </div>
  `;

  // Hide print actions
  document.querySelector('.print-actions').style.display = 'none';
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

// ---------- Add Print Styles ----------
const printStyles = document.createElement('style');
printStyles.textContent = `
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
document.head.appendChild(printStyles);

// ---------- Generate QR Code (Optional - requires library) ----------
// If you want to add actual QR code, you can use a library like qrcode.js
// For now, we'll keep it as a placeholder

// ---------- Email Receipt (Future Enhancement) ----------
function emailReceipt() {
  // This would send the receipt via email
  // Implementation depends on backend service
  showNotification('คุณสมบัตินี้จะเปิดใช้งานเร็วๆ นี้', 'info');
}

// ---------- Print Receipt ----------
window.addEventListener('beforeprint', () => {
  document.title = `ใบเสร็จ_${orderData.orderNumber}`;
});

window.addEventListener('afterprint', () => {
  document.title = 'ใบเสร็จรับเงิน — QUATZ Tech Store';
});

// ---------- Share Receipt (Future Enhancement) ----------
function shareReceipt() {
  if (navigator.share) {
    navigator.share({
      title: `ใบเสร็จ ${orderData.orderNumber}`,
      text: `คำสั่งซื้อ ${orderData.orderNumber} จาก QUATZ Tech Store`,
      url: window.location.href
    }).catch(error => {
      console.log('Error sharing:', error);
    });
  } else {
    // Fallback - copy link
    navigator.clipboard.writeText(window.location.href).then(() => {
      showNotification('คัดลอกลิงก์สำเร็จ', 'success');
    });
  }
}

// ---------- Debug Info (Remove in production) ----------
console.log('Receipt loaded for order:', orderData?.orderNumber);
