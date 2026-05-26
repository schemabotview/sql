# SQL Learning Content Repo

## Role
You are a SQL expert and content creator. This repo contains educational content covering SQL — the relational query language — targeting developers who want to build strong query-writing fundamentals, understand how the database engine executes their queries, and use SQL confidently in analytics, application, and data engineering work.

See `../CLAUDE.md` for shared notebook conventions, repo structure, audio generation, TTS guidelines, and content guidelines.

## Local Setup

```bash
pip install jupyter notebook ipython-sql duckdb duckdb-engine
```

Notebooks use **DuckDB** as the embedded query engine (zero-config, file-backed, ANSI-SQL compatible). Load the `sql` magic in the first code cell:

```python
%load_ext sql
%sql duckdb:///learn.db
```

After that, cells beginning with `%%sql` run queries directly and render results inline.

## Dialect Convention

- **Primary dialect: standard ANSI SQL** — write queries that work across PostgreSQL, DuckDB, SQLite, MySQL 8+, SQL Server, and Snowflake wherever possible.
- When a feature is dialect-specific (e.g., `LIMIT` vs `TOP`, `QUALIFY`, array/JSON syntax), call it out explicitly with a short note: *"PostgreSQL/DuckDB: `LIMIT 10`. SQL Server: `TOP 10`."*
- Use **uppercase keywords** (`SELECT`, `FROM`, `JOIN`, `GROUP BY`) and **lowercase identifiers** (`customer_id`, `orders`) — the conventional readable style.

## Content Guidelines

- Each notebook builds on prior ones — assume the reader has read 01..N-1.
- Every concept gets a **runnable query against a small in-notebook dataset**. Create the schema and seed rows inline using `CREATE TABLE` + `INSERT` so the notebook is self-contained.
- Show **query results inline** — `ipython-sql` renders the result table directly under the cell.
- Explain the **execution model** alongside syntax: which clause runs first (`FROM` → `WHERE` → `GROUP BY` → `HAVING` → `SELECT` → `ORDER BY` → `LIMIT`), why a `WHERE` filter on an aggregate fails, why `ORDER BY` can reference a `SELECT` alias but `WHERE` cannot.
- Use **real-world domain examples** (orders, customers, employees, events) rather than abstract `t1`/`col_a` placeholders.
- Include a **"common pitfalls"** section per notebook (NULL comparisons, implicit type coercion, accidental cross joins, etc.).

## TTS Guidelines

`.tts` files are read aloud by ChatterboxTTS (typically via Colab on a T4 GPU). They must be plain spoken prose — what a teacher would say at a whiteboard.

- **Plain prose only** — no markdown, no `#` headings, no bullets, no backticks, no asterisks. Write section titles as a plain sentence ending with a full stop (e.g. `Window functions.`).
- **No raw SQL or code blocks** — describe what a query computes, never paste it. A query like `SELECT name FROM customers WHERE customer_id = 1` becomes "look up the customer with id one and return their name". Method-style chains like `df.filter(...).select(...)` become "filter, then select."
- **Spell out symbols, keywords, and shorthand:**
  - Comparison operators: `=` → "equals", `<>` / `!=` → "not equals", `<` → "less than", `>=` → "greater or equal"
  - LIKE wildcards: `%` → "percent sign", `_` → "underscore"
  - Other operators: `||` (string concat) → "double pipe" or "concatenated with", `->` (Postgres JSON) → "json arrow", `->>` → "json arrow returning text", `*` (in `COUNT(*)`) → "star", `.` (in `c.name`) → "dot"
  - SQL acronyms: SQL → "sequel" (or "ess-cue-el"), ANSI → "ansi", CTE → "common table expression" (spell out on first use, then `c-t-e`), DDL → "data definition language", DML → "data manipulation language", ACID → "acid" (the word), MVCC → "multi-version concurrency control", PK → "primary key", FK → "foreign key", T-SQL → "t-sequel", PL/SQL → "p-l sequel"
  - General acronyms: JSON → "jay-son", I/O → "i-o", JVM → "java virtual machine", API → "ay-pee-eye", RAM → "ram", CPU → "see-pee-you"
  - Aggregate calls: `COUNT(*)` → "count star", `COUNT(DISTINCT x)` → "count distinct x", `SUM(amount)` → "sum of amount", `AVG(x)` → "average of x"
  - Function names: `ROW_NUMBER()` → "row number", `LAG` / `LEAD` → "lag" / "lead", `COALESCE` → "coalesce", `NULLIF` → "null if", `ROLLUP` / `CUBE` → "rollup" / "cube", `EXTRACT(YEAR FROM x)` → "extract year from x"
  - Predicates and null: `NULL` → "null", `IS NULL` → "is null", `NOT EXISTS` → "not exists", `NOT IN` → "not in", `IN` → "in"
  - Compound keywords: `GROUP BY` → "group by", `ORDER BY` → "order by", `LEFT JOIN` → "left join" (or "left outer join"), `UNION ALL` → "union all", `WITH RECURSIVE` → "with recursive", `ON CONFLICT` → "on conflict"
  - Complexity: O(1) → "constant time", O(n) → "linear time", O(n log n) → "n log n time"
  - Versions: `3.5.3` → "three point five point three", `MySQL 8+` → "MySQL eight and later"
  - Column names: snake_case unfolds to spaces — `customer_id` → "customer id", `order_date` → "order date", `manager_id` → "manager id", `event_time` → "event time"
  - Currency: `$29.99` → "twenty-nine ninety-nine" or "twenty-nine dollars and ninety-nine cents"
  - Dates: `DATE '2024-04-01'` → "April first, twenty twenty-four"
- **Natural spoken flow** — write as a teacher explains at a whiteboard. Use transitional phrases: "notice that", "the key insight here is", "to put it another way", "picture this".
- **Skip visual-only content** — never narrate ASCII diagrams, result tables, query output, or `EXPLAIN` plans. Describe what the listener should picture instead.
- **Pace with paragraph breaks** — each paragraph = one idea. A blank line between paragraphs gives the TTS engine a natural pause. Aim for 2–4 sentences per paragraph.
- **Filename convention** — `.tts` filename matches the notebook stem exactly: `01-sql-foundations.ipynb` → `tts/01-sql-foundations.tts` → `audio/01-sql-foundations.wav`.

## Topics Covered

| # | Topic | Notebook | Audio |
|---|---|---|---|
| 01 | SQL Foundations & the Relational Model | `01-sql-foundations.ipynb` | `01-sql-foundations.wav` |
| 02 | Querying with SELECT | `02-querying-with-select.ipynb` | `02-querying-with-select.wav` |
| 03 | Filtering, Sorting & Set Operations | `03-filtering-sorting-set-operations.ipynb` | `03-filtering-sorting-set-operations.wav` |
| 04 | Joins | `04-joins.ipynb` | `04-joins.wav` |
| 05 | Aggregation & Grouping | `05-aggregation-and-grouping.ipynb` | `05-aggregation-and-grouping.wav` |
| 06 | Subqueries & CTEs | `06-subqueries-and-ctes.ipynb` | `06-subqueries-and-ctes.wav` |
| 07 | Window Functions | `07-window-functions.ipynb` | `07-window-functions.wav` |
| 08 | DDL, DML, Transactions & Query Planning | `08-ddl-dml-transactions.ipynb` | `08-ddl-dml-transactions.wav` |
