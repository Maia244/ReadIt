import { useState } from 'react'
import { useStore, getBook } from '../data/store.js'
import { Cover, ScoreBadge } from '../components/ui.jsx'

function actionText(a) {
  if (a === 'ranked') return 'ranked'
  if (a === 'want') return 'wants to read'
  return a
}

export default function Feed() {
  const feed = useStore((s) => s.feed)
  const [view, setView] = useState('following')

  return (
    <div className="screen">
      <div className="topbar">
        <div className="brand">
          lit<span className="dot">.</span>
        </div>
        <button className="icon-btn" title="Notifications">
          ♡
        </button>
      </div>

      <div className="feed-toggle">
        <button className={view === 'following' ? 'active' : ''} onClick={() => setView('following')}>
          Following
        </button>
        <button className={view === 'foryou' ? 'active' : ''} onClick={() => setView('foryou')}>
          For You
        </button>
      </div>

      {feed.map((item) => {
        const book = getBook(item.bookId)
        if (!book) return null
        return (
          <div className="feed-card" key={item.id}>
            <div className="feed-head">
              <div className="avatar" style={{ background: item.avatar }}>
                {item.user[0]}
              </div>
              <div className="who">
                <div>
                  <b>{item.user}</b> {actionText(item.action)}{' '}
                  <b>{book.title}</b>
                </div>
                <div className="time">{item.time} ago</div>
              </div>
              {item.score != null && <ScoreBadge score={item.score} sm />}
            </div>
            <div className="feed-body">
              <Cover book={book} w={52} h={78} />
              <div>
                <div className="tags">
                  <span className="tag">{book.genre}</span>
                  <span className="tag age">{book.age}</span>
                </div>
                {item.comment && <div className="feed-comment">{item.comment}</div>}
              </div>
            </div>
            <div className="feed-actions">
              <span>♡ Like</span>
              <span>💬 Comment</span>
              <span>＋ Add to list</span>
            </div>
          </div>
        )
      })}
      <div style={{ height: 20 }} />
    </div>
  )
}
