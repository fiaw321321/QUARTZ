// ===================== QUARTZ Tech Store — Logic =====================

// ---------- Products ----------
const products = [
  { id: 1,  name: 'MacBook Pro 14 (M3)', category: 'laptop',  price: 75900, icon: 'bi-laptop', image: 'https://cdsassets.apple.com/live/7WUAS350/images/tech-specs/macbook-pro-14-inch-m3-pro-or-m3.png', desc: 'ชิป Apple M3 ประสิทธิภาพสูง เหมาะงานตัดต่อ/พกพา', specs: ['M3 8-core', 'RAM 16GB', 'SSD 512GB', 'Liquid Retina XDR 14"'] },
  { id: 2,  name: 'Dell XPS 15',         category: 'laptop',  price: 68900, icon: 'bi-laptop', image: 'https://media-cdn.bnn.in.th/98730/Dell-Notebook-XPS15-9500-W5671700THW10-Silver-1-square_medium.jpg', desc: 'จอสวย ขอบบาง งานพรีเมียม', specs: ['Intel Core i7', 'RAM 16GB', 'SSD 1TB', 'OLED 15.6" 3.5K'] },
  { id: 3,  name: 'Lenovo ThinkPad T14', category: 'laptop',  price: 45900, icon: 'bi-laptop', image: 'https://p4-ofp.static.pub//fes/cms/2024/03/27/mo52s9lzdkybc5gqgao9op5793fw47934281.png?width=400&height=400', desc: 'ทนทาน งานองค์กร คีย์บอร์ดดี', specs: ['Intel Core i5', 'RAM 16GB', 'SSD 512GB', '14" FHD IPS'] },
  { id: 4,  name: 'QUARTZ Gaming A5',     category: 'desktop', price: 39900, icon: 'bi-pc', image: 'https://static.gigabyte.com/StaticFile/Image/Global/8e7bd56279b6d1402003fb94d0c43647/Product/27072/webp/2000', desc: 'เกมมิ่งระดับเริ่มต้น เล่น eSport ลื่น', specs: ['Ryzen 5 5600', 'RTX 3060 12GB', 'RAM 16GB', 'SSD 512GB'] },
  { id: 5,  name: 'QUARTZ Creator X7',    category: 'desktop', price: 72900, icon: 'bi-pc-display', image: 'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=800&h=800&fit=crop', desc: 'สายครีเอเตอร์ ตัดต่อ/เรนเดอร์เร็ว', specs: ['Core i7-13700', 'RTX 4070 12GB', 'RAM 32GB', 'SSD 1TB NVMe'] },
  { id: 6,  name: 'ASUS ProArt 27" 4K',  category: 'monitor', price: 18900, icon: 'bi-display', image: 'https://media-cdn.bnn.in.th/314901/ASUS-MONITOR-PA279CRV-(IPS-4K-60Hz-USB-C)-1-square_medium.jpg', desc: 'จอทำสีแม่นยำ 100% sRGB', specs: ['27" 4K IPS', 'ΔE<2', 'HDR10', 'USB-C 65W'] },
  { id: 7,  name: 'Samsung Odyssey G5',  category: 'monitor', price: 11900, icon: 'bi-display', image: 'https://media-cdn.bnn.in.th/74495/SAMSUNG-MONITOR-Odyssey-G5-LC32G55TQWEXXT-VA-2K-144Hz-1-square_medium.jpg', desc: 'โค้ง 1000R เล่นเกมลื่น', specs: ['27" QHD 165Hz', '1ms', 'FreeSync Premium'] },
  { id: 8,  name: 'Logitech MX Keys',    category: 'accessory', price: 3990, icon: 'bi-keyboard', image: 'https://media-cdn.bnn.in.th/212945/5-square_medium.jpg', desc: 'คีย์บอร์ดทำงานพิมพ์สบาย ต่อหลายเครื่อง', specs: ['Wireless', 'Illuminated', 'USB-C Charge'] },
  { id: 9,  name: 'Razer Basilisk V3',   category: 'accessory', price: 2290, icon: 'bi-mouse', image: 'https://www.jib.co.th/img_master/product/original/2021090908580248525_1.jpg', desc: 'เมาส์เกมมิ่ง ปรับได้หลากหลาย', specs: ['26K DPI', '11 Buttons', 'Speedflex Cable'] },
  { id: 10, name: 'HyperX Cloud III',    category: 'accessory', price: 3490, icon: 'bi-headphones', image: 'https://row.hyperx.com/cdn/shop/files/hyperx_cloud_iii_red_66x0049_main_1.jpg?v=1737967101&width=832', desc: 'หูฟังคอมโฟร์ต ตำแหน่งเสียงดี', specs: ['50mm Drivers', 'Detachable Mic', 'Multi-platform'] },
  { id: 11, name: 'Kingston NV2 1TB',    category: 'accessory', price: 2290, icon: 'bi-hdd', image: 'https://www.jib.co.th/img_master/product/original/2022101509081955789_2.jpg', desc: 'SSD NVMe คุ้มค่า ความจุ 1TB', specs: ['PCIe 4.0', 'Up to 3500MB/s', 'M.2 2280'] },
  { id: 12, name: 'Anker 7-in-1 Hub',    category: 'accessory', price: 1790, icon: 'bi-usb-c', image: 'https://cdn.shopify.com/s/files/1/0491/8460/4324/products/A83460A2-Anker_341_USB-C_Hub_7-in-1.png?v=1672496103', desc: 'USB-C Hub ต่อจอ/USB/SD ครบ', specs: ['HDMI 4K', 'USB-A x2', 'SD/microSD', 'PD Pass-Through'] },
];

