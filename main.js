var products = [
    { id: 1, name: "Klassik Qora Ryukzak", price: 350000, color: "qora", type: "ryukzak", rating: 5, img: "imgs/img1.jpg" },
    { id: 2, name: "Qora Crossbody Sumka", price: 220000, color: "qora", type: "crossbody", rating: 4, img: "imgs/img2.jpg" },
    { id: 3, name: "Shahar Qora Ryukzaki", price: 380000, color: "qora", type: "ryukzak", rating: 5, img: "imgs/img3.jpg" },
    { id: 5, name: "Kulrang Zamonaviy Ryukzak", price: 310000, color: "kulrang", type: "ryukzak", rating: 4, img: "imgs/img5.jpg" },
    { id: 6, name: "Sport Qora Ryukzak", price: 290000, color: "qora", type: "ryukzak", rating: 4, img: "imgs/img6.jpg" },
    { id: 7, name: "Minimalist Qora Ryukzak", price: 410000, color: "qora", type: "ryukzak", rating: 5, img: "imgs/img7.jpg" },
    { id: 8, name: "To'q Ko'k Ryukzak", price: 360000, color: "to'q ko'k", type: "ryukzak", rating: 4, img: "imgs/img8.jpg" },
    { id: 9, name: "Katta Qora Ryukzak", price: 450000, color: "qora", type: "ryukzak", rating: 5, img: "imgs/img9.jpg" },
    { id: 10, name: "Yorqin Qizil Ryukzak", price: 280000, color: "qizil", type: "ryukzak", rating: 4, img: "imgs/img10.jpg" },
    { id: 11, name: "Sariq Kundalik Ryukzak", price: 270000, color: "sariq", type: "ryukzak", rating: 4, img: "imgs/img11.jpg" }
];

var cart = [];

function init() {
    var savedCart = localStorage.getItem("bag_cart");
    if (savedCart) {
        cart = JSON.parse(savedCart);
    }
    renderProducts(products);
    updateCartUI();

    setTimeout(function() {
        var loader = document.getElementById("loader");
        if (loader) {
            loader.classList.add("hidden");
        }
    }, 1200);

    var searchInput = document.getElementById("searchInput");
    if (searchInput) {
        searchInput.addEventListener("input", searchProducts);
    }

    var big = document.getElementById('footerBig');
    if (big) {
        var text = big.textContent;
        var chars = "";
        for (var i = 0; i < text.length; i++) {
            chars += '<span style="--i:' + i + '">' + text[i] + '</span>';
        }
        big.innerHTML = chars;

        new IntersectionObserver(function(entries) {
            var entry = entries[0];
            if (entry.isIntersecting) {
                big.classList.add('show');
                setTimeout(function() {
                    big.classList.add('sweep');
                }, text.length * 70 + 600);
            } else {
                big.classList.remove('show', 'sweep');
            }
        }, { threshold: 0.3 }).observe(big);
    }
}

function renderProducts(items) {
    var grid = document.getElementById("productsGrid");
    if (!grid) return;
    grid.innerHTML = "";

    for (var i = 0; i < items.length; i++) {
        var p = items[i];
        var starsHtml = "";
        for (var s = 0; s < 5; s++) {
            if (s < p.rating) {
                starsHtml += '<i class="fa-solid fa-star"></i>';
            } else {
                starsHtml += '<i class="fa-regular fa-star"></i>';
            }
        }

        var card = document.createElement("div");
        card.className = "product-card";
        card.innerHTML = 
            '<div class="product-img-box">' +
                '<img src="' + p.img + '" alt="rasm">' +
            '</div>' +
            '<div class="product-title">' + p.name + '</div>' +
            '<div class="product-rating">' + starsHtml + '</div>' +
            '<div class="product-bottom">' +
                '<span class="product-price">' + formatPrice(p.price) + ' so\'m</span>' +
                '<button class="add-cart-btn" onclick="addToCart(' + p.id + ')">' +
                    '<i class="fa-solid fa-cart-shopping"></i>' +
                '</button>' +
            '</div>';
        grid.appendChild(card);
    }
}

