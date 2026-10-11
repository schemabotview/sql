# SQL — GraphL concept app

A theory-focused SQL course, from relational foundations to access control, authored from
[`SQL-COURSE-PLAN.md`](./SQL-COURSE-PLAN.md): **10 chapters, 79 sections**, PostgreSQL as the
reference engine, one online shop as the recurring example.

Each **section** is one scene (a diagram or an annotated SQL code card), one slide and one narration.
The course explains and traces; it does not assign work or measure learners. Every result and error
shown is produced by a real PostgreSQL server (see `check:sql`), and the app is held to the plan by
`check-plan`, which also reports how many of the 79 sections are authored.

```
npm install
npm run dev          # the app on :5173
npm run check        # layout budgets + conformance to SQL-COURSE-PLAN.md
npm run check:sql    # rebuild the shop database and run every SQL snippet on a real server
npm run db:reset     # rebuild the `shop` schema in the PostgreSQL named by the PG* variables
npm run shot -- out  # render every route at 1920×1080 and report density / clipping
npm run build
```

Conventions, authoring rules and the density targets are in [`CLAUDE.md`](./CLAUDE.md).