// ---------- State ----------
let filteredProducts = [...products];
let cart = JSON.parse(localStorage.getItem('cart_quartz')) || [];
let currentProduct = null;
let viewMode = 'grid'; // 'grid' | 'list'

// ---------- Init ----------
document.addEventListener('DOMContentLoaded', () => {
  renderProducts();
  updateCartUI();
  setupEventListeners();
  checkUserLogin();
});

// ---------- Events ----------
function setupEventListeners() {
  document.getElementById('searchInput').addEventListener('input', handleSearch);
  document.querySelectorAll('.category-filter').forEach(r => r.addEventListener('change', applyFilters));
  document.getElementById('priceRange').addEventListener('input', (e) => {
    document.getElementById('maxPrice').textContent = '฿' + parseInt(e.target.value).toLocaleString();
    applyFilters();
  });
  document.getElementById('sortSelect').addEventListener('change', applySorting);
  document.getElementById('resetFilters').addEventListener('click', resetFilters);

  document.getElementById('btnCheckout').addEventListener('click', () => {
    if (cart.length === 0) return showNotification('ตะกร้าว่างเปล่า');
    
    // บันทึกตะกร้าไว้สำหรับหน้าชำระเงิน
    localStorage.setItem('quartz_cart', JSON.stringify(cart));
    
    // ไปหน้าชำระเงิน
    window.location.href = 'checkout.html';
  });

  document.getElementById('gridViewBtn').addEventListener('click', () => {
    viewMode = 'grid';
    document.getElementById('gridViewBtn').classList.add('active');
    document.getElementById('listViewBtn').classList.remove('active');
    renderProducts();
  });
  document.getElementById('listViewBtn').addEventListener('click', () => {
    viewMode = 'list';
    document.getElementById('listViewBtn').classList.add('active');
    document.getElementById('gridViewBtn').classList.remove('active');
    renderProducts();
  });

  // Login button
  document.getElementById('loginBtn').addEventListener('click', handleLoginButtonClick);
}

// ---------- Search / Filter / Sort ----------
function handleSearch(e) {
  const term = e.target.value.toLowerCase();
  filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(term) ||
    p.desc.toLowerCase().includes(term) ||
    p.specs.join(' ').toLowerCase().includes(term)
  );
  applyFilters();
}

