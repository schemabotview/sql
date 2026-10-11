-- The canonical dataset: one small e-commerce shop that every lesson in the course queries.
-- PostgreSQL 16. Chapter 2 teaches how to write this DDL; this file is the finished reference.
--
-- Rebuild from scratch with `npm run db:reset`; every snippet in a slide is run against it by
-- `npm run check:sql`, so a result table on screen can never drift from the database.

DROP SCHEMA IF EXISTS shop CASCADE;
CREATE SCHEMA shop;
SET search_path = shop;

-- A tree: Electronics > Audio, Computers. parent_id IS NULL marks a root (recursive CTEs, ch 6).
CREATE TABLE categories (
  category_id integer PRIMARY KEY,
  name        text    NOT NULL UNIQUE,
  parent_id   integer REFERENCES categories (category_id)
);

CREATE TABLE customers (
  customer_id integer PRIMARY KEY,
  first_name  text NOT NULL,
  last_name   text NOT NULL,
  email       text NOT NULL UNIQUE,
  phone       text,                       -- optional on purpose: the course's NULL specimen
  city        text NOT NULL,
  country     text NOT NULL,
  signup_date date NOT NULL
);

CREATE TABLE products (
  product_id   integer PRIMARY KEY,
  name         text           NOT NULL,
  category_id  integer        NOT NULL REFERENCES categories (category_id),
  price        numeric(8, 2)  NOT NULL CHECK (price > 0),
  stock        integer        NOT NULL DEFAULT 0 CHECK (stock >= 0),
  discontinued boolean        NOT NULL DEFAULT false
);

-- Another tree: manager_id points at the same table (self-joins and hierarchies, ch 5-6).
CREATE TABLE employees (
  employee_id integer PRIMARY KEY,
  name        text          NOT NULL,
  title       text          NOT NULL,
  manager_id  integer       REFERENCES employees (employee_id),
  hire_date   date          NOT NULL,
  salary      numeric(9, 2) NOT NULL CHECK (salary > 0)
);

CREATE TABLE orders (
  order_id    integer PRIMARY KEY,
  customer_id integer NOT NULL REFERENCES customers (customer_id),
  employee_id integer REFERENCES employees (employee_id),  -- NULL = placed online, no sales rep
  order_date  date    NOT NULL,
  status      text    NOT NULL CHECK (status IN ('pending', 'shipped', 'delivered', 'cancelled'))
);

-- A composite key: a line is identified by its order AND its position within it.
CREATE TABLE order_items (
  order_id   integer       NOT NULL REFERENCES orders (order_id),
  line_no    integer       NOT NULL,
  product_id integer       NOT NULL REFERENCES products (product_id),
  quantity   integer       NOT NULL CHECK (quantity > 0),
  unit_price numeric(8, 2) NOT NULL,   -- the price AT PURCHASE, which may differ from products.price
  PRIMARY KEY (order_id, line_no)
);

CREATE TABLE payments (
  payment_id integer       PRIMARY KEY,
  order_id   integer       NOT NULL REFERENCES orders (order_id),
  method     text          NOT NULL CHECK (method IN ('card', 'paypal', 'transfer')),
  amount     numeric(9, 2) NOT NULL CHECK (amount > 0),
  paid_at    date          NOT NULL
);

CREATE TABLE reviews (
  review_id   integer PRIMARY KEY,
  product_id  integer NOT NULL REFERENCES products (product_id),
  customer_id integer NOT NULL REFERENCES customers (customer_id),
  rating      integer NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment     text,                      -- optional: a rating with no words is allowed
  created_at  date    NOT NULL,
  UNIQUE (product_id, customer_id)       -- one review per customer per product
);
