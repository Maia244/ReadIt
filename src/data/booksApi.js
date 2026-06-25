// Live book catalogue via the Open Library + Google Books search APIs.
// Both return loose subjects/categories; we map those into the app's fixed
// genre + age-group taxonomy so every result fits the lists and filters.
import { GOOGLE_BOOKS_API_KEY } from './booksApiConfig.js'

const SEARCH_URL = 'https://openlibrary.org/search.json'
const FIELDS = 'key,title,author_name,first_publish_year,subject,cover_i'
const GBOOKS_URL = 'https://www.googleapis.com/books/v1/volumes'

// Priority-ordered genre rules — first matching keyword wins.
const GENRE_RULES = [
  ['Horror', ['horror', 'ghost', 'haunt', 'vampire', 'zombie']],
  ['Fantasy', ['fantasy', 'magic', 'dragon', 'wizard', 'mythology', 'fairy']],
  ['Sci-Fi', ['science fiction', 'space opera', 'dystop', 'robot', 'time travel', 'aliens']],
  ['Thriller', ['thriller', 'suspense', 'espionage', 'spy']],
  ['Mystery', ['mystery', 'detective', 'crime', 'murder']],
  ['Romance', ['romance', 'love stories']],
  ['Historical', ['historical fiction', 'historical romance']],
  ['Biography', ['biography', 'autobiography', 'memoir']],
  ['Self-Help', ['self-help', 'self-improvement', 'personal development', 'psychology', 'mindfulness']],
  ['Poetry', ['poetry', 'poems', 'verse']],
  ['Non-Fiction', ['nonfiction', 'history', 'science', 'business', 'biography & autobiography', 'politics', 'essays', 'philosophy']],
  ['Literary', ['fiction', 'literature', 'classics', 'literary']],
]

const AGE_RULES = [
  ['Young Adult', ['young adult', 'teenage', 'teen fiction', 'ya fiction']],
  ['Children', ['picture book', 'baby', 'toddler', 'early reader', 'ages 0', 'ages 3', 'ages 4', 'ages 5', 'ages 6', "children's stories"]],
  ['Middle Grade', ['juvenile fiction', 'middle grade', 'ages 7', 'ages 8', 'ages 9', 'ages 10', 'juvenile']],
]

// Soft palette for the cover placeholder when a book has no cover image.
const PALETTE = ['#6a4c93', '#1d3557', '#e63946', '#2a9d8f', '#bc6c25', '#264653', '#7209b7', '#457b9d', '#606c38', '#5f0f40', '#023e8a', '#3a0ca3']

function hashColor(str) {
  let h = 0
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) >>> 0
  return PALETTE[h % PALETTE.length]
}

function matchRules(subjects, rules, fallback) {
  const hay = subjects.join(' • ').toLowerCase()
  for (const [label, keywords] of rules) {
    if (keywords.some((k) => hay.includes(k))) return label
  }
  return fallback
}

// Normalise one Open Library doc into the app's book shape.
function mapDoc(doc) {
  const subjects = doc.subject || []
  return {
    id: 'ol:' + (doc.key || `${doc.title}-${doc.first_publish_year}`),
    title: doc.title,
    author: doc.author_name ? doc.author_name[0] : 'Unknown',
    genre: matchRules(subjects, GENRE_RULES, 'Literary'),
    age: matchRules(subjects, AGE_RULES, 'Adult'),
    year: doc.first_publish_year || null,
    cover: hashColor(doc.title || 'book'),
    coverUrl: doc.cover_i ? `https://covers.openlibrary.org/b/id/${doc.cover_i}-M.jpg?default=false` : null,
  }
}

// Fetch a book's "about" description from Open Library's work record.
// API book ids look like 'ol:/works/OL12345W'; returns a string or null.
export async function fetchDescription(id, signal) {
  if (!id || !id.startsWith('ol:/works/')) return null
  const key = id.slice(3) // strip 'ol:' -> '/works/OL...W'
  const res = await fetch(`https://openlibrary.org${key}.json`, { signal })
  if (!res.ok) return null
  const data = await res.json()
  const d = data.description
  const text = typeof d === 'string' ? d : d && d.value
  if (!text) return null
  // Strip Open Library's trailing source/citation lines for a cleaner blurb.
  return text.split(/\n+|\(\[source/)[0].trim()
}

// Normalise one Google Books volume into the app's book shape.
function mapVolume(v) {
  const info = v.volumeInfo || {}
  const cats = info.categories || []
  const img = info.imageLinks || {}
  const raw = img.thumbnail || img.smallThumbnail || null
  return {
    id: 'gb:' + v.id,
    title: info.title,
    author: info.authors ? info.authors[0] : 'Unknown',
    genre: matchRules(cats, GENRE_RULES, 'Literary'),
    age: matchRules(cats, AGE_RULES, 'Adult'),
    year: info.publishedDate ? parseInt(info.publishedDate.slice(0, 4), 10) || null : null,
    cover: hashColor(info.title || 'book'),
    coverUrl: raw ? raw.replace('http://', 'https://') : null,
  }
}

async function searchOpenLibrary(query, signal) {
  const url = `${SEARCH_URL}?q=${encodeURIComponent(query)}&limit=20&fields=${FIELDS}`
  const res = await fetch(url, { signal })
  if (!res.ok) throw new Error(`Open Library HTTP ${res.status}`)
  const data = await res.json()
  return (data.docs || []).filter((d) => d.title && d.author_name).map(mapDoc)
}

async function searchGoogleBooks(query, signal) {
  const key = GOOGLE_BOOKS_API_KEY ? `&key=${GOOGLE_BOOKS_API_KEY}` : ''
  const url = `${GBOOKS_URL}?q=${encodeURIComponent(query)}&maxResults=20&printType=books${key}`
  const res = await fetch(url, { signal })
  if (!res.ok) throw new Error(`Google Books HTTP ${res.status}`)
  const data = await res.json()
  return (data.items || []).filter((v) => v.volumeInfo && v.volumeInfo.title).map(mapVolume)
}

const dedupeKey = (b) => `${b.title}`.toLowerCase().trim() + '|' + `${b.author}`.toLowerCase().trim()

// Search both sources in parallel and merge. Open Library results come first
// (good covers); Google Books fills in anything missing — especially new
// releases. Throws only if BOTH sources fail (so the caller can fall back to
// the built-in catalogue).
export async function searchBooks(query, signal) {
  const [ol, gb] = await Promise.allSettled([
    searchOpenLibrary(query, signal),
    searchGoogleBooks(query, signal),
  ])
  if (ol.status === 'rejected' && gb.status === 'rejected') {
    throw ol.reason || gb.reason || new Error('Book search failed')
  }
  const merged = []
  const seen = new Set()
  for (const list of [ol.value || [], gb.value || []]) {
    for (const b of list) {
      const k = dedupeKey(b)
      if (seen.has(k)) continue
      seen.add(k)
      merged.push(b)
    }
  }
  return merged
}