function applyFilters() {
  const selectedCategory = document.querySelector('.category-filter:checked')?.value || 'all';
  const maxPrice = parseInt(document.getElementById('priceRange').value);
  const term = document.getElementById('searchInput').value.toLowerCase();

  filteredProducts = products.filter(p => {
    const matchCat = selectedCategory === 'all' || p.category === selectedCategory;
    const matchPrice = p.price <= maxPrice;
    const matchSearch = p.name.toLowerCase().includes(term) || p.desc.toLowerCase().includes(term) || p.specs.join(' ').toLowerCase().includes(term);
    return matchCat && matchPrice && matchSearch;
  });
  applySorting();
}

function applySorting() {
  const v = document.getElementById('sortSelect').value;
  switch (v) {
    case 'price-low': filteredProducts.sort((a,b)=>a.price-b.price); break;
    case 'price-high': filteredProducts.sort((a,b)=>b.price-a.price); break;
    case 'name-az': filteredProducts.sort((a,b)=>a.name.localeCompare(b.name)); break;
    case 'name-za': filteredProducts.sort((a,b)=>b.name.localeCompare(a.name)); break;
    default: filteredProducts.sort((a,b)=>a.id-b.id);
  }
  renderProducts();
}

function resetFilters() {
  document.getElementById('catAll').checked = true;
  document.getElementById('priceRange').value = 120000;
  document.getElementById('maxPrice').textContent = '฿120,000';
  document.getElementById('sortSelect').value = 'default';
  document.querySelectorAll('.chip').forEach((c,i)=>c.classList.toggle('active', i===0));
  document.getElementById('searchInput').value = '';
  filteredProducts = [...products];
  renderProducts();
}

// ---------- Render ----------
function renderProducts() {
  const container = document.getElementById('productsContainer');
  document.getElementById('productCount').textContent = `แสดง ${filteredProducts.length} รายการ`;

  const row = container.closest('.row');
  if(viewMode === 'list'){ row.classList.add('list-mode'); }
  else{ row.classList.remove('list-mode'); }

  if (filteredProducts.length === 0) {
    container.innerHTML = `
      <div class="col-12 text-center text-muted py-5">
        <i class="bi bi-search" style="font-size:3rem;"></i>
        <h5 class="mt-3">ไม่พบสินค้าที่ตรงกับเงื่อนไข</h5>
        <p>ลองเปลี่ยนตัวกรองหรือค้นหาใหม่</p>
      </div>`;
    return;
  }

  container.innerHTML = filteredProducts.map((p, idx) => `
    <div class="${viewMode==='grid' ? 'col-sm-6 col-lg-4' : 'col-12'}" style="animation-delay:${idx*0.06}s">
      <div class="product-card">
        <div class="product-image">
          <img src="${p.image}" alt="${p.name}" onerror="this.style.display='none';this.nextElementSibling.style.display='flex';">
          <i class="${p.icon}" style="display:none"></i>
          ${p.price > 50000 ? '<span class="product-badge">HOT</span>' : ''}
        </div>
        <div class="product-info">
          <div class="product-category">${getCategoryName(p.category)}</div>
          <h3 class="product-name">${p.name}</h3>
          <div class="product-price">฿${p.price.toLocaleString()}</div>
          <p class="product-description d-none d-md-block" style="margin-bottom:10px;color:#475569">${p.desc}</p>
          <div class="product-actions">
            <button class="btn-quick-view" onclick="openQuickView(${p.id})"><i class="bi bi-eye me-1"></i>ดูรายละเอียด</button>
            <button class="btn-add-cart" onclick="addToCart(${p.id})"><i class="bi bi-cart-plus me-1"></i>เพิ่มลงตะกร้า</button>
          </div>
        </div>
      </div>
    </div>
  `).join('');
}

function getCategoryName(cat){
  const m = { laptop:'Laptop', desktop:'Desktop', monitor:'Monitor', accessory:'อุปกรณ์เสริม' };
  return m[cat] || cat;
}

