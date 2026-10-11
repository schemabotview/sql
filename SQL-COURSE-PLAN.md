# SQL — From Foundations to Advanced Reasoning

## Audience and prerequisites

For beginners with basic computer literacy; no prior SQL, programming, or database experience is required. This is a theory-focused course with annotated SQL, result tables, worked examples, and failure walkthroughs. A database installation, submitted exercises, assessments, and learner monitoring are not required.

Scope: relational foundations, schema design, data loading, query semantics and analysis, performance reasoning, modifications, transactions, and access control. PostgreSQL 18 is the reference dialect for concrete explanations; implementation-specific behaviour is labelled rather than presented as universal SQL.

Target: explain relational designs, interpret SQL and its results, analyse common errors, and justify query, transaction, and access-control decisions. The course supports advanced understanding; it does not certify implementation competence or production expertise.

Structure: **10 chapters**, with section counts of **6, 9, 5, 10, 10, 10, 7, 8, 8, and 6**. Counts follow conceptual scope, not a quota; sections need not have equal teaching duration.

## Learning spine

Understand relational data → define structures → populate them → retrieve and summarise → combine and reuse queries → analyse → explain performance → reason about modifications → understand concurrent changes → control access and integrate.

The spine follows a database's lifecycle. A lecturer develops one online shop with customers, products, orders, and order items. Each chapter explains the next decision using the schema and data already introduced; contrasting cases reveal where an apparently sensible approach fails.

Teaching method: objective → mental model → annotated worked example → misconception or failure contrast → reasoning summary → bridge. Use small input/output tables before complex queries, explain technical terms before relying on them, and revisit concepts at greater depth. Transaction safeguards accompany modification examples before the deeper concurrency chapter. Examples illustrate application; no learner submission or performance measurement is required.

## Chapter 1 — Database and SQL Foundations

Objective: Explain relational data and the basic form and context of SQL statements.

1. Data, databases, and the role of a DBMS
2. Tables, rows, columns, schemas, and relationships
3. Keys and relational integrity
4. Data types, missing information, and NULL
5. SQL statement structure: identifiers, literals, comments, and statement families
6. Client/server interaction, dialects, and an annotated shop-database tour

Outcome: Explain tables, keys, NULL, basic statement syntax, and the distinction between a database server, a client, and SQL dialects.

Bridge: We can describe relational data; next we translate business requirements into structures and enforceable rules.

## Chapter 2 — Designing and Defining Database Structures

Objective: Explain how business rules become relational structures and enforceable constraints.

1. Translate business requirements into entities and relationships
2. Normalisation, dependencies, and update anomalies
3. Organise databases and schemas
4. Table definitions, type choices, precision, defaults, and generated values
5. Define primary, unique, and composite keys
6. Enforce relationships and rules with constraints
7. Read schema metadata: information_schema and database-specific catalogues
8. Evolve structures with ALTER TABLE
9. Remove structures and data: DROP and TRUNCATE

Outcome: Interpret the shop schema, explain dependencies and normalisation choices, and predict whether example records satisfy its constraints.

Bridge: The schema expresses the business rules but has no useful records; next we populate and validate it.

## Chapter 3 — Populating and Validating Data

Objective: Trace how records enter a database and why some loads produce incorrect or rejected data.

1. Insert individual and multiple rows
2. Use defaults, generated identifiers, and optional values
3. Understand constraint failures and load related tables in dependency order
4. Import external data and validate the load
5. Worked case: explain loading and reconciliation of the shop dataset

Outcome: Trace insertion and loading examples, explain rejected rows, and compare source records with the illustrated loaded dataset.

Bridge: The database contains validated records; next we turn those records into answers to business questions.

## Chapter 4 — Retrieving and Summarising Data

Objective: Explain single-table query results through expressions, NULL semantics, filtering, and grouping.

1. SELECT, aliases, DISTINCT, and result grain
2. WHERE, comparisons, and logical operators
3. IN, BETWEEN, and LIKE
4. NULL predicates and three-valued logic
5. Arithmetic expressions and type conversions
6. String, numeric, and date/time functions
7. Conditional expressions with CASE
8. Deterministic ordering, limiting, and pagination concepts
9. Aggregate functions, GROUP BY, and HAVING
10. Logical query-processing order versus physical execution; incorrect-summary walkthrough

Outcome: Interpret query outputs and explain mistakes involving duplicate rows, NULL, type conversion, ordering, or aggregation.

Bridge: Single-table reports reveal only part of the business story; next we connect related records and query results.

## Chapter 5 — Combining Tables and Queries

Objective: Reason about combined result sets and reusable query interfaces.

1. Join relationships, cardinality, and result grain
2. Inner joins
3. Outer joins and predicate placement
4. Self-joins and cross joins
5. Multi-table joins and duplicate amplification
6. Scalar and table subqueries
7. Correlated subqueries
8. EXISTS, NOT EXISTS, and NULL pitfalls
9. UNION, INTERSECT, and EXCEPT: duplicate handling and ALL variants where supported
10. Views as reusable query interfaces: definition, abstraction, and updateability limits

Outcome: Predict join and subquery outputs, explain cardinality errors and duplicate semantics, and compare a view with its underlying query.

