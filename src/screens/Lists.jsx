import { useState } from 'react'
import { useStore, getBook, actions } from '../data/store.js'
import { GENRES, AGE_GROUPS } from '../data/constants.js'
import { BookRow } from '../components/ui.jsx'

const TABS = [
  { key: 'read', label: 'Read' },
  { key: 'want', label: 'Want to Read' },
  { key: 'recs', label: 'Recs' },
]

export default function Lists({ onAdd }) {
  const [tab, setTab] = useState('read')
  const [genre, setGenre] = useState(null)
  const [age, setAge] = useState(null)
  const state = useStore()

  function matches(book) {
    if (genre && book.genre !== genre) return false
    if (age && book.age !== age) return false
    return true
  }

  // Build the list for the active tab.
  let entries = []
  if (tab === 'read') {
    entries = state.read
      .map((r) => ({ ...r, book: getBook(r.id) }))
      .filter((r) => r.book && matches(r.book))
  } else {
    entries = state[tab]
      .map((id) => ({ id, book: getBook(id) }))
      .filter((r) => r.book && matches(r.book))
  }

  const filterChips = (
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
  )

  return (
    <div className="screen">
      <div className="topbar">
        <div className="brand">Your Lists</div>
        <button className="icon-btn" onClick={() => onAdd()} title="Add a book">
          ＋
        </button>
      </div>

      <div className="segment">
        {TABS.map((t) => (
          <button
            key={t.key}
            className={tab === t.key ? 'active' : ''}
            onClick={() => setTab(t.key)}
          >
            {t.label}
            <span className="count">
              {t.key === 'read' ? state.read.length : state[t.key].length}
            </span>
          </button>
        ))}
      </div>

      {filterChips}

      <div className="rows">
        {entries.length === 0 ? (
          <div className="empty">
            <span className="e-emoji">📚</span>
            Nothing here yet.
            <br />
            Tap ＋ to add a book.
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
                    onClick={(ev) => {
                      ev.stopPropagation()
                      onAdd(e.book)
                    }}
                  >
                    Rank
                  </button>
                ) : tab === 'recs' ? (
                  <button
                    className="btn ghost"
                    style={{ width: 'auto', padding: '8px 14px', fontSize: 13 }}
                    onClick={(ev) => {
                      ev.stopPropagation()
                      actions.addToWant(e.book.id)
                    }}
                  >
                    ＋ Want
                  </button>
                ) : null
              }
            />
          ))
        )}
      </div>
    </div>
  )
}
