import { useState } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'

const BASE = 'http://localhost:5000/api'

const RatingModal = ({ deal, rateeId, rateeName, onClose, onRated }) => {
  const [score, setScore] = useState(5)
  const [comment, setComment] = useState('')
  const [loading, setLoading] = useState(false)
  const [hovered, setHovered] = useState(0)

  const handleSubmit = async () => {
    setLoading(true)
    try {
      await axios.post(
        `${BASE}/ratings`,
        { deal_id: deal.id, ratee_id: rateeId, score, comment },
        { withCredentials: true }
      )
      toast.success('Rating submitted!')
      onRated()
      onClose()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit rating')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <div className="modal-header">
          <span className="modal-title">Rate {rateeName}</span>
          <button className="modal-close" onClick={onClose} aria-label="Close">
            <i className="ti ti-x" aria-hidden="true" />
          </button>
        </div>

        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 12, color: '#9ca3af', marginBottom: 12 }}>
            How was your experience working with {rateeName}?
          </div>

          {/* Star Rating */}
          <div style={{ display: 'flex', gap: 6, marginBottom: 20 }}>
            {[1, 2, 3, 4, 5].map(star => (
              <button
                key={star}
                onMouseEnter={() => setHovered(star)}
                onMouseLeave={() => setHovered(0)}
                onClick={() => setScore(star)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: 28,
                  cursor: 'pointer',
                  color: star <= (hovered || score) ? '#BA7517' : '#e8e8ed',
                  transition: 'color 0.1s',
                  padding: '0 2px',
                }}
                aria-label={`${star} star`}
              >
                <i className="ti ti-star-filled" aria-hidden="true" />
              </button>
            ))}
            <span style={{ fontSize: 13, color: '#9ca3af', alignSelf: 'center', marginLeft: 4 }}>
              {score}/5
            </span>
          </div>

          <div className="form-group">
            <label>Comment (optional)</label>
            <textarea
              className="form-control"
              placeholder="Share your experience..."
              value={comment}
              onChange={e => setComment(e.target.value)}
              rows={3}
              style={{ resize: 'vertical' }}
            />
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn-save" onClick={handleSubmit} disabled={loading}>
            {loading ? 'Submitting...' : 'Submit rating'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default RatingModal