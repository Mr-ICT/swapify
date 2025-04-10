const SwipeButtons = ({ onLeft, onRight, onSuper, disabled }) => {
  return (
    <div className="swipe-actions">
      <button
        className="action-btn pass"
        onClick={onLeft}
        disabled={disabled}
        aria-label="Pass"
      >
        <i className="ti ti-x" aria-hidden="true" />
      </button>

      <button
        className="action-btn like"
        onClick={onRight}
        disabled={disabled}
        aria-label="Like"
      >
        <i className="ti ti-heart" aria-hidden="true" />
      </button>

      <button
        className="action-btn superswap"
        onClick={onSuper}
        disabled={disabled}
        aria-label="Super swap"
      >
        <i className="ti ti-star" aria-hidden="true" />
      </button>
    </div>
  )
}

export default SwipeButtons