// ---------- Quick View ----------
function openQuickView(id){
  const p = products.find(x=>x.id===id); if(!p) return;
  currentProduct = p;

  document.getElementById('modalProductName').textContent = p.name;
  
  // Update modal image
  const modalImageContainer = document.querySelector('.modal-product-image');
  const existingImg = modalImageContainer.querySelector('img');
  const iconElement = document.getElementById('modalProductIcon');
  
  if (p.image) {
    if (existingImg) {
      existingImg.src = p.image;
      existingImg.style.display = 'block';
    } else {
      const img = document.createElement('img');
      img.src = p.image;
      img.alt = p.name;
      img.style.cssText = 'max-width:100%;max-height:100%;object-fit:contain;';
      img.onerror = function() {
        this.style.display = 'none';
        iconElement.style.display = 'flex';
      };
      modalImageContainer.insertBefore(img, iconElement);
    }
    iconElement.style.display = 'none';
  } else {
    if (existingImg) existingImg.style.display = 'none';
    iconElement.style.display = 'flex';
  }
  
  iconElement.className = `bi ${p.icon}`;
  document.getElementById('modalProductCategory').textContent = getCategoryName(p.category);
  document.getElementById('modalProductPrice').textContent = '฿' + p.price.toLocaleString();
  document.getElementById('modalProductDesc').textContent = p.desc;

  const specsHTML = p.specs.map(s=>`<p><i class="bi bi-check-circle-fill"></i>${s}</p>`).join('');
  document.getElementById('modalProductSpecs').innerHTML = specsHTML;

  document.getElementById('modalAddToCart').onclick = () => {
    addToCart(id);
    const modalEl = document.getElementById('quickViewModal');
    bootstrap.Modal.getInstance(modalEl).hide();
  };

  new bootstrap.Modal(document.getElementById('quickViewModal')).show();
}

// ---------- Cart ----------
function addToCart(id){
  const p = products.find(x=>x.id===id); if(!p) return;
  const existing = cart.find(i=>i.id===id);
  if(existing){ existing.quantity++; }
  else{ cart.push({...p, quantity:1}); }
  localStorage.setItem('cart_quartz', JSON.stringify(cart));
  updateCartUI();
  showNotification('เพิ่มสินค้าลงตะกร้าแล้ว');
}

function removeFromCart(id){
  cart = cart.filter(i=>i.id!==id);
  localStorage.setItem('cart_quartz', JSON.stringify(cart));
  updateCartUI();
}

function updateCartUI(){
  const cartCount = cart.reduce((s,i)=>s+i.quantity,0);
  document.getElementById('cartCount').textContent = cartCount;

  const cartItemsContainer = document.getElementById('cartItems');
  const cartSummary = document.getElementById('cartSummary');

  if(cart.length===0){
    cartItemsContainer.innerHTML = '<div class="empty-cart"><i class="bi bi-cart-x"></i><p>ตะกร้าสินค้าว่างเปล่า</p></div>';
    cartSummary.style.display = 'none';
    return;
  }

  cartItemsContainer.innerHTML = cart.map(item => `
    <div class="cart-item">
      <div class="cart-item-image">
        ${item.image ? `<img src="${item.image}" alt="${item.name}" style="max-width:100%;max-height:100%;object-fit:contain;" onerror="this.style.display='none';this.nextElementSibling.style.display='flex';">` : ''}
        <i class="${item.icon}" style="${item.image ? 'display:none' : ''}"></i>
      </div>
      <div class="cart-item-info">
        <div class="cart-item-name">${item.name}</div>
        <div class="cart-item-price">฿${item.price.toLocaleString()} × ${item.quantity}</div>
      </div>
      <button class="cart-item-remove" onclick="removeFromCart(${item.id})"><i class="bi bi-x"></i></button>
    </div>
  `).join('');

  const total = cart.reduce((s,i)=>s + (i.price*i.quantity), 0);
  document.getElementById('cartTotal').textContent = '฿' + total.toLocaleString();
  cartSummary.style.display = 'block';
}

// ---------- User Authentication ----------
function checkUserLogin() {
  const isLoggedIn = sessionStorage.getItem('user_logged_in');
  const userEmail = sessionStorage.getItem('user_email');
  
  const loginBtn = document.getElementById('loginBtn');
  const userDisplay = document.getElementById('userDisplay');
  
  if (isLoggedIn === 'true' && userEmail) {
    // User is logged in
    const userName = userEmail.split('@')[0];
    userDisplay.textContent = userName;
    loginBtn.className = 'btn btn-primary ms-lg-2';
    loginBtn.innerHTML = `<i class="bi bi-person-check-fill me-1"></i> <span id="userDisplay">${userName}</span>`;
    
    // Add dropdown for logout
    loginBtn.addEventListener('click', showUserMenu);
  } else {
    // User is not logged in
    loginBtn.addEventListener('click', () => {
      window.location.href = 'login.html';
    });
  }
}