Bridge: We can connect the necessary evidence; next we express sequences, comparisons, and multi-step analytical questions.

## Chapter 6 — Advanced Analytical Queries

Objective: Explain multi-step analyses, recursive relationships, window calculations, and advanced summaries.

1. Structure multi-step queries with CTEs
2. Recursive CTEs: hierarchy traversal, termination, and cycles
3. Understand window partitions and ordering
4. Understand window frames
5. Ranking, top-N, and deduplication
6. Running totals and moving averages
7. Period comparisons with LAG and LEAD
8. Gaps, islands, and sequences
9. Advanced summaries with GROUPING SETS, ROLLUP, and CUBE
10. Cohort analysis: define populations, time periods, and metrics

Outcome: Explain how query stages, recursion, grouping sets, and window definitions determine analytical results and their limitations.

Bridge: The analysis produces the right answer; next we investigate the work required to produce it and improve performance with evidence.

## Chapter 7 — Query Performance and Indexing

Objective: Interpret query-cost evidence and explain the trade-offs behind performance decisions.

1. Establish correctness, representative workloads, and a baseline
2. Read execution plans: scans, joins, sorts, and aggregates; EXPLAIN versus executing EXPLAIN ANALYZE
3. Understand estimated versus actual cardinality and statistics
4. Design single-column and composite indexes
5. Recognise index-friendly predicates and unnecessary work
6. Compare alternatives using annotated measurements and read/write trade-offs
7. Materialized views: stored results, refresh, and freshness/performance trade-offs

Outcome: Interpret an annotated plan and before/after measurements, explain plausible bottlenecks, and compare indexing or stored-summary trade-offs.

Bridge: We can retrieve and analyse data efficiently; next we use those findings to correct and synchronise stored records.

## Chapter 8 — Modifying and Synchronising Data

Objective: Reason about targeted changes, synchronisation, and their side effects.

1. Affected-row reasoning, validation, and an annotated rollback walkthrough
2. Update records safely
3. Delete records safely
4. Insert query results with INSERT … SELECT
5. Modify data using joins, subqueries, and CTEs
6. Upserts versus MERGE: matching, conflicts, and concurrency assumptions
7. Understand cascades, triggers, and bulk-change side effects
8. Worked case: explain cleaning and synchronisation decisions

Outcome: Predict before/after records, explain rollback and synchronisation cases, and distinguish upsert, MERGE, cascades, and trigger side effects.

Bridge: A change can be correct in isolation yet fail as part of a larger operation or race another user; next we study transaction boundaries and concurrency.

## Chapter 9 — Transactions and Concurrency

Objective: Explain how transaction boundaries and concurrency controls protect business invariants.

1. Business invariants, transaction boundaries, and ACID
2. BEGIN, COMMIT, ROLLBACK, and savepoints
3. Concurrency anomalies explained through two-session timelines
4. Isolation guarantees: SQL concepts and PostgreSQL-specific behaviour
5. Understand locking and blocking
6. Understand MVCC and visibility
7. Diagnose deadlocks and design retries
8. Worked timelines: concurrent purchases and inventory consistency

Outcome: Trace concurrent transaction timelines and justify a consistency requirement, an isolation choice, and the need for transaction retries under stated assumptions.

Bridge: Operations now have explicit consistency guarantees; next we control who may perform them and integrate the full lifecycle.

## Chapter 10 — Access Control and Integrated Reasoning

Objective: Explain access boundaries and connect the complete database lifecycle through a worked case.

1. Authentication, authorisation, ownership, users, and roles
2. Manage privileges with GRANT and REVOKE
3. Design role hierarchies and least privilege
4. Restrict data exposure with views and row-level policies
5. Parameterised query values, identifier boundaries, and appropriate application privileges
6. Integrated narrated case: explain the shop database from design to controlled access

Outcome: Interpret a permission matrix, explain query parameterisation boundaries, and justify design choices throughout the narrated shop case.

Bridge: Continue exploring unfamiliar queries, documented engine differences, and failure cases; practical competence requires separate implementation experience.

## Sources and scope

The outline draws on [PostgreSQL 18’s tutorial](https://www.postgresql.org/docs/18/tutorial.html) and [SQL-language guide](https://www.postgresql.org/docs/18/sql.html), with selected detailed sections covering expressions, queries, constraints, plans, isolation, and access control. These ground examples in one implementation; they do not establish universal behaviour across databases.

Publisher contents were compared for Alan Beaulieu’s [Learning SQL, third edition](https://www.oreilly.com/library/view/learning-sql-3rd/9781492057604/) (2020) and Bill Karwin’s [SQL Antipatterns, Volume 1](https://www.oreilly.com/library/view/sql-antipatterns-volume/9798888650011/) (2022). Full book text was not inspected. Detailed research evidence, coverage decisions, and review tracking belong in [README.md](../README.md).

The course prioritises widely applicable relational reasoning. Full API catalogues, JSON/array specialisations, spatial and full-text search, advanced physical partitioning, stored-procedure languages, replication, backup administration, and engine internals beyond query/concurrency reasoning are deferred to specialist courses. Normalisation remains introductory rather than a formal treatment of dependency theory.
