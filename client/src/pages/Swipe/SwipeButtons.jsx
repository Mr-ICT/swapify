const SwipeButtons = ({ onLeft, onRight, disabled }) => {
  return (
    <div className="swipe-buttons">
      <button
        className="swipe-btn reject"
        onClick={onLeft}
        disabled={disabled}
        title="Pass"
      >
        ✕
      </button>
      <button
        className="swipe-btn accept"
        onClick={onRight}
        disabled={disabled}
        title="Match"
      >
        ♥
      </button>
    </div>
  )
}

export default SwipeButtons