function handleLoginButtonClick() {
  const isLoggedIn = sessionStorage.getItem('user_logged_in');
  
  if (isLoggedIn === 'true') {
    showUserMenu();
  } else {
    window.location.href = 'login.html';
  }
}

function showUserMenu() {
  const menu = document.createElement('div');
  menu.style.cssText = `
    position: fixed;
    top: 70px;
    right: 20px;
    background: #fff;
    border: 1px solid #e2e8f0;
    border-radius: 12px;
    box-shadow: 0 8px 22px rgba(2, 6, 23, .15);
    padding: 8px 0;
    z-index: 9999;
    min-width: 200px;
  `;
  
  const userEmail = sessionStorage.getItem('user_email');
  
  menu.innerHTML = `
    <div style="padding: 12px 16px; border-bottom: 1px solid #e2e8f0;">
      <div style="font-weight: 700; color: #0f172a;">${userEmail}</div>
      <div style="font-size: .85rem; color: #64748b;">สมาชิก QUARTZ</div>
    </div>
    <button class="user-menu-item" onclick="showProfile()">
      <i class="bi bi-person"></i> โปรไฟล์
    </button>
    <button class="user-menu-item" onclick="showOrderHistory()">
      <i class="bi bi-bag"></i> ประวัติการสั่งซื้อ
    </button>
    <button class="user-menu-item" onclick="showSettings()">
      <i class="bi bi-gear"></i> ตั้งค่า
    </button>
    <div style="border-top: 1px solid #e2e8f0; margin: 4px 0;"></div>
    <button class="user-menu-item" onclick="handleLogout()" style="color: #dc2626;">
      <i class="bi bi-box-arrow-right"></i> ออกจากระบบ
    </button>
  `;
  
  document.body.appendChild(menu);
  
  // Close menu when clicking outside
  setTimeout(() => {
    document.addEventListener('click', function closeMenu(e) {
      if (!menu.contains(e.target)) {
        menu.remove();
        document.removeEventListener('click', closeMenu);
      }
    });
  }, 100);
}

// ---------- Profile Function ----------
function showProfile() {
  closeUserMenu();
  
  const userEmail = sessionStorage.getItem('user_email');
  const userName = sessionStorage.getItem('user_name') || 'ผู้ใช้';
  
  // Get user data from localStorage if exists
  const users = JSON.parse(localStorage.getItem('quartz_users') || '[]');
  const currentUser = users.find(u => u.email === userEmail);
  
  const modal = document.createElement('div');
  modal.className = 'modal fade';
  modal.id = 'profileModal';
  modal.innerHTML = `
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title"><i class="bi bi-person-circle me-2"></i>ข้อมูลส่วนตัว</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
        </div>
        <div class="modal-body">
          <div class="text-center mb-4">
            <div style="width: 80px; height: 80px; background: linear-gradient(135deg, #0ea5e9, #1e40af); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 12px;">
              <i class="bi bi-person-fill" style="font-size: 40px; color: #fff;"></i>
            </div>
            <h4 style="margin: 0; color: #0f172a;">${userName}</h4>
            <p style="color: #64748b; margin: 4px 0;">สมาชิก QUARTZ</p>
          </div>
          
          <div style="background: #f8fafc; border-radius: 12px; padding: 16px; margin-bottom: 16px;">
            <div style="margin-bottom: 12px;">
              <div style="font-size: 0.85rem; color: #64748b; margin-bottom: 4px;">อีเมล</div>
              <div style="font-weight: 700; color: #0f172a;">${userEmail}</div>
            </div>
            ${currentUser ? `
              <div style="margin-bottom: 12px;">
                <div style="font-size: 0.85rem; color: #64748b; margin-bottom: 4px;">เบอร์โทร</div>
                <div style="font-weight: 700; color: #0f172a;">${currentUser.phone || 'ไม่ระบุ'}</div>
              </div>
              <div>
                <div style="font-size: 0.85rem; color: #64748b; margin-bottom: 4px;">สมัครเมื่อ</div>
                <div style="font-weight: 700; color: #0f172a;">${new Date(currentUser.createdAt).toLocaleDateString('th-TH')}</div>
              </div>
            ` : ''}
          </div>
          
          <div style="background: #dbeafe; border-left: 4px solid #0ea5e9; padding: 12px; border-radius: 8px;">
            <i class="bi bi-info-circle me-2" style="color: #0ea5e9;"></i>
            <span style="color: #1e40af; font-size: 0.9rem;">แก้ไขข้อมูลส่วนตัวได้ที่เมนู "ตั้งค่า"</span>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">ปิด</button>
          <button type="button" class="btn btn-primary" onclick="showSettings(); bootstrap.Modal.getInstance(document.getElementById('profileModal')).hide();">
            <i class="bi bi-gear me-1"></i>ตั้งค่า
          </button>
        </div>
      </div>
    </div>
  `;
  
  document.body.appendChild(modal);
  const bsModal = new bootstrap.Modal(modal);
  bsModal.show();
  
  modal.addEventListener('hidden.bs.modal', () => {
    modal.remove();
  });
}

