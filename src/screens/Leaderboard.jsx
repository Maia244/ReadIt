import { useMemo, useState } from 'react'
import { CATALOG, SEED_FEED } from '../data/seed.js'
import { useStore, getBook } from '../data/store.js'
import { GENRES, AGE_GROUPS } from '../data/constants.js'
import { BookRow } from '../components/ui.jsx'

// A community leaderboard: aggregates your scores + friends' feed scores into
// a ranked board you can slice by genre and age group.
export default function Leaderboard({ onOpenBook }) {
  const [genre, setGenre] = useState(null)
  const [age, setAge] = useState(null)
  const read = useStore((s) => s.read)

  const board = useMemo(() => {
    const agg = {}
    const add = (id, score) => {
      if (score == null) return
      if (!agg[id]) agg[id] = { id, total: 0, n: 0 }
      agg[id].total += score
      agg[id].n += 1
    }
    read.forEach((r) => add(r.id, r.score))
    SEED_FEED.forEach((f) => add(f.bookId, f.score))

    return Object.values(agg)
      .map((a) => ({ id: a.id, avg: a.total / a.n, book: getBook(a.id) }))
      .filter((a) => a.book)
      .filter((a) => (genre ? a.book.genre === genre : true))
      .filter((a) => (age ? a.book.age === age : true))
      .sort((a, b) => b.avg - a.avg)
  }, [read, genre, age])

  return (
    <div className="screen">
      <div className="topbar">
        <div className="brand">Leaderboard</div>
      </div>
      <div className="screen-sub" style={{ paddingTop: 12 }}>
        Top-rated books across lit — filter by genre or age group.
      </div>

      <div className="chips">
        <button className={`chip ${!genre && !age ? 'active' : ''}`} onClick={() => { setGenre(null); setAge(null) }}>
          All
        </button>
        {GENRES.map((g) => (
          <button key={g} className={`chip ${genre === g ? 'active' : ''}`} onClick={() => setGenre(genre === g ? null : g)}>
            {g}
          </button>
        ))}
        {AGE_GROUPS.map((a) => (
          <button key={a} className={`chip ${age === a ? 'active' : ''}`} onClick={() => setAge(age === a ? null : a)}>
            {a}
          </button>
        ))}
      </div>

      <div className="rows">
        {board.length === 0 ? (
          <div className="empty">No ranked books in this slice yet.</div>
        ) : (
          board.map((e, i) => (
            <BookRow key={e.id} book={e.book} rank={i + 1} score={e.avg} onClick={() => onOpenBook(e.book)} />
          ))
        )}
      </div>
    </div>
  )
}
