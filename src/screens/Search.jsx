import { useMemo, useState } from 'react'
import { CATALOG } from '../data/seed.js'
import { useStore, actions } from '../data/store.js'
import { GENRES, AGE_GROUPS } from '../data/constants.js'
import { BookRow } from '../components/ui.jsx'

// Search + browse the catalogue. Picking a book opens the ranking flow;
// the heart adds it to "Want to Read".
export default function Search({ onAdd }) {
  const [q, setQ] = useState('')
  const [genre, setGenre] = useState(null)
  const [age, setAge] = useState(null)
  const want = useStore((s) => s.want)
  const read = useStore((s) => s.read)

  const readIds = useMemo(() => new Set(read.map((r) => r.id)), [read])

  const results = CATALOG.filter((b) => {
    const text = `${b.title} ${b.author} ${b.genre}`.toLowerCase()
    if (q && !text.includes(q.toLowerCase())) return false
    if (genre && b.genre !== genre) return false
    if (age && b.age !== age) return false
    return true
  })

  return (
    <div className="screen">
      <div className="topbar">
        <div className="brand">Search</div>
      </div>

      <div className="search-wrap">
        <input
          className="search-input"
          placeholder="🔍  Search title, author or genre"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
      </div>

      <div className="chips">
        <button className={`chip ${!genre && !age ? 'active' : ''}`} onClick={() => { setGenre(null); setAge(null) }}>
          All
        </button>
        {AGE_GROUPS.map((a) => (
          <button key={a} className={`chip ${age === a ? 'active' : ''}`} onClick={() => setAge(age === a ? null : a)}>
            {a}
          </button>
        ))}
        {GENRES.map((g) => (
          <button key={g} className={`chip ${genre === g ? 'active' : ''}`} onClick={() => setGenre(genre === g ? null : g)}>
            {g}
          </button>
        ))}
      </div>

      <div className="rows search-results">
        {results.length === 0 ? (
          <div className="empty">
            <span className="e-emoji">🔍</span>
            No books match.
          </div>
        ) : (
          results.map((b) => {
            const isRead = readIds.has(b.id)
            const onWant = want.includes(b.id)
            return (
              <BookRow
                key={b.id}
                book={b}
                onClick={() => onAdd(b)}
                right={
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <button
                      className={`btn ghost ${onWant ? 'added' : ''}`}
                      style={{ width: 44, height: 44, padding: 0, fontSize: 18, flex: '0 0 auto' }}
                      title="Want to read"
                      onClick={(ev) => {
                        ev.stopPropagation()
                        onWant ? actions.removeFromWant(b.id) : actions.addToWant(b.id)
                      }}
                    >
                      {onWant ? '✓' : '🔖'}
                    </button>
                    <button
                      className="btn"
                      style={{ width: 'auto', padding: '10px 16px', fontSize: 14 }}
                      onClick={(ev) => {
                        ev.stopPropagation()
                        onAdd(b)
                      }}
                    >
                      {isRead ? 'Re-rank' : 'Rank'}
                    </button>
                  </div>
                }
              />
            )
          })
        )}
      </div>
    </div>
  )
}
