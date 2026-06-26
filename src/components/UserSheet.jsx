import { useStore, actions, getBook } from '../data/store.js'
import { BookRow } from './ui.jsx'

// Beli-style mini profile shown when you tap a person: their stats, a follow
// button, and the books they rank highest.
export default function UserSheet({ user, onClose }) {
  const following = useStore((s) => s.following)
  const isFollowing = following.includes(user.id)

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="sheet" onClick={(e) => e.stopPropagation()}>
        <div className="sheet-grab" />

        <div className="user-sheet-head">
          <div className="avatar lg">{user.name[0]}</div>
          <div style={{ flex: 1 }}>
            <h3 style={{ margin: 0 }}>{user.name}</h3>
            <div className="handle">@{user.handle}</div>
            <div className="user-bio">{user.bio}</div>
          </div>
        </div>

        <div className="user-stats">
          <div>
            <b>{user.ranked}</b> Ranked
          </div>
          <div>
            <b>{(user.followers + (isFollowing ? 1 : 0)).toLocaleString()}</b> Followers
          </div>
        </div>

        <button
          className={`btn ${isFollowing ? 'ghost' : ''}`}
          onClick={() => actions.toggleFollow(user.id)}
          style={{ marginBottom: 16 }}
        >
          {isFollowing ? 'Following' : '+ Follow'}
        </button>

        <div className="section-h" style={{ paddingLeft: 0 }}>
          {user.name}’s top books
        </div>
        <div className="rows" style={{ padding: 0 }}>
          {user.favs.map((id, i) => {
            const book = getBook(id)
            return book ? <BookRow key={id} book={book} rank={i + 1} /> : null
          })}
        </div>
      </div>
    </div>
  )
}
