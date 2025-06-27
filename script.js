/* ===================================
   MUNDANE MARVELS JAVASCRIPT
   Simple, clean functionality with Salesforce tracking
   =================================== */

// Product data - Our delightfully ordinary collection
const products = [
    {
        id: 1,
        name: "The Thinking Spoon",
        price: 24.99,
        description: "A regular spoon that comes with philosophical quotes. Perfect for contemplating soup.",
        category: "kitchenware"
    },
    {
        id: 2,
        name: "Artisanal Air - Mountain Breeze",
        price: 12.99,
        description: "Empty jar filled with curated air from the Rocky Mountains. Breathe differently.",
        category: "lifestyle"
    },
    {
        id: 3,
        name: "Gravity Pants",
        price: 89.99,
        description: "Regular pants that work harmoniously with gravity. Physics-approved design.",
        category: "clothing"
    },
    {
        id: 4,
        name: "WiFi-Free Notebook",
        price: 15.99,
        description: "Paper notebook for disconnected productivity. No buffering, ever.",
        category: "office"
    },
    {
        id: 5,
        name: "Organic Shadows - Starter Set",
        price: 34.99,
        description: "Decorative shadow stencils for your walls. Create shadows intentionally.",
        category: "decor"
    }
];

// Article data - Enlightening content
const articles = [
    {
        id: 1,
        title: "The Psychology of Choosing the Perfect Spoon",
        readTime: "5 min read",
        excerpt: "Dive deep into the psychological factors that influence spoon selection and how it affects your dining experience.",
        category: "psychology"
    },
    {
        id: 2,
        title: "Why Your Notebook Doesn't Need WiFi",
        readTime: "3 min read",
        excerpt: "Exploring the benefits of analog productivity tools in our hyper-connected world.",
        category: "productivity"
    },
    {
        id: 3,
        title: "The Art of Appreciating Shadows",
        readTime: "7 min read",
        excerpt: "A comprehensive guide to finding beauty in the interplay of light and shadow in everyday spaces.",
        category: "lifestyle"
    }
];

// Cart functionality - Simple local storage
let cart = JSON.parse(localStorage.getItem('mundane-cart')) || [];

/* ===================================
   PAGE INITIALIZATION
   =================================== */
document.addEventListener('DOMContentLoaded', function() {
    console.log('🎉 Mundane Marvels initialized successfully!');
    
    // Load products and articles
    loadProducts();
    loadArticles();
    updateCartDisplay();
    
    // Set up event listeners
    setupEventListeners();
    
    // Initialize Salesforce tracking (placeholder for now)
    initializeSalesforceTracking();
    
    // Track page view
    trackEvent('page-view', {
        page: 'homepage',
        url: window.location.href
    });
});

/* ===================================
   PRODUCT FUNCTIONALITY
   =================================== */
function loadProducts() {
    const productGrid = document.querySelector('.product-grid');
    
    // Clear existing content
    productGrid.innerHTML = '';
    
    // Create product cards
    products.forEach(product => {
        const productCard = createProductCard(product);
        productGrid.appendChild(productCard);
    });
    
    console.log(`✅ Loaded ${products.length} products`);
}

function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = `
        <h3>${product.name}</h3>
        <p class="price">$${product.price}</p>
        <p>${product.description}</p>
        <button class="add-to-cart" onclick="addToCart(${product.id})">
            Add to Cart
        </button>
    `;
    
    // Track product view when card is clicked
    card.addEventListener('click', function(e) {
        if (!e.target.classList.contains('add-to-cart')) {
            trackEvent('product-view', {
                productId: product.id,
                productName: product.name,
                category: product.category,
                price: product.price
            });
        }
    });
    
    return card;
}

/* ===================================
   ARTICLE FUNCTIONALITY
   =================================== */
function loadArticles() {
    const articlesGrid = document.querySelector('.articles-grid');
    
    // Clear existing content
    articlesGrid.innerHTML = '';
    
    // Create article cards
    articles.forEach(article => {
        const articleCard = createArticleCard(article);
        articlesGrid.appendChild(articleCard);
    });
    
    console.log(`✅ Loaded ${articles.length} articles`);
}

function createArticleCard(article) {
    const card = document.createElement('div');
    card.className = 'article-card';
    card.innerHTML = `
        <h3>${article.title}</h3>
        <p class="read-time">${article.readTime}</p>
        <p>${article.excerpt}</p>
    `;
    
    // Track article engagement
    card.addEventListener('click', function() {
        trackEvent('article-click', {
            articleId: article.id,
            articleTitle: article.title,
            category: article.category
        });
        
        // In a real implementation, this would navigate to the full article
        alert(`Opening: ${article.title}\n\n(Full article functionality coming soon!)`);
    });
    
    return card;
}

