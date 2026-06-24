# lit 📚

A **Beli-style book rating app** — rank every book you read through fun
head-to-head matchups and discover what to read next, sliced by **genre** and
**age group**.

lit borrows Beli's signature experience and applies it to books:

- **Rank, don't just rate.** Instead of forcing a number, you pick a vibe
  (_I liked it · It was fine · Didn't like it_) and then make a few quick
  "Which did you prefer?" comparisons. ReadIt turns those into a precise
  **0–10 score** with traffic-light colors (green / amber / red).
- **Your Lists** — `Read`, `Want to Read`, and `Recs`, exactly like Beli's
  _Been / Want to Try / Recs_.
- **Genre + age-group filters** everywhere (Children, Middle Grade, Young
  Adult, Adult × Fantasy, Sci-Fi, Romance, …).
- **Leaderboard** — community top books you can slice by genre and age group.
- **Social feed** with a `Following / For You` toggle.
- **Profile** with reading stats and a taste breakdown by genre and age group.

## Run it

```bash
npm install
npm run dev      # http://localhost:5173
```

```bash
npm run build    # production build into dist/
npm run preview  # preview the production build
```

## How the scoring works

Books are bucketed into three sentiment **bands** (mirroring Beli):

| Sentiment      | Score band |
| -------------- | ---------- |
| I liked it!    | 6.8 – 10.0 |
| It was fine    | 3.4 – 6.7  |
| Didn't like it | 0.0 – 3.3  |

When you add a book, a binary search of head-to-head comparisons places it
exactly within its band, then every book's score is re-spread evenly across
the band so rankings always stay consistent.

## Tech

- **React 18 + Vite** — no backend required.
- State persists locally via `localStorage`, so your lists survive refreshes.
- Tap the ⚙ on your Profile to reset back to the demo data.

## Project structure

```
src/
  App.jsx              # shell + bottom tab nav + ranking modal wiring
  data/
    constants.js       # genres, age groups, sentiment bands, score colors
    seed.js            # demo catalogue, lists, and social feed
    store.js           # localStorage store + scoring engine
  components/
    ui.jsx             # ScoreBadge, Cover, BookRow
    RankFlow.jsx       # the Beli-style rank-by-comparison sheet
  screens/
    Feed.jsx  Lists.jsx  Search.jsx  Leaderboard.jsx  Profile.jsx
```
