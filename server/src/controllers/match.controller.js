const {
  getSwipeQueue,
  recordSwipe,
  checkMutualMatch,
  createMatch,
  getUserMatches,
} = require('../models/match.model')

// @route GET /api/matches/queue
const getQueue = async (req, res, next) => {
  try {
    const queue = await getSwipeQueue(req.user.id)
    res.status(200).json({ success: true, queue })
  } catch (err) {
    next(err)
  }
}

// @route POST /api/matches/swipe
const swipe = async (req, res, next) => {
  try {
    const { swiped_id, direction } = req.body

    if (!swiped_id || !direction) {
      return res.status(400).json({ success: false, message: 'swiped_id and direction are required' })
    }

    if (swiped_id === req.user.id) {
      return res.status(400).json({ success: false, message: 'Cannot swipe on yourself' })
    }

    await recordSwipe(req.user.id, swiped_id, direction)

    let match = null

    if (direction === 'right') {
      const isMutual = await checkMutualMatch(req.user.id, swiped_id)
      if (isMutual) {
        match = await createMatch(req.user.id, swiped_id)
      }
    }

    res.status(200).json({
      success: true,
      matched: !!match,
      match: match || null,
    })
  } catch (err) {
    next(err)
  }
}

// @route GET /api/matches
const getMatches = async (req, res, next) => {
  try {
    const matches = await getUserMatches(req.user.id)
    res.status(200).json({ success: true, matches })
  } catch (err) {
    next(err)
  }
}

module.exports = { getQueue, swipe, getMatches }