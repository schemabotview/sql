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
