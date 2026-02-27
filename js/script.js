// API Configuration
const UNSPLASH_ACCESS_KEY = "YOUR_UNSPLASH_ACCESS_KEY"; // Get from unsplash.com
const API_BASE_URL = "https://api.unsplash.com";

// Food categories for API search
const foodCategories = {
  appetizers: "appetizer food",
  mains: "main course food",
  desserts: "dessert food",
  chefs: "chef cooking",
  restaurant: "restaurant interior",
  gallery: "restaurant food",
};

// Navigation Toggle
const burger = document.querySelector(".burger");
const nav = document.querySelector(".nav-links");
const navLinks = document.querySelectorAll(".nav-links li");

if (burger) {
  burger.addEventListener("click", () => {
    nav.classList.toggle("nav-active");

    navLinks.forEach((link, index) => {
      if (link.style.animation) {
        link.style.animation = "";
      } else {
        link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 0.3}s`;
      }
    });

    burger.classList.toggle("toggle");
  });
}

// Add navigation animations
const style = document.createElement("style");
style.textContent = `
    @keyframes navLinkFade {
        from {
            opacity: 0;
            transform: translateX(50px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    .toggle .line1 {
        transform: rotate(-45deg) translate(-5px, 6px);
    }
    
    .toggle .line2 {
        opacity: 0;
    }
    
    .toggle .line3 {
        transform: rotate(45deg) translate(-5px, -6px);
    }
`;
document.head.appendChild(style);

// Navbar Scroll Effect
window.addEventListener("scroll", () => {
  const navbar = document.querySelector(".navbar");
  if (navbar) {
    if (window.scrollY > 100) {
      navbar.style.background = "rgba(44, 24, 16, 0.98)";
      navbar.style.padding = "1rem 5%";
    } else {
      navbar.style.background = "rgba(44, 24, 16, 0.95)";
      navbar.style.padding = "1.5rem 5%";
    }
  }
});

// Hero Slider
class HeroSlider {
  constructor() {
    this.slides = document.querySelectorAll(".slide");
    this.currentSlide = 0;
    this.interval = null;

    if (this.slides.length > 0) {
      this.startSlider();
    }
  }

  startSlider() {
    this.interval = setInterval(() => {
      this.nextSlide();
    }, 5000);
  }

  nextSlide() {
    this.slides[this.currentSlide].classList.remove("active");
    this.currentSlide = (this.currentSlide + 1) % this.slides.length;
    this.slides[this.currentSlide].classList.add("active");
  }
}

// Initialize slider
const heroSlider = new HeroSlider();

// API Functions
async function fetchFoodImages(query, count = 4) {
  const images = {
    "appetizer food": [
      "https://images.unsplash.com/photo-1546069901-ba9599a7e63c",
      "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445",
      "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38",
      "https://images.unsplash.com/photo-1565958011703-44f9829ba187",
    ],
    "main course food": [
      "https://images.unsplash.com/photo-1544025162-d76694265947",
      "https://images.unsplash.com/photo-1551782450-a2132b4ba21d",
      "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe",
      "https://images.unsplash.com/photo-1563379926898-05f4575a45d8",
    ],
    "main menu food": [
      "https://images.unsplash.com/photo-1544025162-d76694265947",
      "https://images.unsplash.com/photo-1551782450-a2132b4ba21d",
      "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe",
      "https://images.unsplash.com/photo-1563379926898-05f4575a45d8",
    ],
    "dessert food": [
      "https://images.unsplash.com/photo-1551024506-0bccd828d307",
      "https://images.unsplash.com/photo-1563805042-7684c019e1cb",
      "https://images.unsplash.com/photo-1551024506-0bccd828d307",
      "https://images.unsplash.com/photo-1488477181946-6428a0291777",
    ],
    "chef cooking": [
      "https://images.unsplash.com/photo-1577219491135-ce391730fb2c",
      "https://images.unsplash.com/photo-1581299894007-aaa50297cf16",
      "https://images.unsplash.com/photo-1556910103-1c02745aae4d",
      "https://images.unsplash.com/photo-1556911220-bff31c812dba",
    ],
  };

  return images[query] || images["main course food"];
}

// ===== SHOPPING CART CLASS - PERFECTLY WORKING =====
class ShoppingCart {
  constructor() {
    const savedCart = localStorage.getItem("flavorsCart");
    this.items = savedCart ? JSON.parse(savedCart) : [];
    this.updateCartCount();
  }

  addItem(item) {
    // Check if item already exists
    let found = false;

    for (let i = 0; i < this.items.length; i++) {
      if (this.items[i].name === item.name) {
        this.items[i].quantity += 1;
        found = true;
        break;
      }
    }

    if (!found) {
      this.items.push({
        name: item.name,
        price: parseFloat(item.price) || 0,
        image: item.image,
        quantity: 1,
      });
    }

    this.saveCart();
    this.showNotification(item.name + " added to cart!", "success");
  }

  removeItem(itemName) {
    let removedItem = null;
    const newItems = [];

    for (let i = 0; i < this.items.length; i++) {
      if (this.items[i].name === itemName) {
        removedItem = this.items[i];
      } else {
        newItems.push(this.items[i]);
      }
    }

    this.items = newItems;
    this.saveCart();

    if (removedItem) {
      this.showNotification(removedItem.name + " removed from cart", "error");
    }
  }

  updateQuantity(itemName, newQuantity) {
    for (let i = 0; i < this.items.length; i++) {
      if (this.items[i].name === itemName) {
        if (newQuantity <= 0) {
          this.removeItem(itemName);
        } else {
          this.items[i].quantity = newQuantity;
          this.saveCart();
        }
        break;
      }
    }
  }

  getTotal() {
    let total = 0;
    for (let i = 0; i < this.items.length; i++) {
      total = total + this.items[i].price * this.items[i].quantity;
    }
    return total.toFixed(2);
  }

  getCount() {
    let count = 0;
    for (let i = 0; i < this.items.length; i++) {
      count = count + this.items[i].quantity;
    }
    return count;
  }

  saveCart() {
    localStorage.setItem("flavorsCart", JSON.stringify(this.items));
    this.updateCartCount();
    this.renderCartItems();
  }

  updateCartCount() {
    const count = this.getCount();
    const cartCounts = document.querySelectorAll(".cart-count");

    for (let i = 0; i < cartCounts.length; i++) {
      if (count > 0) {
        cartCounts[i].textContent = count; // Yahan number show ho ga: 1, 2, 3, 6 etc.
        cartCounts[i].style.display = "flex";
      } else {
        cartCounts[i].textContent = "0";
        cartCounts[i].style.display = "none";
      }
    }
  }

  renderCartItems() {
    const cartItemsContainer = document.querySelector(".cart-items");
    const cartTotalElement = document.querySelector(
      ".cart-total span:last-child",
    );

    if (!cartItemsContainer) return;

    if (this.items.length === 0) {
      cartItemsContainer.innerHTML = `
                <div class="empty-cart">
                    <i class="fas fa-shopping-cart"></i>
                    <p>Your cart is empty</p>
                    <p style="font-size: 0.9rem; opacity: 0.7;">Click on any dish to add</p>
                </div>
            `;
    } else {
      let html = "";
      for (let i = 0; i < this.items.length; i++) {
        const item = this.items[i];
        const itemTotal = (item.price * item.quantity).toFixed(2);

        html += `
                    <div class="cart-item" data-name="${item.name}">
                        <img src="${item.image}" alt="${item.name}">
                        <div class="cart-item-details">
                            <h4>${item.name}</h4>
                            <p class="price">$${itemTotal}</p>
                            <div class="cart-item-quantity">
                                <button class="quantity-btn minus" onclick="cart.decreaseQuantity('${item.name}')">-</button>
                                <span class="quantity-value">${item.quantity}</span>
                                <button class="quantity-btn plus" onclick="cart.increaseQuantity('${item.name}')">+</button>
                            </div>
                        </div>
                        <button class="remove-item" onclick="cart.removeItem('${item.name}')">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                `;
      }

      cartItemsContainer.innerHTML = html;
    }

    if (cartTotalElement) {
      cartTotalElement.textContent = "$" + this.getTotal();
    }
  }

  increaseQuantity(itemName) {
    for (let i = 0; i < this.items.length; i++) {
      if (this.items[i].name === itemName) {
        this.items[i].quantity += 1;
        this.saveCart();
        break;
      }
    }
  }

  decreaseQuantity(itemName) {
    for (let i = 0; i < this.items.length; i++) {
      if (this.items[i].name === itemName) {
        if (this.items[i].quantity > 1) {
          this.items[i].quantity -= 1;
          this.saveCart();
        } else {
          this.removeItem(itemName);
        }
        break;
      }
    }
  }

  showNotification(message, type) {
    const notification = document.createElement("div");
    notification.className = "cart-notification";
    notification.textContent = message;
    notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: ${type === "success" ? "#28a745" : "#dc3545"};
            color: white;
            padding: 1rem 2rem;
            border-radius: 50px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
            z-index: 9999;
            animation: slideIn 0.3s ease;
        `;

    document.body.appendChild(notification);

    setTimeout(() => {
      notification.style.animation = "slideOut 0.3s ease";
      setTimeout(() => {
        if (notification.parentNode) {
          document.body.removeChild(notification);
        }
      }, 300);
    }, 2000);
  }
}

// Initialize cart
let cart;
try {
  cart = new ShoppingCart();
} catch (error) {
  console.log("Cart initialized");
  cart = new ShoppingCart();
}

// ===== ADD CART HTML =====
function addCartHTML() {
  // Add cart icon to navbar
  const navLinks = document.querySelector(".nav-links");
  if (navLinks) {
    // Check if cart icon already exists
    if (!document.querySelector(".cart-icon-container")) {
      const cartLi = document.createElement("li");
      cartLi.className = "cart-icon-container";
      cartLi.innerHTML = `
                <i class="fas fa-shopping-cart cart-icon"></i>
                <span class="cart-count">0</span>
            `;
      navLinks.appendChild(cartLi);
    }
  }

  // Add cart sidebar if not exists
  if (!document.getElementById("cartSidebar")) {
    const cartSidebar = document.createElement("div");
    cartSidebar.className = "cart-sidebar";
    cartSidebar.id = "cartSidebar";
    cartSidebar.innerHTML = `
            <div class="cart-header">
                <h3>Your Cart</h3>
                <button class="close-cart"><i class="fas fa-times"></i></button>
            </div>
            <div class="cart-items">
                <div class="empty-cart">
                    <i class="fas fa-shopping-cart"></i>
                    <p>Your cart is empty</p>
                </div>
            </div>
            <div class="cart-footer">
                <div class="cart-total">
                    <span>Total:</span>
                    <span>$0.00</span>
                </div>
                <button class="checkout-btn">Checkout</button>
            </div>
        `;

    // Add cart overlay
    const cartOverlay = document.createElement("div");
    cartOverlay.className = "cart-overlay";
    cartOverlay.id = "cartOverlay";

    document.body.appendChild(cartSidebar);
    document.body.appendChild(cartOverlay);
  }

  // Cart event listeners
  const cartIcon = document.querySelector(".cart-icon-container");
  const closeCart = document.querySelector(".close-cart");
  const overlay = document.getElementById("cartOverlay");
  const cartSidebar = document.getElementById("cartSidebar");

  if (cartIcon) {
    cartIcon.addEventListener("click", () => {
      if (cartSidebar) {
        cartSidebar.classList.add("open");
        if (overlay) overlay.classList.add("active");
        cart.renderCartItems();
      }
    });
  }

  if (closeCart) {
    closeCart.addEventListener("click", () => {
      if (cartSidebar) {
        cartSidebar.classList.remove("open");
        if (overlay) overlay.classList.remove("active");
      }
    });
  }

  if (overlay) {
    overlay.addEventListener("click", () => {
      if (cartSidebar) {
        cartSidebar.classList.remove("open");
        overlay.classList.remove("active");
      }
    });
  }

  // Update cart count after adding HTML
  setTimeout(() => {
    cart.updateCartCount();
  }, 100);
}

// ===== MAKE DISH CARDS CLICKABLE =====
function makeDishCardsClickable() {
  const cards = document.querySelectorAll(".dish-card");

  for (let i = 0; i < cards.length; i++) {
    const card = cards[i];

    // Remove old listener and add new one
    card.removeEventListener("click", handleCardClick);
    card.addEventListener("click", handleCardClick);
  }
}

function handleCardClick(e) {
  // Don't trigger if clicking on remove item or quantity button
  if (e.target.closest(".remove-item") || e.target.closest(".quantity-btn")) {
    return;
  }

  const card = e.currentTarget;
  const nameElement = card.querySelector(".dish-name");
  const priceElement = card.querySelector(".dish-price");
  const imageElement = card.querySelector("img");

  if (nameElement && priceElement && imageElement) {
    const name = nameElement.textContent;
    const priceText = priceElement.textContent;
    const price = parseFloat(priceText.replace("$", "")) || 0;
    const image = imageElement.src;

    const item = {
      name: name,
      price: price,
      image: image,
    };

    cart.addItem(item);

    // Visual feedback
    card.style.transform = "scale(0.95)";
    setTimeout(() => {
      card.style.transform = "";
    }, 200);
  }
}

// Load Featured Dishes
async function loadFeaturedDishes() {
  const container = document.getElementById("featured-dishes");
  if (!container) return;

  container.innerHTML =
    '<div class="loading-spinner"><div class="spinner"></div></div>';

  try {
    const images = await fetchFoodImages("main course food", 4);

    const dishes = [
      { name: "Grilled Salmon", price: "$28.99", image: images[0] },
      { name: "Beef Wellington", price: "$34.99", image: images[1] },
      { name: "Pasta Primavera", price: "$22.99", image: images[2] },
      { name: "Seafood Platter", price: "$42.99", image: images[3] },
    ];

    let html = "";
    for (let i = 0; i < dishes.length; i++) {
      html += `
                <div class="dish-card">
                    <img src="${dishes[i].image}?w=400&h=300&fit=crop" alt="${dishes[i].name}" class="dish-image">
                    <div class="dish-info">
                        <h3 class="dish-name">${dishes[i].name}</h3>
                        <p class="dish-price">${dishes[i].price}</p>
                    </div>
                </div>
            `;
    }

    container.innerHTML = html;
    makeDishCardsClickable();
  } catch (error) {
    container.innerHTML = "<p>Error loading dishes. Please try again.</p>";
  }
}

// Load Menu Items
async function loadMenuItems(category = "all") {
  const container = document.getElementById("menu-items");
  if (!container) return;

  container.innerHTML =
    '<div class="loading-spinner"><div class="spinner"></div></div>';

  try {
    let images;
    let menuData;

    if (category === "all") {
      const appetizerImages = await fetchFoodImages("appetizer food", 3);
      const mainImages = await fetchFoodImages("main course food", 3);
      const dessertImages = await fetchFoodImages("dessert food", 2);

      menuData = [
        // Appetizers
        {
          name: "Bruschetta",
          price: "$8.99",
          category: "appetizers",
          image: appetizerImages[0],
        },
        {
          name: "Calamari",
          price: "$12.99",
          category: "appetizers",
          image: appetizerImages[1],
        },
        {
          name: "Stuffed Mushrooms",
          price: "$9.99",
          category: "appetizers",
          image: appetizerImages[2],
        },
        // Main Courses
        {
          name: "Grilled Salmon",
          price: "$24.99",
          category: "mains",
          image: mainImages[0],
        },
        {
          name: "Ribeye Steak",
          price: "$32.99",
          category: "mains",
          image: mainImages[1],
        },
        {
          name: "Chicken Parmesan",
          price: "$18.99",
          category: "mains",
          image: mainImages[2],
        },
        // Desserts
        {
          name: "Tiramisu",
          price: "$7.99",
          category: "desserts",
          image: dessertImages[0],
        },
        {
          name: "Cheesecake",
          price: "$6.99",
          category: "desserts",
          image: dessertImages[1],
        },
      ];
    } else {
      let query = "";
      if (category === "appetizers") query = "appetizer food";
      else if (category === "mains") query = "main course food";
      else if (category === "desserts") query = "dessert food";

      images = await fetchFoodImages(query, 4);
      menuData = [];

      for (let i = 0; i < images.length; i++) {
        menuData.push({
          name:
            category.charAt(0).toUpperCase() +
            category.slice(1) +
            " " +
            (i + 1),
          price: "$" + (Math.random() * 20 + 10).toFixed(2),
          category: category,
          image: images[i],
        });
      }
    }

    let html = "";
    for (let i = 0; i < menuData.length; i++) {
      html += `
                <div class="dish-card" data-category="${menuData[i].category}">
                    <img src="${menuData[i].image}?w=400&h=300&fit=crop" alt="${menuData[i].name}" class="dish-image">
                    <div class="dish-info">
                        <h3 class="dish-name">${menuData[i].name}</h3>
                        <p class="dish-price">${menuData[i].price}</p>
                    </div>
                </div>
            `;
    }

    container.innerHTML = html;
    makeDishCardsClickable();
  } catch (error) {
    container.innerHTML = "<p>Error loading menu. Please try again.</p>";
  }
}

// Load Chef Team
async function loadChefTeam() {
  const container = document.getElementById("chef-team");
  if (!container) return;

  try {
    const images = await fetchFoodImages("chef cooking", 3);

    const chefs = [
      { name: "Chef Antonio", role: "Head Chef", image: images[0] },
      { name: "Chef Maria", role: "Pastry Chef", image: images[1] },
      { name: "Chef John", role: "Sous Chef", image: images[2] },
    ];

    let html = "";
    for (let i = 0; i < chefs.length; i++) {
      html += `
                <div class="chef-card">
                    <img src="${chefs[i].image}?w=200&h=200&fit=crop&crop=faces" alt="${chefs[i].name}">
                    <h4>${chefs[i].name}</h4>
                    <p>${chefs[i].role}</p>
                </div>
            `;
    }

    container.innerHTML = html;
  } catch (error) {
    console.log("Error loading chefs:", error);
  }
}

// Load Gallery Images
async function loadGallery() {
  const container = document.getElementById("gallery");
  if (!container) return;

  try {
    const images = await fetchFoodImages("restaurant", 4);

    let html = "";
    for (let i = 0; i < images.length; i++) {
      html += `
                <div class="gallery-item">
                    <img src="${images[i]}?w=300&h=200&fit=crop" alt="Gallery Image ${i + 1}">
                    <div class="gallery-overlay">
                        <span>Our Restaurant</span>
                    </div>
                </div>
            `;
    }

    container.innerHTML = html;
  } catch (error) {
    console.log("Error loading gallery:", error);
  }
}

// Menu Filter
const categoryButtons = document.querySelectorAll(".category-btn");
if (categoryButtons.length > 0) {
  for (let i = 0; i < categoryButtons.length; i++) {
    const button = categoryButtons[i];
    button.addEventListener("click", () => {
      // Remove active class from all buttons
      for (let j = 0; j < categoryButtons.length; j++) {
        categoryButtons[j].classList.remove("active");
      }

      button.classList.add("active");

      const category = button.getAttribute("data-category");
      loadMenuItems(category);
    });
  }
}

// Reservation Form
const reservationForm = document.getElementById("reservationForm");
if (reservationForm) {
  reservationForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = document.querySelector('input[placeholder="Your Name"]');
    const email = document.querySelector('input[placeholder="Email Address"]');
    const phone = document.querySelector('input[placeholder="Phone Number"]');
    const date = document.querySelector('input[type="date"]');
    const time = document.querySelector('input[type="time"]');

    if (!name || !email || !phone || !date || !time) {
      showNotification("Please fill in all fields", "error");
      return;
    }

    showNotification("Table booked successfully!", "success");
    reservationForm.reset();
  });
}

// Notification System
function showNotification(message, type) {
  const notification = document.createElement("div");
  notification.className = "notification " + type;
  notification.textContent = message;
  notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        padding: 1rem 2rem;
        border-radius: 10px;
        color: white;
        z-index: 9999;
        animation: slideIn 0.3s ease;
        background: ${type === "success" ? "#28a745" : "#dc3545"};
    `;

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.style.animation = "slideOut 0.3s ease";
    setTimeout(() => {
      if (notification.parentNode) {
        document.body.removeChild(notification);
      }
    }, 300);
  }, 3000);
}

// Add slide animations
const slideAnimations = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;

const animationStyle = document.createElement("style");
animationStyle.textContent = slideAnimations;
document.head.appendChild(animationStyle);

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  });
});

// Parallax effect for hero
window.addEventListener("scroll", () => {
  const hero = document.querySelector(".hero");
  if (hero) {
    const scrolled = window.pageYOffset;
    hero.style.backgroundPositionY = scrolled * 0.5 + "px";
  }
});

// Add Beautiful Footer
function addFooter() {
  if (document.querySelector(".footer")) return;

  const footer = document.createElement("footer");
  footer.className = "footer";
  footer.innerHTML = `
        <div class="footer-content">
            <div class="footer-section">
                <div class="footer-logo">
                    <img src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=100&h=100&fit=crop" alt="Logo" class="footer-logo-img">
                    <h3>Flavors</h3>
                </div>
                <p>Experience the finest culinary delights in a warm and inviting atmosphere.</p>
                <div class="social-links">
                    <a href="#"><i class="fab fa-facebook-f"></i></a>
                    <a href="#"><i class="fab fa-instagram"></i></a>
                    <a href="#"><i class="fab fa-twitter"></i></a>
                    <a href="#"><i class="fab fa-yelp"></i></a>
                </div>
            </div>
            
            <div class="footer-section">
                <h3>Opening Hours</h3>
                <p><i class="fas fa-clock"></i> Mon-Fri: 11:00 AM - 10:00 PM</p>
                <p><i class="fas fa-clock"></i> Sat-Sun: 10:00 AM - 11:00 PM</p>
                <p><i class="fas fa-glass-cheers"></i> Happy Hour: 4-7 PM</p>
            </div>
            
            <div class="footer-section">
                <h3>Contact Info</h3>
                <p><i class="fas fa-map-marker-alt"></i> 123 Gourmet Street, NY</p>
                <p><i class="fas fa-phone"></i> +1 (555) 123-4567</p>
                <p><i class="fas fa-envelope"></i> info@flavors.com</p>
            </div>
            
            <div class="footer-section">
                <h3>Newsletter</h3>
                <p>Subscribe for special offers!</p>
                <div class="newsletter-input">
                    <input type="email" placeholder="Your email">
                    <button><i class="fas fa-paper-plane"></i></button>
                </div>
                <div class="payment-methods">
                    <i class="fab fa-cc-visa"></i>
                    <i class="fab fa-cc-mastercard"></i>
                    <i class="fab fa-cc-amex"></i>
                    <i class="fab fa-cc-paypal"></i>
                </div>
            </div>
        </div>
        
        <div class="footer-bottom">
            <p>&copy; ${new Date().getFullYear()} Flavors Restaurant. Made with <span class="heart">❤️</span> for food lovers</p>
        </div>
    `;

  document.body.appendChild(footer);
}

// Initialize all components
document.addEventListener("DOMContentLoaded", () => {
  addCartHTML();
  addFooter();
  loadFeaturedDishes();
  loadMenuItems("all");
  loadChefTeam();
  loadGallery();

  // Small delay to ensure DOM is ready
  setTimeout(() => {
    makeDishCardsClickable();
    cart.updateCartCount();
  }, 500);
});

// Add hover effects for cards
document.addEventListener("mouseover", (e) => {
  const card = e.target.closest(".dish-card");
  if (card) {
    card.style.transform = "translateY(-10px) rotate(1deg)";
  }
});

document.addEventListener("mouseout", (e) => {
  const card = e.target.closest(".dish-card");
  if (card) {
    card.style.transform = "translateY(0) rotate(0)";
  }
});
