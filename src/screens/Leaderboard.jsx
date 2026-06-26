import { useMemo, useState } from 'react'
import { PEOPLE } from '../data/seed.js'
import { useStore } from '../data/store.js'
import { useAuth } from '../auth/AuthContext.jsx'
import UserSheet from '../components/UserSheet.jsx'

// Top readers — every member ranked by how many books they've read,
// including you.
export default function Leaderboard() {
  const read = useStore((s) => s.read)
  const photo = useStore((s) => s.photo)
  const { user } = useAuth()
  const [viewUser, setViewUser] = useState(null)

  const me = {
    id: 'me',
    name: user?.displayName || (user?.email ? user.email.split('@')[0] : 'You'),
    handle: user?.email || 'you',
    avatar: '#aeb6c2',
    count: read.length,
    isMe: true,
  }

  const board = useMemo(() => {
    const rows = PEOPLE.map((p) => ({ id: p.id, name: p.name, handle: p.handle, avatar: p.avatar, count: p.ranked, person: p }))
    rows.push(me)
    return rows.sort((a, b) => b.count - a.count)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [read.length, user])

  return (
    <div className="screen">
      <div className="topbar">
        <div className="brand">Leaderboard</div>
      </div>
      <div className="screen-sub" style={{ paddingTop: 12 }}>
        Top readers — ranked by books read.
      </div>

      <div className="rows">
        {board.map((u, i) => (
          <div
            className="row"
            key={u.id}
            style={u.isMe ? { background: 'var(--navy-soft)', borderRadius: 12 } : undefined}
            onClick={() => (u.person ? setViewUser(u.person) : null)}
          >
            <div className="rank">{i + 1}</div>
            {u.isMe && photo ? (
              <img className="avatar" src={photo} alt="You" style={{ objectFit: 'cover' }} />
            ) : (
              <div className="avatar" style={{ background: u.avatar }}>
                {u.name[0]?.toUpperCase()}
              </div>
            )}
            <div className="meta">
              <div className="t">{u.name}{u.isMe ? ' (you)' : ''}</div>
              <div className="a">@{u.handle}</div>
            </div>
            <div className="reader-count">
              <div className="rc-n">{u.count}</div>
              <div className="rc-l">books</div>
            </div>
          </div>
        ))}
      </div>

      {viewUser && <UserSheet user={viewUser} onClose={() => setViewUser(null)} />}
    </div>
  )
}
