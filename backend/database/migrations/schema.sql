-- ============================================================
-- E-Commerce Database Schema
-- Database: ecommerce_web
-- ============================================================

CREATE DATABASE IF NOT EXISTS ecommerce_web CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE ecommerce_web;

-- -------------------------------------------------------
-- roles
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS roles (
  id        INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name      ENUM('admin','user') NOT NULL UNIQUE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- -------------------------------------------------------
-- users
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
  id           INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  role_id      INT UNSIGNED NOT NULL DEFAULT 2,
  first_name   VARCHAR(80) NOT NULL,
  last_name    VARCHAR(80) NOT NULL,
  email        VARCHAR(191) NOT NULL UNIQUE,
  password     VARCHAR(255) NOT NULL,
  phone        VARCHAR(20),
  avatar       VARCHAR(255),
  is_active    TINYINT(1) DEFAULT 1,
  reset_token  VARCHAR(255),
  reset_token_expiry DATETIME,
  created_at   DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at   DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE RESTRICT,
  INDEX idx_email (email),
  INDEX idx_role  (role_id)
);

-- -------------------------------------------------------
-- addresses
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS addresses (
  id           INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id      INT UNSIGNED NOT NULL,
  full_name    VARCHAR(160) NOT NULL,
  phone        VARCHAR(20)  NOT NULL,
  address_line1 VARCHAR(255) NOT NULL,
  address_line2 VARCHAR(255),
  city         VARCHAR(100) NOT NULL,
  state        VARCHAR(100),
  postal_code  VARCHAR(20),
  country      VARCHAR(100) NOT NULL DEFAULT 'Cambodia',
  is_default   TINYINT(1) DEFAULT 0,
  created_at   DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at   DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_address (user_id)
);

-- -------------------------------------------------------
-- categories
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS categories (
  id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name        VARCHAR(120) NOT NULL,
  slug        VARCHAR(140) NOT NULL UNIQUE,
  description TEXT,
  image       VARCHAR(255),
  parent_id   INT UNSIGNED,
  is_active   TINYINT(1) DEFAULT 1,
  sort_order  INT DEFAULT 0,
  created_at  DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at  DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (parent_id) REFERENCES categories(id) ON DELETE SET NULL,
  INDEX idx_slug   (slug),
  INDEX idx_parent (parent_id)
);

-- -------------------------------------------------------
-- brands
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS brands (
  id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name        VARCHAR(120) NOT NULL,
  slug        VARCHAR(140) NOT NULL UNIQUE,
  description TEXT,
  logo        VARCHAR(255),
  website     VARCHAR(255),
  is_active   TINYINT(1) DEFAULT 1,
  created_at  DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at  DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_slug (slug)
);

-- -------------------------------------------------------
-- products
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS products (
  id              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  category_id     INT UNSIGNED NOT NULL,
  brand_id        INT UNSIGNED,
  name            VARCHAR(255) NOT NULL,
  slug            VARCHAR(280) NOT NULL UNIQUE,
  description     TEXT,
  short_desc      VARCHAR(500),
  sku             VARCHAR(100) UNIQUE,
  price           DECIMAL(12,2) NOT NULL,
  sale_price      DECIMAL(12,2),
  stock           INT DEFAULT 0,
  sold_count      INT DEFAULT 0,
  thumbnail       VARCHAR(255),
  is_active       TINYINT(1) DEFAULT 1,
  is_featured     TINYINT(1) DEFAULT 0,
  avg_rating      DECIMAL(3,2) DEFAULT 0.00,
  review_count    INT DEFAULT 0,
  created_at      DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at      DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE RESTRICT,
  FOREIGN KEY (brand_id)    REFERENCES brands(id)    ON DELETE SET NULL,
  INDEX idx_slug       (slug),
  INDEX idx_category   (category_id),
  INDEX idx_brand      (brand_id),
  INDEX idx_price      (price),
  INDEX idx_featured   (is_featured),
  FULLTEXT idx_search  (name, description)
);

-- -------------------------------------------------------
-- product_images
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS product_images (
  id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  product_id  INT UNSIGNED NOT NULL,
  image_url   VARCHAR(255) NOT NULL,
  alt_text    VARCHAR(255),
  sort_order  INT DEFAULT 0,
  created_at  DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  INDEX idx_product (product_id)
);

-- -------------------------------------------------------
-- coupons
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS coupons (
  id              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  code            VARCHAR(50) NOT NULL UNIQUE,
  type            ENUM('fixed','percentage') DEFAULT 'fixed',
  value           DECIMAL(10,2) NOT NULL,
  min_order_amount DECIMAL(12,2) DEFAULT 0,
  max_discount    DECIMAL(12,2),
  usage_limit     INT,
  used_count      INT DEFAULT 0,
  starts_at       DATETIME,
  expires_at      DATETIME,
  is_active       TINYINT(1) DEFAULT 1,
  created_at      DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at      DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_code (code)
);

