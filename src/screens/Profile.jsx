import { useMemo, useState } from 'react'
import { useStore, getBook, actions } from '../data/store.js'
import { GENRES, AGE_GROUPS } from '../data/constants.js'
import { BookRow } from '../components/ui.jsx'
import { IconGear } from '../components/icons.jsx'

const LIST_TABS = [
  { key: 'read', label: 'Read' },
  { key: 'want', label: 'Want to Read' },
  { key: 'recs', label: 'Recs' },
  { key: 'stats', label: 'Stats' },
]

// Beli keeps a user's ranked lists on their Profile (Been / Want to Try /
// Recs), so this screen hosts the segmented lists + a taste-breakdown tab.
export default function Profile({ onAdd }) {
  const state = useStore()
  const [tab, setTab] = useState('read')
  const [genre, setGenre] = useState(null)
  const [age, setAge] = useState(null)

  const stats = useMemo(() => {
    const read = state.read.map((r) => ({ ...r, book: getBook(r.id) })).filter((r) => r.book)
    const avg = read.length ? read.reduce((s, r) => s + r.score, 0) / read.length : 0

    const byGenre = {}
    read.forEach((r) => (byGenre[r.book.genre] = (byGenre[r.book.genre] || 0) + 1))
    const genres = Object.entries(byGenre).sort((a, b) => b[1] - a[1])
    const maxG = genres.length ? genres[0][1] : 1

    const byAge = {}
    read.forEach((r) => (byAge[r.book.age] = (byAge[r.book.age] || 0) + 1))
    const ages = Object.entries(byAge).sort((a, b) => b[1] - a[1])
    const maxA = ages.length ? ages[0][1] : 1

    return { avg, genres, maxG, ages, maxA }
  }, [state.read])

  function matches(book) {
    if (genre && book.genre !== genre) return false
    if (age && book.age !== age) return false
    return true
  }

  let entries = []
  if (tab === 'read') {
    entries = state.read.map((r) => ({ ...r, book: getBook(r.id) })).filter((r) => r.book && matches(r.book))
  } else if (tab === 'want' || tab === 'recs') {
    entries = state[tab].map((id) => ({ id, book: getBook(id) })).filter((r) => r.book && matches(r.book))
  }

  return (
    <div className="screen">
      <div className="topbar">
        <div className="brand">lit</div>
        <button
          className="icon-btn"
          title="Settings"
          onClick={() => {
            if (confirm('Reset lit to demo data?')) actions.reset()
          }}
        >
          <IconGear />
        </button>
      </div>

      <div className="profile-head">
        <div className="big-avatar">M</div>
        <div>
          <h2>Maia</h2>
          <div className="handle">@maia · bookworm</div>
        </div>
      </div>

      <div className="stats">
        <div className="stat">
          <div className="n">{state.read.length}</div>
          <div className="l">Ranked</div>
        </div>
        <div className="stat">
          <div className="n">248</div>
          <div className="l">Followers</div>
        </div>
        <div className="stat">
          <div className="n">{state.following.length}</div>
          <div className="l">Following</div>
        </div>
      </div>

      <div className="segment">
        {LIST_TABS.map((t) => (
          <button
            key={t.key}
            className={tab === t.key ? 'active' : ''}
            onClick={() => setTab(t.key)}
          >
            {t.label}
            {t.key !== 'stats' && (
              <span className="count">
                {t.key === 'read' ? state.read.length : state[t.key].length}
              </span>
            )}
          </button>
        ))}
      </div>

      {tab === 'stats' ? (
        <>
          <div className="bar-row" style={{ paddingTop: 16, fontWeight: 700 }}>
            <div className="bl">Avg score</div>
            <div style={{ flex: 1 }} />
            <div className="bn" style={{ width: 'auto', color: 'var(--ink)' }}>
              {stats.avg.toFixed(1)}
            </div>
          </div>
          <div className="section-h">Favorite genres</div>
          {stats.genres.map(([g, n]) => (
            <div className="bar-row" key={g}>
              <div className="bl">{g}</div>
              <div className="bar-track">
                <div className="bar-fill" style={{ width: `${(n / stats.maxG) * 100}%` }} />
              </div>
              <div className="bn">{n}</div>
            </div>
          ))}
          <div className="section-h">By age group</div>
          {stats.ages.map(([a, n]) => (
            <div className="bar-row" key={a}>
              <div className="bl">{a}</div>
              <div className="bar-track">
                <div className="bar-fill" style={{ width: `${(n / stats.maxA) * 100}%`, background: '#e0a23a' }} />
              </div>
              <div className="bn">{n}</div>
            </div>
          ))}
          <div style={{ height: 20 }} />
        </>
      ) : (
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

          <div className="rows">
            {entries.length === 0 ? (
              <div className="empty">
                Nothing here yet.
                <br />
                Add a book from Search to see it here.
              </div>
            ) : (
              entries.map((e, i) => (
                <BookRow
                  key={e.id}
                  book={e.book}
                  rank={tab === 'read' ? i + 1 : null}
                  score={tab === 'read' ? e.score : null}
                  note={tab === 'read' ? e.note : null}
                  onClick={() => onAdd(e.book)}
                  right={
                    tab === 'want' ? (
                      <button
                        className="btn ghost"
                        style={{ width: 'auto', padding: '8px 14px', fontSize: 13 }}
                        onClick={(ev) => { ev.stopPropagation(); onAdd(e.book) }}
                      >
                        Rank
                      </button>
                    ) : tab === 'recs' ? (
                      <button
                        className="btn ghost"
                        style={{ width: 'auto', padding: '8px 14px', fontSize: 13 }}
                        onClick={(ev) => { ev.stopPropagation(); actions.addToWant(e.book.id) }}
                      >
                        + Want
                      </button>
                    ) : null
                  }
                />
              ))
            )}
          </div>
        </>
      )}
    </div>
  )
}
