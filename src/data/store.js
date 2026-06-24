import { useEffect, useState, useCallback } from 'react'
import { CATALOG, PEOPLE, SEED_READ, SEED_WANT, SEED_RECS, SEED_FEED, SEED_FOLLOWING } from './seed.js'

const KEY = 'lit.state.v1'

// Beli buckets a rating into thirds by sentiment; we keep scores inside
// the matching band so "I liked it" can never fall below a "fine" book.
const BANDS = {
  liked: [6.8, 10.0],
  fine: [3.4, 6.7],
  disliked: [0.0, 3.3],
}

function defaultState() {
  return {
    read: SEED_READ.map((r) => ({ ...r })), // {id, score, sentiment, note}
    want: [...SEED_WANT],
    recs: [...SEED_RECS],
    feed: [...SEED_FEED],
    following: [...SEED_FOLLOWING],
  }
}

function load() {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) return { ...defaultState(), ...JSON.parse(raw) } // merge in new keys
  } catch (e) {
    /* ignore corrupt storage */
  }
  return defaultState()
}

// Re-spread every book's score evenly inside its sentiment band, best first.
// `read` must already be ordered best → worst.
function rescore(read) {
  const byBand = { liked: [], fine: [], disliked: [] }
  read.forEach((b) => byBand[b.sentiment].push(b))

  const scored = {}
  Object.entries(byBand).forEach(([band, items]) => {
    const [lo, hi] = BANDS[band]
    const n = items.length
    items.forEach((b, p) => {
      // A lone book sits mid-band; otherwise spread best→worst across the band.
      const t = n === 1 ? 0.5 : p / (n - 1)
      const raw = hi - (hi - lo) * t
      scored[b.id] = Math.round(raw * 10) / 10
    })
  })
  return read.map((b) => ({ ...b, score: scored[b.id] }))
}

export const catalogById = Object.fromEntries(CATALOG.map((b) => [b.id, b]))
const peopleById = Object.fromEntries(PEOPLE.map((p) => [p.id, p]))

export function getBook(id) {
  return catalogById[id]
}

export function getUser(id) {
  return peopleById[id]
}

// Shared singleton so every screen sees the same state without a context tree.
let state = load()
const listeners = new Set()

function commit(next) {
  state = next
  try {
    localStorage.setItem(KEY, JSON.stringify(state))
  } catch (e) {
    /* storage full / disabled — keep in-memory */
  }
  listeners.forEach((fn) => fn(state))
}

export const actions = {
  addToWant(id) {
    if (state.want.includes(id)) return
    commit({
      ...state,
      want: [id, ...state.want],
      recs: state.recs.filter((r) => r !== id),
    })
  },
  removeFromWant(id) {
    commit({ ...state, want: state.want.filter((w) => w !== id) })
  },
  toggleFollow(userId) {
    const following = state.following.includes(userId)
      ? state.following.filter((u) => u !== userId)
      : [userId, ...state.following]
    commit({ ...state, following })
  },
  // Insert a freshly compared book at `index` within its sentiment band and
  // recompute the whole list's scores.
  rankBook({ id, sentiment, index, note = '' }) {
    const cleaned = state.read.filter((b) => b.id !== id)

    // Rebuild each band best → worst, inserting the new book into its band.
    const ordered = ['liked', 'fine', 'disliked'].flatMap((band) => {
      const items = cleaned.filter((b) => b.sentiment === band)
      if (band === sentiment) items.splice(index, 0, { id, sentiment, note, score: 0 })
      return items
    })

    commit({
      ...state,
      read: rescore(ordered),
      want: state.want.filter((w) => w !== id),
      recs: state.recs.filter((r) => r !== id),
    })
  },
  reset() {
    commit(defaultState())
  },
}

// The list of books in a given band, best → worst, enriched with catalog
// data (title/author/cover) for the comparison flow.
export function bandList(sentiment) {
  return state.read
    .filter((b) => b.sentiment === sentiment)
    .map((b) => ({ ...b, book: catalogById[b.id] }))
}

export function useStore(selector = (s) => s) {
  const [value, setValue] = useState(() => selector(state))
  useEffect(() => {
    const fn = (s) => setValue(selector(s))
    listeners.add(fn)
    fn(state)
    return () => listeners.delete(fn)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return value
}

export function useActions() {
  return useCallback(actions, [])
}
