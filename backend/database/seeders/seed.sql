USE ecommerce_web;

-- Roles
INSERT IGNORE INTO roles (id, name) VALUES (1,'admin'),(2,'user');

-- Admin user (password: Admin@123)
INSERT IGNORE INTO users (id,role_id,first_name,last_name,email,password,phone,is_active)
VALUES (1,1,'Super','Admin','admin@ecommerce.com',
  '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBa8mWnKVZx7mG',
  '012000000',1);

-- Sample user (password: User@123)
INSERT IGNORE INTO users (id,role_id,first_name,last_name,email,password,phone,is_active)
VALUES (2,2,'John','Doe','user@ecommerce.com',
  '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBa8mWnKVZx7mG',
  '012111111',1);

-- Categories
INSERT IGNORE INTO categories (id,name,slug,description,is_active,sort_order) VALUES
(1,'Electronics','electronics','Electronic devices and gadgets',1,1),
(2,'Clothing','clothing','Fashion and apparel',1,2),
(3,'Books','books','Books and literature',1,3),
(4,'Home & Garden','home-garden','Home decor and garden supplies',1,4),
(5,'Sports','sports','Sports and outdoor equipment',1,5),
(6,'Smartphones','smartphones','Mobile phones and accessories',1,1),
(7,'Laptops','laptops','Laptops and computers',1,2),
(8,"Men's Fashion","mens-fashion","Men clothing and accessories",1,1);

-- Update parent categories
UPDATE categories SET parent_id=1 WHERE id IN (6,7);
UPDATE categories SET parent_id=2 WHERE id=8;

-- Brands
INSERT IGNORE INTO brands (id,name,slug,website,is_active) VALUES
(1,'Apple','apple','https://apple.com',1),
(2,'Samsung','samsung','https://samsung.com',1),
(3,'Nike','nike','https://nike.com',1),
(4,'Sony','sony','https://sony.com',1),
(5,'Dell','dell','https://dell.com',1),
(6,'Adidas','adidas','https://adidas.com',1),
(7,'LG','lg','https://lg.com',1),
(8,'Asus','asus','https://asus.com',1);

-- Products
INSERT IGNORE INTO products (id,category_id,brand_id,name,slug,short_desc,price,sale_price,stock,sku,is_active,is_featured,avg_rating,review_count) VALUES
(1,6,1,'iPhone 15 Pro','iphone-15-pro','Latest Apple iPhone with titanium design',1299.00,1199.00,50,'APL-IP15P',1,1,4.80,120),
(2,6,2,'Samsung Galaxy S24','samsung-galaxy-s24','Flagship Android smartphone',999.00,899.00,80,'SAM-GS24',1,1,4.60,95),
(3,7,5,'Dell XPS 15','dell-xps-15','High performance laptop for professionals',1599.00,NULL,30,'DELL-XPS15',1,1,4.70,60),
(4,7,8,'ASUS ROG Strix G16','asus-rog-strix-g16','Gaming laptop with RTX 4070',1499.00,1399.00,25,'ASUS-ROG-G16',1,0,4.50,45),
(5,2,3,'Nike Air Max 270','nike-air-max-270','Comfortable running shoes',150.00,120.00,200,'NIKE-AM270',1,1,4.40,200),
(6,2,6,'Adidas Ultraboost 23','adidas-ultraboost-23','Premium running sneakers',180.00,NULL,150,'ADI-UB23',1,0,4.30,88),
(7,1,4,'Sony WH-1000XM5','sony-wh1000xm5','Industry leading noise cancelling headphones',349.00,299.00,60,'SONY-WH1000',1,1,4.90,310),
(8,1,7,'LG OLED 55" TV','lg-oled-55','55 inch 4K OLED Smart TV',1200.00,999.00,20,'LG-OLED55',1,0,4.70,75);

-- Coupons
INSERT IGNORE INTO coupons (code,type,value,min_order_amount,usage_limit,is_active,expires_at) VALUES
('WELCOME10','percentage',10.00,50.00,1000,1,'2025-12-31 23:59:59'),
('SAVE20','fixed',20.00,100.00,500,1,'2025-12-31 23:59:59'),
('FLASH50','percentage',50.00,200.00,100,1,'2025-06-30 23:59:59');

-- Settings
INSERT IGNORE INTO settings (`key`,value,group_name) VALUES
('site_name','ShopEase','general'),
('site_email','info@shopease.com','general'),
('site_phone','+855 12 345 678','general'),
('site_address','Phnom Penh, Cambodia','general'),
('currency','USD','general'),
('currency_symbol','$','general'),
('shipping_fee','5.00','shipping'),
('free_shipping_threshold','100.00','shipping'),
('meta_title','ShopEase - Best Online Shopping','seo'),
('meta_description','Shop the best products at ShopEase','seo');
