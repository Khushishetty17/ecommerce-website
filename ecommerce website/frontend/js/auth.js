// API URLs
const AUTH_API_URL = 'http://localhost:8080/api/auth';

// DOM Elements
const loginModal = document.getElementById('loginModal');
const registerModal = document.getElementById('registerModal');
const loginBtn = document.getElementById('loginBtn');
const registerBtn = document.getElementById('registerBtn');
const showRegisterLink = document.getElementById('showRegister');
const showLoginLink = document.getElementById('showLogin');
const closeButtons = document.querySelectorAll('.close');
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');

// User state
let currentUser = null;

// Initialize auth state on page load
document.addEventListener('DOMContentLoaded', () => {
    checkAuthState();
    setupEventListeners();
});

// Check if user is authenticated
function checkAuthState() {
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');
    
    if (token && username) {
        // User is logged in
        currentUser = { username };
        updateUIForLoggedInUser();
    } else {
        // User is logged out
        updateUIForLoggedOutUser();
    }
}

// Update UI for logged in user
function updateUIForLoggedInUser() {
    if (loginBtn) loginBtn.textContent = 'My Account';
    if (registerBtn) registerBtn.style.display = 'none';
    
    // Add logout button if it doesn't exist
    const userActions = document.querySelector('.user-actions');
    if (userActions && !document.getElementById('logoutBtn')) {
        const logoutBtn = document.createElement('a');
        logoutBtn.href = '#';
        logoutBtn.id = 'logoutBtn';
        logoutBtn.textContent = 'Logout';
        logoutBtn.addEventListener('click', logout);
        userActions.appendChild(logoutBtn);
    }
}

// Update UI for logged out user
function updateUIForLoggedOutUser() {
    if (loginBtn) loginBtn.textContent = 'Login';
    if (registerBtn) registerBtn.style.display = 'inline-block';
    
    // Remove logout button if it exists
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.parentNode.removeChild(logoutBtn);
    }
}

// Setup event listeners
function setupEventListeners() {
    // Modal triggers
    if (loginBtn) {
        loginBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (currentUser) {
                // Navigate to account page if logged in
                window.location.href = 'account.html';
            } else {
                // Show login modal if logged out
                loginModal.style.display = 'block';
            }
        });
    }
    
    if (registerBtn) {
        registerBtn.addEventListener('click', (e) => {
            e.preventDefault();
            registerModal.style.display = 'block';
        });
    }
    
    // Switch between modals
    if (showRegisterLink) {
        showRegisterLink.addEventListener('click', (e) => {
            e.preventDefault();
            loginModal.style.display = 'none';
            registerModal.style.display = 'block';
        });
    }
    
    if (showLoginLink) {
        showLoginLink.addEventListener('click', (e) => {
            e.preventDefault();
            registerModal.style.display = 'none';
            loginModal.style.display = 'block';
        });
    }
    
    // Close modals
    closeButtons.forEach(button => {
        button.addEventListener('click', () => {
            loginModal.style.display = 'none';
            registerModal.style.display = 'none';
        });
    });
    
    // Close when clicking outside the modal
    window.addEventListener('click', (e) => {
        if (e.target === loginModal) {
            loginModal.style.display = 'none';
        }
        if (e.target === registerModal) {
            registerModal.style.display = 'none';
        }
    });
    
    // Form submissions
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }
}

// Handle login form submission
async function handleLogin(e) {
    e.preventDefault();
    
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;
    
    try {
        const response = await fetch(`${AUTH_API_URL}/signin`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });
        
        if (!response.ok) {
            throw new Error('Login failed');
        }
        
        const data = await response.json();
        
        // Store auth token and user info
        localStorage.setItem('token', data.token);
        localStorage.setItem('username', data.username);
        localStorage.setItem('roles', JSON.stringify(data.roles));
        
        // Update current user and UI
        currentUser = { username: data.username, roles: data.roles };
        updateUIForLoggedInUser();
        
        // Close modal
        loginModal.style.display = 'none';
        
        // Show success message
        showMessage('Login successful!', 'success');
    } catch (error) {
        console.error('Login error:', error);
        showMessage('Login failed. Please check your credentials.', 'error');
    }
}

// Handle register form submission
async function handleRegister(e) {
    e.preventDefault();
    
    const username = document.getElementById('registerUsername').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('registerConfirmPassword').value;
    
    // Check if passwords match
    if (password !== confirmPassword) {
        showMessage('Passwords do not match', 'error');
        return;
    }
    
    try {
        const response = await fetch(`${AUTH_API_URL}/signup`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username,
                email,
                password,
                role: ['user'] // Default role
            })
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Registration failed');
        }
        
        const data = await response.json();
        
        // Close register modal and show login
        registerModal.style.display = 'none';
        loginModal.style.display = 'block';
        
        // Show success message
        showMessage('Registration successful! You can now login.', 'success');
    } catch (error) {
        console.error('Registration error:', error);
        showMessage(`Registration failed: ${error.message}`, 'error');
    }
}

// Handle logout
function logout() {
    // Clear local storage
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('roles');
    
    // Update current user and UI
    currentUser = null;
    updateUIForLoggedOutUser();
    
    // Show success message
    showMessage('You have been logged out', 'success');
}

// Display messages to the user
function showMessage(message, type = 'info') {
    // Create message container if it doesn't exist
    let messageContainer = document.getElementById('message-container');
    if (!messageContainer) {
        messageContainer = document.createElement('div');
        messageContainer.id = 'message-container';
        messageContainer.style.position = 'fixed';
        messageContainer.style.top = '20px';
        messageContainer.style.right = '20px';
        messageContainer.style.zIndex = '9999';
        document.body.appendChild(messageContainer);
    }
    
    // Create message element
    const messageElement = document.createElement('div');
    messageElement.className = `message ${type}`;
    messageElement.textContent = message;
    messageElement.style.padding = '10px 20px';
    messageElement.style.marginBottom = '10px';
    messageElement.style.borderRadius = '4px';
    messageElement.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
    
    // Set background color based on message type
    switch (type) {
        case 'success':
            messageElement.style.backgroundColor = '#4CAF50';
            messageElement.style.color = 'white';
            break;
        case 'error':
            messageElement.style.backgroundColor = '#f44336';
            messageElement.style.color = 'white';
            break;
        case 'warning':
            messageElement.style.backgroundColor = '#ff9800';
            messageElement.style.color = 'white';
            break;
        default:
            messageElement.style.backgroundColor = '#2196F3';
            messageElement.style.color = 'white';
    }
    
    // Add message to container
    messageContainer.appendChild(messageElement);
    
    // Remove message after 3 seconds
    setTimeout(() => {
        messageElement.style.opacity = '0';
        messageElement.style.transition = 'opacity 0.5s';
        setTimeout(() => {
            if (messageContainer.contains(messageElement)) {
                messageContainer.removeChild(messageElement);
            }
        }, 500);
    }, 3000);
}

// Helper function to get auth header
function getAuthHeader() {
    const token = localStorage.getItem('token');
    return token ? { 'Authorization': `Bearer ${token}` } : {};
}

// Export functions for use in other scripts
window.auth = {
    isAuthenticated: () => !!localStorage.getItem('token'),
    getUsername: () => localStorage.getItem('username'),
    getToken: () => localStorage.getItem('token'),
    getRoles: () => JSON.parse(localStorage.getItem('roles') || '[]'),
    getAuthHeader,
    logout
}; 