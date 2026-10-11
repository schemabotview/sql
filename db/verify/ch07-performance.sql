-- Chapter 7 claims that a displayed plan cannot prove by itself. Timings are never asserted (they vary by
-- machine); plan shapes, row counts and relations between measurements are.
-- Uses the perf schema (db/perf.sql). Every change is rolled back with the transaction around this file.
SET search_path = shop, perf;

CREATE FUNCTION pg_temp.plan_of(q text) RETURNS jsonb LANGUAGE plpgsql AS $f$
DECLARE j json;
BEGIN
  EXECUTE 'EXPLAIN (ANALYZE, FORMAT JSON, TIMING OFF, SUMMARY OFF) ' || q INTO j;
  RETURN j::jsonb -> 0 -> 'Plan';
END $f$;

CREATE FUNCTION pg_temp.node(q text) RETURNS text LANGUAGE sql AS $f$ SELECT pg_temp.plan_of(q) ->> 'Node Type' $f$;
CREATE FUNCTION pg_temp.examined(q text) RETURNS bigint LANGUAGE sql AS
$f$ SELECT ((pg_temp.plan_of(q) ->> 'Actual Rows')::bigint + coalesce((pg_temp.plan_of(q) ->> 'Rows Removed by Filter')::bigint, 0)) $f$;

-- §1: the baseline. Customer 42 has 10 orders; a scan with no index examines all 20 000 rows.
DO $$
BEGIN
  ASSERT (SELECT count(*) FROM big_orders WHERE customer_id = 42) = 10, 'ten orders';
  ASSERT (SELECT sum(total) FROM big_orders WHERE customer_id = 42) = 1018.30, 'revenue 1018.30';
  ASSERT pg_temp.node('SELECT * FROM big_orders WHERE customer_id = 42') = 'Seq Scan', 'baseline is a sequential scan';
  ASSERT pg_temp.examined('SELECT * FROM big_orders WHERE customer_id = 42') = 20000, '20 000 rows examined';
END $$;

-- §2: the plan tree's shape, and the fact that EXPLAIN ANALYZE runs an UPDATE while plain EXPLAIN does not.
DO $$
DECLARE p jsonb;
BEGIN
  p := pg_temp.plan_of($q$SELECT c.country, count(*) AS pending FROM big_orders o JOIN big_customers c USING (customer_id)
        WHERE o.status = 'pending' GROUP BY c.country ORDER BY pending DESC$q$);
  ASSERT p ->> 'Node Type' = 'Sort', 'root is Sort';
  ASSERT p -> 'Plans' -> 0 ->> 'Node Type' = 'Aggregate', 'then the aggregate';
  ASSERT p -> 'Plans' -> 0 -> 'Plans' -> 0 ->> 'Node Type' = 'Hash Join', 'then the hash join';
  EXECUTE 'EXPLAIN (COSTS OFF) UPDATE big_customers SET country = ''x'' WHERE customer_id = 42';
  ASSERT (SELECT count(*) FROM big_customers WHERE country = 'x') = 0, 'plain EXPLAIN changes nothing';
  PERFORM pg_temp.plan_of('UPDATE big_customers SET country = ''x'' WHERE customer_id = 42');
  ASSERT (SELECT count(*) FROM big_customers WHERE country = 'x') = 1, 'EXPLAIN ANALYZE ran the UPDATE';
END $$;

-- §3: estimates versus actuals on a copy of the table (the original is left untouched).
DO $$
DECLARE p jsonb;
BEGIN
  CREATE TABLE orders_copy AS SELECT * FROM big_orders;
  ANALYZE orders_copy;
  p := pg_temp.plan_of('SELECT * FROM orders_copy WHERE status = ''pending''');
  ASSERT (p ->> 'Plan Rows')::int = 2800 AND (p ->> 'Actual Rows')::int = 2800, 'stage 1: estimate = actual = 2800';
  UPDATE orders_copy SET status = 'pending' WHERE order_id % 2 = 0 AND status = 'delivered';
  p := pg_temp.plan_of('SELECT * FROM orders_copy WHERE status = ''pending''');
  ASSERT (p ->> 'Actual Rows')::int = 11029, 'stage 2: actual 11029';
  ASSERT (p ->> 'Plan Rows')::int < 5000, 'stage 2: the estimate is stale (3675 on PostgreSQL 16)';
  ANALYZE orders_copy;
  p := pg_temp.plan_of('SELECT * FROM orders_copy WHERE status = ''pending''');
  ASSERT (p ->> 'Plan Rows')::int = 11029 AND (p ->> 'Actual Rows')::int = 11029, 'stage 3: repaired';
END $$;

