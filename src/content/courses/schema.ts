import type { Course } from 'flow-engine'

// Course 1 — "Modeling data" (the DESIGN slice of the SQL lifecycle). It opens on the
// `sql-landscape` master map (this file, §1 `the-shape`) to orient the whole concept, then
// switches to a spacious `schema-erd` scene to teach the relational model, keys, constraints,
// DDL, and views/indexes in depth. Solid-tour reveal: 1 beat = 1 section; the scene is
// solidified on entry and the camera + focus tell the story (lit band, dimmed rest).
//
// STATUS: complete — §1 overview (master map) → §2–7 the ERD deep-dive (relational model →
// table → keys → constraints → DDL → views/indexes) → §8 you-are-here bookend (back on the map).
export const schema: Course = {
  id: 'schema',
  title: 'Modeling data',
  sections: [
    {
      // ── §1 overview (SOLID TOUR): the whole SQL map, framed whole and drawn solid.
      //    `focus: []` → nothing dimmed, a full-brightness orientation. Solidifying every
      //    node auto-solidifies the edges (both endpoints revealed). This is the "shape of
      //    SQL" beat; §2 switches scenes to the ERD, so this scene never re-ghosts. ──
      id: 'the-shape',
      heading: 'The shape of SQL',
      scene: 'sql-landscape',
      focus: [],
      slide: {
        title: 'The shape of SQL',
        body: [
          'SQL is one language with **five sub-tongues**, spoken over a **catalog** of metadata and a **store** of data.',
          '',
          '### The five sub-languages',
          '- **DDL** — *define* structure · **DQL** — *query* it · **DML** — *change* data',
          '- **TCL** — wrap changes in *transactions* · **DCL** — *control* access',
          '',
          '### What they act on',
          '- **Catalog** — the metadata: databases → schemas → tables, constraints, views',
          '- **Storage** — the data itself: tablespaces, pages, rows, the write-ahead log',
          '',
          '### The rest of the map',
          '- **Query pipeline** — every `SELECT` runs in one fixed *logical order*',
          '- **Programmatic** — procedures, functions, triggers · **Set ops** — combine results',
          '',
          'This first course is the top-left corner — how you **design** a database and what the catalog records.',
        ].join('\n'),
      },
      beats: [
        {
          line: "Before we write a single query, here's the whole of SQL on one map. It looks like a lot, but it's really one language with five sub-tongues. You use DDL to define structure — creating and altering tables. You use DQL, the SELECT statement, to query data back out. You use DML — insert, update, delete — to change data. Those changes are wrapped in transactions, which is TCL: begin, commit, rollback. And you control who can do any of it with DCL: grant and revoke. All five act on two things underneath. The catalog is the metadata — the databases, schemas, tables, constraints, and views the database keeps about itself. And storage is the data itself, living in tablespaces, pages, and rows, with a write-ahead log for durability. Around the edges sit the machinery: the query pipeline, where every SELECT runs in one fixed logical order; the programmatic layer of stored procedures, functions, and triggers; and set operations that combine query results. We'll tour all of it across five courses — and this first one is the top-left corner: how you design a database, and what the catalog records when you do.",
          delta: [
            {
              kind: 'solidify',
              ids: [
                // DDL
                'ddl', 'ddl-create-table', 'ddl-alter-table', 'ddl-drop-table', 'ddl-truncate', 'ddl-create-index', 'ddl-create-view', 'ddl-rename',
                // Catalog
                'catalog', 'cat-database', 'cat-schema', 'cat-table', 'tbl-columns', 'tbl-indexes', 'tbl-constraints', 'con-pk', 'con-fk', 'con-notnull', 'con-unique', 'con-check', 'tbl-views',
                // Transactions
                'transactions', 'txn-begin', 'txn-writedml', 'dml-insert', 'dml-update', 'dml-delete', 'dml-merge', 'txn-commit', 'txn-rollback', 'txn-isolation', 'iso-ru', 'iso-rc', 'iso-rr', 'iso-ser',
                // DCL
                'dcl', 'dcl-grant', 'dcl-revoke', 'dcl-roles',
                // Storage
                'storage', 'st-tablespace', 'st-pages', 'st-rows', 'st-wal',
                // Programmatic
                'programmatic', 'prog-procs', 'prog-funcs', 'prog-triggers', 'prog-cursors',
                // Query pipeline
                'query-pipeline', 'qp-cte', 'qp-window', 'qp-from', 'qp-join', 'join-inner', 'join-left', 'join-right', 'join-full', 'join-cross', 'join-self', 'qp-where', 'qp-groupby', 'qp-having', 'qp-select', 'qp-distinct', 'qp-orderby', 'qp-limit',
                // Set operations
                'set-operations', 'set-union', 'set-unionall', 'set-intersect', 'set-except',
              ],
            },
          ],
        },
      ],
    },
    {
      // ── §2 the relational model (SOLID TOUR opener for `schema-erd`): the whole ERD drawn
      //    solid and framed whole (`focus: []` → nothing dimmed). Every later section rides this
      //    same scene, so nothing re-ghosts — each just lights its own band. ──
      id: 'relational-model',
      heading: 'The relational model',
      scene: 'schema-erd',
      focus: [],
      slide: {
        title: 'The relational model',
        body: [
          'A relational database stores everything as **tables** — and the power is in how they *relate*.',
          '',
          '### A table is a relation',
          '- **Rows** = records (one customer, one order) · **Columns** = attributes with a fixed **type**',
          '- Every row has the same shape; row order carries no meaning — a table is a *set* of rows',
          '',
          '### Tables relate by keys',
          '- One table points at another by storing its key — here **orders → customers**',
          '- That single idea — a value matching across tables — is what *relational* means',
          '',
          '### Why model first',
          '- Get the shape right and queries, integrity, and speed all follow',
          '- Get it wrong and every query spends its life fighting the schema',
          '',
          'So before any SQL, we design the tables and how they connect.',
        ].join('\n'),
      },
      beats: [
        {
          line: "The word relational is the key to all of this, and it's simpler than it sounds. A relational database keeps everything in tables. A table is just a grid: each row is one record — one customer, or one order — and each column is an attribute of that record, with a fixed data type. Every row in a table has the exact same shape, and the order of rows means nothing — mathematically, a table is a set of rows, which is why it's called a relation. Now here's the relational part. Tables don't sit alone; they point at each other. Our orders table points at customers by storing a customer's key inside each order. That one idea — a value in one table matching a value in another — is the whole game. It's how the database keeps a tangle of real-world facts consistent. And it's why we design first: get the shape of your tables and their connections right, and querying, integrity, and performance all fall into place; get it wrong, and every query you ever write will be fighting the schema. So before we touch SQL, we lay out the tables and how they link.",
          delta: [
            {
              kind: 'solidify',
              ids: [
                'erd-ddl', 'erd-create-table', 'erd-alter-table', 'erd-drop-table', 'erd-truncate', 'erd-rename', 'erd-create-index', 'erd-create-view',
                'customers', 'cust-id', 'cust-name', 'cust-email', 'cust-created',
                'orders', 'ord-id', 'ord-customer', 'ord-total', 'ord-status', 'ord-created',
                'constraints', 'cn-pk', 'cn-fk', 'cn-notnull', 'cn-unique', 'cn-check', 'cn-default',
                'view', 'index',
              ],
            },
          ],
        },
      ],
    },
    {
      // ── §3 anatomy of one table — focus defaults to the customers band → camera frames it,
      //    lights it, dims everything else (already solid from §2). ──
      id: 'the-table',
      heading: 'Anatomy of a table',
      scene: 'schema-erd',
      slide: {
        title: 'Anatomy of a table',
        body: [
          'Zoom into one table — `customers` — and meet its parts.',
          '',
          '### Columns & types',
          '- Each **column** has a **name** and a **data type** the database enforces',
          '- `id` bigint · `name` text · `email` text · `created_at` timestamptz',
          '',
          '### Rows',
          '- A **row** is one record — one customer — with a value for every column',
          '- The database **rejects** a row whose values don’t fit the column types',
          '',
          '### Types are a contract',
          '- The type decides what’s storable, how values compare, and how much space they take',
          '- Pick the **narrowest type that fits** — it guards the data and speeds up scans',
          '',
          'A lone table is useful — but the real power comes when tables connect.',
        ].join('\n'),
      },
      beats: [
        {
          line: "Let's zoom into a single table, customers, and take it apart. Reading across the top, a table is defined by its columns — and every column has two things: a name, and a data type. Here id is a bigint, name and email are text, and created_at is a timestamp with time zone. That type isn't decoration; it's a contract the database enforces. Reading down, each row is one record — one actual customer — carrying a value for every column. If you try to insert a row whose values don't match the declared types — a word where a number belongs — the database refuses it outright. That's the quiet power of types: they decide what can be stored, how two values compare to each other, and even how much space each value takes on disk. A good rule is to pick the narrowest type that comfortably fits your data — it both protects the data from bad values and makes scans faster, because there's less to read. A single well-defined table is already useful — but the real power of the relational model shows up the moment two tables connect.",
          delta: [{ kind: 'solidify', ids: ['customers', 'cust-id', 'cust-name', 'cust-email', 'cust-created'] }],
        },
      ],
    },
    {
      // ── §4 keys — light BOTH tables so the FK link (auto-solid since §2) reads as the focal
      //    relationship; the narration + drawn edge carry "keys". ──
      id: 'keys',
      heading: 'Keys: identity & relationships',
      scene: 'schema-erd',
      slide: {
        title: 'Keys: identity & relationships',
        body: [
          'Keys turn a pile of separate tables into one connected model.',
          '',
          '### Primary key — identity',
          '- **PRIMARY KEY** — the column(s) that uniquely identify each row (`customers.id`)',
          '- Unique **and** not null; it’s how every other table will refer to this row',
          '',
          '### Foreign key — the relationship',
          '- **FOREIGN KEY** — a column holding another table’s key (`orders.customer_id → customers.id`)',
          '- It states the rule *every order belongs to a real customer* — one customer, many orders',
          '',
          '### Referential integrity',
          '- The DB **refuses** an order whose `customer_id` matches no customer',
          '- Delete rules (`CASCADE` / `RESTRICT`) decide what happens to the children',
          '',
          'This one link — a value matching across tables — is the heart of *relational*.',
        ].join('\n'),
      },
      beats: [
        {
          line: "Keys are what turn a pile of separate tables into a single connected model, and there are two of them. The first is the primary key. It's the column — or set of columns — that uniquely identifies each row; for customers, that's id. A primary key is both unique and never null, because it's the handle every other table will grab onto to refer to this row. The second is the foreign key, and this is the actual relationship. Look at orders: it has a column called customer_id, and that column is a foreign key pointing at customers.id. That single declaration encodes a real business rule — every order must belong to a real customer — and because one customer can appear in many orders, it captures a one-to-many relationship. Best of all, the database enforces it for you: this is referential integrity. If you try to insert an order whose customer_id doesn't match any existing customer, it's rejected. And you decide what happens when a parent is deleted — cascade the delete down to its orders, or restrict it and refuse. That one link, a value in one table matching a key in another, is the very heart of what relational means.",
          delta: [
            {
              kind: 'solidify',
              ids: ['customers', 'cust-id', 'cust-name', 'cust-email', 'cust-created', 'orders', 'ord-id', 'ord-customer', 'ord-total', 'ord-status', 'ord-created'],
            },
          ],
        },
      ],
    },
    {
      // ── §5 constraints — focus the Constraints panel (its own band) so the camera frames the
      //    rules directly. ──
      id: 'constraints',
      heading: 'Constraints: rules the DB enforces',
      scene: 'schema-erd',
      slide: {
        title: 'Constraints: rules the DB enforces',
        body: [
          'Constraints are business rules you hand to the database to enforce for you — every time, forever.',
          '',
          '### The core rules',
          '- **NOT NULL** — the value is required · **UNIQUE** — no duplicates (e.g. `email`)',
          '- **CHECK** — a condition every row must satisfy (`total > 0`)',
          '- **DEFAULT** — a value filled in when you don’t supply one',
          '',
          '### Keys are constraints too',
          '- **PRIMARY KEY** = UNIQUE + NOT NULL · **FOREIGN KEY** = must match a parent row',
          '',
          '### Why push rules into the schema',
          '- Enforced once, centrally — every app and query gets the **same** guarantee',
          '- Bad data is rejected **at the door**, not discovered months later',
          '',
          'With the shape and the rules set, we can write the DDL that creates it all.',
        ].join('\n'),
      },
      beats: [
        {
          line: "Constraints are how you hand your business rules to the database and let it enforce them for you, on every single write, forever. The core ones are simple. NOT NULL means a column is required — you can't leave it blank. UNIQUE means no two rows can share that value; we put it on email so two customers can't register the same address. CHECK lets you write an actual condition every row must satisfy — like total must be greater than zero, so a negative order is impossible. And DEFAULT supplies a value automatically when you don't provide one, which is how created_at can fill itself in with the current time. Here's the nice part: the keys you just met are really constraints too. A primary key is just UNIQUE plus NOT NULL bundled together, and a foreign key is a constraint that says this value must match a real parent row. Why push all of this down into the schema instead of checking it in your application code? Because it's enforced once, in one place — so every application, every query, every developer gets exactly the same guarantee, and bad data is turned away at the door rather than discovered months later when a report breaks. With the shape of our data defined and the rules locked in, we're ready to write the DDL that actually creates it all.",
          delta: [{ kind: 'solidify', ids: ['constraints', 'cn-pk', 'cn-fk', 'cn-notnull', 'cn-unique', 'cn-check', 'cn-default'] }],
        },
      ],
    },
    {
      // ── §6 DDL — focus the DDL band: the verbs that write this schema into the catalog. ──
      id: 'ddl',
      heading: 'DDL: the verbs that build the schema',
      scene: 'schema-erd',
      slide: {
        title: 'DDL: build the schema',
        body: [
          'DDL is how you write this design into the database’s **catalog**.',
          '',
          '### Create & change structure',
          '- **CREATE TABLE** — define a table: its columns, types, and constraints',
          '- **ALTER TABLE** — add or drop a column / constraint as the model evolves',
          '- **DROP TABLE** — remove it entirely · **TRUNCATE** — empty it fast, keep the shell',
          '',
          '### Other objects',
          '- **CREATE INDEX** — add an access path · **CREATE VIEW** — save a query as an object',
          '- **RENAME** — rename a table or a column',
          '',
          '### DDL writes metadata',
          '- Each statement updates the **catalog** — the DB’s own record of its structure',
          '- In Postgres DDL is transactional — a failed migration **rolls back** cleanly',
          '',
          'Two of those objects — views and indexes — are worth a closer look.',
        ].join('\n'),
      },
      beats: [
        {
          line: "Now we write the design into the database, and the language for that is DDL — data definition language. The workhorse is CREATE TABLE: in one statement you name the table and list its columns, their types, and their constraints — everything we just designed. As the model evolves, ALTER TABLE lets you add or drop a column or a constraint without rebuilding from scratch. DROP TABLE removes a table entirely, structure and data together, while TRUNCATE is the one to reach for when you want to empty a table's rows fast but keep its shell and definition intact. Beyond tables, the same family builds the other objects: CREATE INDEX adds a fast access path, CREATE VIEW saves a query as a reusable object, and RENAME relabels a table or column. The thing to understand about every one of these is that DDL writes metadata — each statement updates the catalog, the database's own record of its structure. And in PostgreSQL, DDL is transactional, which is a real gift: you can wrap a whole migration in a transaction, and if any step fails, the entire thing rolls back cleanly, leaving your schema exactly as it was. Two of the objects we just created — views and indexes — are worth a closer look before we move on.",
          delta: [{ kind: 'solidify', ids: ['erd-ddl', 'erd-create-table', 'erd-alter-table', 'erd-drop-table', 'erd-truncate', 'erd-rename', 'erd-create-index', 'erd-create-view'] }],
        },
      ],
    },
    {
      // ── §7 views & indexes — focus the two derived catalog objects (their edges to the tables
      //    are already solid from §2). ──
      id: 'views-indexes',
      heading: 'Views & indexes',
      scene: 'schema-erd',
      slide: {
        title: 'Views & indexes',
        body: [
          'Views and indexes are **catalog objects derived from your tables**.',
          '',
          '### Views — a saved query',
          '- **CREATE VIEW** names a query so you can `SELECT` from it like a table',
          '- `active_customers` = customers with a recent order — complexity hidden, reused everywhere',
          '- A plain view stores **no data** — it re-runs its query each time (a *materialized* view caches results)',
          '',
          '### Indexes — an access path',
          '- **CREATE INDEX** builds a lookup structure (usually a **B-tree**) on a column',
          '- `idx_orders_customer_id` makes *“find this customer’s orders”* fast',
          '- The trade-off: faster reads, but slightly slower writes and more disk',
          '',
          'That’s the design toolkit — next we’ll query the data these tables hold.',
        ].join('\n'),
      },
      beats: [
        {
          line: "Two catalog objects deserve a closer look, because they're both derived from your tables rather than storing new facts of their own. First, views. A view is simply a saved query: you write a SELECT once, give it a name with CREATE VIEW, and from then on you can query that name as if it were a table. Our active_customers view might be defined as customers who've placed a recent order — so instead of rewriting that logic everywhere, everyone just selects from active_customers. A plain view stores no data at all; it re-runs its underlying query every time you read it, always giving fresh results. If that query is expensive and you'd rather cache the answer, a materialized view stores the computed rows and you refresh them on a schedule. Second, indexes. An index is an access path — a separate lookup structure, usually a B-tree, built on one or more columns. Our idx_orders_customer_id index makes the question find all orders for this customer fast, because the database can jump straight to the matching rows instead of scanning the whole table. Indexes aren't free, though: they speed up reads but slightly slow down writes, since every insert has to update the index too, and they take extra disk. That's the whole design toolkit — tables, types, keys, constraints, DDL, views, and indexes. Next, we'll start querying the data these tables hold.",
          delta: [{ kind: 'solidify', ids: ['view', 'index'] }],
        },
      ],
    },
    {
      // ── §8 you-are-here — RETURN to the master map (scene switch resets it, so re-solidify all
      //    72 nodes to redraw the full map) and focus the two bands this course filled in: DDL +
      //    Catalog light, the other six dim. A bookend to §1, handing off to Course 2. ──
      id: 'you-are-here',
      heading: 'You are here',
      scene: 'sql-landscape',
      focus: [
        'ddl', 'ddl-create-table', 'ddl-alter-table', 'ddl-drop-table', 'ddl-truncate', 'ddl-create-index', 'ddl-create-view', 'ddl-rename',
        'catalog', 'cat-database', 'cat-schema', 'cat-table', 'tbl-columns', 'tbl-indexes', 'tbl-constraints', 'con-pk', 'con-fk', 'con-notnull', 'con-unique', 'con-check', 'tbl-views',
      ],
      slide: {
        title: 'You are here',
        body: [
          'You’ve filled in the top-left corner of the map: **define + catalog**.',
          '',
          '### What you can now do',
          '- Model data as **tables** of typed **columns**, related by **keys**',
          '- Enforce rules with **constraints**, and build it all with **DDL**',
          '- Add **views** and **indexes** as catalog objects',
          '',
          '### The rest of the map',
          '- **Query pipeline** — read it all back *(next course)*',
          '- **Transactions · DCL** — change data safely, control who can',
          '- **Storage · Programmatic** — where it lives, and server-side logic',
          '',
          'With a schema in place, the next course reads it back — the `SELECT` pipeline.',
        ].join('\n'),
      },
      beats: [
        {
          line: "Let's step back to the map we started on. The top-left corner is now lit, because that's exactly what this course filled in: define and catalog. You can now model data the relational way — as tables of typed columns, related to each other by primary and foreign keys. You can hand your business rules to the database as constraints, and build the whole structure with DDL. And you can add the two derived objects, views and indexes, all of which live in the catalog. Everything else on the map is still dim, and that's the road ahead. Next, the query pipeline — how you read all of this back out with SELECT. After that, transactions and access control, for changing data safely and deciding who's allowed to. And finally storage and the programmatic layer — where your data physically lives, and the server-side logic that runs on it. But it all starts here: with a schema in place, the next course brings it to life by querying it.",
          delta: [
            {
              kind: 'solidify',
              ids: [
                'ddl', 'ddl-create-table', 'ddl-alter-table', 'ddl-drop-table', 'ddl-truncate', 'ddl-create-index', 'ddl-create-view', 'ddl-rename',
                'catalog', 'cat-database', 'cat-schema', 'cat-table', 'tbl-columns', 'tbl-indexes', 'tbl-constraints', 'con-pk', 'con-fk', 'con-notnull', 'con-unique', 'con-check', 'tbl-views',
                'transactions', 'txn-begin', 'txn-writedml', 'dml-insert', 'dml-update', 'dml-delete', 'dml-merge', 'txn-commit', 'txn-rollback', 'txn-isolation', 'iso-ru', 'iso-rc', 'iso-rr', 'iso-ser',
                'dcl', 'dcl-grant', 'dcl-revoke', 'dcl-roles',
                'storage', 'st-tablespace', 'st-pages', 'st-rows', 'st-wal',
                'programmatic', 'prog-procs', 'prog-funcs', 'prog-triggers', 'prog-cursors',
                'query-pipeline', 'qp-cte', 'qp-window', 'qp-from', 'qp-join', 'join-inner', 'join-left', 'join-right', 'join-full', 'join-cross', 'join-self', 'qp-where', 'qp-groupby', 'qp-having', 'qp-select', 'qp-distinct', 'qp-orderby', 'qp-limit',
                'set-operations', 'set-union', 'set-unionall', 'set-intersect', 'set-except',
              ],
            },
          ],
        },
      ],
    },
  ],
}
