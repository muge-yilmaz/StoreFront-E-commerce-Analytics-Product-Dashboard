// --- 1. DEĞİŞKENLER VE HAFIZA ---
const productGrid = document.getElementById('product-grid');
const searchInput = document.getElementById('search-input');
const productCountText = document.getElementById('product-count');
const mainContent = document.getElementById('main-content');

let cart = JSON.parse(localStorage.getItem('myCart')) || [];
let favorites = JSON.parse(localStorage.getItem('myFavorites')) || [];
let allProducts = []; 


// --- 2. YARDIMCI FONKSİYONLAR ---

function updateDashboardStats() {
    const totalProdEl = document.getElementById('stat-products');
    const revenueEl = document.getElementById('stat-revenue');
    const favEl = document.getElementById('stat-favorites');

    if (totalProdEl) totalProdEl.innerText = allProducts.length.toLocaleString();
    if (revenueEl) {
        const totalRevenue = 48290; // Sabit kalsın (İleride cart içindeki ürünlerin fiyatlarının toplamı ile dinamik yapılabilir)
revenueEl.innerText = `$${totalRevenue.toLocaleString()}`;
    }
    if (favEl) favEl.innerText = favorites.length;
}


function updateCartUI() {
    const cartCount = document.getElementById('cart-count');
    const cartValueEl = document.getElementById('stat-cart-value'); 
    
    // 1. Sağ üstteki sepet sayısını güncelle
    if (cartCount) cartCount.innerText = cart.length;
    
    // 2. Dashboard'daki toplam tutarı hesapla ve yazdır
    if (cartValueEl) {
        const total = cart.reduce((sum, item) => sum + item.price, 0);
        cartValueEl.innerText = `$${total.toLocaleString()}`;
    }
}


function updateNavUI(activeId) {
    document.querySelectorAll('nav a').forEach(btn => {
        btn.classList.remove('bg-indigo-50', 'text-indigo-600', 'font-bold');
    });
    const activeBtn = document.getElementById(activeId);
    if (activeBtn) activeBtn.classList.add('bg-indigo-50', 'text-indigo-600', 'font-bold');
}


// --- 3. ÜRÜN ÇEKME VE RENDER ---

async function fetchProducts() {
    try {
        const response = await fetch('https://dummyjson.com/products?limit=300');
        const data = await response.json();
        allProducts = data.products; 
        renderProducts(allProducts);
        updateDashboardStats();
    } catch (error) {
        console.error('Veri çekme hatası:', error);
    }
}


function renderProducts(productsList) {
    if (!productGrid) return;
    productGrid.innerHTML = '';
    if (productCountText) productCountText.innerText = `${productsList.length} items found`;

    productsList.forEach(product => {
        const isFav = favorites.some(fav => fav.id === product.id);
        const productCard = document.createElement('div');
        productCard.className = "relative group bg-white p-6 rounded-3xl shadow-sm border border-gray-200 flex flex-col gap-4 hover:shadow-lg transition duration-500";
        
        productCard.innerHTML = `
            <span class="absolute text-[10px] font-bold uppercase tracking-wider top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full shadow-sm z-10">${product.category}</span>
            <button onclick="toggleFavorite(${product.id})" class="absolute top-4 right-4 z-20 p-2 rounded-full bg-white/90 shadow-sm hover:scale-110 transition active:scale-95">
                <svg id="fav-icon-${product.id}" class="w-5 h-5 ${isFav ? 'fill-rose-500 text-rose-500' : 'text-gray-300'}" xmlns="http://www.w3.org/2000/svg" fill="${isFav ? 'currentColor' : 'none'}" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318 1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
            </button>
            <div class="w-full h-48 flex items-center justify-center overflow-hidden rounded-2xl bg-gray-50/50">
                <img src="${product.thumbnail}" alt="${product.title}" class="max-w-full max-h-full object-contain group-hover:scale-110 transition duration-500">
            </div>
            <div class="flex flex-col flex-1 px-1">
                <h2 class="font-bold text-gray-900 text-sm mb-1 truncate">${product.title}</h2>
                <div class="flex items-center justify-between mt-auto">
                    <span class="text-lg font-black text-indigo-600">$${product.price}</span>
                    <button onclick="addToCart(${product.id}, this)" class="bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-4 rounded-xl text-xs transition active:scale-95 shadow-md shadow-indigo-100">Add</button>
                </div>
            </div>
        `;
        productGrid.appendChild(productCard);
    });
}