-- §4: single-column and composite indexes. Each block creates its index, asserts, and is undone by the
-- exception that ends it (CREATE INDEX is transactional, so the savepoint-style block restores the state).
DO $$
BEGIN
  BEGIN
    CREATE INDEX t1 ON big_orders (customer_id);
    ASSERT pg_temp.node('SELECT * FROM big_orders WHERE customer_id = 42') = 'Bitmap Heap Scan', 'index lookup';
    RAISE EXCEPTION 'undo' USING ERRCODE = 'P0001';
  EXCEPTION WHEN raise_exception THEN NULL;
  END;
  BEGIN
    CREATE INDEX t2 ON big_orders (status, order_date);
    ASSERT pg_temp.node($q$SELECT * FROM big_orders WHERE status = 'pending' AND order_date BETWEEN '2025-03-01' AND '2025-03-07'$q$) = 'Bitmap Heap Scan', '(status, date) serves status + range';
    -- a later column alone is a cost decision, not a rule: the whole index must be read to use it
    ASSERT pg_temp.node($q$SELECT * FROM big_orders WHERE order_date BETWEEN '2025-03-01' AND '2025-03-02'$q$) = 'Seq Scan', '(status, date): 2-day range alone falls back to a scan';
    ASSERT pg_temp.examined($q$SELECT * FROM big_orders WHERE order_date BETWEEN '2025-03-01' AND '2025-03-02'$q$) = 20000 AND (SELECT count(*) FROM big_orders WHERE order_date BETWEEN '2025-03-01' AND '2025-03-02') = 110, 'it examines every row for 110';
    ASSERT pg_temp.node($q$SELECT * FROM big_orders WHERE order_date BETWEEN '2025-03-01' AND '2025-03-07'$q$) = 'Bitmap Heap Scan', 'but the 7-day range still uses the index (planner decides by cost)';
    ASSERT pg_temp.node($q$SELECT * FROM big_orders WHERE status = 'pending'$q$) = 'Bitmap Heap Scan', '(status, date) serves status alone';
    RAISE EXCEPTION 'undo' USING ERRCODE = 'P0001';
  EXCEPTION WHEN raise_exception THEN NULL;
  END;
  BEGIN
    CREATE INDEX t3 ON big_orders (order_date, status);
    ASSERT pg_temp.node($q$SELECT * FROM big_orders WHERE status = 'pending' AND order_date BETWEEN '2025-03-01' AND '2025-03-07'$q$) = 'Bitmap Heap Scan', '(date, status) serves status + range';
    ASSERT pg_temp.node($q$SELECT * FROM big_orders WHERE order_date BETWEEN '2025-03-01' AND '2025-03-07'$q$) = 'Bitmap Heap Scan', '(date, status) serves the date range';
    ASSERT pg_temp.node($q$SELECT * FROM big_orders WHERE status = 'pending'$q$) = 'Seq Scan', '(date, status): status alone, a common value, scans';
    ASSERT pg_temp.node($q$SELECT * FROM big_orders WHERE status = 'cancelled'$q$) = 'Bitmap Heap Scan', 'a rare value can still use it (whole-index scan)';
    RAISE EXCEPTION 'undo' USING ERRCODE = 'P0001';
  EXCEPTION WHEN raise_exception THEN NULL;
  END;
END $$;

-- §5: index-friendly predicates, and selectivity.
DO $$
BEGIN
  BEGIN
    CREATE INDEX t4 ON big_orders (order_date);
    ASSERT pg_temp.node('SELECT * FROM big_orders WHERE extract(month FROM order_date) = 3') = 'Seq Scan', 'function on the column hides the index';
    ASSERT (SELECT count(*) FROM big_orders WHERE extract(month FROM order_date) = 3) = 1705, 'March has 1705 orders';
    ASSERT pg_temp.node($q$SELECT * FROM big_orders WHERE order_date >= '2025-03-01' AND order_date < '2025-04-01'$q$) = 'Bitmap Heap Scan', 'the equivalent range uses it';
    RAISE EXCEPTION 'undo' USING ERRCODE = 'P0001';
  EXCEPTION WHEN raise_exception THEN NULL;
  END;
  BEGIN
    CREATE INDEX t5 ON big_orders (status);
    ASSERT pg_temp.node($q$SELECT * FROM big_orders WHERE status = 'cancelled'$q$) = 'Bitmap Heap Scan', 'a rare value uses the index';
    ASSERT pg_temp.node($q$SELECT * FROM big_orders WHERE status = 'delivered'$q$) = 'Seq Scan', 'a common value does not';
    ASSERT (SELECT count(*) FROM big_orders WHERE status = 'delivered') = 16800, '16 800 delivered';
    RAISE EXCEPTION 'undo' USING ERRCODE = 'P0001';
  EXCEPTION WHEN raise_exception THEN NULL;
  END;
END $$;

-- §6: five designs for one query: rows examined, heap pages, index size (bounded, not exact bytes).
DO $$
DECLARE
  q constant text := $q$SELECT * FROM big_orders WHERE status = 'pending' AND order_date BETWEEN '2025-03-01' AND '2025-03-07'$q$;
  p jsonb; heap_pages int; sz_status bigint; sz_date bigint; sz_comp bigint;
