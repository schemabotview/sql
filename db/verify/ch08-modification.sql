-- Chapter 8 claims that a displayed snippet cannot show. Each block undoes its changes with a raised
-- exception (a rolled-back sub-transaction), then asserts the state is restored.

-- §1: UPDATE without WHERE touches every row (10 products); a rollback restores the original prices.
DO $$
DECLARE n bigint; before numeric;
BEGIN
  SELECT sum(price) INTO before FROM products;
  BEGIN
    UPDATE products SET price = round(price * 1.10, 2);
    GET DIAGNOSTICS n = ROW_COUNT;
    ASSERT n = 10, 'no WHERE: UPDATE 10';
    ASSERT (SELECT sum(price) FROM products) <> before, 'prices changed';
    RAISE EXCEPTION 'undo' USING ERRCODE = 'P0001';
  EXCEPTION WHEN raise_exception THEN NULL;
  END;
  ASSERT (SELECT sum(price) FROM products) = before, 'rollback restored every price';
  ASSERT (SELECT count(*) FROM products WHERE category_id = 5) = 2, 'category 5 has 2 products';
END $$;

-- §2/§3: a CHECK refuses price = 0 and leaves the row; a foreign key refuses deleting customer 1;
-- DELETE without WHERE removes all 8 payments; product 10 deletes cleanly.
DO $$
DECLARE n bigint;
BEGIN
  BEGIN
    UPDATE products SET price = 0 WHERE product_id = 1;
    ASSERT false, 'CHECK should have refused';
  EXCEPTION WHEN check_violation THEN NULL;
  END;
  ASSERT (SELECT price FROM products WHERE product_id = 1) = 59.00, 'row unchanged after the refusal';
  BEGIN
    DELETE FROM customers WHERE customer_id = 1;
    ASSERT false, 'FK should have refused';
  EXCEPTION WHEN foreign_key_violation THEN NULL;
  END;
  BEGIN
    DELETE FROM payments;
    GET DIAGNOSTICS n = ROW_COUNT;
    ASSERT n = 8, 'DELETE 8';
    RAISE EXCEPTION 'undo' USING ERRCODE = 'P0001';
  EXCEPTION WHEN raise_exception THEN NULL;
  END;
  ASSERT (SELECT count(*) FROM payments) = 8, 'payments restored';
  BEGIN
    DELETE FROM products WHERE product_id = 10;
    GET DIAGNOSTICS n = ROW_COUNT;
    ASSERT n = 1, 'DELETE 1';
    RAISE EXCEPTION 'undo' USING ERRCODE = 'P0001';
  EXCEPTION WHEN raise_exception THEN NULL;
  END;
  ASSERT (SELECT count(*) FROM orders WHERE status = 'pending') = 3, 'status pending matches 3 orders (9, 10, 11)';
END $$;

-- §4: INSERT ... SELECT is not idempotent: the second run collides with the key and leaves the first 5.
DO $$
BEGIN
  CREATE TABLE orders_archive (LIKE orders INCLUDING ALL);
  INSERT INTO orders_archive SELECT * FROM orders WHERE status = 'delivered';
  BEGIN
    INSERT INTO orders_archive SELECT * FROM orders WHERE status = 'delivered';
    ASSERT false, 'second run should collide';
  EXCEPTION WHEN unique_violation THEN NULL;
  END;
  ASSERT (SELECT count(*) FROM orders_archive) = 5, 'the first five rows remain';
END $$;

-- §5: when several source rows match one target row, UPDATE ... FROM updates it ONCE.
DO $$
DECLARE n bigint;
BEGIN
  UPDATE products p SET stock = stock + s.qty
  FROM (VALUES (1, 5), (1, 7)) AS s(product_id, qty) WHERE p.product_id = s.product_id;
  GET DIAGNOSTICS n = ROW_COUNT;
  ASSERT n = 1, 'two matching source rows, one updated row';
  ASSERT (SELECT stock FROM products WHERE product_id = 1) IN (125, 127), 'exactly one of the two source rows was applied';
END $$;

