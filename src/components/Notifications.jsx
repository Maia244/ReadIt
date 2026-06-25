import { SEED_NOTIFS } from '../data/seed.js'
import { getBook } from '../data/store.js'

// Bottom-sheet list of activity about you (likes, follows, comments, recs).
export default function Notifications({ onClose }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="sheet" onClick={(e) => e.stopPropagation()}>
        <div className="sheet-grab" />
        <h3 style={{ marginBottom: 14 }}>Notifications</h3>

        {SEED_NOTIFS.map((n) => {
          const book = n.bookId ? getBook(n.bookId) : null
          return (
            <div className="notif" key={n.id}>
              <div className="avatar" style={{ background: n.avatar }}>
                {n.user[0]}
              </div>
              <div className="notif-body">
                <div className="notif-text">
                  <b>{n.user}</b> {n.text}
                  {book ? <b> {book.title}</b> : ''}
                </div>
                <div className="notif-time">{n.time} ago</div>
              </div>
            </div>
          )
        })}
        <div style={{ height: 8 }} />
      </div>
    </div>
  )
}
