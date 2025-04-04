/**
 * Products page JavaScript for TechShop
 * Handles product loading, filtering, sorting and search
 */

// DOM Elements
const productsGrid = document.getElementById('products-grid');
const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');
const categoryFilter = document.getElementById('category-filter');
const sortOption = document.getElementById('sort-option');
const emptyResults = document.getElementById('empty-results');
const pagination = document.getElementById('pagination');
const resetFiltersBtn = document.getElementById('reset-filters');

// Products data
let products = [];
let filteredProducts = [];

// Pagination settings
const productsPerPage = 6;
let currentPage = 1;

// Initialize products page
document.addEventListener('DOMContentLoaded', () => {
    loadProducts();
    setupEventListeners();
    
    // Check for URL parameters to set initial filters
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('category')) {
        categoryFilter.value = urlParams.get('category');
    }
    if (urlParams.has('search')) {
        searchInput.value = urlParams.get('search');
    }
    if (urlParams.has('sort')) {
        sortOption.value = urlParams.get('sort');
    }
    if (urlParams.has('page')) {
        currentPage = parseInt(urlParams.get('page')) || 1;
    }
    
    // Apply initial filters
    filterProducts();
});

// Load products - in a real app, this would fetch from an API
function loadProducts() {
    // Mock product data
    products = [
        {
            id: 1,
            name: "iPhone 15 Pro",
            description: "The latest iPhone with a powerful A17 Pro chip, 48MP camera system, and titanium design.",
            price: 999.99,
            category: "smartphones",
            imageUrl: "https://images.unsplash.com/photo-1675264870498-54affab6d010?w=600&auto=format&fit=crop"
        },
        {
            id: 2,
            name: "Samsung Galaxy S23 Ultra",
            description: "Featuring a 200MP camera, S Pen functionality, and long-lasting battery life.",
            price: 1199.99,
            category: "smartphones",
            imageUrl: "https://images.unsplash.com/photo-1678911820864-e2c567c655d7?w=600&auto=format&fit=crop"
        },
        {
            id: 3,
            name: "Google Pixel 8 Pro",
            description: "Google's flagship phone with exceptional camera capabilities and clean Android experience.",
            price: 899.99,
            category: "smartphones",
            imageUrl: "https://images.unsplash.com/photo-1696446702194-eb33be27a7fb?w=600&auto=format&fit=crop"
        },
        {
            id: 4,
            name: "MacBook Pro M3",
            description: "Powerful MacBook with M3 chip, Liquid Retina XDR display, and all-day battery life.",
            price: 1999.99,
            category: "laptops",
            imageUrl: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&auto=format&fit=crop"
        },
        {
            id: 5,
            name: "Dell XPS 15",
            description: "Premium Windows laptop with InfinityEdge display and high-performance components.",
            price: 1599.99,
            category: "laptops",
            imageUrl: "https://images.unsplash.com/photo-1593642702749-b7d2a804fbcf?w=600&auto=format&fit=crop"
        },
        {
            id: 6,
            name: "Lenovo ThinkPad X1 Carbon",
            description: "Business laptop known for reliability, lightweight design, and excellent keyboard.",
            price: 1399.99,
            category: "laptops",
            imageUrl: "https://images.unsplash.com/photo-1587614382346-4ec70e388b28?w=600&auto=format&fit=crop"
        },
        {
            id: 7,
            name: "Sony WH-1000XM5",
            description: "Industry-leading noise cancelling headphones with exceptional sound quality.",
            price: 349.99,
            category: "headphones",
            imageUrl: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=600&auto=format&fit=crop"
        },
        {
            id: 8,
            name: "Bose QuietComfort 45",
            description: "Comfortable over-ear headphones with excellent noise cancellation and long battery life.",
            price: 329.99,
            category: "headphones",
            imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop"
        },
        {
            id: 9,
            name: "Apple AirPods Pro 2",
            description: "True wireless earbuds with active noise cancellation and adaptive transparency mode.",
            price: 249.99,
            category: "earphones",
            imageUrl: "https://images.unsplash.com/photo-1606400082777-ef05f3c5cde2?w=600&auto=format&fit=crop"
        },
        {
            id: 10,
            name: "Samsung Galaxy Book Pro",
            description: "Ultra-thin and light laptop with AMOLED display and Intel Core processors.",
            price: 1299.99,
            category: "laptops",
            imageUrl: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=600&auto=format&fit=crop"
        },
        {
            id: 11,
            name: "OnePlus 11",
            description: "Flagship Android smartphone with Hasselblad camera system and fast charging.",
            price: 699.99,
            category: "smartphones",
            imageUrl: "https://images.unsplash.com/photo-1683036858188-50a3d5c75b9c?w=600&auto=format&fit=crop"
        },
        {
            id: 12,
            name: "Sony WF-1000XM5",
            description: "Premium true wireless earbuds with industry-leading noise cancellation.",
            price: 279.99,
            category: "earphones",
            imageUrl: "https://images.unsplash.com/photo-1606400082674-e7f8697f0587?w=600&auto=format&fit=crop"
        }
    ];
}

// Set up event listeners
function setupEventListeners() {
    // Search form submission
    if (searchForm) {
        searchForm.addEventListener('submit', (e) => {
            e.preventDefault();
            currentPage = 1;
            filterProducts();
            updateURL();
        });
    }
    
    // Category filter change
    if (categoryFilter) {
        categoryFilter.addEventListener('change', () => {
            currentPage = 1;
            filterProducts();
            updateURL();
        });
    }
    
    // Sort option change
    if (sortOption) {
        sortOption.addEventListener('change', () => {
            currentPage = 1;
            filterProducts();
            updateURL();
        });
    }
    
    // Reset filters button
    if (resetFiltersBtn) {
        resetFiltersBtn.addEventListener('click', () => {
            searchInput.value = '';
            categoryFilter.value = '';
            sortOption.value = 'default';
            currentPage = 1;
            filterProducts();
            updateURL();
        });
    }
}