-- -------------------------------------------------------
-- orders
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS orders (
  id               INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id          INT UNSIGNED NOT NULL,
  order_number     VARCHAR(30) NOT NULL UNIQUE,
  status           ENUM('pending','confirmed','processing','shipped','delivered','cancelled') DEFAULT 'pending',
  payment_method   ENUM('cod','card','bank_transfer') DEFAULT 'cod',
  payment_status   ENUM('pending','paid','failed','refunded') DEFAULT 'pending',
  subtotal         DECIMAL(12,2) NOT NULL,
  discount         DECIMAL(12,2) DEFAULT 0,
  shipping_fee     DECIMAL(12,2) DEFAULT 0,
  total            DECIMAL(12,2) NOT NULL,
  coupon_id        INT UNSIGNED,
  shipping_address JSON NOT NULL,
  notes            TEXT,
  created_at       DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at       DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id)   REFERENCES users(id)   ON DELETE RESTRICT,
  FOREIGN KEY (coupon_id) REFERENCES coupons(id) ON DELETE SET NULL,
  INDEX idx_user   (user_id),
  INDEX idx_status (status),
  INDEX idx_number (order_number)
);

-- -------------------------------------------------------
-- order_items
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS order_items (
  id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  order_id    INT UNSIGNED NOT NULL,
  product_id  INT UNSIGNED NOT NULL,
  name        VARCHAR(255) NOT NULL,
  thumbnail   VARCHAR(255),
  price       DECIMAL(12,2) NOT NULL,
  quantity    INT NOT NULL,
  subtotal    DECIMAL(12,2) NOT NULL,
  created_at  DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (order_id)   REFERENCES orders(id)   ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE RESTRICT,
  INDEX idx_order   (order_id),
  INDEX idx_product (product_id)
);

-- -------------------------------------------------------
-- payments
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS payments (
  id              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  order_id        INT UNSIGNED NOT NULL UNIQUE,
  transaction_id  VARCHAR(255),
  method          ENUM('cod','card','bank_transfer') DEFAULT 'cod',
  status          ENUM('pending','paid','failed','refunded') DEFAULT 'pending',
  amount          DECIMAL(12,2) NOT NULL,
  paid_at         DATETIME,
  created_at      DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at      DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
);

-- -------------------------------------------------------
-- carts
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS carts (
  id         INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id    INT UNSIGNED NOT NULL UNIQUE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- -------------------------------------------------------
-- cart_items
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS cart_items (
  id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  cart_id     INT UNSIGNED NOT NULL,
  product_id  INT UNSIGNED NOT NULL,
  quantity    INT NOT NULL DEFAULT 1,
  created_at  DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at  DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_cart_product (cart_id, product_id),
  FOREIGN KEY (cart_id)    REFERENCES carts(id)    ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- -------------------------------------------------------
-- wishlists
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS wishlists (
  id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id     INT UNSIGNED NOT NULL,
  product_id  INT UNSIGNED NOT NULL,
  created_at  DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_user_product (user_id, product_id),
  FOREIGN KEY (user_id)    REFERENCES users(id)    ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- -------------------------------------------------------
-- reviews
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS reviews (
  id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id     INT UNSIGNED NOT NULL,
  product_id  INT UNSIGNED NOT NULL,
  order_id    INT UNSIGNED,
  rating      TINYINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  title       VARCHAR(255),
  body        TEXT,
  is_approved TINYINT(1) DEFAULT 1,
  created_at  DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at  DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_user_product (user_id, product_id),
  FOREIGN KEY (user_id)    REFERENCES users(id)    ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  FOREIGN KEY (order_id)   REFERENCES orders(id)   ON DELETE SET NULL,
  INDEX idx_product (product_id),
  INDEX idx_rating  (rating)
);

-- -------------------------------------------------------
-- coupon_usage
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS coupon_usage (
  id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  coupon_id   INT UNSIGNED NOT NULL,
  user_id     INT UNSIGNED NOT NULL,
  order_id    INT UNSIGNED NOT NULL,
  used_at     DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_coupon_user (coupon_id, user_id),
  FOREIGN KEY (coupon_id) REFERENCES coupons(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id)   REFERENCES users(id)   ON DELETE CASCADE,
  FOREIGN KEY (order_id)  REFERENCES orders(id)  ON DELETE CASCADE
);

-- -------------------------------------------------------
-- notifications
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS notifications (
  id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id     INT UNSIGNED NOT NULL,
  title       VARCHAR(255) NOT NULL,
  message     TEXT NOT NULL,
  type        VARCHAR(50) DEFAULT 'info',
  is_read     TINYINT(1) DEFAULT 0,
  link        VARCHAR(255),
  created_at  DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user   (user_id),
  INDEX idx_unread (is_read)
);

-- -------------------------------------------------------
-- settings
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS settings (
  id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `key`       VARCHAR(100) NOT NULL UNIQUE,
  value       TEXT,
  group_name  VARCHAR(60) DEFAULT 'general',
  updated_at  DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_key   (`key`),
  INDEX idx_group (group_name)
);
