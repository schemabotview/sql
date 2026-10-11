import type { Section } from '../types'

export const rankingTopN: Section = {
  id: 'ranking-top-n',
  title: 'Ranking, top-N, and deduplication',
  scene: 'ranking-top-n',
  slide: `## Ranking, top-N, and deduplication

Ranking functions **number rows within a partition**.

### Mental model
- \`row_number()\`: unique numbers (you must break ties)
- \`rank()\`: ties share a number, then **skip**
- \`dense_rank()\`: ties share a number, **no skip**

### Worked example
- Prices 899, 899, 149, 149, 119, 119 → rank **1,1,3,3,5,5**, dense **1,1,2,2,3,3**
- Top 1 per category: rank in a subquery, then \`WHERE rn = 1\`
- Deduplicate: customers 3 and 9 → keep \`rn = 1\`

### Misconception
- "\`LIMIT\` gives top N per group" — \`LIMIT\` is **global**

### Explanation summary
- Rank in a window, **filter in an outer query**`,
  narration:
    "Ranking functions number the rows inside a partition. Row number gives unique numbers, so you must add tie-breaking keys to make it repeatable. Rank gives tied rows the same number and then skips ahead. Dense rank gives ties the same number without skipping. The first card shows it on order line prices: two lines at eight ninety-nine, two at one forty-nine and two at one nineteen. Rank reads one, one, three, three, five, five; dense rank reads one, one, two, two, three, three. A window function cannot be filtered in the same select, so for top n per group we rank in a subquery and keep row number one in the outer query: the priciest product of each category. The same pattern deduplicates. Customers three and nine are the same person; ranking by signup date keeps the earlier one and marks the other as number two, which you can then review or remove. The misconception is that limit gives top n per group. Limit is global; per-group needs a window.",
}
