-- Chapter 2 claims that a displayed snippet cannot show. Each block asserts one section's evidence.

-- §6: the finished wishlist table accepts two records and rejects four, each for the stated rule.
CREATE TABLE wishlist (
  customer_id integer NOT NULL REFERENCES customers (customer_id),
  product_id  integer NOT NULL REFERENCES products (product_id),
  priority    integer NOT NULL DEFAULT 3 CHECK (priority BETWEEN 1 AND 5),
  added_on    date    NOT NULL DEFAULT current_date,
  PRIMARY KEY (customer_id, product_id)
);
DO $$
BEGIN
  INSERT INTO wishlist (customer_id, product_id, priority) VALUES (1, 4, 3);          -- accepted
  INSERT INTO wishlist (customer_id, product_id, priority) VALUES (3, 5, 1);          -- accepted
  BEGIN INSERT INTO wishlist (customer_id, product_id, priority) VALUES (1, 4, 2);
    RAISE EXCEPTION 'duplicate pair was accepted';
  EXCEPTION WHEN unique_violation THEN NULL; END;                                      -- PRIMARY KEY
  BEGIN INSERT INTO wishlist (customer_id, product_id, priority) VALUES (99, 4, 3);
    RAISE EXCEPTION 'unknown customer was accepted';
  EXCEPTION WHEN foreign_key_violation THEN NULL; END;                                 -- FOREIGN KEY
  BEGIN INSERT INTO wishlist (customer_id, product_id, priority) VALUES (2, 5, 9);
    RAISE EXCEPTION 'priority 9 was accepted';
  EXCEPTION WHEN check_violation THEN NULL; END;                                       -- CHECK
  BEGIN INSERT INTO wishlist (customer_id, product_id, priority) VALUES (NULL, 4, 3);
    RAISE EXCEPTION 'NULL customer was accepted';
  EXCEPTION WHEN not_null_violation THEN NULL; END;                                    -- NOT NULL
  ASSERT (SELECT count(*) FROM wishlist) = 2, 'exactly the two valid records remain';
END $$;

-- §2: the wide sheet really does disagree with itself after a partial update, and the
-- normalised table does not (one row holds the city).
DO $$
BEGIN
  CREATE TEMP TABLE order_sheet AS
    SELECT o.order_id, c.first_name || ' ' || c.last_name AS customer, c.city
    FROM orders o JOIN customers c USING (customer_id);
  UPDATE order_sheet SET city = 'Mysuru' WHERE order_id = 1;
  ASSERT (SELECT count(DISTINCT city) FROM order_sheet WHERE customer = 'Asha Rao') = 2, 'two cities for Asha';
  ASSERT (SELECT count(*) FROM customers WHERE first_name = 'Asha') = 1, 'Asha is one row in customers';
END $$;

-- §9: TRUNCATE and DROP are transactional — undoing them restores the rows and the table.
DO $$
BEGIN
  CREATE TEMP TABLE w (a integer);
  INSERT INTO w VALUES (1), (2), (3);
  BEGIN TRUNCATE w; ASSERT (SELECT count(*) FROM w) = 0, 'truncate emptied it';
    RAISE EXCEPTION 'undo';
  EXCEPTION WHEN raise_exception THEN NULL; END;
  ASSERT (SELECT count(*) FROM w) = 3, 'rolled-back TRUNCATE restores the 3 rows';
  BEGIN DROP TABLE w; RAISE EXCEPTION 'undo';
  EXCEPTION WHEN raise_exception THEN NULL; END;
  ASSERT to_regclass('pg_temp.w') IS NOT NULL, 'rolled-back DROP restores the table';
END $$;

-- §7: the catalogue behind information_schema is PostgreSQL's own pg_catalog.
DO $$ BEGIN ASSERT to_regclass('pg_catalog.pg_class') IS NOT NULL, 'pg_catalog exists'; END $$;
