import { useState } from 'react'
import { useStore, getBook } from '../data/store.js'
import { Cover, ScoreBadge } from '../components/ui.jsx'
import { IconHeart, IconComment, IconBookmark, IconBell } from '../components/icons.jsx'
import Notifications from '../components/Notifications.jsx'

function actionText(a) {
  if (a === 'ranked') return 'ranked'
  if (a === 'want') return 'wants to read'
  return a
}

export default function Feed({ onOpenBook }) {
  const feed = useStore((s) => s.feed)
  const [view, setView] = useState('following')
  const [showNotifs, setShowNotifs] = useState(false)

  return (
    <div className="screen">
      <div className="topbar">
        <div className="wordmark">lit</div>
        <button className="icon-btn notif-btn" title="Notifications" onClick={() => setShowNotifs(true)}>
          <IconBell />
          <span className="notif-dot" />
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
            <div className="feed-body" onClick={() => onOpenBook(book)} style={{ cursor: 'pointer' }}>
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
              <span><IconHeart width={18} height={18} /> 12</span>
              <span><IconComment width={18} height={18} /> 3</span>
              <span style={{ marginLeft: 'auto' }}><IconBookmark width={18} height={18} /></span>
            </div>
          </div>
        )
      })}
      <div style={{ height: 20 }} />

      {showNotifs && <Notifications onClose={() => setShowNotifs(false)} />}
    </div>
  )
}
