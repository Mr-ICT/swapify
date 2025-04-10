const SwipeCard = ({ user }) => {
  return (
    <div className="swipe-card">
      <div className="swipe-card-img">
        {user.avatar_url ? (
          <img src={user.avatar_url} alt={user.name} />
        ) : (
          <div style={{
            width: 72, height: 72, borderRadius: '50%',
            background: '#534AB7', display: 'flex',
            alignItems: 'center', justifyContent: 'center',
            color: 'white', fontSize: 26, fontWeight: 600
          }}>
            {user.name?.charAt(0).toUpperCase()}
          </div>
        )}
        <div className="swipe-badge">
          <i className="ti ti-sparkles" aria-hidden="true" />
          New
        </div>
      </div>

      <div className="swipe-card-body">
        <div className="swipe-card-name">{user.name}</div>

        {user.location && (
          <div className="swipe-card-meta">
            <i className="ti ti-map-pin" aria-hidden="true" />
            {user.location}
          </div>
        )}

        {user.bio && (
          <div className="swipe-card-bio">{user.bio}</div>
        )}

        {user.offers?.length > 0 && (
          <div className="skill-block">
            <div className="skill-block-label label-offers">Offers</div>
            <div className="tags">
              {user.offers.map((s, i) => (
                <span key={i} className="tag tag-offer">{s}</span>
              ))}
            </div>
          </div>
        )}

        {user.wants?.length > 0 && (
          <div className="skill-block" style={{ marginTop: 10 }}>
            <div className="skill-block-label label-wants">Wants</div>
            <div className="tags">
              {user.wants.map((s, i) => (
                <span key={i} className="tag tag-want">{s}</span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default SwipeCard