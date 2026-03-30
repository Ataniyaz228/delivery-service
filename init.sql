CREATE TYPE IF NOT EXISTS delivery_role AS ENUM ('customer', 'admin');
CREATE TYPE IF NOT EXISTS delivery_order_status AS ENUM ('pending', 'confirmed', 'delivering', 'delivered', 'cancelled');

CREATE TABLE IF NOT EXISTS delivery_users (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone VARCHAR(20),
  address TEXT,
  password_hash TEXT NOT NULL,
  role delivery_role NOT NULL DEFAULT 'customer',
  created_at TIMESTAMP DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS delivery_categories (
  id SERIAL PRIMARY KEY,
  name_kz TEXT NOT NULL,
  icon TEXT,
  color TEXT
);

CREATE TABLE IF NOT EXISTS delivery_products (
  id SERIAL PRIMARY KEY,
  name_kz TEXT NOT NULL,
  description_kz TEXT,
  category_id INTEGER REFERENCES delivery_categories(id),
  price NUMERIC(10,2) NOT NULL,
  stock INTEGER NOT NULL DEFAULT 0,
  image_url TEXT,
  is_active INTEGER NOT NULL DEFAULT 1
);

CREATE TABLE IF NOT EXISTS delivery_orders (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES delivery_users(id),
  status delivery_order_status NOT NULL DEFAULT 'pending',
  total_price NUMERIC(10,2) NOT NULL,
  delivery_address TEXT NOT NULL,
  note TEXT,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS delivery_order_items (
  id SERIAL PRIMARY KEY,
  order_id INTEGER NOT NULL REFERENCES delivery_orders(id),
  product_id INTEGER NOT NULL REFERENCES delivery_products(id),
  quantity INTEGER NOT NULL,
  unit_price NUMERIC(10,2) NOT NULL
);
