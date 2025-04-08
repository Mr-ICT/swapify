const SwipeCard = ({ user }) => {
  return (
    <div className="swipe-card">
      <div className="swipe-card-avatar">
        {user.avatar_url ? (
          <img src={user.avatar_url} alt={user.name} />
        ) : (
          <div className="avatar-placeholder">
            {user.name?.charAt(0).toUpperCase()}
          </div>
        )}
      </div>
      <div className="swipe-card-info">
        <h2>{user.name}</h2>
        {user.location && <p className="location">📍 {user.location}</p>}
        {user.bio && <p className="bio">{user.bio}</p>}
        <div className="skills-section">
          {user.offers?.length > 0 && (
            <div className="skill-group">
              <span className="skill-label offers">Offers</span>
              <div className="skill-tags">
                {user.offers.map((s, i) => (
                  <span key={i} className="skill-tag offer-tag">{s}</span>
                ))}
              </div>
            </div>
          )}
          {user.wants?.length > 0 && (
            <div className="skill-group">
              <span className="skill-label wants">Wants</span>
              <div className="skill-tags">
                {user.wants.map((s, i) => (
                  <span key={i} className="skill-tag want-tag">{s}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default SwipeCard