-- §6: upsert and MERGE counts.
DO $$
DECLARE n bigint;
BEGIN
  BEGIN
  INSERT INTO customers (customer_id, first_name, last_name, email, phone, city, country, signup_date) VALUES
      (1, 'Asha', 'Rao', 'asha.rao@example.com', '+91-98450-99999', 'Bengaluru', 'India', '2025-05-01'),
      (10, 'Ivan', 'Novak', 'ivan.novak@example.com', NULL, 'Prague', 'Czechia', '2025-05-01')
    ON CONFLICT (email) DO UPDATE SET phone = EXCLUDED.phone;
    GET DIAGNOSTICS n = ROW_COUNT;
    ASSERT n = 2, 'INSERT 0 2';
    ASSERT (SELECT count(*) FROM customers) = 10, 'ten customers';
    ASSERT (SELECT phone FROM customers WHERE customer_id = 1) = '+91-98450-99999', 'Asha updated, id unchanged';
    INSERT INTO customers (customer_id, first_name, last_name, email, city, country, signup_date)
    VALUES (11, 'Asha', 'Rao', 'asha.rao@example.com', 'Bengaluru', 'India', '2025-05-01') ON CONFLICT (email) DO NOTHING;
    GET DIAGNOSTICS n = ROW_COUNT;
    ASSERT n = 0, 'DO NOTHING: INSERT 0 0';
    MERGE INTO products p USING (VALUES (1, 62.00), (11, 25.00)) AS s(product_id, price) ON p.product_id = s.product_id
    WHEN MATCHED THEN UPDATE SET price = s.price
    WHEN NOT MATCHED THEN INSERT (product_id, name, category_id, price) VALUES (s.product_id, 'Staged item', 4, s.price);
    GET DIAGNOSTICS n = ROW_COUNT;
    ASSERT n = 2, 'MERGE 2';
    ASSERT (SELECT price FROM products WHERE product_id = 1) = 62.00 AND (SELECT count(*) FROM products WHERE product_id = 11) = 1, 'merged';
    RAISE EXCEPTION 'undo' USING ERRCODE = 'P0001';
  EXCEPTION WHEN raise_exception THEN NULL;
  END;
END $$;

-- §7: cascade deletes children; the trigger fires per row and for "UPDATE OF price" even when unchanged.
DO $$
BEGIN
  BEGIN
  CREATE TABLE wishlist (
      customer_id integer NOT NULL REFERENCES customers (customer_id) ON DELETE CASCADE,
      product_id integer NOT NULL REFERENCES products (product_id),
      PRIMARY KEY (customer_id, product_id));
    INSERT INTO wishlist VALUES (7, 1), (8, 1), (8, 2);
    DELETE FROM customers WHERE customer_id = 8;
    ASSERT (SELECT count(*) FROM wishlist) = 1 AND (SELECT customer_id FROM wishlist) = 7, 'cascade removed customer 8 rows only';
    CREATE TABLE price_audit (product_id integer, old_price numeric(8, 2), new_price numeric(8, 2));
    CREATE FUNCTION log_price() RETURNS trigger LANGUAGE plpgsql AS $f$
    BEGIN INSERT INTO price_audit VALUES (OLD.product_id, OLD.price, NEW.price); RETURN NEW; END $f$;
    CREATE TRIGGER products_price_audit AFTER UPDATE OF price ON products FOR EACH ROW EXECUTE FUNCTION log_price();
    UPDATE products SET price = round(price * 1.10, 2) WHERE category_id = 5;
    ASSERT (SELECT count(*) FROM price_audit) = 2, 'two audit rows';
    UPDATE products SET price = price;
    ASSERT (SELECT count(*) FROM price_audit) = 12, 'unchanged price still fires: 12';
    UPDATE products SET stock = stock + 1;
    ASSERT (SELECT count(*) FROM price_audit) = 12, 'stock-only update fires nothing';
    RAISE EXCEPTION 'undo' USING ERRCODE = 'P0001';
  EXCEPTION WHEN raise_exception THEN NULL;
  END;
END $$;

-- §8: the cleaning case. Deleting customer 9 first is refused; moving the order first works and reconciles.
DO $$
DECLARE n bigint;
BEGIN
  BEGIN
    DELETE FROM customers WHERE customer_id = 9;
    ASSERT false, 'FK should refuse deleting 9 while order 11 exists';
  EXCEPTION WHEN foreign_key_violation THEN NULL;
  END;
  UPDATE orders SET customer_id = 3 WHERE customer_id = 9;
  GET DIAGNOSTICS n = ROW_COUNT;
  ASSERT n = 1, 'UPDATE 1';
  DELETE FROM customers WHERE customer_id = 9;
  GET DIAGNOSTICS n = ROW_COUNT;
  ASSERT n = 1, 'DELETE 1';
  ASSERT (SELECT count(*) FROM customers) = 8 AND (SELECT count(*) FROM orders) = 11, 'customers 8, orders 11';
  ASSERT (SELECT count(*) FROM orders WHERE customer_id = 3) = 2, 'customer 3 has 2 orders';
  ASSERT (SELECT count(*) FROM orders o LEFT JOIN customers c USING (customer_id) WHERE c.customer_id IS NULL) = 0, 'no orphans';
END $$;
