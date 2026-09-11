// 1. Hafızadan sepeti oku, yoksa boş bir liste başlat
let cart = JSON.parse(localStorage.getItem("myCart")) || [];

const cartItemsContainer = document.getElementById("cart-items-container");
const subtotal = document.getElementById("subtotal");
const totalPrice = document.getElementById("total-price");


function checkAuth() {
  const isLoggedIn = localStorage.getItem("isLoggedIn");

  // Eğer giriş yapılmamışsa (isLoggedIn true değilse)
  if (isLoggedIn !== "true") {

    // window.location.replace kullanarak geri dönülmesini engelle
    window.location.replace("login.html");
    return;
  }
  if (window.location.pathname.includes("login.html")) return;


  const savedName = localStorage.getItem("userName");
  const userDisplayElements = document.querySelectorAll(".user-name-display");
  const avatarElement = document.getElementById("user-avatar");

  if (!isLoggedIn || !savedName) {
    window.location.replace("login.html");
    return;
  }

  // 1. İsimleri Güncelle
  userDisplayElements.forEach((el) => (el.innerText = savedName));

  // 3. Avatar Baş Harflerini Oluştur
  if (avatarElement) {
    const nameParts = savedName.trim().split(/\s+/);
    let initials =
      nameParts.length > 1
        ? nameParts[0][0] + nameParts[nameParts.length - 1][0]
        : nameParts[0].substring(0, 2);
    avatarElement.innerText = initials.toUpperCase();
  }
}

// Çıkış yapma fonksiyonu (Global yapmak için window'a bağlıyoruz)
window.logout = function () {
  localStorage.clear();
  window.location.replace("login.html");
};

// Sayfa yüklendiğinde kontrol et
checkAuth();


// ÖNEMLİ: Summary güncelleme fonksiyonunu da ekleyelim (yoksa hata verir)
function updateSummary(total) {
  const formatted = `$${total.toFixed(2)}`;
  if (subtotal) subtotal.innerText = formatted;
  if (totalPrice) totalPrice.innerText = formatted;
}


// 2. Sepeti ekrana basan ana fonksiyon
function renderCart() {
  if (!cartItemsContainer) return; // Element yoksa dur

  cartItemsContainer.innerHTML = "";
  let total = 0;

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = `
            <div class="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-300">
                <p class="text-gray-400 font-medium">The cart is currently empty 🕸️</p>
                <a href="index.html" class="text-indigo-600 font-bold mt-4 inline-block hover:underline">Browse Products</a>
            </div>
        `;
    updateSummary(0);
  } else {
    cart.forEach((product, index) => {
      // quantity yoksa hata vermemesi için sadece price ekle:
      total += product.price;

      const productRow = document.createElement("div");
      productRow.className =
        "flex items-center gap-4 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm transition hover:shadow-md";

      productRow.innerHTML = `
                <img src="${product.thumbnail}" alt="${product.title}" class="w-20 h-20 object-contain bg-gray-50 rounded-xl">
                <div class="flex-1">
                    <h3 class="font-bold text-gray-900">${product.title}</h3>
                    <p class="text-sm text-gray-500">${product.category}</p>
                    <p class="font-black text-indigo-600 mt-1">$${product.price}</p>
                </div>
                <button onclick="removeFromCart(${index})" class="p-3 text-rose-500 hover:bg-rose-50 rounded-xl transition-colors">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                </button>
            `;
      cartItemsContainer.appendChild(productRow);
    });
    updateSummary(total);
  }
}


// 3. SİLME FONKSİYONU (Dışarıdan erişilebilir olması için window'a bağlıyoruz)
window.removeFromCart = function (index) {
  cart.splice(index, 1); // Diziden sil
  localStorage.setItem("myCart", JSON.stringify(cart)); // Hafızayı güncelle
  renderCart(); // Ekranı tazele
};


window.clearAllCart = function () {
  // 1. Kullanıcıya soralım:
  const confirmDelete = confirm(
    "Are you sure you want to delete all the items from the cart? 🧐",
  );

  if (confirmDelete) {
    // 2. Sepeti boşalt
    cart = [];

    // 3. LocalStorage'ı güncelle (Hafızadan sil)
    localStorage.setItem("myCart", JSON.stringify(cart));

    // 4. Sayfayı yeniden çiz (Boş sepet uyarısı çıkacaktır)
    renderCart();

    console.log("All items have been removed from the cart.");
  }
};


// Checkout butonunu bul ve tıklandığında ne yapacağını söyle
const checkoutBtn = document.querySelector("button.bg-indigo-600"); // Checkout butonunu seçer

if (checkoutBtn) {
  checkoutBtn.addEventListener("click", () => {
    if (cart.length === 0) {
      alert("Your cart is already empty! 🛒");
      return;
    }

    alert("🎉 Your order has been placed successfully! Thank you.");

    // Sipariş bittiği için sepeti sıfırla
    cart = [];
    localStorage.setItem("myCart", JSON.stringify(cart));
    renderCart();
  });
}

// 4. SAYFA AÇILDIĞINDA ÇALIŞTIR
renderCart();
