import { useState, useEffect } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'

const BASE = 'http://localhost:5000/api'

const Matches = () => {
  const [matches, setMatches] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const res = await axios.get(`${BASE}/matches`, { withCredentials: true })
        setMatches(res.data.matches || [])
      } catch {
        toast.error('Failed to load matches')
      } finally {
        setLoading(false)
      }
    }
    fetchMatches()
  }, [])

  if (loading) {
    return (
      <div className="state-container">
        <div className="state-icon">
          <i className="ti ti-loader-2" aria-hidden="true" />
        </div>
        <div className="state-title">Loading matches...</div>
      </div>
    )
  }

  return (
    <div className="matches-page">
      <div className="matches-header">
        <div className="matches-title">Your matches</div>
        <div className="matches-sub">
          {matches.length === 0
            ? 'No matches yet — go swipe!'
            : `${matches.length} match${matches.length !== 1 ? 'es' : ''} so far`
          }
        </div>
      </div>

      {matches.length === 0 ? (
        <div className="state-container" style={{ minHeight: 'auto', padding: '60px 0' }}>
          <div className="state-icon">
            <i className="ti ti-users" aria-hidden="true" />
          </div>
          <div className="state-title">No matches yet</div>
          <div className="state-sub">
            Start swiping to find people whose skills complement yours.
          </div>
        </div>
      ) : (
        <div className="matches-grid">
          {matches.map(m => (
            <div key={m.id} className="match-card">
              <div className="match-card-avatar">
                {m.name?.charAt(0).toUpperCase()}
              </div>
              <div className="match-card-name">{m.name}</div>
              {m.bio && (
                <div className="match-card-skill" style={{
                  fontSize: 12,
                  color: '#9ca3af',
                  overflow: 'hidden',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical'
                }}>
                  {m.bio}
                </div>
              )}
              <button className="match-card-btn">
                <i className="ti ti-message" style={{ fontSize: 11 }} aria-hidden="true" />
                {' '}Message
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Matches