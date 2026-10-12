import type { Scene } from '@graphlearning/flow'
import { grid, pair, tag } from '../pair'

// §6 upsert-merge — insert-or-update. ON CONFLICT (email) DO UPDATE: Asha's email already exists, so her
// row (id 1) gets the new phone while the id in the VALUES list (1) is irrelevant; Ivan is new and
// becomes customer 10; the table ends with 10 customers. DO NOTHING skips the conflict (INSERT 0 0).
// MERGE (PostgreSQL 15+, verified on 16) matches an explicit join condition: product 1's price becomes
// 62.00 and a new product 11 is inserted (MERGE 2). Concurrency is stated, not run: ON CONFLICT is the
// atomic insert-or-update; MERGE can still hit a unique violation if another session inserts first.
export const upsertMerge: Scene = {
  id: 'upsert-merge',
  padding: 0.15,
  flow: 'TB',
  edges: [],
  nodes: [
    grid('cards', 'Insert or update, in one statement', 2, [
      pair({
        id: 'upsert',
        title: 'ON CONFLICT … DO UPDATE',
        file: 'upsert.sql',
        sql: [
          'INSERT INTO customers (customer_id, first_name,',
          '  last_name, email, phone, city, country,',
          '  signup_date) VALUES',
          "  (1, 'Asha', 'Rao', 'asha.rao@example.com',",
          "   '+91-98450-99999', 'Bengaluru', 'India',",
          "   '2025-05-01'),",
          "  (10, 'Ivan', 'Novak', 'ivan.novak@example.com',",
          "   NULL, 'Prague', 'Czechia', '2025-05-01')",
          'ON CONFLICT (email)',
          '  DO UPDATE SET phone = EXCLUDED.phone',
          'RETURNING customer_id, email, phone;',
        ],
        outs: [{ label: 'one updated (id 1), one inserted (id 10)', headers: ['customer_id', 'email', 'phone'], values: [['1', 'asha.rao@example.com', '+91-98450-99999'], ['10', 'ivan.novak@example.com', 'NULL']] }, tag('two rows', 'INSERT 0 2')],
      }),
      pair({
        id: 'nothing',
        title: 'DO NOTHING: skip the conflict',
        file: 'upsert-nothing.sql',
        sql: ['INSERT INTO customers (customer_id,', '  first_name, last_name, email,', '  city, country, signup_date)', "VALUES (11, 'Asha', 'Rao',", "  'asha.rao@example.com',", "  'Bengaluru', 'India', '2025-05-01')", 'ON CONFLICT (email) DO NOTHING;'],
        outs: [tag('nothing inserted, no error', 'INSERT 0 0')],
      }),
      pair({
        id: 'merge',
        title: 'MERGE (PostgreSQL 15+)',
        file: 'merge.sql',
        sql: [
          'MERGE INTO products p',
          'USING (VALUES (1, 62.00), (11, 25.00))',
          '  AS s(product_id, price)',
          '  ON p.product_id = s.product_id',
          'WHEN MATCHED THEN',
          '  UPDATE SET price = s.price',
          'WHEN NOT MATCHED THEN',
          '  INSERT (product_id, name, category_id, price)',
          "  VALUES (s.product_id, 'Staged item', 4, s.price);",
          '',
          'SELECT product_id, name, price FROM products',
          'WHERE product_id IN (1, 11) ORDER BY 1;',
        ],
        outs: [tag('one updated, one inserted', 'MERGE 2'), { label: 'after the merge', headers: ['product_id', 'name', 'price'], values: [['1', 'Wireless Earbuds', '62.00'], ['11', 'Staged item', '25.00']] }],
      }),
      {
        id: 'compare',
        kind: 'table',
        label: 'upsert versus MERGE',
        pattern: 'service',
        headers: ['', 'ON CONFLICT', 'MERGE'],
        values: [['match is', 'a unique key', 'any join condition'], ['actions', 'update or skip', 'update, insert, delete'], ['concurrent inserts', 'atomic', 'may raise a unique error'], ['portability', 'PostgreSQL', 'SQL standard (15+)']],
      },
    ]),
  ],
}
