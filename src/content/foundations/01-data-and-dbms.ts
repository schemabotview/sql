import type { Section } from '../types'

export const dataAndDbms: Section = {
  id: 'data-and-dbms',
  title: 'Data, databases, and the role of a DBMS',
  scene: 'dbms-vs-files',
  slide: `## Data, databases, and the DBMS

Three words people use as one — the difference decides how systems fail.

### Mental model
- **Data** — recorded facts: *Asha, Bengaluru*
- **Database** — data organised so it can be trusted: \`shop\`
- **DBMS** — software that stores, protects and answers questions: **PostgreSQL**

### Worked example: Asha moves
- Left: each application keeps its **own file** — 3 copies of Asha
- Billing is updated; the others still say Bengaluru — **two truths**
- Right: one **DBMS**, one copy, one update

### Misconception
- "A database is a spreadsheet with more rows" — a DBMS also **enforces rules** and **coordinates writers**

### Explanation summary
- Copies drift apart; one governed copy cannot`,
  narration:
    "Let's begin with three words that people use as if they meant one thing. Data is simply recorded facts: Asha, Bengaluru. A database is data that has been organised so that it can be found and trusted; the one we will use throughout this course is called shop. A database management system, a DBMS, is the software that stores that data, protects it, and answers questions about it. PostgreSQL is a DBMS. Now look at the board, and imagine Asha moves house. On the left, billing, shipping and reports each keep their own file, so there are three copies of Asha. Billing is updated, but the other two files still say Bengaluru. The business now has two truths, and nobody knows which one is right. On the right, the same three applications ask one DBMS. There is one copy, so there is one update, and every application sees it at once. The DBMS also enforces rules about what may be stored, controls who can see or change what, and lets many people work safely at the same time. A common misconception is that a database is just a spreadsheet with more rows. A spreadsheet stores values. A DBMS also enforces rules and coordinates writers. So the lesson is that copies drift apart, and a single governed copy cannot, and that SQL is the language we use to talk to the DBMS.",
}
