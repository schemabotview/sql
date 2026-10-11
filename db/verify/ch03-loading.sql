-- Chapter 3 claims that a displayed snippet cannot show.

-- §1/§3: a multi-row INSERT is all-or-nothing — the good first row is NOT kept when the second breaks CHECK.
DO $$
DECLARE before_rows integer;
BEGIN
  SELECT count(*) INTO before_rows FROM products;
  BEGIN
    INSERT INTO products (product_id, name, category_id, price)
      VALUES (11, 'Good', 3, 5.00), (12, 'Bad', 3, -1.00);
    RAISE EXCEPTION 'the bad statement was accepted';
  EXCEPTION WHEN check_violation THEN NULL; END;
  ASSERT (SELECT count(*) FROM products) = before_rows, 'neither row was stored';
  ASSERT NOT EXISTS (SELECT 1 FROM products WHERE product_id = 11), 'the valid row was not kept';
END $$;

-- §3: a child before its parent is refused; parents first succeeds.
DO $$
BEGIN
  BEGIN
    INSERT INTO order_items VALUES (12, 1, 1, 1, 59.00);
    RAISE EXCEPTION 'order line without an order was accepted';
  EXCEPTION WHEN foreign_key_violation THEN NULL; END;
  INSERT INTO orders (order_id, customer_id, employee_id, order_date, status) VALUES (12, 1, NULL, '2025-04-16', 'pending');
  INSERT INTO order_items VALUES (12, 1, 1, 1, 59.00);
  ASSERT (SELECT count(*) FROM order_items WHERE order_id = 12) = 1, 'the line loaded once its order existed';
END $$;

-- §2: an identity number spent on a rolled-back row is not reused (ids 1 and 3, never 2).
DO $$
BEGIN
  CREATE TEMP TABLE tag (id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY, label text NOT NULL);
  INSERT INTO tag (label) VALUES ('gift');
  BEGIN INSERT INTO tag (label) VALUES ('temp'); RAISE EXCEPTION 'undo';
  EXCEPTION WHEN raise_exception THEN NULL; END;
  INSERT INTO tag (label) VALUES ('sale');
  ASSERT (SELECT array_agg(id ORDER BY id) FROM tag) = ARRAY[1, 3], 'ids are 1 and 3';
END $$;

-- §5: reconciliation — 6 source rows = 3 loaded + 3 rejected, and customers go 9 -> 12.
DO $$
DECLARE loaded integer; rejected integer;
BEGIN
  CREATE TEMP TABLE feed (id text, email text, signup_date text);
  INSERT INTO feed VALUES
    ('10', 'ines@x.com', '2025-04-15'), ('11', 'jon@x.com', '2025-04-16'), ('12', NULL, '2025-04-17'),
    ('13', 'asha.rao@example.com', '2025-04-18'), ('14', 'noor@x.com', '2025-13-40'), ('15', 'omar@x.com', '2025-04-20');
  CREATE TEMP TABLE verdicts AS
    SELECT f.id, f.email, f.signup_date,
      CASE
        WHEN f.email IS NULL THEN 'rejected: email missing'
        WHEN EXISTS (SELECT 1 FROM customers c WHERE c.email = f.email) THEN 'rejected: email in use'
        WHEN f.signup_date !~ '^[0-9]{4}-(0[1-9]|1[0-2])-[0-9]{2}$' THEN 'rejected: bad date'
        ELSE 'loaded'
      END AS verdict
    FROM feed f;
  SELECT count(*) FILTER (WHERE verdict = 'loaded'), count(*) FILTER (WHERE verdict <> 'loaded') INTO loaded, rejected FROM verdicts;
  ASSERT loaded = 3 AND rejected = 3, 'three loaded, three rejected';
  ASSERT (SELECT count(*) FROM customers) = 9, 'nine customers before';
  INSERT INTO customers (customer_id, first_name, last_name, email, city, country, signup_date)
    SELECT id::integer, 'New', 'Customer', email, 'City', 'Country', signup_date::date FROM verdicts WHERE verdict = 'loaded';
  ASSERT (SELECT count(*) FROM customers) = 12, 'twelve customers after';
  ASSERT (SELECT count(*) FROM feed) = loaded + rejected, 'source = loaded + rejected';
END $$;
