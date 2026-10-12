-- Chapter 9 claims that a single-session card cannot show. (Two-session claims live in
-- scripts/timelines.mjs, replayed by scripts/check-timelines.mjs.)

-- §1/§2: a failed third step leaves nothing behind when the transaction is rolled back.
DO $$
BEGIN
  BEGIN
    INSERT INTO orders VALUES (12, 2, NULL, '2025-03-13', 'pending');
    INSERT INTO order_items VALUES (12, 1, 9, 1, 52.00);
    UPDATE products SET stock = stock - 1 WHERE product_id = 9;
    ASSERT false, 'product 9 has stock 0: the CHECK must refuse';
  EXCEPTION WHEN check_violation THEN NULL;
  END;
  ASSERT (SELECT stock FROM products WHERE product_id = 9) = 0, 'product 9 has stock 0';
  ASSERT (SELECT count(*) FROM orders WHERE order_id = 12) = 0, 'steps 1 and 2 were undone with step 3';
  ASSERT (SELECT count(*) FROM order_items WHERE order_id = 12) = 0, 'no line either';
END $$;

-- §2: a savepoint keeps the order and the second line, undoing only the first line.
DO $$
BEGIN
  INSERT INTO orders VALUES (12, 2, NULL, '2025-03-13', 'pending');
  BEGIN
    INSERT INTO order_items VALUES (12, 1, 9, 1, 52.00);
    RAISE EXCEPTION 'undo' USING ERRCODE = 'P0001';
  EXCEPTION WHEN raise_exception THEN NULL;
  END;
  INSERT INTO order_items VALUES (12, 1, 6, 1, 29.90);
  ASSERT (SELECT array_agg(product_id) FROM order_items WHERE order_id = 12) = ARRAY[6], 'only the product 6 line remains';
  ASSERT (SELECT count(*) FROM orders WHERE order_id = 12) = 1, 'the order is kept';
END $$;

-- §6: an UPDATE writes a new row version (a new ctid and a new creating transaction id).
DO $$
DECLARE c1 tid; x1 xid; c2 tid; x2 xid;
BEGIN
  SELECT ctid, xmin INTO c1, x1 FROM products WHERE product_id = 1;
  UPDATE products SET price = 64.00 WHERE product_id = 1;
  SELECT ctid, xmin INTO c2, x2 FROM products WHERE product_id = 1;
  ASSERT c1 <> c2, 'the row moved to a new physical location: a new version';
  ASSERT (SELECT price FROM products WHERE product_id = 1) = 64.00, 'the new version is the visible one';
END $$;
