import { useMemo } from 'react'
import { useStore, getBook, actions } from '../data/store.js'

export default function Profile() {
  const state = useStore()

  const stats = useMemo(() => {
    const read = state.read.map((r) => ({ ...r, book: getBook(r.id) })).filter((r) => r.book)
    const avg = read.length ? read.reduce((s, r) => s + r.score, 0) / read.length : 0

    // Genre breakdown.
    const byGenre = {}
    read.forEach((r) => {
      byGenre[r.book.genre] = (byGenre[r.book.genre] || 0) + 1
    })
    const genres = Object.entries(byGenre).sort((a, b) => b[1] - a[1])
    const maxG = genres.length ? genres[0][1] : 1

    // Age-group breakdown.
    const byAge = {}
    read.forEach((r) => {
      byAge[r.book.age] = (byAge[r.book.age] || 0) + 1
    })
    const ages = Object.entries(byAge).sort((a, b) => b[1] - a[1])
    const maxA = ages.length ? ages[0][1] : 1

    return { read, avg, genres, maxG, ages, maxA }
  }, [state.read])

  return (
    <div className="screen">
      <div className="topbar">
        <div className="brand">Profile</div>
        <button className="icon-btn" title="Settings" onClick={() => {
          if (confirm('Reset lit to demo data?')) actions.reset()
        }}>
          ⚙
        </button>
      </div>

      <div className="profile-head">
        <div className="big-avatar">M</div>
        <div>
          <h2>Maia</h2>
          <div className="handle">@maia · 🔖 bookworm</div>
        </div>
      </div>

      <div className="stats">
        <div className="stat">
          <div className="n">{state.read.length}</div>
          <div className="l">Read</div>
        </div>
        <div className="stat">
          <div className="n">{state.want.length}</div>
          <div className="l">Want to Read</div>
        </div>
        <div className="stat">
          <div className="n">{stats.avg.toFixed(1)}</div>
          <div className="l">Avg score</div>
        </div>
      </div>

      <div className="section-h">Favorite genres</div>
      {stats.genres.length === 0 ? (
        <div className="empty" style={{ padding: '20px' }}>Rank a book to see your taste.</div>
      ) : (
        stats.genres.map(([g, n]) => (
          <div className="bar-row" key={g}>
            <div className="bl">{g}</div>
            <div className="bar-track">
              <div className="bar-fill" style={{ width: `${(n / stats.maxG) * 100}%` }} />
            </div>
            <div className="bn">{n}</div>
          </div>
        ))
      )}

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
    </div>
  )
}
