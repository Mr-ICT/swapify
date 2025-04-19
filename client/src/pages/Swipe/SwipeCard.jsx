import { motion, useMotionValue, useTransform } from 'framer-motion'

const SwipeCard = ({ user, onSwipe }) => {
  const x = useMotionValue(0)
  const rotate = useTransform(x, [-200, 200], [-25, 25])
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0, 1, 1, 1, 0])

  const likeOpacity = useTransform(x, [0, 100], [0, 1])
  const passOpacity = useTransform(x, [-100, 0], [1, 0])

  const handleDragEnd = (_, info) => {
    if (info.offset.x > 100) {
      onSwipe('right')
    } else if (info.offset.x < -100) {
      onSwipe('left')
    }
  }

  return (
    <motion.div
      className="swipe-card"
      style={{ x, rotate, opacity, cursor: 'grab', position: 'relative' }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={handleDragEnd}
      whileDrag={{ cursor: 'grabbing' }}
      animate={{ x: 0 }}
    >
      {/* Like indicator */}
      <motion.div style={{
        position: 'absolute', top: 20, right: 20, zIndex: 10,
        opacity: likeOpacity,
        padding: '4px 12px',
        border: '2px solid #1D9E75',
        borderRadius: 6,
        color: '#1D9E75',
        fontWeight: 700,
        fontSize: 18,
        transform: 'rotate(-15deg)',
        background: 'rgba(255,255,255,0.9)',
      }}>
        LIKE
      </motion.div>

      {/* Pass indicator */}
      <motion.div style={{
        position: 'absolute', top: 20, left: 20, zIndex: 10,
        opacity: passOpacity,
        padding: '4px 12px',
        border: '2px solid #D85A30',
        borderRadius: 6,
        color: '#D85A30',
        fontWeight: 700,
        fontSize: 18,
        transform: 'rotate(15deg)',
        background: 'rgba(255,255,255,0.9)',
      }}>
        PASS
      </motion.div>

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
    </motion.div>
  )
}

export default SwipeCard