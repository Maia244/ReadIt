import { useState } from 'react'
import Feed from './screens/Feed.jsx'
import Search from './screens/Search.jsx'
import Leaderboard from './screens/Leaderboard.jsx'
import Profile from './screens/Profile.jsx'
import RankFlow from './components/RankFlow.jsx'
import BookDetail from './components/BookDetail.jsx'
import { actions } from './data/store.js'
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
  const [tab, setTab] = useState('feed')
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

  // Tapping a book opens its detail + AI consensus view.
  function openBook(book) {
    actions.cacheBook(book)
    setDetail(book)
  }

  return (
    <div className="phone">
      {tab === 'feed' && <Feed onOpenBook={openBook} />}
      {tab === 'search' && <Search onAdd={openAdd} onOpenBook={openBook} />}
      {tab === 'board' && <Leaderboard onOpenBook={openBook} />}
      {tab === 'profile' && <Profile onAdd={openAdd} onOpenBook={openBook} />}

      {detail && <BookDetail book={detail} onClose={() => setDetail(null)} onRank={openAdd} />}
      {ranking && <RankFlow book={ranking} onClose={() => setRanking(null)} />}

      <nav className="tabbar">
        {NAV.map((n) =>
          n.center ? (
            <button key={n.key} className="add" onClick={() => setTab('search')} aria-label="Add a book">
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
