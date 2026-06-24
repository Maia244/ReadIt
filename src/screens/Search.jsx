import { useMemo, useState } from 'react'
import { CATALOG, PEOPLE } from '../data/seed.js'
import { useStore, actions } from '../data/store.js'
import { GENRES, AGE_GROUPS } from '../data/constants.js'
import { BookRow } from '../components/ui.jsx'
import { IconBookmark } from '../components/icons.jsx'
import UserSheet from '../components/UserSheet.jsx'

// Search both books and people (Beli's "Restaurants / Members"). Picking a
// book opens the ranking flow; people can be followed inline.
export default function Search({ onAdd }) {
  const [mode, setMode] = useState('books') // books | people
  const [q, setQ] = useState('')
  const [genre, setGenre] = useState(null)
  const [age, setAge] = useState(null)
  const [viewUser, setViewUser] = useState(null)

  const want = useStore((s) => s.want)
  const read = useStore((s) => s.read)
  const following = useStore((s) => s.following)
  const readIds = useMemo(() => new Set(read.map((r) => r.id)), [read])

  const bookResults = CATALOG.filter((b) => {
    const text = `${b.title} ${b.author} ${b.genre}`.toLowerCase()
    if (q && !text.includes(q.toLowerCase())) return false
    if (genre && b.genre !== genre) return false
    if (age && b.age !== age) return false
    return true
  })

  const peopleResults = PEOPLE.filter((p) => {
    const text = `${p.name} ${p.handle} ${p.bio}`.toLowerCase()
    return !q || text.includes(q.toLowerCase())
  })

  return (
    <div className="screen">
      <div className="topbar">
        <div className="brand">Search</div>
      </div>

      <div className="search-wrap">
        <input
          className="search-input"
          placeholder={mode === 'books' ? 'Search books, authors, genres' : 'Search people'}
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <div className="segment" style={{ position: 'static', padding: '10px 0 0' }}>
          <button className={mode === 'books' ? 'active' : ''} onClick={() => setMode('books')}>
            Books
          </button>
          <button className={mode === 'people' ? 'active' : ''} onClick={() => setMode('people')}>
            People
          </button>
        </div>
      </div>

      {mode === 'books' ? (
        <>
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
            {bookResults.length === 0 ? (
              <div className="empty">No books match your search.</div>
            ) : (
              bookResults.map((b) => {
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
                          <IconBookmark
                            width={20}
                            height={20}
                            style={{ fill: onWant ? 'var(--teal)' : 'none' }}
                          />
                        </button>
                        <button
                          className="btn"
                          style={{ width: 'auto', padding: '10px 16px', fontSize: 14 }}
                          onClick={(ev) => { ev.stopPropagation(); onAdd(b) }}
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
        </>
      ) : (
        <div className="rows search-results">
          {peopleResults.length === 0 ? (
            <div className="empty">No people match your search.</div>
          ) : (
            peopleResults.map((p) => {
              const isFollowing = following.includes(p.id)
              return (
                <div className="row" key={p.id} onClick={() => setViewUser(p)}>
                  <div className="avatar" style={{ background: p.avatar }}>
                    {p.name[0]}
                  </div>
                  <div className="meta">
                    <div className="t">{p.name}</div>
                    <div className="a">@{p.handle}</div>
                    <div className="note" style={{ fontStyle: 'normal' }}>
                      {p.bio} · {p.ranked} ranked
                    </div>
                  </div>
                  <button
                    className={`btn ${isFollowing ? 'ghost' : ''}`}
                    style={{ width: 'auto', padding: '9px 16px', fontSize: 13 }}
                    onClick={(ev) => { ev.stopPropagation(); actions.toggleFollow(p.id) }}
                  >
                    {isFollowing ? 'Following' : '+ Follow'}
                  </button>
                </div>
              )
            })
          )}
        </div>
      )}

      {viewUser && <UserSheet user={viewUser} onClose={() => setViewUser(null)} />}
    </div>
  )
}
