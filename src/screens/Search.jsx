import { useEffect, useMemo, useState } from 'react'
import { CATALOG, PEOPLE } from '../data/seed.js'
import { searchBooks } from '../data/booksApi.js'
import { useStore, actions, bookRankings, getBook } from '../data/store.js'
import { GENRES, AGE_GROUPS, scoreColor } from '../data/constants.js'
import { BookRow } from '../components/ui.jsx'
import { IconBookmark } from '../components/icons.jsx'
import UserSheet from '../components/UserSheet.jsx'

// Search both books and people. Books come live from Open Library (millions
// of titles); if that can't be reached we fall back to the built-in list.
export default function Search({ onAdd, onOpenBook }) {
  const [mode, setMode] = useState('books') // books | people
  const [q, setQ] = useState('')
  const [genres, setGenres] = useState([]) // multi-select
  const [ages, setAges] = useState([]) // multi-select
  const [viewUser, setViewUser] = useState(null)

  const toggle = (list, setList, v) =>
    setList(list.includes(v) ? list.filter((x) => x !== v) : [...list, v])

  const [results, setResults] = useState(CATALOG) // live or fallback book list
  const [loading, setLoading] = useState(false)
  const [offline, setOffline] = useState(false)

  const want = useStore((s) => s.want)
  const read = useStore((s) => s.read)
  const following = useStore((s) => s.following)
  const readIds = useMemo(() => new Set(read.map((r) => r.id)), [read])
  const rankings = useMemo(() => bookRankings(), [read])

  // Debounced live book search.
  useEffect(() => {
    if (mode !== 'books') return
    const query = q.trim()
    if (query.length < 2) {
      setResults(CATALOG)
      setLoading(false)
      setOffline(false)
      return
    }
    const ctrl = new AbortController()
    setLoading(true)
    const t = setTimeout(async () => {
      try {
        const books = await searchBooks(query, ctrl.signal)
        setResults(books)
        setOffline(false)
      } catch (e) {
        if (e.name === 'AbortError') return
        // Couldn't reach the live catalogue — search the built-in list instead.
        const lc = query.toLowerCase()
        setResults(CATALOG.filter((b) => `${b.title} ${b.author} ${b.genre}`.toLowerCase().includes(lc)))
        setOffline(true)
      } finally {
        setLoading(false)
      }
    }, 350)
    return () => {
      clearTimeout(t)
      ctrl.abort()
    }
  }, [q, mode])

  // Rank of each scored book *within its genre* (consensus, high → low).
  const genreRanks = useMemo(() => {
    const byGenre = {}
    for (const [id, r] of Object.entries(rankings)) {
      const bk = getBook(id)
      if (!bk?.genre) continue
      ;(byGenre[bk.genre] ||= []).push({ id, score: r.score })
    }
    const map = {}
    for (const arr of Object.values(byGenre)) {
      arr.sort((a, b) => b.score - a.score).forEach((e, i) => { map[e.id] = i + 1 })
    }
    return map
  }, [rankings])

  // Filter (match ANY selected genre AND ANY selected age), then sort by
  // consensus rating high → low (unrated fall to the end).
  const bookResults = useMemo(() => {
    const scoreOf = (b) => (rankings[b.id] ? rankings[b.id].score : -1)
    return results
      .filter((b) => (!genres.length || genres.includes(b.genre)) && (!ages.length || ages.includes(b.age)))
      .slice()
      .sort((a, b) => scoreOf(b) - scoreOf(a))
  }, [results, genres, ages, rankings])

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
          placeholder={mode === 'books' ? 'Search any book, author or genre' : 'Search people'}
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
            <button className={`chip ${!genres.length && !ages.length ? 'active' : ''}`} onClick={() => { setGenres([]); setAges([]) }}>
              All
            </button>
            {GENRES.map((g) => (
              <button key={g} className={`chip ${genres.includes(g) ? 'active' : ''}`} onClick={() => toggle(genres, setGenres, g)}>
                {g}
              </button>
            ))}
            {AGE_GROUPS.map((a) => (
              <button key={a} className={`chip ${ages.includes(a) ? 'active' : ''}`} onClick={() => toggle(ages, setAges, a)}>
                {a}
              </button>
            ))}
          </div>

          {q.trim().length < 2 && <div className="list-label">Popular on lit</div>}
          {offline && <div className="list-label muted">Showing built-in results — couldn’t reach the live catalogue</div>}

          <div className="rows search-results">
            {loading ? (
              <div className="empty">Searching…</div>
            ) : bookResults.length === 0 ? (
              <div className="empty">No books match your search.</div>
            ) : (
              bookResults.map((b) => {
                const isRead = readIds.has(b.id)
                const onWant = want.includes(b.id)
                const rk = rankings[b.id]
                return (
                  <BookRow
                    key={b.id}
                    book={b}
                    onClick={() => onOpenBook(b)}
                    stat={
                      rk ? (
                        <span>
                          {genres.length === 1
                            ? `#${genreRanks[b.id] ?? '–'} in ${b.genre}`
                            : `#${rk.rank} overall`}
                        </span>
                      ) : (
                        <span className="rowstat-muted">Not ranked yet</span>
                      )
                    }
                    right={
                      <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                        {rk && (
                          <div className="score" style={{ background: scoreColor(rk.score) }}>
                            {rk.score.toFixed(1)}
                          </div>
                        )}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'stretch' }}>
                          <button
                            className="btn"
                            style={{ width: 'auto', padding: '6px 12px', fontSize: 12 }}
                            onClick={(ev) => { ev.stopPropagation(); onAdd(b) }}
                          >
                            {isRead ? 'Re-rank' : 'Rank'}
                          </button>
                          <button
                            style={{ background: 'none', padding: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--navy)' }}
                            title={onWant ? 'Saved to Want to Read' : 'Want to read'}
                            onClick={(ev) => {
                              ev.stopPropagation()
                              if (onWant) {
                                actions.removeFromWant(b.id)
                              } else {
                                actions.cacheBook(b)
                                actions.addToWant(b.id)
                              }
                            }}
                          >
                            <IconBookmark width={20} height={20} style={{ fill: onWant ? 'var(--navy)' : 'none' }} />
                          </button>
                        </div>
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
                  <div className="avatar">{p.name[0]}</div>
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
