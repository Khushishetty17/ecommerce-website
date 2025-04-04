// Test Auth Panel
document.addEventListener('DOMContentLoaded', function() {
    createAuthTestingPanel();
    setupAuthTestPanelEventListeners();
});

// Base API URL
const API_BASE_URL = 'http://localhost:8080/api';

// Create the Auth Testing Panel
function createAuthTestingPanel() {
    // Check if panel already exists
    if (document.getElementById('auth-test-panel')) return;
    
    // Create panel container
    const panel = document.createElement('div');
    panel.id = 'auth-test-panel';
    panel.style.position = 'fixed';
    panel.style.top = '50px';
    panel.style.right = '20px';
    panel.style.zIndex = '9999';
    panel.style.background = '#f8f9fa';
    panel.style.padding = '15px';
    panel.style.borderRadius = '8px';
    panel.style.boxShadow = '0 0 10px rgba(0,0,0,0.2)';
    panel.style.width = '300px';
    panel.style.maxHeight = '80vh';
    panel.style.overflowY = 'auto';

    // Panel header
    const header = document.createElement('h3');
    header.textContent = 'Auth Testing Panel';
    header.style.marginTop = '0';
    
    // Username field
    const usernameLabel = document.createElement('label');
    usernameLabel.textContent = 'Username:';
    usernameLabel.style.display = 'block';
    usernameLabel.style.marginTop = '10px';
    
    const usernameInput = document.createElement('input');
    usernameInput.id = 'test-username';
    usernameInput.type = 'text';
    usernameInput.value = 'admin';
    usernameInput.style.width = '100%';
    usernameInput.style.padding = '8px';
    usernameInput.style.marginTop = '5px';
    usernameInput.style.boxSizing = 'border-box';
    
    // Password field
    const passwordLabel = document.createElement('label');
    passwordLabel.textContent = 'Password:';
    passwordLabel.style.display = 'block';
    passwordLabel.style.marginTop = '10px';
    
    const passwordInput = document.createElement('input');
    passwordInput.id = 'test-password';
    passwordInput.type = 'password';
    passwordInput.value = 'adminpassword';
    passwordInput.style.width = '100%';
    passwordInput.style.padding = '8px';
    passwordInput.style.marginTop = '5px';
    passwordInput.style.boxSizing = 'border-box';
    
    // Buttons
    const buttonContainer = document.createElement('div');
    buttonContainer.style.marginTop = '15px';
    buttonContainer.style.display = 'flex';
    buttonContainer.style.gap = '10px';
    
    const loginButton = document.createElement('button');
    loginButton.id = 'test-login-btn';
    loginButton.textContent = 'Login';
    loginButton.style.padding = '8px 12px';
    loginButton.style.cursor = 'pointer';
    
    const createRolesButton = document.createElement('button');
    createRolesButton.id = 'create-roles-btn';
    createRolesButton.textContent = 'Create Roles';
    createRolesButton.style.padding = '8px 12px';
    createRolesButton.style.cursor = 'pointer';
    
    const createAdminButton = document.createElement('button');
    createAdminButton.id = 'create-admin-btn';
    createAdminButton.textContent = 'Create Admin';
    createAdminButton.style.padding = '8px 12px';
    createAdminButton.style.cursor = 'pointer';
    
    buttonContainer.appendChild(loginButton);
    buttonContainer.appendChild(createRolesButton);
    buttonContainer.appendChild(createAdminButton);
    
    // Status display
    const statusLabel = document.createElement('div');
    statusLabel.textContent = 'Status:';
    statusLabel.style.marginTop = '15px';
    statusLabel.style.fontWeight = 'bold';
    
    const statusDisplay = document.createElement('div');
    statusDisplay.id = 'test-status';
    statusDisplay.textContent = 'Waiting for action...';
    statusDisplay.style.padding = '10px';
    statusDisplay.style.marginTop = '5px';
    statusDisplay.style.backgroundColor = '#f1f1f1';
    statusDisplay.style.borderRadius = '4px';
    
    // Hide panel button
    const hideButton = document.createElement('button');
    hideButton.id = 'hide-panel-btn';
    hideButton.textContent = 'Hide Panel';
    hideButton.style.marginTop = '15px';
    hideButton.style.padding = '8px 12px';
    hideButton.style.width = '100%';
    hideButton.style.cursor = 'pointer';
    
    // Assemble panel
    panel.appendChild(header);
    panel.appendChild(usernameLabel);
    panel.appendChild(usernameInput);
    panel.appendChild(passwordLabel);
    panel.appendChild(passwordInput);
    panel.appendChild(buttonContainer);
    panel.appendChild(statusLabel);
    panel.appendChild(statusDisplay);
    panel.appendChild(hideButton);
    
    // Add panel to document
    document.body.appendChild(panel);
}