BEGIN
  heap_pages := pg_relation_size('big_orders') / current_setting('block_size')::int;
  ASSERT heap_pages = 148, 'the table is 148 pages';
  ASSERT pg_temp.examined(q) = 20000 AND (pg_temp.plan_of(q) ->> 'Actual Rows')::int = 54, 'no index: 20 000 examined, 54 returned';
  BEGIN
    CREATE INDEX t6 ON big_orders (status);
    p := pg_temp.plan_of(q);
    ASSERT (p ->> 'Exact Heap Blocks')::int = 148 AND (p ->> 'Rows Removed by Filter')::int = 2746, '(status): 2800 examined';
    sz_status := pg_relation_size('t6');
    RAISE EXCEPTION 'undo' USING ERRCODE = 'P0001';
  EXCEPTION WHEN raise_exception THEN NULL;
  END;
  BEGIN
    CREATE INDEX t7 ON big_orders (order_date);
    p := pg_temp.plan_of(q);
    ASSERT (p ->> 'Exact Heap Blocks')::int = 57 AND (p ->> 'Rows Removed by Filter')::int = 331, '(order_date): 385 examined';
    sz_date := pg_relation_size('t7');
    RAISE EXCEPTION 'undo' USING ERRCODE = 'P0001';
  EXCEPTION WHEN raise_exception THEN NULL;
  END;
  BEGIN
    CREATE INDEX t8 ON big_orders (status, order_date);
    p := pg_temp.plan_of(q);
    ASSERT (p ->> 'Exact Heap Blocks')::int = 54 AND coalesce((p ->> 'Rows Removed by Filter')::int, 0) = 0, 'composite: 54 examined';
    sz_comp := pg_relation_size('t8');
    ASSERT sz_comp > sz_status AND sz_comp > sz_date, 'the composite index is the largest single index';
    ASSERT sz_comp < pg_relation_size('big_orders') / 4, 'but small next to the table';
    RAISE EXCEPTION 'undo' USING ERRCODE = 'P0001';
  EXCEPTION WHEN raise_exception THEN NULL;
  END;
  BEGIN
    CREATE INDEX t9 ON big_orders (order_date);
    CREATE INDEX t10 ON big_orders (status);
    p := pg_temp.plan_of(q);
    ASSERT p -> 'Plans' -> 0 ->> 'Node Type' = 'BitmapAnd', 'two single indexes combine with BitmapAnd';
    ASSERT (p ->> 'Exact Heap Blocks')::int = 54, 'and visit 54 pages';
    RAISE EXCEPTION 'undo' USING ERRCODE = 'P0001';
  EXCEPTION WHEN raise_exception THEN NULL;
  END;
END $$;

-- §7: a materialized view is stale until refreshed; a plain query is always current.
DO $$
BEGIN
  CREATE MATERIALIZED VIEW revenue_by_status AS
    SELECT o.status, count(DISTINCT o.order_id) AS orders, sum(i.quantity * i.unit_price) AS revenue
    FROM orders o JOIN order_items i USING (order_id) GROUP BY o.status;
  INSERT INTO orders VALUES (12, 2, NULL, '2025-03-13', 'pending');
  INSERT INTO order_items VALUES (12, 1, 6, 2, 29.90);
  ASSERT (SELECT orders FROM revenue_by_status WHERE status = 'pending') = 3 AND (SELECT revenue FROM revenue_by_status WHERE status = 'pending') = 1269.00, 'stored result is stale';
  ASSERT (SELECT count(DISTINCT o.order_id) FROM orders o WHERE status = 'pending') = 4, 'the live data has moved on';
  REFRESH MATERIALIZED VIEW revenue_by_status;
  ASSERT (SELECT orders FROM revenue_by_status WHERE status = 'pending') = 4 AND (SELECT revenue FROM revenue_by_status WHERE status = 'pending') = 1328.80, 'refreshed';
END $$;

-- §5 (cast): a cast on the indexed column hides the index; the bare comparison uses it.
DO $$
BEGIN
  BEGIN
    CREATE INDEX t11 ON big_orders (customer_id);
    ASSERT pg_temp.node('SELECT * FROM big_orders WHERE customer_id::text = ''42''') = 'Seq Scan', 'cast hides the index';
    ASSERT pg_temp.node('SELECT * FROM big_orders WHERE customer_id = 42') = 'Bitmap Heap Scan', 'bare comparison uses it';
    RAISE EXCEPTION 'undo' USING ERRCODE = 'P0001';
  EXCEPTION WHEN raise_exception THEN NULL;
  END;
END $$;

-- §7 (read cost): reading a materialized view is a scan of its 4 stored rows.
DO $$
DECLARE p jsonb;
BEGIN
  CREATE MATERIALIZED VIEW mv_probe AS SELECT status, count(*) AS orders FROM orders GROUP BY status;
  p := pg_temp.plan_of('SELECT * FROM mv_probe');
  ASSERT p ->> 'Node Type' = 'Seq Scan' AND (p ->> 'Actual Rows')::int = 4, 'a read scans 4 stored rows';
END $$;
