import { useRef, useState } from 'react'
import { useStore, getBook, actions } from '../data/store.js'
import { SEED_FEED, SEED_FORYOU } from '../data/seed.js'
import { Cover, ScoreBadge } from '../components/ui.jsx'
import { IconHeart, IconComment, IconBookmark, IconBell } from '../components/icons.jsx'
import Notifications from '../components/Notifications.jsx'
import Comments from '../components/Comments.jsx'

function actionText(a) {
  if (a === 'ranked') return 'ranked'
  if (a === 'want') return 'wants to read'
  return a
}

function shuffle(arr) {
  const a = arr.slice()
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export default function Feed({ onOpenBook }) {
  const likes = useStore((s) => s.likes)
  const userComments = useStore((s) => s.userComments)
  const [view, setView] = useState('following')
  const [showNotifs, setShowNotifs] = useState(false)
  const [commentItem, setCommentItem] = useState(null)
  const [feeds, setFeeds] = useState({ following: SEED_FEED, foryou: SEED_FORYOU })
  const [refreshing, setRefreshing] = useState(false)
  const [pull, setPull] = useState(0)

  const screenRef = useRef(null)
  const startY = useRef(null)

  function doRefresh() {
    if (refreshing) return
    setRefreshing(true)
    setTimeout(() => {
      setFeeds((f) => ({ ...f, [view]: shuffle(f[view]) }))
      setRefreshing(false)
    }, 700)
  }

  // ---- pull-to-refresh (pointer events: works with mouse drag + touch) ----
  const dragging = useRef(false)
  const pullRef = useRef(0)

  function onPointerDown(e) {
    if (screenRef.current && screenRef.current.scrollTop <= 0 && !refreshing) {
      startY.current = e.clientY
      dragging.current = true
    }
  }
  function onPointerMove(e) {
    if (!dragging.current || refreshing) return
    const dy = e.clientY - startY.current
    if (dy > 0 && screenRef.current.scrollTop <= 0) {
      const p = Math.min(dy * 0.5, 90)
      pullRef.current = p
      setPull(p)
    } else if (dy <= 0) {
      pullRef.current = 0
      setPull(0)
    }
  }
  function endPull() {
    if (!dragging.current) return
    dragging.current = false
    if (pullRef.current > 55) doRefresh()
    pullRef.current = 0
    setPull(0)
    startY.current = null
  }

  const items = feeds[view]
  const showIndicator = refreshing || pull > 0
  const indicatorText = refreshing ? 'Refreshing…' : pull > 55 ? 'Release to refresh' : 'Pull to refresh'

  return (
    <div
      className="screen"
      ref={screenRef}
      style={{ userSelect: pull > 0 ? 'none' : undefined }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endPull}
      onPointerCancel={endPull}
      onPointerLeave={endPull}
    >
      <div className="topbar">
        <div className="wordmark">lit</div>
        <button className="icon-btn notif-btn" title="Notifications" onClick={() => setShowNotifs(true)}>
          <IconBell />
          <span className="notif-dot" />
        </button>
      </div>

      <div className="feed-toggle">
        <button
          className={view === 'following' ? 'active' : ''}
          onClick={() => (view === 'following' ? doRefresh() : setView('following'))}
        >
          Following
        </button>
        <button
          className={view === 'foryou' ? 'active' : ''}
          onClick={() => (view === 'foryou' ? doRefresh() : setView('foryou'))}
        >
          For You
        </button>
      </div>

      {showIndicator && (
        <div className="refresh-bar" style={{ height: refreshing ? 44 : pull }}>
          <span className={refreshing ? 'spin' : ''}>↻</span> {indicatorText}
        </div>
      )}

      {items.map((item) => {
        const book = getBook(item.bookId)
        if (!book) return null
        const liked = !!likes[item.id]
        const count = (item.likes || 0) + (liked ? 1 : 0)
        return (
          <div className="feed-card" key={item.id}>
            <div className="feed-head">
              <div className="avatar" style={{ background: item.avatar }}>
                {item.user[0]}
              </div>
              <div className="who">
                <div>
                  <b>{item.user}</b> {actionText(item.action)} <b>{book.title}</b>
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
              <button className={`fa-btn ${liked ? 'liked' : ''}`} onClick={() => actions.toggleLike(item.id)}>
                <IconHeart width={18} height={18} style={{ fill: liked ? 'var(--bad)' : 'none' }} />
                {count}
              </button>
              <button className="fa-btn" onClick={() => setCommentItem(item)}>
                <IconComment width={18} height={18} /> {(item.comments || 0) + (userComments[item.id]?.length || 0)}
              </button>
              <button
                className="fa-btn"
                style={{ marginLeft: 'auto' }}
                title="Want to read"
                onClick={() => { actions.cacheBook(book); actions.addToWant(book.id) }}
              >
                <IconBookmark width={18} height={18} />
              </button>
            </div>
          </div>
        )
      })}
      <div style={{ height: 20 }} />

      {showNotifs && <Notifications onClose={() => setShowNotifs(false)} />}
      {commentItem && <Comments item={commentItem} onClose={() => setCommentItem(null)} />}
    </div>
  )
}
