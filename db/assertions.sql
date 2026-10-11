-- The facts the lessons lean on. If someone edits seed.sql and breaks one, `npm run check:sql`
-- fails here, at the cause, rather than three chapters later in a slide that no longer adds up.
SET search_path = shop;

DO $$
DECLARE
  n integer;
BEGIN
  -- Row counts the slides quote.
  IF (SELECT count(*) FROM customers)   <> 9  THEN RAISE EXCEPTION 'customers should have 9 rows'; END IF;
  IF (SELECT count(*) FROM products)    <> 10 THEN RAISE EXCEPTION 'products should have 10 rows'; END IF;
  IF (SELECT count(*) FROM orders)      <> 11 THEN RAISE EXCEPTION 'orders should have 11 rows'; END IF;
  IF (SELECT count(*) FROM order_items) <> 16 THEN RAISE EXCEPTION 'order_items should have 16 rows'; END IF;

  -- Outer joins need rows with no partner, on both sides.
  SELECT count(*) INTO n FROM customers c WHERE NOT EXISTS (SELECT 1 FROM orders o WHERE o.customer_id = c.customer_id);
  IF n <> 2 THEN RAISE EXCEPTION 'exactly 2 customers should have never ordered, found %', n; END IF;
  SELECT count(*) INTO n FROM products p WHERE NOT EXISTS (SELECT 1 FROM order_items i WHERE i.product_id = p.product_id);
  IF n <> 1 THEN RAISE EXCEPTION 'exactly 1 product should have never been ordered, found %', n; END IF;

  -- NULL specimens.
  IF (SELECT count(*) FROM customers WHERE phone IS NULL) <> 1 THEN RAISE EXCEPTION 'exactly 1 customer should have no phone'; END IF;
  IF (SELECT count(*) FROM reviews   WHERE comment IS NULL) <> 3 THEN RAISE EXCEPTION 'exactly 3 reviews should have no comment'; END IF;
  IF (SELECT count(*) FROM orders    WHERE employee_id IS NULL) <> 6 THEN RAISE EXCEPTION 'exactly 6 orders should have no sales rep'; END IF;

  -- Deduplication: one name+city pair appears twice, under different emails.
  SELECT count(*) INTO n FROM (
    SELECT 1 FROM customers GROUP BY first_name, last_name, city HAVING count(*) > 1
  ) d;
  IF n <> 1 THEN RAISE EXCEPTION 'exactly 1 duplicated name+city pair expected, found %', n; END IF;

  -- Gaps and islands: order dates form three runs (1-3 Mar, 6-7 Mar, 12 Mar).
  SELECT count(DISTINCT grp) INTO n FROM (
    SELECT d - (row_number() OVER (ORDER BY d))::int AS grp
    FROM (SELECT DISTINCT order_date AS d FROM orders) x
  ) y;
  IF n <> 3 THEN RAISE EXCEPTION 'order dates should form 3 islands, found %', n; END IF;

  -- Reconciliation: order 10 is part-paid, 9 and 11 unpaid, and order 8 is the one cancelled.
  IF (SELECT sum(quantity * unit_price) FROM order_items WHERE order_id = 10) <= (SELECT sum(amount) FROM payments WHERE order_id = 10)
    THEN RAISE EXCEPTION 'order 10 should be part-paid'; END IF;
  IF (SELECT count(*) FROM orders o WHERE status <> 'cancelled' AND NOT EXISTS (SELECT 1 FROM payments p WHERE p.order_id = o.order_id)) <> 2
    THEN RAISE EXCEPTION 'orders 9 and 11 should be the unpaid live orders'; END IF;
  IF (SELECT count(*) FROM orders WHERE status = 'cancelled') <> 1 THEN RAISE EXCEPTION 'exactly 1 cancelled order expected'; END IF;

  -- Hierarchies: one root each, and depth 3 in both.
  IF (SELECT count(*) FROM employees WHERE manager_id IS NULL) <> 1 THEN RAISE EXCEPTION 'one employee root expected'; END IF;
  IF (SELECT count(*) FROM categories WHERE parent_id IS NULL) <> 3 THEN RAISE EXCEPTION 'three category roots expected'; END IF;
END
$$;
