import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import toast from 'react-hot-toast'

const BASE = 'http://localhost:5000/api'

const Deals = () => {
  const [deals, setDeals] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchDeals = async () => {
      try {
        const res = await axios.get(`${BASE}/deals`, { withCredentials: true })
        setDeals(res.data.deals || [])
      } catch {
        toast.error('Failed to load deals')
      } finally {
        setLoading(false)
      }
    }
    fetchDeals()
  }, [])

  const statusColor = (status) => {
    const map = {
      proposed: { bg: '#FAEEDA', color: '#BA7517' },
      accepted: { bg: '#E1F5EE', color: '#1D9E75' },
      declined: { bg: '#FAECE7', color: '#D85A30' },
      completed: { bg: '#EEEDFE', color: '#534AB7' },
      cancelled: { bg: '#F7F7F9', color: '#9ca3af' },
    }
    return map[status] || map.proposed
  }

  if (loading) {
    return (
      <div className="state-container">
        <div className="state-icon">
          <i className="ti ti-loader-2" aria-hidden="true" />
        </div>
        <div className="state-title">Loading deals...</div>
      </div>
    )
  }

  return (
    <div className="matches-page">
      <div className="matches-header">
        <div className="matches-title">Deals</div>
        <div className="matches-sub">
          {deals.length === 0
            ? 'No deals yet — match with someone and propose a swap'
            : `${deals.length} deal${deals.length !== 1 ? 's' : ''}`
          }
        </div>
      </div>

      {deals.length === 0 ? (
        <div className="state-container" style={{ minHeight: 'auto', padding: '60px 0' }}>
          <div className="state-icon">
            <i className="ti ti-handshake" aria-hidden="true" />
          </div>
          <div className="state-title">No deals yet</div>
          <div className="state-sub">
            Match with someone and propose a skill swap to get started.
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {deals.map(d => {
            const { bg, color } = statusColor(d.status)
            return (
              <div
                key={d.id}
                className="sidebar-card"
                style={{ cursor: 'pointer', transition: 'border-color 0.15s' }}
                onClick={() => navigate(`/deals/${d.id}`)}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 4 }}>
                      {d.description}
                    </div>
                    <div style={{ fontSize: 12, color: '#9ca3af' }}>
                      Proposed by {d.proposed_by_name}
                    </div>
                  </div>
                  <span style={{
                    padding: '3px 10px',
                    borderRadius: 999,
                    fontSize: 11,
                    fontWeight: 500,
                    background: bg,
                    color,
                    flexShrink: 0,
                  }}>
                    {d.status}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default Deals