import { useState, useEffect } from 'react'
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