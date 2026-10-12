-- Chapter 10 claims that a displayed card cannot show. Roles are created inside the file's transaction,
-- which the runner rolls back, so the cluster keeps none. SET ROLE / RESET ROLE make the checks real
-- for a superuser runner.

-- §1: without USAGE on the schema, a qualified name is "permission denied", an unqualified one "does not exist".
DO $$
BEGIN
  CREATE ROLE v_analyst NOLOGIN;
  SET LOCAL ROLE v_analyst;
  BEGIN
    PERFORM count(*) FROM shop.orders;
    ASSERT false, 'qualified name must be refused';
  EXCEPTION WHEN insufficient_privilege THEN NULL;
  END;
  BEGIN
    PERFORM count(*) FROM orders;
    ASSERT false, 'unqualified name must fail';
  EXCEPTION WHEN undefined_table THEN NULL;
  END;
  RESET ROLE;
END $$;

-- §4: a default view runs with the OWNER's rights; a security_invoker view (PostgreSQL 15+) with the caller's.
DO $$
BEGIN
  CREATE ROLE v_viewer NOLOGIN;
  GRANT USAGE ON SCHEMA shop TO v_viewer;
  CREATE VIEW v_default AS SELECT customer_id, first_name FROM customers;
  CREATE VIEW v_invoker WITH (security_invoker = true) AS SELECT customer_id, first_name FROM customers;
  GRANT SELECT ON v_default, v_invoker TO v_viewer;
  SET LOCAL ROLE v_viewer;
  ASSERT (SELECT count(*) FROM v_default) = 9, 'owner-rights view works without table access';
  BEGIN
    PERFORM count(*) FROM v_invoker;
    ASSERT false, 'security_invoker view needs the caller to have table access';
  EXCEPTION WHEN insufficient_privilege THEN NULL;
  END;
  RESET ROLE;
END $$;

-- §4: the row policy shows 3 / 2 orders to employees 4 / 5; the 6 online orders (NULL employee) match nobody.
DO $$
BEGIN
  CREATE ROLE v_sales NOLOGIN;
  GRANT USAGE ON SCHEMA shop TO v_sales;
  GRANT SELECT ON orders TO v_sales;
  ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
  CREATE POLICY own_orders ON orders FOR SELECT TO v_sales USING (employee_id = current_setting('app.employee_id', true)::int);
  SET LOCAL ROLE v_sales;
  PERFORM set_config('app.employee_id', '4', true);
  ASSERT (SELECT array_agg(order_id ORDER BY order_id) FROM orders) = ARRAY[1, 5, 10], 'employee 4 sees 1, 5, 10';
  PERFORM set_config('app.employee_id', '5', true);
  ASSERT (SELECT array_agg(order_id ORDER BY order_id) FROM orders) = ARRAY[3, 7], 'employee 5 sees 3, 7';
  ASSERT (SELECT count(*) FROM orders WHERE employee_id IS NULL) = 0, 'online orders are invisible to every rep';
  RESET ROLE;
  ASSERT (SELECT count(*) FROM orders) = 11, 'the owner bypasses the policy';
  ASSERT (SELECT count(*) FROM orders WHERE employee_id IS NULL) = 6, 'six online orders exist';
END $$;

-- §5: pasted text becomes code (9 rows); the same text as a parameter matches nobody; DROP needs ownership.
DO $$
DECLARE n bigint;
BEGIN
  EXECUTE 'SELECT count(*) FROM customers WHERE email = ''x'' OR ''1''=''1''' INTO n;
  ASSERT n = 9, 'pasted: 9 rows';
  EXECUTE 'SELECT count(*) FROM customers WHERE email = $1' INTO n USING 'x'' OR ''1''=''1';
  ASSERT n = 0, 'parameter: 0 rows';
  ASSERT format('SELECT * FROM %I', 'orders; DROP TABLE customers') = 'SELECT * FROM "orders; DROP TABLE customers"', 'format %I quotes the whole text as one name';
  CREATE ROLE v_app LOGIN;
  GRANT USAGE ON SCHEMA shop TO v_app;
  GRANT SELECT, INSERT ON orders TO v_app;
  SET LOCAL ROLE v_app;
  BEGIN
    DROP TABLE orders;
    ASSERT false, 'only the owner may drop';
  EXCEPTION WHEN insufficient_privilege THEN NULL;
  END;
  RESET ROLE;
END $$;