// ---------- Order History Function ----------
function showOrderHistory() {
  closeUserMenu();
  
  const orders = JSON.parse(localStorage.getItem('quartz_orders') || '[]');
  const userEmail = sessionStorage.getItem('user_email');
  
  // Filter orders for current user
  const userOrders = orders.filter(order => order.customer.email === userEmail);
  
  const modal = document.createElement('div');
  modal.className = 'modal fade';
  modal.id = 'ordersModal';
  modal.innerHTML = `
    <div class="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title"><i class="bi bi-bag-check me-2"></i>ประวัติการสั่งซื้อ</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
        </div>
        <div class="modal-body">
          ${userOrders.length === 0 ? `
            <div class="text-center py-5">
              <i class="bi bi-bag-x" style="font-size: 64px; color: #cbd5e1; display: block; margin-bottom: 16px;"></i>
              <h5 style="color: #64748b;">ยังไม่มีประวัติการสั่งซื้อ</h5>
              <p style="color: #94a3b8;">เริ่มช้อปปิ้งเพื่อสร้างประวัติการสั่งซื้อของคุณ</p>
              <button class="btn btn-primary mt-3" data-bs-dismiss="modal">
                <i class="bi bi-cart-plus me-2"></i>เริ่มช้อปปิ้ง
              </button>
            </div>
          ` : `
            <div class="list-group">
              ${userOrders.map(order => `
                <div class="list-group-item" style="border-radius: 12px; margin-bottom: 12px; border: 1px solid #e2e8f0;">
                  <div class="d-flex justify-content-between align-items-start mb-2">
                    <div>
                      <h6 style="margin: 0; color: #0f172a;">
                        <i class="bi bi-receipt me-1" style="color: #0ea5e9;"></i>
                        ${order.orderNumber}
                      </h6>
                      <small style="color: #64748b;">
                        ${new Date(order.orderDate).toLocaleString('th-TH', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </small>
                    </div>
                    <span class="badge" style="background: #10b981; padding: 6px 12px; border-radius: 12px;">
                      ${order.status === 'confirmed' ? 'ยืนยันแล้ว' : order.status}
                    </span>
                  </div>
                  
                  <div style="background: #f8fafc; padding: 12px; border-radius: 8px; margin: 12px 0;">
                    <div style="font-size: 0.9rem; color: #64748b; margin-bottom: 4px;">รายการสินค้า (${order.items.length} รายการ)</div>
                    ${order.items.slice(0, 2).map(item => `
                      <div style="font-size: 0.85rem; color: #0f172a;">• ${item.name} x ${item.quantity}</div>
                    `).join('')}
                    ${order.items.length > 2 ? `<div style="font-size: 0.85rem; color: #64748b;">และอีก ${order.items.length - 2} รายการ...</div>` : ''}
                  </div>
                  
                  <div class="d-flex justify-content-between align-items-center">
                    <div>
                      <div style="font-size: 0.85rem; color: #64748b;">ยอดรวม</div>
                      <div style="font-size: 1.25rem; font-weight: 700; color: #0ea5e9;">
                        ฿${order.summary.total.toLocaleString()}
                      </div>
                    </div>
                    <button class="btn btn-sm btn-outline-primary" onclick="viewOrderReceipt('${order.orderNumber}')">
                      <i class="bi bi-receipt me-1"></i>ดูใบเสร็จ
                    </button>
                  </div>
                </div>
              `).join('')}
            </div>
          `}
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">ปิด</button>
        </div>
      </div>
    </div>
  `;
  
  document.body.appendChild(modal);
  const bsModal = new bootstrap.Modal(modal);
  bsModal.show();
  
  modal.addEventListener('hidden.bs.modal', () => {
    modal.remove();
  });
}