// --- 4. KATEGORİ VE NAVİGASYON ---

async function showCategories() {
    mainContent.classList.add('hidden');
    const title = document.querySelector('#products-section h1');
    if (title) title.innerText = "All Categories";

    try {
        const response = await fetch('https://dummyjson.com/products/categories');
        const categories = await response.json();
        productGrid.innerHTML = ''; 
        categories.slice(0, 12).forEach(cat => {
            const catName = typeof cat === 'object' ? cat.name : cat;
            const catSlug = typeof cat === 'object' ? cat.slug : cat;
            const catCard = document.createElement('div');
            catCard.className = "group bg-white p-8 rounded-3xl border border-gray-200 shadow-sm hover:shadow-xl hover:border-indigo-300 transition-all cursor-pointer flex flex-col items-center gap-4 text-center";
            catCard.innerHTML = `<h3 class="font-bold text-gray-900 capitalize">${catName}</h3><span class="text-xs text-indigo-500 opacity-0 group-hover:opacity-100 transition">View Products →</span>`;
            catCard.onclick = () => {
                if (title) title.innerText = catName + " Products";
                fetchProductsByCategory(catSlug);
            };
            productGrid.appendChild(catCard);
        });
    } catch (error) { console.error("Hata:", error); }
}

async function fetchProductsByCategory(slug) {
    const response = await fetch(`https://dummyjson.com/products/category/${slug}`);
    const data = await response.json();
    renderProducts(data.products);
}


// --- 5. ETKİLEŞİM ---

window.toggleFavorite = function(productId) {
    const product = allProducts.find(p => p.id === productId);
    const index = favorites.findIndex(f => f.id === productId);
    index === -1 ? favorites.push(product) : favorites.splice(index, 1);
    localStorage.setItem('myFavorites', JSON.stringify(favorites));
    
    const currentTitle = document.querySelector('#products-section h1').innerText;
    currentTitle === "Favorites" ? renderProducts(favorites) : renderProducts(allProducts);
    updateDashboardStats();
};

window.addToCart = function(productId, buttonElement) {
    const product = allProducts.find(p => p.id === productId);
    if (product) {
        cart.push(product);
        localStorage.setItem('myCart', JSON.stringify(cart));
        updateCartUI();

        if (buttonElement) {
            const originalHTML = buttonElement.innerHTML;
            const originalBg = buttonElement.style.backgroundColor;

            // 1. Yazıyı değiştir
            buttonElement.innerHTML = `<span>Added! ✅</span>`;
            
            // 2. Rengi doğrudan stil (style) ile yeşil yap (Garanti yöntem)
            buttonElement.style.backgroundColor = "#22c55e"; // Tailwind'in green-500 kodu
            buttonElement.style.borderColor = "#22c55e";
            buttonElement.disabled = true;

            // 2 saniye sonra eski haline döndür
            setTimeout(() => {
                buttonElement.innerHTML = originalHTML;
                buttonElement.style.backgroundColor = ""; // Eski CSS rengine döner
                buttonElement.style.borderColor = "";
                buttonElement.disabled = false;
            }, 2000);
        }
    }
};


// --- 6. OLAY DİNLEYİCİLER ---

