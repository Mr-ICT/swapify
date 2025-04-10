import { useState } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'

const BASE = 'http://localhost:5000/api'

const EditProfileModal = ({ profile, onClose, onUpdated }) => {
  const [form, setForm] = useState({
    name: profile.name || '',
    bio: profile.bio || '',
    location: profile.location || '',
    avatar_url: profile.avatar_url || '',
  })
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await axios.put(`${BASE}/profile/me`, form, { withCredentials: true })
      toast.success('Profile updated')
      onUpdated(res.data.profile)
      onClose()
    } catch {
      toast.error('Failed to update profile')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <div className="modal-header">
          <span className="modal-title">Edit profile</span>
          <button className="modal-close" onClick={onClose} aria-label="Close">
            <i className="ti ti-x" aria-hidden="true" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full name</label>
            <input
              className="form-control"
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Your name"
            />
          </div>
          <div className="form-group">
            <label>Location</label>
            <input
              className="form-control"
              type="text"
              name="location"
              value={form.location}
              onChange={handleChange}
              placeholder="City, Country"
            />
          </div>
          <div className="form-group">
            <label>Avatar URL</label>
            <input
              className="form-control"
              type="text"
              name="avatar_url"
              value={form.avatar_url}
              onChange={handleChange}
              placeholder="https://..."
            />
          </div>
          <div className="form-group">
            <label>Bio</label>
            <textarea
              className="form-control"
              name="bio"
              value={form.bio}
              onChange={handleChange}
              placeholder="Tell people what you're about..."
              rows={3}
              style={{ resize: 'vertical' }}
            />
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-ghost"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-save"
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditProfileModal