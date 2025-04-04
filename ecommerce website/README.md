# E-Commerce Website

A full-stack e-commerce application built with Spring Boot and JavaScript.

## Features

- User authentication (signup, login, JWT)
- Product browsing and search
- Shopping cart functionality
- Order management
- Admin dashboard for product management

## Tech Stack

### Backend
- Java 21
- Spring Boot 3.x
- Spring Security with JWT
- Spring Data JPA
- MySQL Database (Production)
- H2 Database (Development)
- Stripe Payment Integration

### Frontend
- HTML5, CSS3, JavaScript
- Bootstrap 5

## Prerequisites

- Java 21 or higher
- Maven
- MySQL (for production)
- Node.js and npm (for frontend development)

## Setup Instructions

### Backend Setup

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/ecommerce-website.git
   cd ecommerce-website
   ```

2. Configure the database:
   - For production: Update `src/main/resources/application.properties` with your MySQL credentials
   - For development: Use H2 in-memory database by running with the dev profile

3. Build the application:
   ```
   mvn clean install
   ```

4. Run the application:
   - For production:
     ```
     mvn spring-boot:run
     ```
   - For development (using H2 database):
     ```
     mvn spring-boot:run -Dspring.profiles.active=dev
     ```

5. The backend will be available at:
   ```
   http://localhost:8080
   ```

6. H2 Console (Development only):
   ```
   http://localhost:8080/h2-console
   ```

### Default Admin Credentials

- Username: admin
- Password: adminpassword

## API Endpoints

### Authentication
- POST `/api/auth/signup` - Register a new user
- POST `/api/auth/signin` - Login and receive JWT token

### Products
- GET `/api/products` - List all products
- GET `/api/products/{id}` - Get a specific product
- POST `/api/products` - Create a new product (Admin only)
- PUT `/api/products/{id}` - Update a product (Admin only)
- DELETE `/api/products/{id}` - Delete a product (Admin only)

### Categories
- GET `/api/categories` - List all categories
- GET `/api/categories/{id}` - Get a specific category
- POST `/api/categories` - Create a new category (Admin only)
- PUT `/api/categories/{id}` - Update a category (Admin only)
- DELETE `/api/categories/{id}` - Delete a category (Admin only)

### Shopping Cart
- GET `/api/cart` - View current user's cart
- POST `/api/cart/add` - Add item to cart
- PUT `/api/cart/update` - Update cart item quantity
- DELETE `/api/cart/remove/{id}` - Remove item from cart

### Orders
- GET `/api/orders` - List user's orders
- GET `/api/orders/{id}` - Get a specific order
- POST `/api/orders` - Create a new order
- PUT `/api/orders/{id}/status` - Update order status (Admin only)

## Frontend Setup

1. Navigate to the frontend directory:
   ```
   cd frontend
   ```

2. Open HTML files directly in a browser or use a simple HTTP server:
   ```
   npx http-server -p 3000
   ```

3. The frontend will be available at:
   ```
   http://localhost:3000
   ```

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Quick Start

### Using the Provided Scripts

1. **Run the application**
   
   Use the provided batch file to start the application in development mode:
   ```
   .\run-app.bat
   ```
   
   This will:
   - Check if Java is installed
   - Set the Spring profile to 'dev' (using H2 in-memory database)
   - Start the application

2. **Test the API endpoints**
   
   Once the application is running, you can test the API endpoints using the PowerShell script:
   ```
   .\test-api.ps1
   ```
   
   This will:
   - Check if the server is running
   - Test the public endpoint
   - Test the categories endpoint
   - Test the products endpoint
   - Attempt to authenticate as admin

### Accessing the H2 Console

When running in development mode, you can access the H2 database console at:
```
http://localhost:8080/h2-console
```

Use these settings:
- JDBC URL: `jdbc:h2:mem:ecommercedb;DB_CLOSE_DELAY=-1`
- Username: `sa`
- Password: ` ` (leave blank)

### Sample Data

The application initializes with sample data including:
- Admin user (username: `admin`, password: `adminpassword`)
- Categories (Electronics, Clothing, Books, etc.)
- Products in each category 