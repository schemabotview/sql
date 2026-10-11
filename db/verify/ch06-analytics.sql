-- Chapter 6 claims that a displayed snippet cannot show.

-- §2: the management chain adds 1, 2, 3, 1 rows per round; an unguarded cycle keeps producing rows.
DO $$
BEGIN
  ASSERT (SELECT array_agg(n ORDER BY d) FROM (
    WITH RECURSIVE c AS (SELECT employee_id, 1 AS d FROM employees WHERE manager_id IS NULL
      UNION ALL SELECT e.employee_id, c.d + 1 FROM employees e JOIN c ON e.manager_id = c.employee_id)
    SELECT d, count(*) AS n FROM c GROUP BY d) t) = ARRAY[1, 2, 3, 1]::bigint[], 'rounds add 1,2,3,1';
  ASSERT (WITH RECURSIVE w(id, nxt, depth) AS (
      SELECT id, nxt, 1 FROM (VALUES (1, 2), (2, 3), (3, 1)) e(id, nxt) WHERE id = 1
      UNION ALL SELECT e.id, e.nxt, w.depth + 1 FROM (VALUES (1, 2), (2, 3), (3, 1)) e(id, nxt) JOIN w ON e.id = w.nxt WHERE w.depth < 10)
    SELECT count(*) FROM w) = 10, 'unguarded cycle keeps producing rows until the cap';
END $$;

-- §5: rank skips, dense_rank does not, over the tied unit prices.
DO $$
BEGIN
  ASSERT (SELECT array_agg(r ORDER BY r) FROM (SELECT rank() OVER (ORDER BY unit_price DESC) r FROM order_items) t WHERE r <= 5) = ARRAY[1, 1, 3, 3, 5, 5]::bigint[], 'rank 1,1,3,3,5,5';
  ASSERT (SELECT array_agg(r ORDER BY r) FROM (SELECT dense_rank() OVER (ORDER BY unit_price DESC) r FROM order_items) t WHERE r <= 3) = ARRAY[1, 1, 2, 2, 3, 3]::bigint[], 'dense_rank 1,1,2,2,3,3';
END $$;

-- §4/§6: with ties the default frame is RANGE: peers share the sum.
DO $$
BEGIN
  ASSERT (SELECT count(DISTINCT s) FROM (SELECT sum(i.quantity * i.unit_price) OVER (ORDER BY o.order_date) s FROM orders o JOIN order_items i USING (order_id) WHERE o.order_date = '2025-03-01') t) = 1, 'peers share the default-frame sum';
END $$;

-- §8: order dates form exactly three islands and six gap days.
DO $$
BEGIN
  ASSERT (SELECT count(DISTINCT anchor) FROM (SELECT order_date - (row_number() OVER (ORDER BY order_date))::int AS anchor FROM (SELECT DISTINCT order_date FROM orders) d) n) = 3, 'three islands';
  ASSERT (SELECT count(*) FROM generate_series('2025-03-01'::date, '2025-03-12', '1 day') g(d) WHERE d::date NOT IN (SELECT order_date FROM orders)) = 6, 'six gap days';
END $$;

-- §10: customer 9 signed up in April but ordered in March (period -1); customer 6's only order is cancelled.
DO $$
BEGIN
  ASSERT (SELECT count(*) FROM customers c JOIN orders o USING (customer_id) WHERE o.order_date < c.signup_date) = 1, 'exactly one order before signup';
  ASSERT (SELECT c.customer_id FROM customers c JOIN orders o USING (customer_id) WHERE o.order_date < c.signup_date) = 9, 'customer 9';
  ASSERT (SELECT count(*) FROM orders WHERE customer_id = 6 AND status <> 'cancelled') = 0, 'customer 6 has no live order';
END $$;
