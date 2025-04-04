/**
 * Cart functionality for TechShop
 * Uses localStorage to store cart items
 */

// DOM elements
const cartItemsContainer = document.getElementById('cart-items-container');
const emptyCartMessage = document.getElementById('empty-cart-message');
const cartWithItems = document.getElementById('cart-with-items');
const cartCount = document.getElementById('cartCount');
const cartSubtotal = document.getElementById('cart-subtotal');
const cartShipping = document.getElementById('cart-shipping');
const cartTax = document.getElementById('cart-tax');
const cartTotal = document.getElementById('cart-total');
const checkoutBtn = document.getElementById('checkout-btn');

// Cart data
let cart = [];

// Constants
const SHIPPING_FEE = 10;
const TAX_RATE = 0.08; // 8%

// Initialize function
function initCart() {
    loadCart();
    renderCart();
    setupEventListeners();
}

// Load cart from localStorage
function loadCart() {
    const savedCart = localStorage.getItem('cart');
    
    if (savedCart) {
        try {
            cart = JSON.parse(savedCart);
        } catch(e) {
            console.error('Error parsing cart data:', e);
            cart = [];
            localStorage.setItem('cart', JSON.stringify(cart));
        }
    }
}

// Save cart to localStorage
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
}

// Render cart items
function renderCart() {
    if (!cartItemsContainer) return;
    
    // Check if cart is empty
    if (cart.length === 0) {
        if (emptyCartMessage) emptyCartMessage.style.display = 'block';
        if (cartWithItems) cartWithItems.style.display = 'none';
        return;
    }
    
    // Show cart with items
    if (emptyCartMessage) emptyCartMessage.style.display = 'none';
    if (cartWithItems) cartWithItems.style.display = 'grid';
    
    // Clear the items container
    cartItemsContainer.innerHTML = '';
    
    // Render each item
    cart.forEach(item => {
        const cartItemEl = document.createElement('div');
        cartItemEl.className = 'cart-item';
        cartItemEl.dataset.id = item.id;
        
        cartItemEl.innerHTML = `
            <div class="cart-item-image">
                <img src="${item.imageUrl}" alt="${item.name}">
            </div>
            <div class="cart-item-details">
                <h3 class="item-name">${item.name}</h3>
                <p class="item-description">${item.description?.substring(0, 100) || ''}</p>
                <p class="item-price">$${(item.price * item.quantity).toFixed(2)}</p>
            </div>
            <div class="item-actions">
                <div class="quantity-control">
                    <button class="quantity-btn decrease" data-id="${item.id}">-</button>
                    <input type="text" class="quantity-input" value="${item.quantity}" min="1" data-id="${item.id}">
                    <button class="quantity-btn increase" data-id="${item.id}">+</button>
                </div>
                <button class="remove-btn" data-id="${item.id}">
                    <i class="fas fa-trash-alt"></i> Remove
                </button>
            </div>
        `;
        
        cartItemsContainer.appendChild(cartItemEl);
    });
    
    // Update the order summary
    updateOrderSummary();
}

// Update order summary
function updateOrderSummary() {
    if (!cartSubtotal || !cartShipping || !cartTax || !cartTotal) return;
    
    const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    const shipping = cart.length > 0 ? SHIPPING_FEE : 0;
    const tax = subtotal * TAX_RATE;
    const total = subtotal + shipping + tax;
    
    cartSubtotal.textContent = `$${subtotal.toFixed(2)}`;
    cartShipping.textContent = `$${shipping.toFixed(2)}`;
    cartTax.textContent = `$${tax.toFixed(2)}`;
    cartTotal.textContent = `$${total.toFixed(2)}`;
}

// Update cart count in the header
function updateCartCount() {
    if (!cartCount) return;
    
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    cartCount.textContent = totalItems;
}

// Add an item to the cart
function addToCart(product, quantity = 1) {
    // Check if product already exists in cart
    const existingItemIndex = cart.findIndex(item => item.id === product.id);
    
    if (existingItemIndex >= 0) {
        // Increase quantity
        cart[existingItemIndex].quantity += quantity;
    } else {
        // Add new item
        cart.push({
            ...product,
            quantity: quantity
        });
    }
    
    // Save cart to localStorage
    saveCart();
    
    // Show notification
    showNotification(`${product.name} added to cart!`);
}