// Setup event listeners for the Auth Testing Panel
function setupAuthTestPanelEventListeners() {
    // Add hide/show panel toggle using T key
    document.addEventListener('keydown', function(e) {
        if (e.key === 't' || e.key === 'T') {
            const panel = document.getElementById('auth-test-panel');
            if (panel) {
                panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
            }
        }
    });
    
    // Attach button event listeners
    document.getElementById('test-login-btn')?.addEventListener('click', testLogin);
    document.getElementById('create-roles-btn')?.addEventListener('click', createRoles);
    document.getElementById('create-admin-btn')?.addEventListener('click', createAdmin);
    document.getElementById('hide-panel-btn')?.addEventListener('click', function() {
        document.getElementById('auth-test-panel').style.display = 'none';
    });
}

// Test Login function
async function testLogin() {
    const username = document.getElementById('test-username').value;
    const password = document.getElementById('test-password').value;
    const statusElement = document.getElementById('test-status');
    
    if (!username || !password) {
        updateStatus('Error: Username and password are required', true);
        return;
    }
    
    try {
        updateStatus('Attempting login...', false);
        
        const response = await fetch(`${API_BASE_URL}/test-auth/login?username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error || 'Login failed');
        }
        
        // Store token and user info
        localStorage.setItem('token', data.token);
        localStorage.setItem('username', data.username);
        
        updateStatus(`Login successful! Token: ${data.token.substring(0, 20)}...`, false);
        console.log('Auth success:', data);
    } catch (error) {
        updateStatus(`Error: ${error.message}`, true);
        console.error('Auth error:', error);
    }
}

// Create Roles function
async function createRoles() {
    try {
        updateStatus('Creating roles...', false);
        
        const response = await fetch(`${API_BASE_URL}/test-auth/roles`, {
            method: 'GET'
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error || 'Failed to create roles');
        }
        
        updateStatus(`Roles created successfully!`, false);
        console.log('Roles created:', data);
    } catch (error) {
        updateStatus(`Error: ${error.message}`, true);
        console.error('Create roles error:', error);
    }
}

// Create Admin function
async function createAdmin() {
    try {
        updateStatus('Creating admin user...', false);
        
        const response = await fetch(`${API_BASE_URL}/test-auth/create-admin`, {
            method: 'POST'
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error || 'Failed to create admin');
        }
        
        updateStatus(`Admin created! Username: ${data.username}, Password: ${data.password}`, false);
        console.log('Admin created:', data);
    } catch (error) {
        updateStatus(`Error: ${error.message}`, true);
        console.error('Create admin error:', error);
    }
}

// Update status display
function updateStatus(message, isError) {
    const statusElement = document.getElementById('test-status');
    if (statusElement) {
        statusElement.textContent = message;
        statusElement.style.backgroundColor = isError ? '#f8d7da' : '#d4edda';
        statusElement.style.color = isError ? '#721c24' : '#155724';
    }
}

// Helper function to test if API is accessible
async function checkApiConnection() {
    try {
        const response = await fetch(`${API_BASE_URL}/test-auth/health`);
        return response.ok;
    } catch (error) {
        console.error('API connection error:', error);
        return false;
    }
}

// Initialize by checking connection
(async function() {
    try {
        const connected = await checkApiConnection();
        if (!connected) {
            updateStatus('Error: Failed to connect to API server', true);
        }
    } catch (error) {
        updateStatus('Error: Failed to fetch', true);
    }
})(); 