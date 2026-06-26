import { useState } from 'react'
import { useStore, actions } from '../data/store.js'
import { SEED_COMMENTS } from '../data/seed.js'

// Comment thread for a feed post: sample comments + your own, with an input.
export default function Comments({ item, onClose }) {
  const userComments = useStore((s) => s.userComments)
  const photo = useStore((s) => s.photo)
  const [text, setText] = useState('')

  const seeded = SEED_COMMENTS[item.id] || []
  const mine = (userComments[item.id] || []).map((c) => ({ ...c, user: 'You', mine: true }))
  const all = [...seeded, ...mine]

  function submit(e) {
    e.preventDefault()
    if (!text.trim()) return
    actions.addComment(item.id, text)
    setText('')
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="sheet" onClick={(e) => e.stopPropagation()}>
        <div className="sheet-grab" />
        <h3 style={{ marginBottom: 14 }}>Comments</h3>

        {all.length === 0 && (
          <div className="empty" style={{ padding: '24px 10px' }}>No comments yet — be the first.</div>
        )}

        {all.map((c, i) => (
          <div className="notif" key={i}>
            {c.mine && photo ? (
              <img className="avatar" src={photo} alt="You" style={{ objectFit: 'cover' }} />
            ) : (
              <div className="avatar" style={{ background: c.mine ? '#aeb6c2' : c.avatar }}>
                {c.user[0]}
              </div>
            )}
            <div className="notif-body">
              <div className="notif-text">
                <b>{c.user}</b> {c.text}
              </div>
              <div className="notif-time">{c.time}</div>
            </div>
          </div>
        ))}

        <form onSubmit={submit} style={{ display: 'flex', gap: 8, marginTop: 14 }}>
          <input
            className="search-input"
            style={{ flex: 1 }}
            placeholder="Add a comment…"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <button className="btn" style={{ width: 'auto', padding: '0 18px' }} type="submit" disabled={!text.trim()}>
            Post
          </button>
        </form>
        <div style={{ height: 8 }} />
      </div>
    </div>
  )
}
