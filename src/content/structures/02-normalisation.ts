import type { Section } from '../types'

export const normalisation: Section = {
  id: 'normalisation',
  title: 'Normalisation, dependencies, and update anomalies',
  scene: 'normalise-split',
  slide: `## Normalisation and update anomalies

Store each fact **once**, in the table about what **determines** it.

### Mental model
- A **dependency**: one column is fixed by another
- A city depends on the **customer**, not the order
- **1NF** one value per cell · **2NF** the *whole* key · **3NF** nothing but the key

### Worked example: Asha moves
- One of three rows updated → Bengaluru ×**2**, Mysuru ×**1**
- After the split, the city lives on **one** row
- Anomalies: **update**, **insert**, **delete**

### Misconception
- "More tables is always better" — normalise for **correctness**
- An introduction, not formal dependency theory`,
  narration:
    "Normalisation is the discipline of storing each fact once, in the table about whatever determines that fact. The key idea is a dependency: the value of one column is fixed by another. A customer's city depends on the customer, not on any particular order. The wide sheet at the top ignores that. It repeats Asha's name and city on every one of her orders. Now watch what happens when she moves. The card in the middle builds that sheet from the real orders and customers tables, updates only one of her three rows, and counts. Bengaluru appears on two rows, Mysuru on one. The database now holds two truths about one person, and nothing in it says which is right. That is an update anomaly. There are two more. An insert anomaly: you cannot record a customer who has not ordered yet, because there is no row to put them in. And a delete anomaly: removing a customer's last order could remove every trace of them. The cure is on the bottom. Split the sheet by who each fact is about. The city lives on one customer row, orders refer to the customer, and an update changes one place. The formal names are first normal form, one value per cell; second, depending on the whole key; and third, depending on the key and nothing but the key. A common misconception is that more tables is always better. Normalise for correctness, and relax it later only for a measured need. This is an introduction; formal dependency theory is out of scope.",
}
