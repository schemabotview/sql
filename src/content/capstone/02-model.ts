import type { Section } from '../types'

export const model: Section = {
  id: 'model',
  title: 'Model: design the schema',
  scene: 'cap-model',
  focus: 'step-model', // lights this step in the shared strip
  slide: `## Model: design the schema

Every project starts where Course 1 did: the tables. Two of them capture the whole shop.

### The tables
- **\`customers\`** — \`id\` primary key, \`name\` required, \`email\` unique, \`created_at\` defaulted
- **\`orders\`** — \`id\` primary key, a **foreign key** \`customer_id → customers(id)\`

### Constraints do the guarding
- \`CHECK (total >= 0)\` — no negative orders can ever exist
- \`UNIQUE\` on email stops two accounts sharing one address
- \`DEFAULT now()\` fills \`created_at\`; the FK guarantees every order has a real customer

### Why this first
- Get the shape and the rules right and everything downstream — queries, integrity, speed — follows
- Every later step in this project inherits these guarantees for free

The schema exists. Before we put data in, decide **who** is allowed to.`,
  narration:
    'Step one is the schema, exactly where the very first course began. Our shop needs just two tables to start. Customers, on the left, has an id as its primary key, a name that\'s required, and an email marked unique so no two customers can share one. Orders has its own id primary key, and crucially a foreign key — customer_id references customers id — which is the link that ties every order to a real customer. Look at the constraints doing their quiet work: the CHECK on total greater than or equal to zero means a negative order is simply impossible, the database will reject it; DEFAULT now fills in the created_at timestamp automatically; and that foreign key guarantees you can never insert an order for a customer who doesn\'t exist. This is the whole philosophy of course one in practice — we\'re pushing the business rules down into the schema so the database enforces them for us, on every write, forever. And we do it first because everything else in this project rests on it: get these tables and their rules right, and the queries, the integrity, and the performance all have solid ground to stand on. The schema now exists. But before we load a single row, there\'s a question course three taught us to ask: who is actually allowed to write to it?',
}
