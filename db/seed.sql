-- Seed data for the canonical shop. Small enough to count by eye, and deliberately awkward in the
-- places later chapters need:
--   * customers 7 and 8 have never ordered                       -> outer joins, anti-joins
--   * product 10 has never been ordered                          -> the same, from the other side
--   * customer 5 has no phone; three reviews have no comment     -> NULL handling
--   * customers 3 and 9 share a name and a city, different email -> deduplication
--   * orders fall on 1-3 Mar, 6-7 Mar, and 12 Mar                -> gaps and islands
--   * order 8 is cancelled; order 10 is part-paid; 9 and 11 unpaid -> status filters, reconciliation
--   * employees and categories are trees                         -> self-joins, recursive CTEs
SET search_path = shop;

INSERT INTO categories (category_id, name, parent_id) VALUES
  (1, 'Electronics', NULL),
  (2, 'Audio',       1),
  (3, 'Computers',   1),
  (4, 'Books',       NULL),
  (5, 'Home',        NULL),
  (6, 'Headphones',  2);

INSERT INTO customers (customer_id, first_name, last_name, email, phone, city, country, signup_date) VALUES
  (1,  'Asha',   'Rao',     'asha.rao@example.com',    '+91-98450-11111', 'Bengaluru', 'India',   '2025-01-10'),
  (2,  'Ben',    'Carter',  'ben.carter@example.com',  '+44-7700-900101', 'London',    'UK',      '2025-01-22'),
  (3,  'Chloe',  'Martin',  'chloe.martin@example.com','+33-6-12-34-56', 'Lyon',      'France',  '2025-02-03'),
  (4,  'Dev',    'Patel',   'dev.patel@example.com',   '+91-98450-22222', 'Mumbai',    'India',   '2025-02-14'),
  (5,  'Elena',  'Rossi',   'elena.rossi@example.com', NULL,              'Milan',     'Italy',   '2025-02-28'),
  (6,  'Farid',  'Khan',    'farid.khan@example.com',  '+971-50-555-0106','Dubai',     'UAE',     '2025-03-05'),
  (7,  'Grace',  'Lee',     'grace.lee@example.com',   '+1-415-555-0107', 'San Jose',  'USA',     '2025-03-18'),
  (8,  'Hiro',   'Tanaka',  'hiro.tanaka@example.com', '+81-90-5555-0108','Osaka',     'Japan',   '2025-04-02'),
  (9,  'Chloe',  'Martin',  'c.martin@example.org',    '+33-6-98-76-54', 'Lyon',      'France',  '2025-04-20');

INSERT INTO products (product_id, name, category_id, price, stock, discontinued) VALUES
  (1,  'Wireless Earbuds',      6,  59.00, 120, false),
  (2,  'Studio Headphones',     6, 149.00,  35, false),
  (3,  'Bluetooth Speaker',     2,  79.50,  60, false),
  (4,  'Laptop 14"',            3, 899.00,  15, false),
  (5,  'Mechanical Keyboard',   3, 119.00,  42, false),
  (6,  'SQL for Beginners',     4,  29.90, 200, false),
  (7,  'Database Design',       4,  44.00,  80, false),
  (8,  'Desk Lamp',             5,  34.00,  75, false),
  (9,  'Coffee Grinder',        5,  52.00,   0, false),
  (10, 'Retro Cassette Player', 2,  39.00,   9, true);

INSERT INTO employees (employee_id, name, title, manager_id, hire_date, salary) VALUES
  (1, 'Nora Quinn',   'CEO',                    NULL, '2019-01-07', 210000),
  (2, 'Omar Haddad',  'Head of Sales',          1,    '2020-03-16', 130000),
  (3, 'Priya Nair',   'Head of Operations',     1,    '2020-06-01',  125000),
  (4, 'Quinn Moore',  'Sales Representative',   2,    '2021-09-13',   62000),
  (5, 'Rafael Diaz',  'Sales Representative',   2,    '2022-02-07',   60000),
  (6, 'Sana Iqbal',   'Warehouse Lead',         3,    '2021-04-19',   58000),
  (7, 'Tom Becker',   'Warehouse Associate',    6,    '2023-08-21',   41000);

INSERT INTO orders (order_id, customer_id, employee_id, order_date, status) VALUES
  (1,  1, 4,    '2025-03-01', 'delivered'),
  (2,  2, NULL, '2025-03-01', 'delivered'),
  (3,  1, 5,    '2025-03-02', 'delivered'),
  (4,  3, NULL, '2025-03-03', 'delivered'),
  (5,  4, 4,    '2025-03-06', 'delivered'),
  (6,  2, NULL, '2025-03-06', 'shipped'),
  (7,  5, 5,    '2025-03-07', 'shipped'),
  (8,  6, NULL, '2025-03-07', 'cancelled'),
  (9,  1, NULL, '2025-03-12', 'pending'),
  (10, 4, 4,    '2025-03-12', 'pending'),
  (11, 9, NULL, '2025-03-12', 'pending');

INSERT INTO order_items (order_id, line_no, product_id, quantity, unit_price) VALUES
  (1,  1, 1, 1,  59.00),
  (1,  2, 6, 2,  29.90),
  (2,  1, 4, 1, 899.00),
  (3,  1, 2, 1, 149.00),
  (3,  2, 7, 1,  44.00),
  (4,  1, 3, 2,  79.50),
  (5,  1, 5, 1, 119.00),
  (5,  2, 8, 2,  34.00),
  (6,  1, 1, 2,  59.00),
  (7,  1, 6, 1,  29.90),
  (7,  2, 7, 1,  44.00),
  (8,  1, 9, 1,  52.00),
  (9,  1, 2, 1, 149.00),
  (10, 1, 4, 1, 899.00),
  (10, 2, 5, 1, 119.00),
  (11, 1, 8, 3,  34.00);

INSERT INTO payments (payment_id, order_id, method, amount, paid_at) VALUES
  (1, 1, 'card',     118.80, '2025-03-01'),
  (2, 2, 'paypal',   899.00, '2025-03-01'),
  (3, 3, 'card',     193.00, '2025-03-02'),
  (4, 4, 'transfer', 159.00, '2025-03-04'),
  (5, 5, 'card',     187.00, '2025-03-06'),
  (6, 6, 'card',     118.00, '2025-03-06'),
  (7, 7, 'paypal',    73.90, '2025-03-07'),
  (8, 10,'card',     500.00, '2025-03-12');

INSERT INTO reviews (review_id, product_id, customer_id, rating, comment, created_at) VALUES
  (1, 1, 1, 5, 'Great battery life',        '2025-03-10'),
  (2, 2, 1, 4, NULL,                        '2025-03-11'),
  (3, 4, 2, 5, 'Fast and quiet',            '2025-03-09'),
  (4, 3, 3, 3, 'Sound is fine, bass is weak','2025-03-10'),
  (5, 6, 1, 5, NULL,                        '2025-03-08'),
  (6, 5, 4, 4, 'Nice key feel',             '2025-03-13'),
  (7, 7, 5, 2, 'Too theoretical',           '2025-03-14'),
  (8, 1, 2, 4, NULL,                        '2025-03-12'),
  (9, 8, 4, 5, 'Bright and sturdy',         '2025-03-13');

-- Fresh tables have no planner statistics until autovacuum visits them; analysing here keeps the
-- EXPLAIN plans shown in chapter 6 identical on every machine and in CI.
ANALYZE;
