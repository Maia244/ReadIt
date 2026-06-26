import { useEffect, useState } from 'react'
import { SEED_FEED } from '../data/seed.js'
import { useStore, actions } from '../data/store.js'
import { getReviews, getConsensus } from '../data/consensus.js'
import { getSummary } from '../data/summaries.js'
import { fetchDescription } from '../data/booksApi.js'
import { Cover, ScoreBadge } from './ui.jsx'
import { IconBookmark } from './icons.jsx'

const toneLabel = { pos: 'Loved it', mixed: 'It was okay', neg: 'Not for me' }

// Book detail sheet: a summary of the book, then the AI community consensus
// ("democracy of all voices"), then the individual reviews behind it.
export default function BookDetail({ book, onClose, onRank }) {
  const want = useStore((s) => s.want)
  const read = useStore((s) => s.read)

  const reviews = getReviews(book.id)
  const consensus = getConsensus(book.id, reviews)

  // "About this book": curated summary for built-in books, else fetched live
  // from Open Library for API books.
  const seedSummary = getSummary(book.id)
  const [summary, setSummary] = useState(seedSummary)
  const [summaryLoading, setSummaryLoading] = useState(false)
  useEffect(() => {
    if (seedSummary || !book.id.startsWith('ol:')) return
    const ctrl = new AbortController()
    setSummaryLoading(true)
    fetchDescription(book.id, ctrl.signal)
      .then((d) => setSummary(d))
      .catch(() => {})
      .finally(() => setSummaryLoading(false))
    return () => ctrl.abort()
  }, [book.id, seedSummary])

  // Community score: the user's own rank plus friends' feed scores.
  const mine = read.find((r) => r.id === book.id)
  const scores = [
    ...(mine ? [mine.score] : []),
    ...SEED_FEED.filter((f) => f.bookId === book.id && f.score != null).map((f) => f.score),
  ]
  const community = scores.length ? scores.reduce((a, b) => a + b, 0) / scores.length : null
  const onWant = want.includes(book.id)

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="sheet" onClick={(e) => e.stopPropagation()}>
        <div className="sheet-grab" />

        <div className="detail-head">
          <Cover book={book} w={84} h={124} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <h3 style={{ margin: 0 }}>{book.title}</h3>
            <div className="handle">{book.author}{book.year ? ` · ${book.year}` : ''}</div>
            <div className="tags" style={{ marginTop: 8 }}>{book.genre}, {book.age}</div>
            {community != null && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 12 }}>
                <ScoreBadge score={community} sm />
                <span className="handle">community score</span>
              </div>
            )}
          </div>
        </div>

        {(summary || summaryLoading) && (
          <div className="about">
            <div className="about-head">About this book</div>
            {summary ? (
              <p className="about-text">{summary}</p>
            ) : (
              <p className="about-text muted-text">Loading summary…</p>
            )}
          </div>
        )}

        {consensus && (
          <div className="consensus">
            <div className="consensus-head">Community consensus</div>
            <p className="consensus-text">{consensus.text}</p>
            <div className="consensus-foot">
              Summarized from {reviews.length || 'all'} reader review{reviews.length === 1 ? '' : 's'} · every voice weighted equally
            </div>
          </div>
        )}

        <div className="add-actions" style={{ marginBottom: 18 }}>
          <button className="btn" onClick={() => onRank(book)}>
            {mine ? 'Re-rank this book' : 'Rank this book'}
          </button>
          <button
            className={`want ${onWant ? 'on' : ''}`}
            title="Want to read"
            onClick={() => {
              if (onWant) actions.removeFromWant(book.id)
              else {
                actions.cacheBook(book)
                actions.addToWant(book.id)
              }
            }}
          >
            <IconBookmark width={22} height={22} style={{ fill: onWant ? 'var(--navy)' : 'none', color: 'var(--navy)' }} />
          </button>
        </div>

        <div className="section-h" style={{ paddingLeft: 0 }}>
          Reader reviews {reviews.length ? `(${reviews.length})` : ''}
        </div>
        {reviews.length === 0 ? (
          <div className="empty" style={{ padding: '24px 10px' }}>
            No reviews yet — be the first to rank it.
          </div>
        ) : (
          reviews.map((r, i) => (
            <div className="review" key={i}>
              <div className="avatar">{r.user[0]}</div>
              <div style={{ flex: 1 }}>
                <div className="review-top">
                  <b>{r.user}</b>
                  <span className={`tone-dot ${r.tone}`} />
                  <span className="tone-label">{toneLabel[r.tone]}</span>
                </div>
                <div className="review-text">{r.text}</div>
              </div>
            </div>
          ))
        )}
        <div style={{ height: 8 }} />
      </div>
    </div>
  )
}

// Deterministic avatar colour from a name so reviewers look consistent.
const COLORS = ['#ff7b00', '#2a9d8f', '#9c6644', '#7209b7', '#1d3557', '#e63946', '#457b9d', '#52b788', '#3a0ca3', '#bc6c25']
function avatarColor(name) {
  let h = 0
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0
  return COLORS[h % COLORS.length]
}
