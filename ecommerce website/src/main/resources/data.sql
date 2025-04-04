-- Initialize roles
INSERT INTO roles (name) VALUES ('ROLE_USER') ON DUPLICATE KEY UPDATE name = 'ROLE_USER';
INSERT INTO roles (name) VALUES ('ROLE_ADMIN') ON DUPLICATE KEY UPDATE name = 'ROLE_ADMIN';

-- Initialize admin user (password: adminpassword)
INSERT INTO users (username, email, password, first_name, last_name, address, phone)
VALUES ('admin', 'admin@example.com', '$2a$10$XvUz9ygfmvNCqcyKlBxJ6OjXSn1NUzRISCdCRkuXb5Qwq6VdhYrZ6', 'Admin', 'User', '123 Admin St', '1234567890')
ON DUPLICATE KEY UPDATE username = 'admin';

-- Assign admin role to admin user
INSERT INTO user_roles (user_id, role_id)
SELECT (SELECT id FROM users WHERE username = 'admin'),
       (SELECT id FROM roles WHERE name = 'ROLE_ADMIN')
WHERE NOT EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_id = (SELECT id FROM users WHERE username = 'admin')
    AND role_id = (SELECT id FROM roles WHERE name = 'ROLE_ADMIN')
);

-- Initialize categories
INSERT INTO categories (name, description) VALUES ('Electronics', 'Electronic devices and accessories') ON DUPLICATE KEY UPDATE name = 'Electronics';
INSERT INTO categories (name, description) VALUES ('Clothing', 'Apparel and fashion items') ON DUPLICATE KEY UPDATE name = 'Clothing';
INSERT INTO categories (name, description) VALUES ('Books', 'Books, ebooks and publications') ON DUPLICATE KEY UPDATE name = 'Books';
INSERT INTO categories (name, description) VALUES ('Home & Kitchen', 'Home appliances and kitchen utilities') ON DUPLICATE KEY UPDATE name = 'Home & Kitchen';
INSERT INTO categories (name, description) VALUES ('Beauty', 'Beauty and personal care products') ON DUPLICATE KEY UPDATE name = 'Beauty';

-- Initialize products
-- Electronics
INSERT INTO products (name, description, price, stock_quantity, category_id, featured, image_url)
VALUES ('Smartphone', 'Latest model with high-end features', 999.99, 50, (SELECT id FROM categories WHERE name = 'Electronics'), true, 'https://via.placeholder.com/300x200')
ON DUPLICATE KEY UPDATE name = 'Smartphone';

INSERT INTO products (name, description, price, stock_quantity, category_id, featured, image_url)
VALUES ('Laptop', '15-inch laptop with SSD and 16GB RAM', 1299.99, 30, (SELECT id FROM categories WHERE name = 'Electronics'), true, 'https://via.placeholder.com/300x200')
ON DUPLICATE KEY UPDATE name = 'Laptop';

INSERT INTO products (name, description, price, stock_quantity, category_id, featured, image_url)
VALUES ('Wireless Headphones', 'Noise cancelling with premium sound quality', 199.99, 100, (SELECT id FROM categories WHERE name = 'Electronics'), false, 'https://via.placeholder.com/300x200')
ON DUPLICATE KEY UPDATE name = 'Wireless Headphones';

-- Clothing
INSERT INTO products (name, description, price, stock_quantity, category_id, featured, image_url)
VALUES ('Men\'s T-Shirt', 'Comfortable cotton t-shirt', 19.99, 200, (SELECT id FROM categories WHERE name = 'Clothing'), false, 'https://via.placeholder.com/300x200')
ON DUPLICATE KEY UPDATE name = 'Men\'s T-Shirt';

INSERT INTO products (name, description, price, stock_quantity, category_id, featured, image_url)
VALUES ('Women\'s Jeans', 'Slim fit denim jeans', 49.99, 150, (SELECT id FROM categories WHERE name = 'Clothing'), true, 'https://via.placeholder.com/300x200')
ON DUPLICATE KEY UPDATE name = 'Women\'s Jeans';

-- Books
INSERT INTO products (name, description, price, stock_quantity, category_id, featured, image_url)
VALUES ('Science Fiction Novel', 'Bestselling sci-fi thriller', 14.99, 75, (SELECT id FROM categories WHERE name = 'Books'), false, 'https://via.placeholder.com/300x200')
ON DUPLICATE KEY UPDATE name = 'Science Fiction Novel';

INSERT INTO products (name, description, price, stock_quantity, category_id, featured, image_url)
VALUES ('Cookbook', 'Recipes from around the world', 24.99, 60, (SELECT id FROM categories WHERE name = 'Books'), false, 'https://via.placeholder.com/300x200')
ON DUPLICATE KEY UPDATE name = 'Cookbook';

-- Home & Kitchen
INSERT INTO products (name, description, price, stock_quantity, category_id, featured, image_url)
VALUES ('Coffee Maker', 'Automatic coffee maker with timer', 79.99, 40, (SELECT id FROM categories WHERE name = 'Home & Kitchen'), true, 'https://via.placeholder.com/300x200')
ON DUPLICATE KEY UPDATE name = 'Coffee Maker';

INSERT INTO products (name, description, price, stock_quantity, category_id, featured, image_url)
VALUES ('Toaster', '4-slot stainless steel toaster', 49.99, 55, (SELECT id FROM categories WHERE name = 'Home & Kitchen'), false, 'https://via.placeholder.com/300x200')
ON DUPLICATE KEY UPDATE name = 'Toaster';

-- Beauty
INSERT INTO products (name, description, price, stock_quantity, category_id, featured, image_url)
VALUES ('Face Cream', 'Hydrating face cream with natural ingredients', 29.99, 90, (SELECT id FROM categories WHERE name = 'Beauty'), false, 'https://via.placeholder.com/300x200')
ON DUPLICATE KEY UPDATE name = 'Face Cream';

INSERT INTO products (name, description, price, stock_quantity, category_id, featured, image_url)
VALUES ('Perfume', 'Luxury fragrance for men and women', 89.99, 70, (SELECT id FROM categories WHERE name = 'Beauty'), true, 'https://via.placeholder.com/300x200')
ON DUPLICATE KEY UPDATE name = 'Perfume'; 