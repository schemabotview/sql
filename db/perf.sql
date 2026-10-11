-- A second, larger schema for chapter 7 (performance). `shop` stays frozen and tiny; performance
-- lessons need enough rows for the planner to have a real choice. Everything is generated from
-- arithmetic (no random()), so row counts, value distributions and ANALYZE statistics are identical on
-- every machine. 20 000 rows is below ANALYZE's default sample size (30 000), so the whole table is
-- read and the planner's row estimates are deterministic too.
--
--   perf.big_customers  2 000 rows   PRIMARY KEY (customer_id)
--   perf.big_orders    20 000 rows   PRIMARY KEY (order_id); NO index on customer_id, order_date, status
--
--   status: 'cancelled' 1 in 50 (400), 'pending' 1 in 7 of the rest, else 'delivered'
--   customer_id = 1 + (i * 37) % 2000       (every customer has exactly 10 orders)
--   order_date  = 2025-01-01 + i % 365      (every date has 54 or 55 orders)
DROP SCHEMA IF EXISTS perf CASCADE;
CREATE SCHEMA perf;
SET search_path = perf;

CREATE TABLE big_customers (
  customer_id integer PRIMARY KEY,
  country     text NOT NULL
);

CREATE TABLE big_orders (
  order_id    integer       PRIMARY KEY,
  customer_id integer       NOT NULL,
  order_date  date          NOT NULL,
  status      text          NOT NULL,
  total       numeric(9, 2) NOT NULL
);

INSERT INTO big_customers
SELECT i, (ARRAY['India', 'UK', 'France', 'Italy', 'UAE', 'USA', 'Japan', 'Germany'])[1 + i % 8]
FROM generate_series(1, 2000) AS i;

INSERT INTO big_orders
SELECT i,
       1 + (i * 37) % 2000,
       DATE '2025-01-01' + i % 365,
       CASE WHEN i % 50 = 0 THEN 'cancelled' WHEN i % 7 = 0 THEN 'pending' ELSE 'delivered' END,
       5 + (i * 31) % 20000 / 100.0
FROM generate_series(1, 20000) AS i;

ANALYZE;