// Remove an item from the cart
function removeFromCart(productId) {
    // Find the item
    const itemIndex = cart.findIndex(item => item.id === productId);
    
    if (itemIndex >= 0) {
        const removedItem = cart[itemIndex];
        cart.splice(itemIndex, 1);
        
        // Save cart
        saveCart();
        
        // Re-render cart
        renderCart();
        
        // Show notification
        showNotification(`${removedItem.name} removed from cart.`);
    }
}

// Update item quantity
function updateQuantity(productId, newQuantity) {
    // Ensure quantity is at least 1
    newQuantity = Math.max(1, parseInt(newQuantity) || 1);
    
    // Find the item
    const itemIndex = cart.findIndex(item => item.id === productId);
    
    if (itemIndex >= 0) {
        // Update quantity
        cart[itemIndex].quantity = newQuantity;
        
        // Save cart
        saveCart();
        
        // Re-render cart
        renderCart();
    }
}

// Show notification
function showNotification(message, type = 'success') {
    // Create notification container if it doesn't exist
    let notificationContainer = document.getElementById('notification-container');
    if (!notificationContainer) {
        notificationContainer = document.createElement('div');
        notificationContainer.id = 'notification-container';
        notificationContainer.style.position = 'fixed';
        notificationContainer.style.bottom = '20px';
        notificationContainer.style.right = '20px';
        notificationContainer.style.zIndex = '9999';
        document.body.appendChild(notificationContainer);
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `<i class="fas fa-check-circle"></i> ${message}`;
    
    // Style the notification
    notification.style.padding = '15px 20px';
    notification.style.marginBottom = '10px';
    notification.style.backgroundColor = type === 'success' ? '#4CAF50' : '#f44336';
    notification.style.color = 'white';
    notification.style.borderRadius = '4px';
    notification.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)';
    notification.style.display = 'flex';
    notification.style.alignItems = 'center';
    notification.style.gap = '10px';
    notification.style.fontWeight = '500';
    notification.style.minWidth = '250px';
    notification.style.opacity = '0';
    notification.style.transform = 'translateY(20px)';
    notification.style.transition = 'opacity 0.3s, transform 0.3s';
    
    // Add notification to container
    notificationContainer.appendChild(notification);
    
    // Trigger animation
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateY(0)';
    }, 10);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateY(20px)';
        
        // Remove from DOM after animation
        setTimeout(() => {
            if (notificationContainer.contains(notification)) {
                notificationContainer.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Setup event listeners
function setupEventListeners() {
    if (!cartItemsContainer) return;
    
    // Event delegation for cart item actions
    cartItemsContainer.addEventListener('click', (e) => {
        // Increase quantity
        if (e.target.classList.contains('increase')) {
            const productId = parseInt(e.target.dataset.id);
            const item = cart.find(item => item.id === productId);
            if (item) {
                updateQuantity(productId, item.quantity + 1);
            }
        }
        
        // Decrease quantity
        if (e.target.classList.contains('decrease')) {
            const productId = parseInt(e.target.dataset.id);
            const item = cart.find(item => item.id === productId);
            if (item && item.quantity > 1) {
                updateQuantity(productId, item.quantity - 1);
            }
        }
        
        // Remove item
        if (e.target.classList.contains('remove-btn') || (e.target.parentNode && e.target.parentNode.classList.contains('remove-btn'))) {
            const btn = e.target.classList.contains('remove-btn') ? e.target : e.target.parentNode;
            const productId = parseInt(btn.dataset.id);
            removeFromCart(productId);
        }
    });
    
    // Listen for quantity input changes
    cartItemsContainer.addEventListener('change', (e) => {
        if (e.target.classList.contains('quantity-input')) {
            const productId = parseInt(e.target.dataset.id);
            const newQuantity = parseInt(e.target.value);
            updateQuantity(productId, newQuantity);
        }
    });
    
    // Checkout button
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', processCheckout);
    }
}

// Process checkout
function processCheckout() {
    // In a real app, you would redirect to checkout page or open modal
    alert('Thank you for your order! This is a demo, so no actual order will be processed.');
    cart = [];
    saveCart();
    renderCart();
}

// Update cart count on page load
document.addEventListener('DOMContentLoaded', () => {
    // Initialize cart
    initCart();
    
    // Make functions available globally
    window.cart = {
        add: addToCart,
        remove: removeFromCart,
        update: updateQuantity,
        clear: () => {
            cart = [];
            saveCart();
            renderCart();
        }
    };
}); 