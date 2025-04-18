import { useState, useEffect, useCallback } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import EditProfileModal from './EditProfileModal'
import SkillManager from './SkillManager'


const BASE = 'http://localhost:5000/api'

const Profile = () => {
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showEdit, setShowEdit] = useState(false)

  const fetchProfile = async () => {
    try {
      const res = await axios.get(`${BASE}/profile/me`, { withCredentials: true })
      setProfile(res.data.profile)
    } catch {
      toast.error('Failed to load profile')
    } finally {
      setLoading(false)
    }
  }

  const [ratings, setRatings] = useState([])
const [ratingStats, setRatingStats] = useState({ average: 0, total: 0 })

const fetchRatings = async () => {
  try {
    const res = await axios.get(`${BASE}/ratings/me`, { withCredentials: true })
    setRatings(res.data.ratings || [])
    setRatingStats(res.data.stats || { average: 0, total: 0 })
  } catch {}
}

useEffect(() => {
  fetchProfile()
  fetchRatings()
}, [])

  useEffect(() => { fetchProfile() }, [])

  if (loading) {
    return (
      <div className="state-container">
        <div className="state-icon">
          <i className="ti ti-loader-2" aria-hidden="true" />
        </div>
        <div className="state-title">Loading profile...</div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="state-container">
        <div className="state-icon">
          <i className="ti ti-user-off" aria-hidden="true" />
        </div>
        <div className="state-title">Profile not found</div>
      </div>
    )
  }

  return (
    <div className="profile-page">
      <div className="profile-header-card">
        <div className="profile-avatar">
          {profile.avatar_url
            ? <img src={profile.avatar_url} alt={profile.name} />
            : profile.name?.charAt(0).toUpperCase()
          }
        </div>

        <div className="profile-info">
          <div className="profile-name">{profile.name}</div>
          {profile.location && (
            <div className="profile-meta">
              <i className="ti ti-map-pin" aria-hidden="true" />
              {profile.location}
            </div>
          )}
          {profile.bio
            ? <div className="profile-bio">{profile.bio}</div>
            : <div className="profile-bio" style={{ color: '#d1d1d6', fontStyle: 'italic' }}>
                No bio yet
              </div>
          }
        </div>

        <button className="btn-edit" onClick={() => setShowEdit(true)}>
          <i className="ti ti-pencil" aria-hidden="true" />
          Edit
        </button>
      </div>

      <SkillManager
        userSkills={profile.skills || []}
        onSkillsUpdated={fetchProfile}
      />

      {/* Ratings */}
<div className="skills-card">
  <div className="skills-card-header">
    <span className="skills-card-title">Reviews</span>
    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
      <i className="ti ti-star-filled" style={{ color: '#BA7517', fontSize: 14 }} aria-hidden="true" />
      <span style={{ fontSize: 13, fontWeight: 600 }}>{ratingStats.average || '—'}</span>
      <span style={{ fontSize: 12, color: '#9ca3af' }}>({ratingStats.total || 0} reviews)</span>
    </div>
  </div>

  {ratings.length === 0 ? (
    <div className="skills-empty">No reviews yet — complete a deal to get rated</div>
  ) : (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {ratings.map(r => (
        <div key={r.id} style={{ padding: '12px 0', borderBottom: '0.5px solid #f0f0f5' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div className="match-avatar" style={{ width: 28, height: 28, fontSize: 11 }}>
                {r.rater_name?.charAt(0).toUpperCase()}
              </div>
              <span style={{ fontSize: 13, fontWeight: 500 }}>{r.rater_name}</span>
            </div>
            <div style={{ display: 'flex', gap: 2 }}>
              {[1,2,3,4,5].map(star => (
                <i
                  key={star}
                  className={star <= r.score ? 'ti ti-star-filled' : 'ti ti-star'}
                  style={{ fontSize: 13, color: star <= r.score ? '#BA7517' : '#e8e8ed' }}
                  aria-hidden="true"
                />
              ))}
            </div>
          </div>
          {r.comment && (
            <div style={{ fontSize: 13, color: '#4b5563', lineHeight: 1.6, paddingLeft: 36 }}>
              {r.comment}
            </div>
          )}
        </div>
      ))}
    </div>
  )}
</div>

      {showEdit && (
        <EditProfileModal
          profile={profile}
          onClose={() => setShowEdit(false)}
          onUpdated={(updated) => setProfile(prev => ({ ...prev, ...updated }))}
        />
      )}
    </div>
  )
}

export default Profile