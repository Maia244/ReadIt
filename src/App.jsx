import { useState } from 'react'
import Feed from './screens/Feed.jsx'
import Search from './screens/Search.jsx'
import Leaderboard from './screens/Leaderboard.jsx'
import Profile from './screens/Profile.jsx'
import RankFlow from './components/RankFlow.jsx'
import BookDetail from './components/BookDetail.jsx'
import Login from './screens/Login.jsx'
import { actions } from './data/store.js'
import { useAuth } from './auth/AuthContext.jsx'
import { isFirebaseConfigured } from './auth/firebase.js'
import { IconHome, IconSearch, IconTrophy, IconUser, IconPlus } from './components/icons.jsx'

// Beli's bottom nav: Feed · Search · ＋ · Leaderboard · Profile.
const NAV = [
  { key: 'feed', label: 'Feed', Icon: IconHome },
  { key: 'search', label: 'Search', Icon: IconSearch },
  { key: 'add', center: true },
  { key: 'board', label: 'Leaderboard', Icon: IconTrophy },
  { key: 'profile', label: 'Profile', Icon: IconUser },
]

export default function App() {
  const { user, loading } = useAuth()
  const [tab, setTab] = useState('feed')
  // Bumped each time the + button is tapped, to focus the search box.
  const [addSignal, setAddSignal] = useState(0)
  // The book currently being ranked (opens the RankFlow sheet).
  const [ranking, setRanking] = useState(null)
  // The book whose detail/consensus sheet is open.
  const [detail, setDetail] = useState(null)

  // Passing a book opens the ranking sheet; otherwise jump to Search.
  function openAdd(book) {
    if (book) {
      actions.cacheBook(book) // persist API books so lists resolve them later
      setDetail(null)
      setRanking(book)
    } else {
      setTab('search')
    }
  }

  // The + button: jump to Search and focus the input ("Add a book").
  function tapAdd() {
    setTab('search')
    setAddSignal((n) => n + 1)
  }

  // Tapping a book opens its detail + AI consensus view.
  function openBook(book) {
    actions.cacheBook(book)
    setDetail(book)
  }

  // Auth gate: require an account before using the app (when configured).
  if (isFirebaseConfigured) {
    if (loading) {
      return (
        <div className="phone">
          <div className="auth">
            <div className="auth-logo">lit</div>
          </div>
        </div>
      )
    }
    if (!user) return <Login />
  }

  return (
    <div className="phone">
      {tab === 'feed' && <Feed onOpenBook={openBook} />}
      {tab === 'search' && <Search onAdd={openAdd} onOpenBook={openBook} focusSignal={addSignal} />}
      {tab === 'board' && <Leaderboard onOpenBook={openBook} />}
      {tab === 'profile' && <Profile onAdd={openAdd} onOpenBook={openBook} />}

      {detail && <BookDetail book={detail} onClose={() => setDetail(null)} onRank={openAdd} />}
      {ranking && <RankFlow book={ranking} onClose={() => setRanking(null)} />}

      <nav className="tabbar">
        {NAV.map((n) =>
          n.center ? (
            <button key={n.key} className="add" onClick={tapAdd} aria-label="Add a book">
              <IconPlus />
            </button>
          ) : (
            <button
              key={n.key}
              className={tab === n.key ? 'active' : ''}
              onClick={() => setTab(n.key)}
            >
              <span className="ic">
                <n.Icon />
              </span>
              <span>{n.label}</span>
            </button>
          ),
        )}
      </nav>
    </div>
  )
}
