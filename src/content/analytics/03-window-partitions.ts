import type { Section } from '../types'

export const windowPartitions: Section = {
  id: 'window-partitions',
  title: 'Understand window partitions and ordering',
  scene: 'window-partitions',
  slide: `## Window partitions and ordering

A **window function** computes over related rows but **keeps every row**.

### Mental model
- \`OVER (PARTITION BY …)\`: the group each row belongs to
- \`ORDER BY\` inside \`OVER\`: the order within that group
- \`GROUP BY\` collapses; a window **annotates**

### Worked example
- Categories 2 and 3: **4** rows in
- Window: **4** rows out, each with its category average and rank
- \`GROUP BY\`: **2** rows out

### Misconception
- "A window function is another \`GROUP BY\`" — it **never removes rows**

### Explanation summary
- Use a window when each row needs a **group-level value beside it**`,
  narration:
    "Grouping collapses rows, but sometimes we want each row to stay and sit next to a group-level value. That is what a window function does. The over clause defines the window. Partition by decides which rows form a group, here the category. Order by inside over decides the order within the group, which matters for ranking and running calculations. The first card keeps all four products from categories two and three, and adds the category average and each product's rank by price inside its category. The second card computes the same average with group by, and four rows become two: the product detail is gone. The table names the parts of over, including the frame, which the next section explains. The misconception to avoid is treating a window function as another group by. It never removes rows. Reach for a window whenever each row needs a group value beside it, such as a share of the category or a position inside it.",
}
