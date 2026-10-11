-- Chapter 4 claims that a displayed snippet cannot show.

-- §1: the grain of a result — 11 orders but 4 kinds of status; 9 customers but 8 cities.
DO $$
BEGIN
  ASSERT (SELECT count(status) FROM orders) = 11, 'one row per order: 11';
  ASSERT (SELECT count(DISTINCT status) FROM orders) = 4, 'four kinds of status';
  ASSERT (SELECT count(*) FROM customers) = 9, 'nine customers';
  ASSERT (SELECT count(DISTINCT city) FROM customers) = 8, 'eight cities: Lyon twice';
END $$;

-- §8: ascending order puts NULLs last by default in PostgreSQL, and NULLS FIRST flips it.
DO $$
BEGIN
  ASSERT (SELECT employee_id FROM orders ORDER BY employee_id, order_id DESC OFFSET 10) IS NULL
     AND (SELECT count(*) FROM orders WHERE employee_id IS NULL) = 6, 'NULLs sort last ascending';
  ASSERT (SELECT array_agg(order_id) FROM (SELECT order_id FROM orders ORDER BY employee_id NULLS FIRST, order_id LIMIT 4) t) = ARRAY[2, 4, 6, 8], 'NULLS FIRST';
END $$;

-- §10: "9 customers" is right as a row count and wrong as a count of people (customers 3 and 9).
DO $$
BEGIN
  ASSERT (SELECT count(DISTINCT (first_name, last_name)) FROM customers) = 8, 'eight people';
END $$;