/* ===================================
   CART FUNCTIONALITY
   =================================== */
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    
    if (product) {
        // Check if product already in cart
        const existingItem = cart.find(item => item.id === productId);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({
                id: product.id,
                name: product.name,
                price: product.price,
                quantity: 1
            });
        }
        
        // Save to localStorage
        localStorage.setItem('mundane-cart', JSON.stringify(cart));
        
        // Update display
        updateCartDisplay();
        
        // Track add to cart event
        trackEvent('add-to-cart', {
            productId: product.id,
            productName: product.name,
            price: product.price,
            cartTotal: calculateCartTotal()
        });
        
        console.log(`✅ Added ${product.name} to cart`);
    }
}

function updateCartDisplay() {
    const cartCount = document.getElementById('cart-count');
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
}

function calculateCartTotal() {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2);
}

/* ===================================
   EVENT LISTENERS
   =================================== */
function setupEventListeners() {
    // Cart modal functionality
    const cartLink = document.querySelector('.cart-link');
    const cartModal = document.getElementById('cart-modal');
    const cartClose = document.querySelector('.cart-close');
    
    cartLink.addEventListener('click', function(e) {
        e.preventDefault();
        showCart();
    });
    
    cartClose.addEventListener('click', function() {
        cartModal.style.display = 'none';
    });
    
    // Close modal when clicking outside
    cartModal.addEventListener('click', function(e) {
        if (e.target === cartModal) {
            cartModal.style.display = 'none';
        }
    });
    
    // Subscription buttons
    document.querySelectorAll('.subscribe-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const plan = this.getAttribute('data-plan');
            trackEvent('subscription-interest', {
                plan: plan,
                price: plan === 'basic' ? 19.99 : 39.99
            });
            
            alert(`Thanks for your interest in the ${plan} plan!\n\n(Subscription signup coming soon!)`);
        });
    });
}

function showCart() {
    const cartModal = document.getElementById('cart-modal');
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    
    // Clear existing cart items
    cartItems.innerHTML = '';
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<p>Your cart is empty. Add some ordinary magic!</p>';
    } else {
        cart.forEach(item => {
            const itemDiv = document.createElement('div');
            itemDiv.innerHTML = `
                <p>${item.name} x ${item.quantity} - $${(item.price * item.quantity).toFixed(2)}</p>
            `;
            cartItems.appendChild(itemDiv);
        });
    }
    
    cartTotal.textContent = calculateCartTotal();
    cartModal.style.display = 'block';
    
    // Track cart view
    trackEvent('cart-view', {
        itemCount: cart.length,
        cartTotal: calculateCartTotal()
    });
}

/* ===================================
   UTILITY FUNCTIONS
   =================================== */
function scrollToProducts() {
    document.getElementById('products').scrollIntoView({ 
        behavior: 'smooth' 
    });
    
    // Track CTA click
    trackEvent('cta-click', {
        buttonText: 'Shop Mundane Marvels',
        location: 'hero'
    });
}

/* ===================================
   SALESFORCE TRACKING SETUP
   (Placeholder - will implement Data Cloud Web SDK)
   =================================== */
function initializeSalesforceTracking() {
    // This is where we'll initialize the Salesforce Data Cloud Web SDK
    console.log('🔧 Salesforce tracking initialization (placeholder)');
    
    // For now, we'll just log events to console
    // Next step: implement actual Data Cloud Web SDK
}

function trackEvent(eventType, eventData) {
    // This function will send events to Salesforce Data Cloud
    const trackingData = {
        eventType: eventType,
        timestamp: new Date().toISOString(),
        url: window.location.href,
        userAgent: navigator.userAgent,
        ...eventData
    };
    
    // For now, just log to console
    console.log('📊 Event tracked:', trackingData);
    
    // Next step: implement actual Salesforce Data Cloud Web SDK calls
    // Example: sf.interactions.sendEvent(trackingData);
}

/* ===================================
   CONSOLE WELCOME MESSAGE
   =================================== */
console.log(`
🎯 Welcome to Mundane Marvels!
📊 Tracking events ready for Salesforce integration
🛒 Simple cart functionality active
✨ Extraordinarily ordinary since 2024
`); 