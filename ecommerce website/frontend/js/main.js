/**
 * Main JavaScript file for TechShop
 * Contains common functionality used across the site
 */

// API URLs
const API_URL = 'http://localhost:8080/api';
const PRODUCTS_URL = `${API_URL}/products`;
const CATEGORIES_URL = `${API_URL}/categories`;
const CART_URL = `${API_URL}/cart`;

// DOM Elements
const featuredProductsContainer = document.getElementById('featured-products');
const categoriesContainer = document.getElementById('categories-list');
const cartCountElement = document.getElementById('cart-count');
const cartCount = document.getElementById('cartCount');

// Initialize the main functionality
document.addEventListener('DOMContentLoaded', () => {
    loadFeaturedProducts();
    loadCategories();
    updateCartCount();
    setupMobileNavigation();
});

// Load featured products from the API
async function loadFeaturedProducts() {
    try {
        const response = await fetch(`${PRODUCTS_URL}/featured`);
        const products = await response.json();
        
        if (featuredProductsContainer) {
            featuredProductsContainer.innerHTML = '';
            
            products.forEach(product => {
                const productCard = createProductCard(product);
                featuredProductsContainer.appendChild(productCard);
            });
        }
    } catch (error) {
        console.error('Error loading featured products:', error);
    }
}

// Load categories from the API
async function loadCategories() {
    try {
        const response = await fetch(CATEGORIES_URL);
        const categories = await response.json();
        
        if (categoriesContainer) {
            categoriesContainer.innerHTML = '';
            
            categories.forEach(category => {
                const categoryCard = createCategoryCard(category);
                categoriesContainer.appendChild(categoryCard);
            });
        }
    } catch (error) {
        console.error('Error loading categories:', error);
    }
}

// Create a product card element
function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    
    card.innerHTML = `
        <img src="${product.imageUrl || 'https://via.placeholder.com/300x200'}" alt="${product.name}" class="product-image">
        <div class="product-info">
            <h3 class="product-title">${product.name}</h3>
            <p class="product-price">$${product.price.toFixed(2)}</p>
            <p class="product-description">${product.description ? product.description.substring(0, 100) + '...' : ''}</p>
            <button class="add-to-cart" data-id="${product.id}">Add to Cart</button>
        </div>
    `;
    
    // Add event listener to the add to cart button
    const addToCartButton = card.querySelector('.add-to-cart');
    addToCartButton.addEventListener('click', () => addToCart(product));
    
    return card;
}

// Create a category card element
function createCategoryCard(category) {
    const card = document.createElement('div');
    card.className = 'category-card';
    
    card.innerHTML = `
        <img src="${category.imageUrl || 'https://via.placeholder.com/300x150'}" alt="${category.name}" class="category-image">
        <div class="category-info">
            <h3 class="category-title">${category.name}</h3>
        </div>
    `;
    
    card.addEventListener('click', () => {
        window.location.href = `products.html?category=${category.id}`;
    });
    
    return card;
}

// Set up mobile navigation functionality
function setupMobileNavigation() {
    const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
    if (mobileNavToggle) {
        mobileNavToggle.addEventListener('click', () => {
            const nav = document.querySelector('nav');
            if (nav) {
                nav.classList.toggle('active');
                mobileNavToggle.innerHTML = nav.classList.contains('active') ? '✕' : '☰';
            }
        });
    }
    
    // Add responsive styles
    addResponsiveStyles();
}

// Add responsive styles dynamically
function addResponsiveStyles() {
    const style = document.createElement('style');
    style.textContent = `
        /* Mobile Navigation Styles */
        @media (max-width: 768px) {
            header {
                flex-wrap: wrap;
                padding: 15px;
            }
            
            .logo {
                flex: 1;
            }
            
            nav {
                display: none;
                width: 100%;
                order: 3;
                margin-top: 15px;
            }
            
            nav.active {
                display: block;
            }
            
            nav ul {
                flex-direction: column;
                align-items: flex-start;
            }
            
            nav ul li {
                margin: 10px 0;
                width: 100%;
            }
            
            .user-actions {
                order: 2;
                margin-right: 50px;
            }
            
            .mobile-nav-toggle {
                display: block;
                background: transparent;
                border: none;
                font-size: 24px;
                cursor: pointer;
                padding: 5px 10px;
                position: absolute;
                right: 15px;
                top: 15px;
            }
        }
        
        @media (min-width: 769px) {
            .mobile-nav-toggle {
                display: none;
            }
        }
    `;
    document.head.appendChild(style);
}

// Update cart count display
function updateCartCount() {
    const cartCount = document.getElementById('cartCount');
    if (!cartCount) return;
    
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    cartCount.textContent = totalItems;
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
    notification.innerHTML = `<i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i> ${message}`;
    
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

// Add an item to the cart
function addToCart(product, quantity = 1) {
    // Get current cart or initialize empty one
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    
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
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Update cart count
    updateCartCount();
    
    // Show notification
    showNotification(`${product.name} added to cart!`);
}

// Make common functions available globally
window.ecommerce = {
    addToCart,
    showNotification,
    updateCartCount
};

// For demo purposes - mock data if API is not available
function loadMockData() {
    // Mock products
    const mockProducts = [
        {
            id: 1,
            name: 'Wireless Headphones',
            price: 99.99,
            description: 'High-quality wireless headphones with noise cancellation.',
            imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80'
        },
        {
            id: 2,
            name: 'Smartphone',
            price: 599.99,
            description: 'Latest model smartphone with high-resolution camera.',
            imageUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1160&q=80'
        },
        {
            id: 3,
            name: 'Laptop',
            price: 999.99,
            description: 'Powerful laptop for work and gaming.',
            imageUrl: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1171&q=80'
        },
        {
            id: 4,
            name: 'Smartwatch',
            price: 199.99,
            description: 'Track your fitness and stay connected with this smartwatch.',
            imageUrl: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80'
        }
    ];
    
    // Mock categories
    const mockCategories = [
        {
            id: 1,
            name: 'Electronics',
            imageUrl: 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1025&q=80'
        },
        {
            id: 2,
            name: 'Clothing',
            imageUrl: 'https://images.unsplash.com/photo-1445205170230-053b83016050?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1171&q=80'
        },
        {
            id: 3,
            name: 'Home & Kitchen',
            imageUrl: 'https://images.unsplash.com/photo-1556911220-bda9f7f8677e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80'
        },
        {
            id: 4,
            name: 'Sports & Outdoors',
            imageUrl: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3797?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80'
        }
    ];
    
    // Display mock data if API fails
    if (featuredProductsContainer && featuredProductsContainer.innerHTML === '') {
        mockProducts.forEach(product => {
            const productCard = createProductCard(product);
            featuredProductsContainer.appendChild(productCard);
        });
    }
    
    if (categoriesContainer && categoriesContainer.innerHTML === '') {
        mockCategories.forEach(category => {
            const categoryCard = createCategoryCard(category);
            categoriesContainer.appendChild(categoryCard);
        });
    }
}

// Call mock data function after 2 seconds if API fails
setTimeout(() => {
    if (featuredProductsContainer && featuredProductsContainer.innerHTML === '') {
        loadMockData();
    }
}, 2000); 