// ---------- View Order Receipt ----------
function viewOrderReceipt(orderNumber) {
  const orders = JSON.parse(localStorage.getItem('quartz_orders') || '[]');
  const order = orders.find(o => o.orderNumber === orderNumber);
  
  if (order) {
    // Close the orders modal
    const ordersModal = bootstrap.Modal.getInstance(document.getElementById('ordersModal'));
    if (ordersModal) ordersModal.hide();
    
    // Encode order data and redirect to receipt page
    const encodedData = btoa(encodeURIComponent(JSON.stringify(order)));
    window.open(`receipt.html?order=${encodedData}`, '_blank');
  }
}

// ---------- Settings Function ----------
function showSettings() {
  closeUserMenu();
  
  const userEmail = sessionStorage.getItem('user_email');
  const userName = sessionStorage.getItem('user_name') || '';
  
  const modal = document.createElement('div');
  modal.className = 'modal fade';
  modal.id = 'settingsModal';
  modal.innerHTML = `
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title"><i class="bi bi-gear me-2"></i>ตั้งค่าบัญชี</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
        </div>
        <div class="modal-body">
          <form id="settingsForm">
            <div class="mb-3">
              <label class="form-label" style="font-weight: 700;">
                <i class="bi bi-person me-1" style="color: #0ea5e9;"></i>ชื่อผู้ใช้
              </label>
              <input type="text" class="form-control" id="settingName" value="${userName}" placeholder="ชื่อของคุณ">
            </div>
            
            <div class="mb-3">
              <label class="form-label" style="font-weight: 700;">
                <i class="bi bi-envelope me-1" style="color: #0ea5e9;"></i>อีเมล
              </label>
              <input type="email" class="form-control" value="${userEmail}" disabled style="background: #f8fafc;">
              <small class="text-muted">ไม่สามารถเปลี่ยนอีเมลได้</small>
            </div>
            
            <hr style="margin: 20px 0;">
            
            <h6 style="margin-bottom: 16px; color: #0f172a;">การแจ้งเตือน</h6>
            
            <div class="form-check form-switch mb-3">
              <input class="form-check-input" type="checkbox" id="notifyEmail" checked>
              <label class="form-check-label" for="notifyEmail">
                แจ้งเตือนผ่านอีเมล
              </label>
            </div>
            
            <div class="form-check form-switch mb-3">
              <input class="form-check-input" type="checkbox" id="notifyPromo" checked>
              <label class="form-check-label" for="notifyPromo">
                รับข้อเสนอพิเศษและโปรโมชั่น
              </label>
            </div>
            
            <div class="form-check form-switch mb-3">
              <input class="form-check-input" type="checkbox" id="notifyOrder">
              <label class="form-check-label" for="notifyOrder">
                แจ้งเตือนสถานะการสั่งซื้อ
              </label>
            </div>
            
            <hr style="margin: 20px 0;">
            
            <div style="background: #fef2f2; border-left: 4px solid #dc2626; padding: 12px; border-radius: 8px;">
              <h6 style="color: #dc2626; margin-bottom: 8px;">
                <i class="bi bi-exclamation-triangle me-1"></i>โซนอันตราย
              </h6>
              <button type="button" class="btn btn-sm btn-outline-danger" onclick="deleteAccount()">
                <i class="bi bi-trash me-1"></i>ลบบัญชี
              </button>
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">ยกเลิก</button>
          <button type="button" class="btn btn-primary" onclick="saveSettings()">
            <i class="bi bi-check-circle me-1"></i>บันทึก
          </button>
        </div>
      </div>
    </div>
  `;
  
  document.body.appendChild(modal);
  const bsModal = new bootstrap.Modal(modal);
  bsModal.show();
  
  modal.addEventListener('hidden.bs.modal', () => {
    modal.remove();
  });
}