// Filter products based on search, category, and sort
function filterProducts() {
    const searchTerm = searchInput?.value.toLowerCase() || '';
    const category = categoryFilter?.value.toLowerCase() || '';
    const sort = sortOption?.value || 'default';
    
    // Filter products by search term and category
    filteredProducts = products.filter(product => {
        const matchesSearch = searchTerm === '' || 
            product.name.toLowerCase().includes(searchTerm) || 
            product.description.toLowerCase().includes(searchTerm) ||
            product.category.toLowerCase().includes(searchTerm);
            
        const matchesCategory = category === '' || product.category === category;
        
        return matchesSearch && matchesCategory;
    });
    
    // Sort products
    switch (sort) {
        case 'price-asc':
            filteredProducts.sort((a, b) => a.price - b.price);
            break;
        case 'price-desc':
            filteredProducts.sort((a, b) => b.price - a.price);
            break;
        case 'name-asc':
            filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
            break;
        case 'name-desc':
            filteredProducts.sort((a, b) => b.name.localeCompare(a.name));
            break;
        default:
            // Default sort, could be by popularity or newest
            break;
    }
    
    // Render products and pagination
    renderProducts();
    renderPagination();
}

// Render products
function renderProducts() {
    if (!productsGrid) return;
    
    // Show/hide empty results message
    if (emptyResults) {
        emptyResults.style.display = filteredProducts.length === 0 ? 'block' : 'none';
    }
    
    // Show/hide products grid
    productsGrid.style.display = filteredProducts.length === 0 ? 'none' : 'grid';
    
    if (filteredProducts.length === 0) return;
    
    // Calculate pagination
    const startIndex = (currentPage - 1) * productsPerPage;
    const endIndex = startIndex + productsPerPage;
    const paginatedProducts = filteredProducts.slice(startIndex, endIndex);
    
    // Clear previous products
    productsGrid.innerHTML = '';
    
    // Render each product
    paginatedProducts.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        
        productCard.innerHTML = `
            <div class="product-image">
                <img src="${product.imageUrl}" alt="${product.name}">
            </div>
            <div class="product-info">
                <h3 class="product-name">${product.name}</h3>
                <p class="product-description">${product.description}</p>
                <div class="product-price-cart">
                    <p class="product-price">$${product.price.toFixed(2)}</p>
                    <button class="add-to-cart-btn" data-id="${product.id}">
                        <i class="fas fa-shopping-cart"></i> Add to Cart
                    </button>
                </div>
            </div>
        `;
        
        productsGrid.appendChild(productCard);
        
        // Add event listener to add to cart button
        const addToCartBtn = productCard.querySelector('.add-to-cart-btn');
        addToCartBtn.addEventListener('click', () => {
            if (window.ecommerce && window.ecommerce.addToCart) {
                window.ecommerce.addToCart(product);
            }
        });
    });
}

// Render pagination
function renderPagination() {
    if (!pagination) return;
    
    // Clear previous pagination
    pagination.innerHTML = '';
    
    // Calculate total pages
    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
    
    if (totalPages <= 1) return;
    
    // Determine page range to display (show max 5 pages)
    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, startPage + 4);
    
    if (endPage - startPage < 4) {
        startPage = Math.max(1, endPage - 4);
    }
    
    // Previous button
    if (currentPage > 1) {
        const prevBtn = document.createElement('a');
        prevBtn.href = '#';
        prevBtn.className = 'pagination-btn';
        prevBtn.innerHTML = '<i class="fas fa-chevron-left"></i>';
        prevBtn.addEventListener('click', (e) => {
            e.preventDefault();
            currentPage--;
            filterProducts();
            updateURL();
        });
        pagination.appendChild(prevBtn);
    }
    
    // Page numbers
    for (let i = startPage; i <= endPage; i++) {
        const pageBtn = document.createElement('a');
        pageBtn.href = '#';
        pageBtn.className = `pagination-btn ${i === currentPage ? 'active' : ''}`;
        pageBtn.textContent = i;
        pageBtn.addEventListener('click', (e) => {
            e.preventDefault();
            currentPage = i;
            filterProducts();
            updateURL();
        });
        pagination.appendChild(pageBtn);
    }
    
    // Next button
    if (currentPage < totalPages) {
        const nextBtn = document.createElement('a');
        nextBtn.href = '#';
        nextBtn.className = 'pagination-btn';
        nextBtn.innerHTML = '<i class="fas fa-chevron-right"></i>';
        nextBtn.addEventListener('click', (e) => {
            e.preventDefault();
            currentPage++;
            filterProducts();
            updateURL();
        });
        pagination.appendChild(nextBtn);
    }
}

// Update URL with filter parameters
function updateURL() {
    const searchTerm = searchInput?.value || '';
    const category = categoryFilter?.value || '';
    const sort = sortOption?.value || 'default';
    
    const urlParams = new URLSearchParams();
    
    if (searchTerm) urlParams.set('search', searchTerm);
    if (category) urlParams.set('category', category);
    if (sort !== 'default') urlParams.set('sort', sort);
    if (currentPage > 1) urlParams.set('page', currentPage.toString());
    
    const newURL = `${window.location.pathname}${urlParams.toString() ? '?' + urlParams.toString() : ''}`;
    window.history.replaceState({}, '', newURL);
} 