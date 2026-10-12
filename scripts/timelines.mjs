// The chapter 9 timelines. Statements are exactly those the slides show; `expect` is what the slides
// say each step printed. Both sessions run with search_path = cc (copies of shop.products / orders /
// order_items plus cc.duty, see check-timelines.mjs). psql prints command tags (BEGIN, UPDATE 1, ...).
const P1 = 'SELECT price FROM products WHERE product_id = 1;'
export function defineScenarios(add) {
  // §3 non-repeatable read: READ COMMITTED (the default) takes a new snapshot per statement
  add('non-repeatable-read', {
    steps: [
      { who: 'A', sql: 'BEGIN;', expect: /BEGIN/ },
      { who: 'A', sql: P1, expect: /^59\.00$/ },
      { who: 'B', sql: 'UPDATE products SET price = 64.00 WHERE product_id = 1;', expect: /UPDATE 1/ },
      { who: 'A', sql: P1, expect: /^64\.00$/ },
      { who: 'A', sql: 'COMMIT;' },
    ],
  })
  // §3 lost update: read in the application, write an absolute value
  add('lost-update', {
    steps: [
      { who: 'A', sql: 'BEGIN;' },
      { who: 'A', sql: 'SELECT stock FROM products WHERE product_id = 1;', expect: /^120$/ },
      { who: 'B', sql: 'BEGIN;' },
      { who: 'B', sql: 'SELECT stock FROM products WHERE product_id = 1;', expect: /^120$/ },
      { who: 'A', sql: 'UPDATE products SET stock = 119 WHERE product_id = 1;', expect: /UPDATE 1/ },
      { who: 'A', sql: 'COMMIT;' },
      { who: 'B', sql: 'UPDATE products SET stock = 119 WHERE product_id = 1;', expect: /UPDATE 1/ },
      { who: 'B', sql: 'COMMIT;' },
      { who: 'A', sql: 'SELECT stock FROM products WHERE product_id = 1;', expect: /^119$/ },
    ],
  })
  // §3 the fix: let the database compute from the current value
  add('relative-update', {
    steps: [
      { who: 'A', sql: 'BEGIN;' },
      { who: 'A', sql: 'UPDATE products SET stock = stock - 1 WHERE product_id = 1;', expect: /UPDATE 1/ },
      { who: 'B', sql: 'BEGIN;' },
      { who: 'B', sql: 'UPDATE products SET stock = stock - 1 WHERE product_id = 1;', blocks: true, expect: /UPDATE 1/ },
      { who: 'A', sql: 'COMMIT;', release: true },
      { who: 'B', sql: 'COMMIT;' },
      { who: 'A', sql: 'SELECT stock FROM products WHERE product_id = 1;', expect: /^118$/ },
    ],
  })
  // §3/§4 write skew: REPEATABLE READ lets both pass the check
  const skew = (level, secondCommit) => ({
    steps: [
      { who: 'A', sql: `BEGIN ISOLATION LEVEL ${level};` },
      { who: 'B', sql: `BEGIN ISOLATION LEVEL ${level};` },
      { who: 'A', sql: 'SELECT count(*) FROM duty WHERE on_duty;', expect: /^2$/ },
      { who: 'B', sql: 'SELECT count(*) FROM duty WHERE on_duty;', expect: /^2$/ },
      { who: 'A', sql: 'UPDATE duty SET on_duty = false WHERE employee_id = 6;', expect: /UPDATE 1/ },
      { who: 'B', sql: 'UPDATE duty SET on_duty = false WHERE employee_id = 7;', expect: /UPDATE 1/ },
      { who: 'A', sql: 'COMMIT;', expect: /COMMIT/ },
      { who: 'B', sql: 'COMMIT;', expect: secondCommit },
      { who: 'A', sql: 'SELECT count(*) FROM duty WHERE on_duty;', expect: level === 'SERIALIZABLE' ? /^1$/ : /^0$/ },
    ],
  })
  add('write-skew-repeatable-read', skew('REPEATABLE READ', /COMMIT/))
  add('write-skew-serializable', skew('SERIALIZABLE', /ERROR:.*could not serialize access due to read\/write dependencies/))
  // §4 REPEATABLE READ: a stable snapshot, and a refusal to overwrite what it cannot see
  add('repeatable-read', {
    steps: [
      { who: 'A', sql: 'BEGIN ISOLATION LEVEL REPEATABLE READ;' },
      { who: 'A', sql: P1, expect: /^59\.00$/ },
      { who: 'A', sql: "SELECT count(*) FROM orders WHERE status = 'pending';", expect: /^3$/ },
      { who: 'B', sql: 'UPDATE products SET price = 64.00 WHERE product_id = 1;', expect: /UPDATE 1/ },
      { who: 'B', sql: "INSERT INTO orders VALUES (12, 2, NULL, '2025-03-13', 'pending');", expect: /INSERT 0 1/ },
      { who: 'A', sql: P1, expect: /^59\.00$/ },
      { who: 'A', sql: "SELECT count(*) FROM orders WHERE status = 'pending';", expect: /^3$/ },
      { who: 'A', sql: 'UPDATE products SET price = price * 1.1 WHERE product_id = 1;', expect: /ERROR:.*could not serialize access due to concurrent update/ },
      { who: 'A', sql: 'ROLLBACK;' },
      { who: 'A', sql: "SELECT count(*) FROM orders WHERE status = 'pending';", expect: /^4$/ },
    ],
  })
  // §5 blocking: writers wait for writers on the same row; readers and other rows are not blocked
  add('blocking', {
    sessions: ['A', 'B', 'C'],
    steps: [
      { who: 'A', sql: 'BEGIN;' },
      { who: 'A', sql: 'UPDATE products SET stock = stock - 1 WHERE product_id = 1;', expect: /UPDATE 1/ },
      { who: 'C', sql: 'SELECT stock FROM products WHERE product_id = 1;', expect: /^120$/ },
      { who: 'C', sql: 'UPDATE products SET stock = stock - 1 WHERE product_id = 2;', expect: /UPDATE 1/ },
      { who: 'C', sql: 'SELECT stock FROM products WHERE product_id = 1 FOR UPDATE NOWAIT;', expect: /ERROR:.*could not obtain lock on row/ },
      { who: 'B', sql: 'UPDATE products SET stock = stock - 1 WHERE product_id = 1;', blocks: true, expect: /UPDATE 1/ },
      { who: 'A', sql: 'COMMIT;', release: true },
      { who: 'C', sql: 'SELECT stock FROM products WHERE product_id = 1;', expect: /^118$/ },
    ],
  })
  // §6 visibility: three viewers of the same row while an updater has not yet committed / has committed
  add('visibility', {
    sessions: ['A', 'B', 'C'],
    steps: [
      { who: 'A', sql: 'BEGIN ISOLATION LEVEL REPEATABLE READ;' },
      { who: 'A', sql: P1, expect: /^59\.00$/ },
      { who: 'B', sql: 'BEGIN;' },
      { who: 'B', sql: 'UPDATE products SET price = 64.00 WHERE product_id = 1;', expect: /UPDATE 1/ },
      { who: 'B', sql: P1, expect: /^64\.00$/ },
      { who: 'C', sql: P1, expect: /^59\.00$/ },
      { who: 'B', sql: 'COMMIT;' },
      { who: 'C', sql: P1, expect: /^64\.00$/ },
      { who: 'A', sql: P1, expect: /^59\.00$/ },
      { who: 'A', sql: 'COMMIT;' },
      { who: 'A', sql: P1, expect: /^64\.00$/ },
    ],
  })
  // §7 deadlock: opposite lock order. A started waiting first, so its deadlock_timeout fires first and A
  // is the victim; B then gets the lock it asked for.
  add('deadlock', {
    steps: [
      { who: 'A', sql: 'BEGIN;' },
      { who: 'B', sql: 'BEGIN;' },
      { who: 'A', sql: 'UPDATE products SET stock = stock - 1 WHERE product_id = 1;', expect: /UPDATE 1/ },
      { who: 'B', sql: 'UPDATE products SET stock = stock - 1 WHERE product_id = 2;', expect: /UPDATE 1/ },
      { who: 'A', sql: 'UPDATE products SET stock = stock - 1 WHERE product_id = 2;', blocks: true, expect: /ERROR:.*deadlock detected/ },
      { who: 'B', sql: 'UPDATE products SET stock = stock - 1 WHERE product_id = 1;', release: true, expect: /UPDATE 1/ },
      { who: 'B', sql: 'COMMIT;', expect: /COMMIT/ },
      { who: 'A', sql: 'ROLLBACK;', expect: /ROLLBACK/ },
    ],
  })
  // §7 the fix: take locks in one agreed order
  add('lock-order', {
    steps: [
      { who: 'A', sql: 'BEGIN;' },
      { who: 'B', sql: 'BEGIN;' },
      { who: 'A', sql: 'UPDATE products SET stock = stock - 1 WHERE product_id = 1;', expect: /UPDATE 1/ },
      { who: 'B', sql: 'UPDATE products SET stock = stock - 1 WHERE product_id = 1;', blocks: true, expect: /UPDATE 1/ },
      { who: 'A', sql: 'UPDATE products SET stock = stock - 1 WHERE product_id = 2;', expect: /UPDATE 1/ },
      { who: 'A', sql: 'COMMIT;', release: true },
      { who: 'B', sql: 'UPDATE products SET stock = stock - 1 WHERE product_id = 2;', expect: /UPDATE 1/ },
      { who: 'B', sql: 'COMMIT;' },
    ],
  })
  // §8 the last laptop: a guarded update re-checks its WHERE after the blocker commits
  const lastLaptop = { extra: 'UPDATE cc.products SET stock = 1 WHERE product_id = 4;' }
  add('last-laptop-guarded', {
    ...lastLaptop,
    steps: [
      { who: 'A', sql: 'BEGIN;' },
      { who: 'B', sql: 'BEGIN;' },
      { who: 'A', sql: 'UPDATE products SET stock = stock - 1 WHERE product_id = 4 AND stock >= 1;', expect: /UPDATE 1/ },
      { who: 'B', sql: 'UPDATE products SET stock = stock - 1 WHERE product_id = 4 AND stock >= 1;', blocks: true, expect: /UPDATE 0/ },
      { who: 'A', sql: 'COMMIT;', release: true },
      { who: 'B', sql: 'COMMIT;' },
      { who: 'A', sql: 'SELECT stock FROM products WHERE product_id = 4;', expect: /^0$/ },
    ],
  })
  // §8 the unguarded version: read, decide in the application, write
  add('last-laptop-naive', {
    ...lastLaptop,
    steps: [
      { who: 'A', sql: 'BEGIN;' },
      { who: 'B', sql: 'BEGIN;' },
      { who: 'A', sql: 'SELECT stock FROM products WHERE product_id = 4;', expect: /^1$/ },
      { who: 'B', sql: 'SELECT stock FROM products WHERE product_id = 4;', expect: /^1$/ },
      { who: 'A', sql: 'UPDATE products SET stock = stock - 1 WHERE product_id = 4;', expect: /UPDATE 1/ },
      { who: 'B', sql: 'UPDATE products SET stock = stock - 1 WHERE product_id = 4;', blocks: true, expect: /ERROR:.*violates check constraint "products_stock_check"/ },
      { who: 'A', sql: 'COMMIT;', release: true },
      { who: 'B', sql: 'ROLLBACK;' },
    ],
  })
  // §2 an error aborts the whole transaction until ROLLBACK (single session, errors continue)
  add('aborted-transaction', {
    sessions: ['A'],
    steps: [
      { who: 'A', sql: 'BEGIN;' },
      { who: 'A', sql: "INSERT INTO orders VALUES (12, 2, NULL, '2025-03-13', 'pending');", expect: /INSERT 0 1/ },
      { who: 'A', sql: 'INSERT INTO order_items VALUES (12, 1, 9, 1, 52.00);', expect: /INSERT 0 1/ },
      { who: 'A', sql: 'UPDATE products SET stock = stock - 1 WHERE product_id = 9;', expect: /ERROR:.*violates check constraint "products_stock_check"/ },
      { who: 'A', sql: 'SELECT count(*) FROM orders;', expect: /ERROR:.*current transaction is aborted/ },
      { who: 'A', sql: 'ROLLBACK;', expect: /ROLLBACK/ },
      { who: 'A', sql: 'SELECT count(*) FROM orders WHERE order_id = 12;', expect: /^0$/ },
    ],
  })
}
