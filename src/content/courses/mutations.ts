import type { Course } from 'flow-engine'

// Course 3 — "Changing data safely" (the WRITE slice of the SQL lifecycle). The spine is the
// `write-path` scene (DML verbs → the transaction → ACID → who-may-write / server-side logic);
// one stage detours to its own mechanism scene — `isolation` (concurrent transactions & the
// anomalies). Solid-tour reveal throughout: 1 beat = 1 section; the scene is solidified on entry
// and the camera + focus tell the story.
//
// STATUS: COMPLETE (10 sections). §1 write-safely · §2 insert · §3 update · §4 delete-merge ·
// §5 transactions · §6 acid · §7 isolation (`isolation` detour) · §8 dcl (re-entry) ·
// §9 programmatic · §10 you-are-here (returns to the master map). §8 is a scene re-entry
// (re-solidifies write-path after the detour); §10 mirrors schema §8 / queries §10's bookend.
export const mutations: Course = {
  id: 'mutations',
  title: 'Changing data safely',
  sections: [
    {
      // ── §1 THE BIG IDEA (SOLID TOUR opener): the whole write-path drawn solid, framed whole
      //    (`focus: []` → nothing dimmed). The headline is that every change rides inside a
      //    transaction; every later section rides this same scene, lighting one band. ──
      id: 'write-safely',
      heading: 'Every change rides a transaction',
      scene: 'write-path',
      focus: [],
      slide: {
        title: 'Changing data safely',
        body: [
          'Reading data is forgiving — a bad `SELECT` returns wrong rows. **Changing** data is not: a bad write can corrupt or lose it. So SQL wraps every change in safety machinery.',
          '',
          '### The write verbs — DML',
          '- `INSERT` adds rows · `UPDATE` modifies them · `DELETE` removes them',
          '- `MERGE` does all three conditionally in one statement (an *upsert*)',
          '',
          '### The transaction — the safety envelope',
          '- `BEGIN` … your writes … `COMMIT` makes them permanent, all at once',
          '- Anything goes wrong? `ROLLBACK` — as if none of it happened',
          '',
          '### The guarantees & the guards',
          '- **ACID** — atomic, consistent, isolated, durable: what a transaction promises',
          '- **DCL** decides *who* may write; **triggers & procedures** run logic *on* the write',
          '',
          'We’ll tour each band — starting with the verbs that actually change the data.',
        ].join('\n'),
      },
      beats: [
        {
          line: "So far we've only read data, and reading is forgiving — get a query wrong and you just get back the wrong rows; no harm done, try again. Changing data is a different world. A careless write can overwrite the right value with the wrong one, delete rows you meant to keep, or leave your data half-updated and inconsistent. That's why this whole course is about changing data safely, and why SQL wraps every change in layers of protection. Here's the map. At the top are the write verbs — the DML: INSERT adds new rows, UPDATE modifies existing ones, DELETE removes them, and MERGE does all three at once, conditionally, in what's often called an upsert. But you rarely run those verbs naked. You run them inside a transaction — the safety envelope in the second band. You say BEGIN, do your writes, and then COMMIT to make them all permanent together, in one atomic step; and if anything goes wrong along the way, you ROLLBACK, and it's as if none of it ever happened. What a transaction actually guarantees you is the third band: ACID — atomicity, consistency, isolation, and durability. And around all of it sits the last band: DCL, which controls who is even allowed to write, and the programmatic layer — triggers, procedures, and functions — which runs your own logic on the server when writes happen. That's the shape of changing data. Let's start at the top, with the verbs that do the actual changing.",
          delta: [
            {
              kind: 'solidify',
              ids: [
                'wp-dml', 'wp-insert', 'wp-update', 'wp-delete', 'wp-merge',
                'wp-txn', 'wp-begin', 'wp-work', 'wp-commit', 'wp-rollback', 'wp-savepoint',
                'wp-acid', 'wp-a', 'wp-c', 'wp-i', 'wp-d',
                'wp-control', 'wp-dcl', 'wp-grant', 'wp-revoke', 'wp-prog', 'wp-procs', 'wp-funcs', 'wp-triggers', 'wp-cursors',
              ],
            },
          ],
        },
      ],
    },
    {
      // ── §2 INSERT — first verb: add rows. Consecutive same-scene section (rides §1's solid
      //    scene); frame the DML band, light INSERT. ──
      id: 'insert',
      heading: 'INSERT: adding rows',
      scene: 'write-path',
      focus: ['wp-dml'],
      highlight: ['wp-insert'],
      slide: {
        title: 'INSERT — add rows',
        body: [
          'INSERT puts new rows into a table.',
          '',
          '### The basic forms',
          '- `INSERT INTO t (cols…) VALUES (…)` — one row, columns named explicitly',
          '- Stack several `VALUES (…), (…), (…)` to insert **many rows** in one statement',
          '- `INSERT INTO t (…) SELECT …` — insert the **result of a query** (copy / load data)',
          '',
          '### Handy extras (Postgres)',
          '- `RETURNING id` hands back generated values (like a new serial key) without a second query',
          '- `ON CONFLICT (col) DO UPDATE …` — *upsert*: insert, or update the row that clashed',
          '',
          '### Constraints still apply',
          '- A row that violates a **type**, `NOT NULL`, `UNIQUE`, or a **foreign key** is rejected',
          '',
          'Rows added — next, changing rows that already exist: `UPDATE`.',
        ].join('\n'),
      },
      beats: [
        {
          line: "The first and simplest change is adding data, and that's INSERT. In its basic form you write INSERT INTO, name the table and the columns you're filling, and then give the VALUES for those columns — one new row. It's good practice to always list the columns explicitly, so the statement keeps working even if someone later adds or reorders columns in the table. If you have many rows to add, you don't repeat the statement; you just stack multiple parenthesized value lists after VALUES, and they all go in together. And when the data you want to insert already lives somewhere — another table, a query — you can write INSERT INTO followed by a SELECT instead of VALUES, which is how you copy or load rows in bulk. Postgres adds two things worth knowing. RETURNING lets the insert hand you back values it generated, like a new auto-incrementing id, so you don't need a second query to find out what key the row got. And ON CONFLICT turns an insert into an upsert: if the new row collides with an existing one on a unique column, instead of failing you can tell it to update that existing row. Through all of this, every constraint we designed back in course one still stands guard — a row with the wrong type, a missing required value, a duplicate where uniqueness is required, or a foreign key pointing at nothing, is simply refused. So that's how rows get in. Next, how you change rows that are already there: UPDATE.",
          delta: [{ kind: 'solidify', ids: ['wp-insert'] }],
        },
      ],
    },
    {
      // ── §3 UPDATE — modify existing rows. Same scene; frame the DML band, light UPDATE. The
      //    headline safety point: no WHERE means EVERY row. ──
      id: 'update',
      heading: 'UPDATE: modifying rows',
      scene: 'write-path',
      focus: ['wp-dml'],
      highlight: ['wp-update'],
      slide: {
        title: 'UPDATE — modify rows',
        body: [
          'UPDATE changes values in rows that already exist.',
          '',
          '### The shape',
          '- `UPDATE t SET col = value, col2 = value2 WHERE …`',
          '- The `SET` clause lists what to change; the `WHERE` clause decides **which rows**',
          '',
          '### The one that bites everyone',
          '- **No `WHERE` updates *every* row.** Forget it and you overwrite the whole table',
          '- Always test the `WHERE` with a `SELECT` first — same predicate, no risk',
          '',
          '### Beyond the basics',
          '- `SET total = total * 1.1` — new value computed from the old',
          '- `UPDATE t SET … FROM other WHERE …` — pull values from a **joined** table (Postgres)',
          '',
          'Adding and changing covered — the last, most dangerous verb removes rows: `DELETE`.',
        ].join('\n'),
      },
      beats: [
        {
          line: "Once rows exist, UPDATE is how you change them. The shape is straightforward: UPDATE the table, SET one or more columns to new values, and add a WHERE clause to say which rows. The SET clause is the what, and the WHERE clause is the which — and that WHERE clause is the most important habit in all of data modification. Here's why: if you leave the WHERE off, UPDATE doesn't error and it doesn't do nothing — it applies your change to every single row in the table. Set a status without a WHERE and you've just marked the entire table with that status. This is the classic three-in-the-morning mistake, and the way you avoid it is a simple discipline: before you run an UPDATE, run a SELECT with the exact same WHERE clause and look at the rows it returns. If those are the rows you meant to change, swap SELECT for UPDATE and go. The values you set don't have to be constants — you can compute them from the existing data, like SET total equals total times one-point-one to raise every matching price by ten percent. And in Postgres you can even pull the new values from another table by adding a FROM clause, which is an update driven by a join. So we can add rows and change rows. That leaves the last verb, and the one to treat with the most respect, because it takes data away: DELETE.",
          delta: [{ kind: 'solidify', ids: ['wp-update'] }],
        },
      ],
    },
    {
      // ── §4 DELETE & MERGE — remove rows, and the conditional all-in-one write. Same scene;
      //    frame the DML band, light both DELETE and MERGE (the destructive + combined verbs). ──
      id: 'delete-merge',
      heading: 'DELETE & MERGE: removing and upserting',
      scene: 'write-path',
      focus: ['wp-dml'],
      highlight: ['wp-delete', 'wp-merge'],
      slide: {
        title: 'DELETE & MERGE',
        body: [
          'DELETE removes rows; MERGE combines all three verbs into one conditional statement.',
          '',
          '### DELETE — remove rows',
          '- `DELETE FROM t WHERE …` — the same `WHERE` rule: **no `WHERE` empties the table**',
          '- `TRUNCATE` empties a table *fast* — but it’s DDL: no per-row `WHERE`, and it resets it',
          '- Foreign keys guard deletes too — `ON DELETE CASCADE` / `RESTRICT` decides the children',
          '',
          '### MERGE — the conditional upsert',
          '- Match a source against a target, then act per row:',
          '- `WHEN MATCHED` → `UPDATE` (or `DELETE`) · `WHEN NOT MATCHED` → `INSERT`',
          '- One statement to sync a table to new data — insert the new, update the changed',
          '',
          'That’s all four verbs. But a single verb is rarely the whole story — they run inside a transaction.',
        ].join('\n'),
      },
      beats: [
        {
          line: "DELETE removes rows, and it carries the exact same warning as UPDATE, only sharper: DELETE FROM a table with a WHERE clause removes the matching rows, but a DELETE with no WHERE removes every row in the table. Same discipline applies — check it with a SELECT first. If what you actually want is to empty a table completely and quickly, there's a purpose-built tool: TRUNCATE. It wipes all rows far faster than DELETE because it doesn't process them one at a time, but it's a different kind of statement — it's DDL, it can't take a WHERE to remove just some rows, and it typically resets things like auto-increment counters. And remember foreign keys from course one: they guard deletion too, so deleting a customer who still has orders is either blocked or cascades down to those orders, depending on the ON DELETE rule you chose. Now MERGE, which is the power tool of the group. MERGE takes a source of incoming data and matches it against a target table, and then it acts row by row based on whether a match was found. WHEN MATCHED, it can UPDATE or even DELETE the existing row; WHEN NOT MATCHED, it INSERTs a new one. In a single statement it can insert the brand-new records, update the ones that changed, and leave the rest — exactly what you need to sync a table to a fresh batch of data. That completes all four write verbs. But you almost never run just one in isolation — real changes are groups of writes that must all succeed or all fail together, and that's the transaction.",
          delta: [{ kind: 'solidify', ids: ['wp-delete', 'wp-merge'] }],
        },
      ],
    },
    {
      // ── §5 TRANSACTIONS — the second band: the safety envelope. Same scene; frame the txn band,
      //    light the whole flow (BEGIN → work → COMMIT/ROLLBACK + SAVEPOINT). ──
      id: 'transactions',
      heading: 'Transactions: all-or-nothing',
      scene: 'write-path',
      focus: ['wp-txn'],
      highlight: ['wp-begin', 'wp-work', 'wp-commit', 'wp-rollback', 'wp-savepoint'],
      slide: {
        title: 'Transactions — one atomic unit',
        body: [
          'A transaction groups several writes so they **all succeed or all fail** — never half.',
          '',
          '### The lifecycle',
          '- `BEGIN` starts it → run your writes → `COMMIT` makes them **all** permanent at once',
          '- Something failed? `ROLLBACK` — the database is left exactly as before `BEGIN`',
          '',
          '### Why it matters — the transfer',
          '- Move $100: **debit** one account, **credit** another — two writes, one truth',
          '- A crash between them would lose money; a transaction makes both land or neither does',
          '',
          '### SAVEPOINT & autocommit',
          '- `SAVEPOINT` marks a spot to **partially** roll back to, without losing the whole txn',
          '- With no explicit `BEGIN`, each statement is its **own** auto-committed transaction',
          '',
          'A transaction *promises* four things. Those promises have a name: `ACID`.',
        ].join('\n'),
      },
      beats: [
        {
          line: "This is the heart of changing data safely: the transaction. A transaction groups a set of writes together and makes a promise about them — they all succeed, or they all fail, and you never get stuck halfway. The lifecycle is three words. BEGIN starts the transaction. Then you run your writes — one, or ten, however many belong together. Then COMMIT makes all of them permanent in a single instant. And if anything goes wrong before you commit, you ROLLBACK, and the database throws away every change since BEGIN, leaving things exactly as they were. The classic example is a bank transfer. Moving a hundred dollars is really two writes: subtract a hundred from one account, add a hundred to another. If the system crashed right between those two, the money would simply vanish — debited from one side, never credited to the other. Wrap both writes in a transaction and that's impossible: either both happen and the transfer completes, or neither does and nothing moved. Two refinements. A SAVEPOINT is a bookmark inside a transaction — you can roll back to it to undo just the recent part, without abandoning everything you've done since BEGIN. And when you don't write BEGIN at all, you're still in a transaction — the database wraps each individual statement in its own automatic one, called autocommit, which is why a single UPDATE is already all-or-nothing. Now, a transaction makes four specific promises, and together they have a famous name: ACID.",
          delta: [{ kind: 'solidify', ids: ['wp-begin', 'wp-work', 'wp-commit', 'wp-rollback', 'wp-savepoint'] }],
        },
      ],
    },
    {
      // ── §6 ACID — the third band: the four guarantees. Same scene; frame the ACID band, light
      //    all four. Isolation (the I) is the one that gets its own detour next (§7). ──
      id: 'acid',
      heading: 'ACID: the four guarantees',
      scene: 'write-path',
      focus: ['wp-acid'],
      highlight: ['wp-a', 'wp-c', 'wp-i', 'wp-d'],
      slide: {
        title: 'ACID — what a transaction guarantees',
        body: [
          'ACID names the four promises a transaction makes.',
          '',
          '### A · Atomicity',
          '- **All-or-nothing** — every write commits, or none does (the transfer)',
          '',
          '### C · Consistency',
          '- The transaction moves the DB from one **valid state to another** — constraints always hold',
          '',
          '### I · Isolation',
          '- Concurrent transactions don’t **step on each other** — each runs as if alone',
          '- *How much* they’re isolated is tunable — that’s the whole next section',
          '',
          '### D · Durability',
          '- Once **committed**, it survives a crash — the **write-ahead log** guarantees it',
          '',
          'Three of these are absolute. **Isolation** is a dial — let’s see what it’s protecting against.',
        ].join('\n'),
      },
      beats: [
        {
          line: "ACID is an acronym for the four guarantees a transaction gives you, and each letter is worth knowing by name. A is atomicity, which we just saw: all-or-nothing — the whole group of writes commits, or none of it does, like the transfer that can't lose money in the middle. C is consistency: a transaction always moves the database from one valid state to another, which means all the constraints you defined — the foreign keys, the checks, the unique rules — hold true before it starts and after it commits; it can never leave the data in a state that breaks the rules. I is isolation, and this is the subtle one: when many transactions run at the same time, isolation is the promise that they won't step on each other — each one behaves, as much as possible, as if it were the only transaction running. And crucially, isolation isn't a single fixed thing; it's a dial you can turn, trading strictness for speed. D is durability: once a transaction has committed, that data is safe even if the server loses power the very next second, because the database wrote the change to a durable write-ahead log before saying done. Three of these four — atomicity, consistency, durability — are absolutes you simply get. Isolation is the one you tune, and turning that dial too low exposes you to real, named problems. Let's look at exactly what isolation is protecting you from.",
          delta: [{ kind: 'solidify', ids: ['wp-a', 'wp-c', 'wp-i', 'wp-d'] }],
        },
      ],
    },
    {
      // ── §7 ISOLATION — a MECHANISM DETOUR to the `isolation` scene. The scene switch resets the
      //    reveal, so this section solidifies the whole isolation scene and frames it whole
      //    (`focus: []`). Answers §6's hook: what the Isolation dial trades off. ──
      id: 'isolation',
      heading: 'Isolation levels & the anomalies',
      scene: 'isolation',
      focus: [],
      slide: {
        title: 'Isolation & the anomalies',
        body: [
          'Anomalies only appear when transactions **overlap in time** — so we watch two of them run.',
          '',
          '### The interleave',
          '- **T1** reads `x`, gets `5` — then, before T1 finishes, **T2** writes `x = 8` and commits',
          '- T1 reads `x` again and now gets `8` — the same query, two different answers',
          '',
          '### The three read anomalies',
          '- **Dirty read** — you see another transaction’s *uncommitted* change (it may vanish)',
          '- **Non-repeatable read** — re-read one row, its value *changed* (the story above)',
          '- **Phantom read** — re-run a query, *new rows* have appeared',
          '',
          '### The four levels — the dial',
          '- `READ UNCOMMITTED` → `READ COMMITTED` (Postgres default) → `REPEATABLE READ` → `SERIALIZABLE`',
          '- Each step **forbids more anomalies** — but allows **less concurrency** (more waiting/aborts)',
          '',
          'Higher isn’t always better — you pick the weakest level that’s still correct. Back to who may write.',
        ].join('\n'),
      },
      beats: [
        {
          line: "Isolation is the one ACID guarantee you tune, so let's see exactly what you're tuning against — and the key insight is that these problems only exist when two transactions overlap in time. Watch the two here. Transaction one, T1, begins and reads x, getting the value five. But before T1 is done, transaction two, T2, slips in, writes x equals eight, and commits. Now T1 reads x a second time — and gets eight. The very same query inside the very same transaction returned two different answers. That's an anomaly, and it has a name: a non-repeatable read. There are three of these read anomalies, in increasing subtlety. A dirty read is the worst: you see another transaction's change before it has committed — and if that transaction rolls back, you acted on data that never really existed. A non-repeatable read is what we just watched: you re-read a single row and its value has changed underneath you. And a phantom read is about sets rather than single rows: you run a query, then run it again, and new rows have appeared that match — phantoms that weren't there the first time. To control these, SQL gives you four isolation levels, and they're a dial. READ UNCOMMITTED is the weakest and permits all three. READ COMMITTED, which is Postgres's default, stops dirty reads. REPEATABLE READ additionally stops non-repeatable reads. And SERIALIZABLE, the strongest, makes transactions behave as if they ran one at a time, eliminating all of them. Here's the trade-off, though: every step up the dial forbids more anomalies but allows less concurrency — more locking, more waiting, more transactions forced to abort and retry. So higher isn't automatically better; the skill is choosing the weakest level that's still correct for what you're doing. With safety understood, let's step back to the write-path — and to who is even allowed to write.",
          delta: [
            {
              kind: 'solidify',
              ids: [
                'iso-t1', 't1-begin', 't1-read1', 't1-read2', 't1-commit',
                'iso-t2', 't2-begin', 't2-write', 't2-commit',
                'iso-anom', 'iso-dirty', 'iso-nonrep', 'iso-phantom',
                'iso-levels', 'iso-ru', 'iso-rc', 'iso-rr', 'iso-ser',
              ],
            },
          ],
        },
      ],
    },
    {
      // ── §8 DCL — RE-ENTRY to the write-path scene (the isolation detour switched scenes, so the
      //    reveal reset). Re-solidify the WHOLE write-path, then frame the bottom band and light
      //    the DCL half (GRANT/REVOKE). ──
      id: 'dcl',
      heading: 'DCL: who may write',
      scene: 'write-path',
      // Re-entry: the delta re-solidifies the whole scene; frame the control band, light DCL.
      focus: ['wp-control'],
      highlight: ['wp-dcl', 'wp-grant', 'wp-revoke'],
      slide: {
        title: 'DCL — access control',
        body: [
          'Being *able* to write isn’t the same as being *allowed* to. **DCL** controls who may do what.',
          '',
          '### GRANT & REVOKE',
          '- `GRANT SELECT, INSERT ON orders TO clerk` — hand a role specific privileges',
          '- `REVOKE …` takes them back — privileges are per-object and per-operation',
          '',
          '### Roles, not people',
          '- Grant to a **role** (`clerk`, `analyst`), then add users to the role — manage access in one place',
          '- The table’s **owner** has full rights and decides what to hand out',
          '',
          '### Least privilege',
          '- Give each role the **minimum** it needs — a reporting login gets `SELECT`, never `DELETE`',
          '- The safest write is one an account was never allowed to make',
          '',
          'DCL guards writes from *outside*. The last piece runs logic from *inside* — programmatic SQL.',
        ].join('\n'),
      },
      beats: [
        {
          line: "There's a difference between being able to run a DELETE and being allowed to, and that difference is DCL — data control language, the layer that decides who may do what. It comes down to two verbs. GRANT hands a privilege to someone: GRANT SELECT and INSERT on the orders table to the clerk role, for instance, lets that role read and add orders but nothing more. REVOKE takes a privilege back. And notice the granularity — privileges are per object and per operation, so you can allow reads but not writes, or writes to one table but not another. The key practice is that you almost never grant privileges to individual people; you grant them to roles — clerk, analyst, admin — and then assign users to those roles. That way access lives in one place: change what a role can do, and everyone in it changes at once. Every table also has an owner, who holds full rights and decides what to hand out to others. Tying it all together is the principle of least privilege: give each role the minimum it needs to do its job and nothing more. A reporting dashboard's login should be able to SELECT and nothing else — then even a bug or a compromised password can't delete a single row. The safest write, after all, is the one an account was never permitted to make. DCL guards the data from the outside — controlling who gets in. The final piece of the map works from the inside: logic that lives in the database itself, the programmatic layer.",
          delta: [
            {
              kind: 'solidify',
              ids: [
                'wp-dml', 'wp-insert', 'wp-update', 'wp-delete', 'wp-merge',
                'wp-txn', 'wp-begin', 'wp-work', 'wp-commit', 'wp-rollback', 'wp-savepoint',
                'wp-acid', 'wp-a', 'wp-c', 'wp-i', 'wp-d',
                'wp-control', 'wp-dcl', 'wp-grant', 'wp-revoke', 'wp-prog', 'wp-procs', 'wp-funcs', 'wp-triggers', 'wp-cursors',
              ],
            },
          ],
        },
      ],
    },
    {
      // ── §9 PROGRAMMATIC — consecutive same-scene section. Frame the control band, light the
      //    programmatic half (procs / functions / triggers / cursors). ──
      id: 'programmatic',
      heading: 'Programmatic SQL: logic in the database',
      scene: 'write-path',
      focus: ['wp-control'],
      highlight: ['wp-prog', 'wp-procs', 'wp-funcs', 'wp-triggers', 'wp-cursors'],
      slide: {
        title: 'Programmatic SQL',
        body: [
          'SQL isn’t only single statements — you can store **logic** in the database and run it server-side.',
          '',
          '### Procedures & functions',
          '- A **function** takes inputs and **returns a value** — callable inside a query',
          '- A **procedure** performs actions (writes, `COMMIT`) and is run with `CALL` — no return',
          '- Written in a procedural dialect (Postgres: **PL/pgSQL**) — variables, `IF`, loops',
          '',
          '### Triggers — logic that fires on a write',
          '- Attach code to a table: run it **`BEFORE`/`AFTER` `INSERT`/`UPDATE`/`DELETE`**, automatically',
          '- The classic use: an **audit log** row on every change, or enforcing a complex rule',
          '',
          '### Cursors — row-by-row',
          '- Walk a result **one row at a time** when set-based SQL genuinely can’t express the job',
          '- A last resort — SQL is fastest when it works on **whole sets**',
          '',
          'That completes the write machinery. Let’s step back to the map and see the ground we’ve covered.',
        ].join('\n'),
      },
      beats: [
        {
          line: "The last part of the map is that SQL doesn't have to live in your application — you can store logic inside the database and run it right next to the data. It comes in a few forms. A function takes some inputs and returns a value, which means you can call it from inside a query, wherever an expression would go — a custom calculation you reuse everywhere. A procedure is different: it performs actions rather than returning a value — it can run writes, manage transactions, commit — and you invoke it with the CALL keyword. Both are written in a procedural dialect that adds real programming to SQL — in Postgres it's PL/pgSQL, with variables, IF statements, and loops. Then there are triggers, which are the most distinctive, because you don't call them at all — they fire automatically. You attach a trigger to a table and say when: before or after an INSERT, UPDATE, or DELETE. The moment a matching write happens, your code runs. The classic example is an audit log — every time a row changes, a trigger quietly writes a record of what changed, when, and by whom, without the application having to remember to. Triggers can also enforce complex rules that a simple CHECK constraint can't express. And finally, cursors, which let you walk through a result set one row at a time. This is the tool of last resort: SQL is at its best and fastest when it operates on whole sets at once, so you reach for a cursor only when a job genuinely can't be expressed that way. And that completes the machinery for changing data safely. Let's zoom back out to the map and see everything this course has covered.",
          delta: [{ kind: 'solidify', ids: ['wp-prog', 'wp-procs', 'wp-funcs', 'wp-triggers', 'wp-cursors'] }],
        },
      ],
    },
    {
      // ── §10 you-are-here — RETURN to the master map (scene switch resets it, so re-solidify all
      //    72 nodes to redraw the full map) and focus the three bands this course covered:
      //    Transactions (incl. DML + isolation levels), DCL, and Programmatic light; the rest dim.
      //    The bookend to Course 1 §8 (DDL+Catalog) and Course 2 §10 (pipeline+set-ops); hands off
      //    to Course 4 (engine) — only Storage is still dark. ──
      id: 'you-are-here',
      heading: 'You are here',
      scene: 'sql-landscape',
      focus: [
        'transactions', 'txn-begin', 'txn-writedml', 'dml-insert', 'dml-update', 'dml-delete', 'dml-merge', 'txn-commit', 'txn-rollback', 'txn-isolation', 'iso-ru', 'iso-rc', 'iso-rr', 'iso-ser',
        'dcl', 'dcl-grant', 'dcl-revoke', 'dcl-roles',
        'programmatic', 'prog-procs', 'prog-funcs', 'prog-triggers', 'prog-cursors',
      ],
      slide: {
        title: 'You are here',
        body: [
          'Back on the map: this course lit the **middle** — changing data, safely.',
          '',
          '### What you can now do',
          '- Change data with **`INSERT` / `UPDATE` / `DELETE` / `MERGE`** — minding the `WHERE`',
          '- Wrap changes in **transactions** (`BEGIN`…`COMMIT`/`ROLLBACK`) for **ACID** guarantees',
          '- Tune **isolation** against the anomalies · control access with **DCL** · run **server-side logic**',
          '',
          '### The map so far',
          '- **DDL · Catalog** — design *(Course 1)* · **Query pipeline · Set ops** — read *(Course 2)*',
          '- **Transactions · DCL · Programmatic** — change *(this course)*',
          '- Only one region is still dark: **Storage** — where the rows physically live',
          '',
          'You can design, read, and change a database. Next: **under the hood** — storage, indexes & the planner.',
        ].join('\n'),
      },
      beats: [
        {
          line: "Let's zoom back out to the whole map of SQL one more time. The middle is lit now — transactions, access control, and the programmatic layer — because that's the ground this course covered: changing data, safely. You can now make changes with the four write verbs — INSERT, UPDATE, DELETE, and MERGE — always mindful of the WHERE clause that decides which rows. You can wrap those changes in a transaction so they're atomic, consistent, isolated, and durable — all-or-nothing, with a clean rollback when something goes wrong. You understand the isolation dial and the anomalies it guards against, you can control who's even allowed to write using GRANT and REVOKE, and you can push logic into the database itself with functions, procedures, and triggers. Step back and look at how much of the map is now bright. Course one lit the design corner — DDL and the catalog. Course two lit the read path — the query pipeline and set operations. And this course lit the middle — transactions, DCL, and the programmatic layer. Three of SQL's five sub-languages, fully covered. Only one region of the map is still dark: storage — where your rows actually live on disk, how indexes make them fast to find, and how the query planner decides what to do. You can now design a database, read from it, and change it safely. The next course goes under the hood, into that last dark corner: the engine.",
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
