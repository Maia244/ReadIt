import { useState } from 'react'
import Feed from './screens/Feed.jsx'
import Lists from './screens/Lists.jsx'
import Search from './screens/Search.jsx'
import Leaderboard from './screens/Leaderboard.jsx'
import Profile from './screens/Profile.jsx'
import RankFlow from './components/RankFlow.jsx'

const NAV = [
  { key: 'feed', label: 'Feed', icon: '🏠' },
  { key: 'lists', label: 'Lists', icon: '📚' },
  { key: 'add', label: '', icon: '＋', center: true },
  { key: 'board', label: 'Top', icon: '🏆' },
  { key: 'profile', label: 'You', icon: '👤' },
]

export default function App() {
  const [tab, setTab] = useState('feed')
  // The book currently being ranked (opens the RankFlow sheet).
  const [ranking, setRanking] = useState(null)

  // Opening "add" jumps to Search; passing a book opens the ranking sheet.
  function openAdd(book) {
    if (book) setRanking(book)
    else setTab('search')
  }

  return (
    <div className="phone">
      {tab === 'feed' && <Feed />}
      {tab === 'lists' && <Lists onAdd={openAdd} />}
      {tab === 'search' && <Search onAdd={openAdd} />}
      {tab === 'board' && <Leaderboard onAdd={openAdd} />}
      {tab === 'profile' && <Profile />}

      {ranking && <RankFlow book={ranking} onClose={() => setRanking(null)} />}

      <nav className="tabbar">
        {NAV.map((n) =>
          n.center ? (
            <button key={n.key} className="add" onClick={() => setTab('search')}>
              {n.icon}
            </button>
          ) : (
            <button
              key={n.key}
              className={tab === n.key ? 'active' : ''}
              onClick={() => setTab(n.key)}
            >
              <span
                className="ic"
                style={{ filter: tab === n.key ? 'none' : 'grayscale(1)', opacity: tab === n.key ? 1 : 0.55 }}
              >
                {n.icon}
              </span>
              <span>{n.label}</span>
            </button>
          ),
        )}
      </nav>
    </div>
  )
}