function formatPrice(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

function filterProducts() {
    var colorVal = document.getElementById("colorFilter").value;
    var typeVal = document.getElementById("typeFilter").value;
    var sortVal = document.getElementById("sortFilter").value;

    var filtered = [];
    for (var i = 0; i < products.length; i++) {
        var p = products[i];
        var matchColor = (colorVal === "all" || p.color === colorVal);
        var matchType = (typeVal === "all" || p.type === typeVal);
        if (matchColor && matchType) {
            filtered.push(p);
        }
    }

    if (sortVal === "asc") {
        filtered.sort(function(a, b) { return a.price - b.price; });
    } else if (sortVal === "desc") {
        filtered.sort(function(a, b) { return b.price - a.price; });
    }

    renderProducts(filtered);
}

function searchProducts() {
    var text = document.getElementById("searchInput").value.toLowerCase();
    var filtered = [];
    for (var i = 0; i < products.length; i++) {
        var p = products[i];
        if (p.name.toLowerCase().indexOf(text) !== -1) {
            filtered.push(p);
        }
    }
    renderProducts(filtered);
}

function addToCart(id) {
    var found = null;
    for (var i = 0; i < products.length; i++) {
        if (products[i].id === id) {
            found = products[i];
            break;
        }
    }

    if (!found) return;

    var inCartItem = null;
    for (var j = 0; j < cart.length; j++) {
        if (cart[j].id === id) {
            inCartItem = cart[j];
            break;
        }
    }

    if (inCartItem) {
        inCartItem.quantity++;
    } else {
        cart.push({
            id: found.id,
            name: found.name,
            price: found.price,
            img: found.img,
            quantity: 1
        });
    }

    saveCart();
    updateCartUI();
    showNotification("Mahsulot savatchaga qo'shildi!", "success");
}

function changeQuantity(id, delta) {
    for (var i = 0; i < cart.length; i++) {
        if (cart[i].id === id) {
            cart[i].quantity += delta;
            if (cart[i].quantity <= 0) {
                cart.splice(i, 1);
            }
            break;
        }
    }
    saveCart();
    updateCartUI();
}

function removeFromCart(id) {
    for (var i = 0; i < cart.length; i++) {
        if (cart[i].id === id) {
            cart.splice(i, 1);
            break;
        }
    }
    saveCart();
    updateCartUI();
    showNotification("Mahsulot savatchadan o'chirildi", "error");
}

function clearCart() {
    if (cart.length === 0) {
        showNotification("Savatchangiz bo'sh!", "error");
        return;
    }
    cart = [];
    saveCart();
    updateCartUI();
    toggleCart();
    showNotification("Buyurtmangiz qabul qilindi!", "success");
}

function saveCart() {
    localStorage.setItem("bag_cart", JSON.stringify(cart));
}

function updateCartUI() {
    var cartCount = document.getElementById("cartCount");
    var cartItems = document.getElementById("cartItems");
    var cartTotalPrice = document.getElementById("cartTotalPrice");

    var totalQty = 0;
    var totalPrice = 0;

    if (cartItems) cartItems.innerHTML = "";

    for (var i = 0; i < cart.length; i++) {
        var item = cart[i];
        totalQty += item.quantity;
        totalPrice += item.price * item.quantity;

        if (cartItems) {
            var itemDiv = document.createElement("div");
            itemDiv.className = "cart-item";
            itemDiv.innerHTML = 
                '<img src="' + item.img + '" alt="rasm">' +
                '<div class="cart-item-info">' +
                    '<div class="cart-item-title">' + item.name + '</div>' +
                    '<div class="cart-item-price">' + formatPrice(item.price) + ' so\'m</div>' +
                    '<div class="cart-controls">' +
                        '<button onclick="changeQuantity(' + item.id + ', -1)"><i class="fa-solid fa-minus"></i></button>' +
                        '<span>' + item.quantity + '</span>' +
                        '<button onclick="changeQuantity(' + item.id + ', 1)"><i class="fa-solid fa-plus"></i></button>' +
                    '</div>' +
                '</div>' +
                '<button class="cart-remove-btn" onclick="removeFromCart(' + item.id + ')"><i class="fa-solid fa-trash"></i></button>';
            cartItems.appendChild(itemDiv);
        }
    }

    if (cartCount) cartCount.textContent = totalQty;
    if (cartTotalPrice) cartTotalPrice.textContent = formatPrice(totalPrice) + " so'm";
}

function toggleCart() {
    var modal = document.getElementById("cartModal");
    if (modal) {
        modal.classList.toggle("active");
    }
}

function toggleProfileMenu() {
    var dropdown = document.getElementById("profileDropdown");
    if (dropdown) {
        dropdown.classList.toggle("active");
    }
}

function toggleMenu() {
    var nav = document.getElementById("navMenu");
    var icon = document.getElementById("burgerIcon");
    if (nav) {
        nav.classList.toggle("active");
        if (nav.classList.contains("active")) {
            icon.className = "fa-solid fa-xmark";
        } else {
            icon.className = "fa-solid fa-bars";
        }
    }
}

function openModal(title, desc, img) {
    document.getElementById("modalTitle").textContent = title;
    document.getElementById("modalDesc").textContent = desc;
    document.getElementById("modalImg").src = img;
    document.getElementById("detailsModal").classList.add("active");
}

function closeModal() {
    document.getElementById("detailsModal").classList.remove("active");
}

function toggleFaq(element) {
    var answer = element.nextElementSibling;
    if (answer) {
        answer.classList.toggle("active");
    }
}

function handleSubscribe(event) {
    event.preventDefault();
    var emailInput = document.getElementById("newsletterEmail");
    if (emailInput && emailInput.value) {
        showNotification("Muvaffaqiyatli obuna bo'ldingiz!", "success");
        emailInput.value = "";
    }
}

function showNotification(message, type) {
    var container = document.getElementById("notificationContainer");
    if (!container) return;

    var notif = document.createElement("div");
    notif.className = "notification " + (type === "error" ? "error" : "");

    var iconClass = type === "error" ? "fa-solid fa-circle-exclamation" : "fa-solid fa-circle-check";
    
    notif.innerHTML = 
        '<i class="' + iconClass + '"></i>' +
        '<span>' + message + '</span>' +
        '<button class="notification-close" onclick="this.parentElement.remove()"><i class="fa-solid fa-xmark"></i></button>';

    container.appendChild(notif);

    setTimeout(function() {
        if (notif.parentElement) {
            notif.remove();
        }
    }, 3000);
}

window.onload = init;