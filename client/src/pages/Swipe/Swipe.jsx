import { useState, useEffect } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import SwipeCard from './SwipeCard'
import SwipeButtons from './SwipeButtons'
import useAuth from '../../hooks/useAuth'

const BASE = 'http://localhost:5000/api'

const Swipe = () => {
  const { user } = useAuth()
  const [queue, setQueue] = useState([])
  const [current, setCurrent] = useState(0)
  const [loading, setLoading] = useState(true)
  const [swiping, setSwiping] = useState(false)
  const [matches, setMatches] = useState([])
  const [stats, setStats] = useState({ swipes: 0, matches: 0 })

  useEffect(() => {
    fetchQueue()
    fetchMatches()
  }, [])

  const fetchQueue = async () => {
    try {
      const res = await axios.get(`${BASE}/matches/queue`, { withCredentials: true })
      const users = await Promise.all(
        res.data.queue.map(async (u) => {
          const profileRes = await axios.get(`${BASE}/profile/${u.id}`, { withCredentials: true })
          const allSkills = profileRes.data.profile.skills || []
          return {
            ...u,
            offers: allSkills.filter(s => s.type === 'offers').map(s => s.name),
            wants: allSkills.filter(s => s.type === 'wants').map(s => s.name),
          }
        })
      )
      setQueue(users)
    } catch {
      toast.error('Failed to load swipe queue')
    } finally {
      setLoading(false)
    }
  }

  const fetchMatches = async () => {
    try {
      const res = await axios.get(`${BASE}/matches`, { withCredentials: true })
      setMatches(res.data.matches || [])
      setStats(prev => ({ ...prev, matches: res.data.matches?.length || 0 }))
    } catch {}
  }

  const handleSwipe = async (direction) => {
    if (swiping || current >= queue.length) return
    setSwiping(true)
    try {
      const res = await axios.post(
        `${BASE}/matches/swipe`,
        { swiped_id: queue[current].id, direction },
        { withCredentials: true }
      )
      if (res.data.matched) {
        toast.success(`It's a match with ${queue[current].name}!`)
        fetchMatches()
      }
      setStats(prev => ({ ...prev, swipes: prev.swipes + 1 }))
      setCurrent(prev => prev + 1)
    } catch {
      toast.error('Swipe failed')
    } finally {
      setSwiping(false)
    }
  }

  if (loading) {
    return (
      <div className="state-container">
        <div className="state-icon">
          <i className="ti ti-loader-2" aria-hidden="true" />
        </div>
        <div className="state-title">Finding matches...</div>
      </div>
    )
  }

  return (
    <div className="swipe-page">
      <div className="swipe-main">
        {current >= queue.length ? (
          <div className="state-container" style={{ minHeight: 'auto', padding: '60px 24px' }}>
            <div className="state-icon">
              <i className="ti ti-checks" aria-hidden="true" />
            </div>
            <div className="state-title">You're all caught up</div>
            <div className="state-sub">No more profiles right now. Check back later or add more skills.</div>
          </div>
        ) : (
          <>
           <SwipeCard user={queue[current]} onSwipe={handleSwipe} />
            <SwipeButtons
              onLeft={() => handleSwipe('left')}
              onRight={() => handleSwipe('right')}
              onSuper={() => handleSwipe('right')}
              disabled={swiping}
            />
            <div style={{ fontSize: 12, color: '#9ca3af' }}>
              {queue.length - current} profile{queue.length - current !== 1 ? 's' : ''} left
            </div>
          </>
        )}
      </div>

      <div className="swipe-sidebar">
        <div className="sidebar-card">
          <div className="sidebar-card-title">Your stats</div>
          <div className="stat-grid">
            <div className="stat-item">
              <div className="stat-value">{stats.swipes}</div>
              <div className="stat-label">Swipes today</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">{stats.matches}</div>
              <div className="stat-label">Matches</div>
            </div>
          </div>
        </div>

        <div className="sidebar-card">
          <div className="sidebar-card-title">Recent matches</div>
          {matches.length === 0 ? (
            <div style={{ fontSize: 12, color: '#d1d1d6', padding: '8px 0' }}>
              No matches yet — keep swiping!
            </div>
          ) : (
            matches.slice(0, 5).map((m) => (
              <div key={m.id} className="match-item">
                <div className="match-avatar">
                  {m.name?.charAt(0).toUpperCase()}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="match-name">{m.name}</div>
                  <div className="match-skill">Matched</div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export default Swipe