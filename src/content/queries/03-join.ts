import type { Section } from '../types'

export const join: Section = {
  id: 'join',
  title: 'JOIN: matching rows across tables',
  scene: 'join-match',
  slide: `## JOIN: matching rows across tables

A join combines rows from two tables by **matching on a key**.

### How the match works
- Line up \`customers.id\` with \`orders.customer_id\` — each order finds its customer
- **Ann** has two orders, **Bob** one, **Cat** none — so Cat has no match to make

### The join *type* decides what to keep
- **INNER** — only rows that matched (Cat drops out)
- **LEFT / RIGHT** — keep all of one side, matched or not (Cat stays, with \`NULL\`s)
- **FULL OUTER** — keep everything from both sides

### The other two
- **CROSS** — every row of A paired with every row of B (a Cartesian product)
- **SELF** — a table joined to itself (e.g. employee → their manager)

An **anti-join** — \`LEFT JOIN … WHERE key IS NULL\` — finds the rows with *no* match. Back to the pipeline: \`WHERE\`.`,
  narration:
    'A join is how you combine rows from two tables, and it all hinges on matching a key. Here we line up customers.id with orders.customer_id: order 101 and 102 both carry customer 1, so they match Ann; order 103 carries customer 2, so it matches Bob. Notice Cat — customer 3 — has no orders at all, so she has nothing to match. That single fact is what the different join types are really about, because they only disagree on what to do with rows that don\'t match. An inner join keeps only the rows that found a partner, so Ann and Bob\'s orders come through and Cat simply disappears. A left join keeps everything from the left table no matter what — so Cat stays, with nulls where an order would be — and a right join does the same for the right table. A full outer join keeps everything from both sides, matched or not. Those four cover almost everything you\'ll do. The last two are special-purpose: a cross join pairs every row of one table with every row of the other — a Cartesian product you usually create by accident — and a self join is a table joined to itself, which is how you\'d match each employee to their manager in the same employees table. So the mechanics are always the same — match on a key — and the join type just decides which unmatched rows survive. Now back to the pipeline, where the next stage filters those rows: WHERE.',
}