// ---------- Save Settings ----------
function saveSettings() {
  const newName = document.getElementById('settingName').value.trim();
  
  if (newName) {
    sessionStorage.setItem('user_name', newName);
    
    // Update in localStorage if user exists
    const userEmail = sessionStorage.getItem('user_email');
    const users = JSON.parse(localStorage.getItem('quartz_users') || '[]');
    const userIndex = users.findIndex(u => u.email === userEmail);
    
    if (userIndex !== -1) {
      users[userIndex].fullName = newName;
      localStorage.setItem('quartz_users', JSON.stringify(users));
    }
    
    // Update display
    document.getElementById('userDisplay').textContent = newName;
  }
  
  // Get notification settings
  const notifyEmail = document.getElementById('notifyEmail').checked;
  const notifyPromo = document.getElementById('notifyPromo').checked;
  const notifyOrder = document.getElementById('notifyOrder').checked;
  
  // Save to localStorage (in real app, would save to server)
  localStorage.setItem('user_settings', JSON.stringify({
    notifyEmail,
    notifyPromo,
    notifyOrder
  }));
  
  showNotification('บันทึกการตั้งค่าสำเร็จ');
  
  // Close modal
  const modal = bootstrap.Modal.getInstance(document.getElementById('settingsModal'));
  modal.hide();
}

// ---------- Delete Account ----------
function deleteAccount() {
  if (confirm('คุณแน่ใจหรือไม่ที่จะลบบัญชี?\n\nการกระทำนี้ไม่สามารถยกเลิกได้')) {
    if (confirm('ยืนยันอีกครั้ง: ข้อมูลทั้งหมดของคุณจะถูกลบอย่างถาวร')) {
      const userEmail = sessionStorage.getItem('user_email');
      
      // Remove from users list
      const users = JSON.parse(localStorage.getItem('quartz_users') || '[]');
      const updatedUsers = users.filter(u => u.email !== userEmail);
      localStorage.setItem('quartz_users', JSON.stringify(updatedUsers));
      
      // Logout
      sessionStorage.clear();
      
      showNotification('ลบบัญชีสำเร็จ');
      
      setTimeout(() => {
        window.location.href = 'index.html';
      }, 1500);
    }
  }
}

// ---------- Close User Menu ----------
function closeUserMenu() {
  const existingMenu = document.querySelector('[style*="position: fixed"][style*="top: 70px"]');
  if (existingMenu) {
    existingMenu.remove();
  }
}

function handleLogout() {
  sessionStorage.removeItem('user_logged_in');
  sessionStorage.removeItem('user_email');
  showNotification('ออกจากระบบสำเร็จ');
  setTimeout(() => {
    location.reload();
  }, 1000);
}

// ---------- Toast ----------
function showNotification(msg){
  const n = document.createElement('div');
  n.style.cssText = `position:fixed; top:20px; right:20px; background:linear-gradient(135deg,#0ea5e9,#1e40af); color:#fff; padding:12px 18px; border-radius:10px; z-index:1056; box-shadow:0 8px 22px rgba(2,6,23,.25);`;
  n.innerHTML = '<i class="bi bi-check-circle-fill me-1"></i>' + msg;
  document.body.appendChild(n);
  setTimeout(()=>{ n.style.opacity='0'; n.style.transition='.25s'; setTimeout(()=>n.remove(),250); }, 2000);
}