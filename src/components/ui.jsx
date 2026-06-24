import { scoreColor } from '../data/constants.js'

export function ScoreBadge({ score, sm }) {
  return (
    <div className={`score ${sm ? 'sm' : ''}`} style={{ background: scoreColor(score) }}>
      {score.toFixed(1)}
    </div>
  )
}

export function Cover({ book, w = 46, h = 68, showText = true }) {
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

// One book row used in lists. `score` optional; `rank` optional.
export function BookRow({ book, score, rank, note, onClick, right }) {
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
        {note ? <div className="note">“{note}”</div> : null}
      </div>
      {right != null ? right : score != null ? <ScoreBadge score={score} /> : null}
    </div>
  )
}
