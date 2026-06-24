import { useMemo, useState } from 'react'
import { SENTIMENTS, scoreColor } from '../data/constants.js'
import { bandList, actions } from '../data/store.js'
import { Cover } from './ui.jsx'

// Beli-style ranking: pick a sentiment, then a binary-search of head-to-head
// "which did you prefer?" matchups to place the book exactly, then reveal score.
export default function RankFlow({ book, onClose }) {
  const [step, setStep] = useState('sentiment') // sentiment | compare | result
  const [sentiment, setSentiment] = useState(null)
  const [note, setNote] = useState('')

  // Binary-search bounds within the chosen band's existing books.
  const [lo, setLo] = useState(0)
  const [hi, setHi] = useState(0)
  const [peers, setPeers] = useState([])
  const [rounds, setRounds] = useState(0)
  const [finalScore, setFinalScore] = useState(null)

  const totalRounds = useMemo(
    () => (peers.length ? Math.ceil(Math.log2(peers.length + 1)) : 0),
    [peers.length],
  )

  function chooseSentiment(s) {
    const list = bandList(s.key) // best → worst
    setSentiment(s.key)
    setPeers(list)
    setLo(0)
    setHi(list.length)
    setRounds(0)
    if (list.length === 0) {
      finish(s.key, 0)
    } else {
      setStep('compare')
    }
  }

  const mid = Math.floor((lo + hi) / 2)

  // User preferred the NEW book over the peer → it ranks higher (search upper half).
  function pick(preferNew) {
    const nextRounds = rounds + 1
    let nlo = lo
    let nhi = hi
    if (preferNew) {
      nhi = mid // new book is better → goes above peer
    } else {
      nlo = mid + 1 // peer is better → new book goes below it
    }
    setRounds(nextRounds)
    if (nlo >= nhi) {
      finish(sentiment, nlo)
    } else {
      setLo(nlo)
      setHi(nhi)
    }
  }

  function finish(band, index) {
    actions.rankBook({ id: book.id, sentiment: band, index, note })
    // Re-read this book's freshly computed score for the reveal screen.
    const placed = bandList(band)[index]
    setFinalScore(placed ? placed.score : 0)
    setStep('result')
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="sheet" onClick={(e) => e.stopPropagation()}>
        <div className="sheet-grab" />

        {step === 'sentiment' && (
          <>
            <div className="rank-book-head">
              <Cover book={book} w={46} h={68} />
              <div style={{ minWidth: 0 }}>
                <h3 style={{ margin: 0 }}>How was it?</h3>
                <div className="sub" style={{ margin: '2px 0 0' }}>
                  {book.title} · {book.author}
                </div>
              </div>
            </div>
            <div className="sentiment-btns">
              {SENTIMENTS.map((s) => (
                <button key={s.key} className={s.tone} onClick={() => chooseSentiment(s)}>
                  <span className={`sent-dot ${s.tone}`} />
                  <span className="sent-label">{s.label}</span>
                  <span className="chev">›</span>
                </button>
              ))}
            </div>
          </>
        )}

        {step === 'compare' && peers[mid] && (
          <>
            <h3>Which did you prefer?</h3>
            <div className="sub">Comparing to books you’ve already read</div>
            <div className="progress-dots">
              {Array.from({ length: totalRounds }).map((_, i) => (
                <span key={i} className={i < rounds ? 'on' : ''} />
              ))}
            </div>
            <div className="versus">
              <div className="vs-card" onClick={() => pick(true)}>
                <Cover book={book} w={70} h={104} />
                <div>
                  <div className="vt">{book.title}</div>
                  <div className="va">{book.author}</div>
                </div>
              </div>
              <div className="vs-card" onClick={() => pick(false)}>
                <Cover book={peers[mid]?.book} w={70} h={104} />
                <div>
                  <div className="vt">{peers[mid]?.book.title}</div>
                  <div className="va">{peers[mid]?.book.author}</div>
                </div>
              </div>
            </div>
            <div className="vs-or">— or —</div>
            <button className="btn ghost" onClick={() => finish(sentiment, mid)}>
              Too tough to call
            </button>
          </>
        )}

        {step === 'result' && finalScore != null && (
          <>
            <h3>Nice — it’s ranked!</h3>
            <div className="sub">{book.title}</div>
            <div className="result-score">
              <div className="big" style={{ color: scoreColor(finalScore) }}>
                {finalScore.toFixed(1)}
              </div>
              <div className="lbl">Your score · added to “Read”</div>
            </div>
            <textarea
              className="note-input"
              rows={2}
              placeholder="Add a quick note (optional)…"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              onBlur={() =>
                actions.rankBook({
                  id: book.id,
                  sentiment,
                  index: bandList(sentiment).findIndex((b) => b.id === book.id),
                  note,
                })
              }
            />
            <button className="btn" onClick={onClose}>
              Done
            </button>
          </>
        )}
      </div>
    </div>
  )
}
