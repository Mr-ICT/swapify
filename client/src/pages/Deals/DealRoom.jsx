import { useState, useEffect, useRef } from 'react'
import RatingModal from './RatingModal'
import { useParams, useNavigate } from 'react-router-dom'
import { io } from 'socket.io-client'
import axios from 'axios'
import toast from 'react-hot-toast'
import useAuth from '../../hooks/useAuth'

const BASE = 'http://localhost:5000/api'
const SOCKET_URL = 'http://localhost:5000'

const DealRoom = () => {
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [deal, setDeal] = useState(null)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [showRating, setShowRating] = useState(false)
  const socketRef = useRef(null)
  const bottomRef = useRef(null)

  useEffect(() => {
    fetchDeal()
    fetchMessages()

    socketRef.current = io(SOCKET_URL, { withCredentials: true })
    socketRef.current.emit('join_deal', id)
    socketRef.current.on('receive_message', (message) => {
      setMessages(prev => [...prev, message])
    })

    return () => socketRef.current?.disconnect()
  }, [id])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const fetchDeal = async () => {
    try {
      const res = await axios.get(`${BASE}/deals`, { withCredentials: true })
      const found = res.data.deals.find(d => d.id === id)
      setDeal(found || null)
    } catch {
      toast.error('Failed to load deal')
    } finally {
      setLoading(false)
    }
  }

  const fetchMessages = async () => {
    try {
      const res = await axios.get(`${BASE}/deals/${id}/messages`, { withCredentials: true })
      setMessages(res.data.messages || [])
    } catch {
      toast.error('Failed to load messages')
    }
  }

  const handleSend = async () => {
    if (!input.trim() || sending) return
    setSending(true)
    try {
      const res = await axios.post(
        `${BASE}/deals/${id}/messages`,
        { content: input.trim() },
        { withCredentials: true }
      )
      const message = res.data.message
      socketRef.current?.emit('send_message', { deal_id: id, message })
      setMessages(prev => [...prev, message])
      setInput('')
    } catch {
      toast.error('Failed to send message')
    } finally {
      setSending(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleStatusUpdate = async (status) => {
    try {
      await axios.patch(
        `${BASE}/deals/${id}/status`,
        { status },
        { withCredentials: true }
      )
      toast.success(`Deal ${status}`)
      setDeal(prev => ({ ...prev, status }))
    } catch {
      toast.error('Failed to update deal')
    }
  }

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
        <div className="state-title">Loading deal room...</div>
      </div>
    )
  }

  if (!deal) {
    return (
      <div className="state-container">
        <div className="state-icon">
          <i className="ti ti-alert-circle" aria-hidden="true" />
        </div>
        <div className="state-title">Deal not found</div>
      </div>
    )
  }

  const { bg, color } = statusColor(deal.status)

  return (
    <div style={{ maxWidth: 680, margin: '0 auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: 16, height: 'calc(100vh - 56px)' }}>

      {/* Deal Header */}
      <div className="profile-header-card" style={{ padding: 20, flexShrink: 0 }}>
        <button
          onClick={() => navigate('/deals')}
          style={{ background: 'none', border: 'none', color: '#9ca3af', fontSize: 20, cursor: 'pointer', padding: 0 }}
          aria-label="Back"
        >
          <i className="ti ti-arrow-left" aria-hidden="true" />
        </button>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>{deal.description}</div>
          <div style={{ fontSize: 12, color: '#9ca3af' }}>Proposed by {deal.proposed_by_name}</div>
        </div>
        <span style={{ padding: '3px 10px', borderRadius: 999, fontSize: 11, fontWeight: 500, background: bg, color, flexShrink: 0 }}>
          {deal.status}
        </span>
      </div>

      {/* Deal Actions */}
      {deal.status === 'proposed' && deal.proposed_by !== user?.id && (
        <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
          <button
            className="btn-save"
            style={{ flex: 1 }}
            onClick={() => handleStatusUpdate('accepted')}
          >
            <i className="ti ti-check" aria-hidden="true" /> Accept deal
          </button>
          <button
            className="btn-ghost btn"
            style={{ flex: 1 }}
            onClick={() => handleStatusUpdate('declined')}
          >
            <i className="ti ti-x" aria-hidden="true" /> Decline
          </button>
        </div>
      )}

      {deal.status === 'accepted' && (
        <button
          className="btn-save"
          style={{ flexShrink: 0 }}
          onClick={() => handleStatusUpdate('completed')}
        >
          <i className="ti ti-checks" aria-hidden="true" /> Mark as completed
        </button>
      )}

      {deal.status === 'completed' && (
        <button
          className="btn-save"
          style={{ flexShrink: 0, background: '#BA7517' }}
          onClick={() => setShowRating(true)}
        >
          <i className="ti ti-star" aria-hidden="true" /> Rate this swap
        </button>
      )}

      {showRating && (
        <RatingModal
          deal={deal}
          rateeId={deal.proposed_by === user?.id ? deal.user_b : deal.user_a}
          rateeName="your swap partner"
          onClose={() => setShowRating(false)}
          onRated={() => setShowRating(false)}
        />
      )}

      {/* Messages */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        padding: '4px 0',
      }}>
        {messages.length === 0 && (
          <div style={{ textAlign: 'center', color: '#d1d1d6', fontSize: 13, padding: '40px 0' }}>
            No messages yet. Start the conversation.
          </div>
        )}
        {messages.map((m, i) => {
          const isMe = m.sender_id === user?.id
          return (
            <div
              key={m.id || i}
              style={{
                display: 'flex',
                justifyContent: isMe ? 'flex-end' : 'flex-start',
              }}
            >
              <div style={{
                maxWidth: '70%',
                padding: '8px 12px',
                borderRadius: isMe ? '12px 12px 2px 12px' : '12px 12px 12px 2px',
                background: isMe ? '#534AB7' : '#ffffff',
                border: isMe ? 'none' : '0.5px solid #e8e8ed',
                color: isMe ? 'white' : '#1a1a2e',
                fontSize: 13,
                lineHeight: 1.5,
              }}>
                {!isMe && (
                  <div style={{ fontSize: 11, fontWeight: 600, color: '#9ca3af', marginBottom: 3 }}>
                    {m.sender_name}
                  </div>
                )}
                {m.content}
              </div>
            </div>
          )
        })}
        <div ref={bottomRef} />
      </div>

      {/* Message Input */}
      <div style={{
        display: 'flex',
        gap: 8,
        flexShrink: 0,
        padding: '12px 0 0',
        borderTop: '0.5px solid #e8e8ed',
      }}>
        <input
          className="form-control"
          style={{ flex: 1 }}
          placeholder="Type a message... (Enter to send)"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={deal.status === 'declined' || deal.status === 'cancelled'}
        />
        <button
          className="btn-add"
          onClick={handleSend}
          disabled={sending || !input.trim() || deal.status === 'declined' || deal.status === 'cancelled'}
          aria-label="Send"
        >
          <i className="ti ti-send" aria-hidden="true" />
        </button>
      </div>
    </div>
  )
}

export default DealRoom