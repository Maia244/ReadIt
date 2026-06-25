import { useState } from 'react'
import { scoreColor } from '../data/constants.js'

export function ScoreBadge({ score, sm }) {
  return (
    <div className={`score ${sm ? 'sm' : ''}`} style={{ background: scoreColor(score) }}>
      {score.toFixed(1)}
    </div>
  )
}

export function Cover({ book, w = 46, h = 68, showText = true }) {
  const [failed, setFailed] = useState(false)

  // Real cover art when available; on a missing/broken image fall back to a
  // coloured spine with the title/author so every book still looks distinct.
  if (book.coverUrl && !failed) {
    return (
      <img
        className="cover img"
        src={book.coverUrl}
        alt={`${book.title} cover`}
        loading="lazy"
        onError={() => setFailed(true)}
        style={{ width: w, height: h, background: book.cover }}
      />
    )
  }
  return (
    <div className="cover" style={{ width: w, height: h, background: book.cover }}>
      {showText && (
        <>
          <div className="c-title">{book.title}</div>
          <div className="c-author">{book.author}</div>
        </>
      )}
    </div>
  )
}

// One book row used in lists. `score`, `rank`, `stat` all optional.
export function BookRow({ book, score, rank, note, stat, onClick, right }) {
  return (
    <div className="row" onClick={onClick}>
      {rank != null && <div className="rank">{rank}</div>}
      <Cover book={book} />
      <div className="meta">
        <div className="t">{book.title}</div>
        <div className="a">{book.author}</div>
        <div className="tags">
          <span className="tag">{book.genre}</span>
          <span className="tag age">{book.age}</span>
        </div>
        {stat ? <div className="rowstat">{stat}</div> : null}
        {note ? <div className="note">“{note}”</div> : null}
      </div>
      {right != null ? right : score != null ? <ScoreBadge score={score} /> : null}
    </div>
  )
}