document.getElementById('nav-dashboard')?.addEventListener('click', (e) => {
    e.preventDefault();
    updateNavUI('nav-dashboard');
    // 1. İstatistik kartlarını GÖSTER
    if (mainContent) mainContent.classList.remove('hidden');
    
    // 2. Başlığı güncelle
    document.querySelector('#products-section h1').innerText = "Dashboard Overview";
    
    // 3. SADECE İLK 10 ÜRÜNÜ GÖSTER (Özet moduna geç)
    const featuredProducts = allProducts.slice(0, 10);
    renderProducts(featuredProducts);
    
    document.getElementById('product-count').innerText = "Showing top 10 featured items";
});


// --- PRODUCTS: Sadece Ürünler ---
document.getElementById('nav-products')?.addEventListener('click', (e) => {
    e.preventDefault();
    updateNavUI('nav-products');
    
    // Üstteki istatistik kartlarını GİZLE (Sadece ürünlere odaklan)
    if (mainContent) mainContent.classList.add('hidden');
    
    // Başlığı ve ürünleri güncelle
    document.querySelector('#products-section h1').innerText = "All Products";
    renderProducts(allProducts);
});


document.getElementById('nav-favorites')?.addEventListener('click', (e) => {
    e.preventDefault();
    updateNavUI('nav-favorites');
    mainContent.classList.add('hidden');
    document.querySelector('#products-section h1').innerText = "Favorites";
    renderProducts(favorites);
});


document.getElementById('nav-categories')?.addEventListener('click', (e) => {
    e.preventDefault();
    updateNavUI('nav-categories');
    showCategories();
});


// Dropdown filtrelerini bağla
document.querySelectorAll('#filter-menu a').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const categorySlug = e.target.innerText.toLowerCase().replace(" ", "-");
        document.querySelector('#filter-btn span').innerText = e.target.innerText;
        fetchProductsByCategory(categorySlug);
    });
});


if (searchInput) {
    searchInput.addEventListener('input', (e) => {
        const term = e.target.value.toLowerCase();
        const filtered = allProducts.filter(p => p.title.toLowerCase().includes(term) || p.category.toLowerCase().includes(term));
        renderProducts(filtered);
    });
}


// --- 1. GÜVENLİK KONTROLÜ (Sayfa açılır açılmaz çalışsın) ---
function checkAuth() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const userName = localStorage.getItem('userName');

    // Eğer login sayfasında değilsek VE giriş bilgileri yoksa -> Login'e postala
        if (!isLoggedIn || isLoggedIn !== 'true' || !userName) {
            window.location.replace('login.html');
            return;
        }

    // Giriş yapılmışsa arayüzü güncelle
    updateAuthUI(userName);
}


// --- 2. ARAYÜZÜ GÜNCELLEME (İsim, Avatar ve Buton) ---
function updateAuthUI(name) {
    const nameDisplays = document.querySelectorAll('.user-name-display');
    const avatar = document.getElementById('user-avatar');
    const authText = document.getElementById('auth-text');
    const authIcon = document.getElementById('auth-icon');

    // İsimleri bas
    if (name) {
        nameDisplays.forEach(el => el.innerText = name);
        if (avatar) {
            avatar.innerText = name.split(' ').map(n => n[0]).join('').toUpperCase();
        }
    }

    // Butonu "Logout" moduna al
    if (authText) authText.innerText = "Logout";
    if (authIcon) {
        authIcon.innerHTML = `
            <svg class="w-5 h-5 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>`;
    }
}


// --- 3. LOGOUT / LOGIN AKSİYONU ---
window.handleAuthAction = function() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');

    if (isLoggedIn === 'true') {
        // Kullanıcıya bir onay sorusu soralım:
        const confirmLogout = confirm("Are you sure you want to logout?");
        
        if (confirmLogout) {
            // Çıkış yap: Hafızayı temizle
            localStorage.removeItem('isLoggedIn');
            localStorage.removeItem('userName');
            localStorage.removeItem('userRole');
            
            // Kullanıcıyı login sayfasına gönder
            window.location.replace('login.html');
        }
    } else {
        // Giriş yapılmamışsa login sayfasına yönlendir
        window.location.href = 'login.html';
    }
};



checkAuth();
fetchProducts();
updateCartUI();