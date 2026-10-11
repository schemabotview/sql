-- Chapter 5 claims that a displayed snippet cannot show.

-- §2: joining on the wrong columns still runs and returns 9 rows; order 3 is Asha's (customer 1).
DO $$
BEGIN
  ASSERT (SELECT count(*) FROM customers c JOIN orders o ON c.customer_id = o.order_id) = 9, 'wrong-key join: 9 rows';
  ASSERT (SELECT customer_id FROM orders WHERE order_id = 3) = 1, 'order 3 belongs to customer 1';
END $$;

-- §5: the amplified total, and why: every payment repeats once per line of its order.
DO $$
BEGIN
  ASSERT (SELECT sum(p.amount) FROM orders o JOIN order_items i USING (order_id) JOIN payments p USING (order_id)) = 3321.40, 'amplified total';
  ASSERT (SELECT sum(amount) FROM payments) = 2248.70, 'true total';
  ASSERT 3321.40 - 2248.70 = 1072.70, 'excess';
  ASSERT (SELECT sum(p.amount) FROM payments p JOIN (SELECT order_id FROM order_items GROUP BY order_id HAVING count(*) = 2) i USING (order_id)) = 118.80 + 193.00 + 187.00 + 73.90 + 500.00, 'five two-line paid orders';
END $$;

-- §8: NOT IN with a NULL in the list returns nothing, because orders.employee_id has NULLs.
DO $$
BEGIN
  ASSERT (SELECT count(*) FROM orders WHERE employee_id IS NULL) = 6, 'six online orders';
  ASSERT (SELECT count(*) FROM employees WHERE employee_id NOT IN (SELECT employee_id FROM orders)) = 0, 'NOT IN: no rows';
  ASSERT (SELECT count(*) FROM employees WHERE employee_id NOT IN (SELECT employee_id FROM orders WHERE employee_id IS NOT NULL)) = 5, 'filtering NULLs restores 5';
END $$;

-- §10: a view stores a query — it follows its base table — and WITH CHECK OPTION refuses rows it would hide.
DO $$
BEGIN
  CREATE VIEW live_orders AS SELECT order_id, customer_id, status FROM orders WHERE status <> 'cancelled';
  ASSERT (SELECT count(*) FROM live_orders) = 10, 'view: 10 live orders';
  UPDATE orders SET status = 'cancelled' WHERE order_id = 9;
  ASSERT (SELECT count(*) FROM live_orders) = 9, 'view follows the base table';
  CREATE VIEW checked AS SELECT order_id, customer_id, status FROM orders WHERE status <> 'cancelled' WITH CHECK OPTION;
  BEGIN
    UPDATE checked SET status = 'cancelled' WHERE order_id = 1;
    ASSERT false, 'CHECK OPTION should have refused';
  EXCEPTION WHEN with_check_option_violation THEN NULL;
  END;
END $$;
