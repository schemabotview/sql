import type { Scene } from '@graphlearning/flow'
import { grid, pair, pairSide } from '../pair'

// §7 cascades-triggers — a change can do more than the statement says. ON DELETE CASCADE: deleting customer 8
// removes that customer's two wishlist rows but not customer 7's. A row trigger on UPDATE OF price writes
// an audit row per changed row: the UPDATE of 2 products leaves 2 audit rows. "UPDATE OF price" fires
// whenever price is in the SET list, even if the value is unchanged: SET price = price adds 10 more (12), while
// a stock-only UPDATE of all 10 rows adds none (still 12). Verified in db/verify/ch08-modification.sql.
export const cascadesTriggers: Scene = {
  id: 'cascades-triggers',
  padding: 0.12,
  flow: 'LR',
  edges: [],
  nodes: [
    grid('left', 'Side effects the statement does not show', 1, [
      pair({
        id: 'cascade',
        title: 'ON DELETE CASCADE',
        file: 'cascade.sql',
        sql: [
          'CREATE TABLE wishlist (',
          '  customer_id integer NOT NULL',
          '    REFERENCES customers (customer_id)',
          '    ON DELETE CASCADE,',
          '  product_id integer NOT NULL',
          '    REFERENCES products (product_id),',
          '  PRIMARY KEY (customer_id, product_id));',
          'INSERT INTO wishlist VALUES (7, 1), (8, 1), (8, 2);',
          '',
          'DELETE FROM customers WHERE customer_id = 8;',
          'SELECT * FROM wishlist ORDER BY 1, 2;',
        ],
        outs: [{ label: 'customer 8’s two rows went with it', headers: ['customer_id', 'product_id'], values: [['7', '1']] }],
      }),
    ]),
    pairSide({
      id: 'trigger',
      title: 'a row trigger',
      file: 'trigger.sql',
      sql: [
        'CREATE TABLE price_audit (product_id integer,',
        '  old_price numeric(8, 2), new_price numeric(8, 2));',
        '',
        'CREATE FUNCTION log_price() RETURNS trigger',
        'LANGUAGE plpgsql AS $$',
        'BEGIN',
        '  INSERT INTO price_audit',
        '  VALUES (OLD.product_id, OLD.price, NEW.price);',
        '  RETURN NEW;',
        'END $$;',
        '',
        'CREATE TRIGGER products_price_audit',
        '  AFTER UPDATE OF price ON products',
        '  FOR EACH ROW EXECUTE FUNCTION log_price();',
        '',
        'UPDATE products',
        '  SET price = round(price * 1.10, 2)',
        'WHERE category_id = 5;',
        'SELECT * FROM price_audit ORDER BY product_id;',
        '',
        'UPDATE products SET price = price;',
        'SELECT count(*) AS audit_rows FROM price_audit;',
        '',
        'UPDATE products SET stock = stock + 1;',
        'SELECT count(*) AS audit_rows FROM price_audit;',
      ],
      outs: [
        { label: '2 products changed, 2 audit rows', headers: ['product_id', 'old_price', 'new_price'], values: [['8', '34.00', '37.40'], ['9', '52.00', '57.20']] },
        { label: 'price = price still fires: 2 + 10', headers: ['audit_rows'], values: [['12']], pattern: 'warn' },
        { label: 'stock only: no new rows', headers: ['audit_rows'], values: [['12']] },
      ],
    }),
  ],
}
