const { createRating, getRatingsForUser, getAverageRating, hasRated } = require('../models/rating.model')
const pool = require('../config/db')

// @route POST /api/ratings
const submitRating = async (req, res, next) => {
  try {
    const { deal_id, ratee_id, score, comment } = req.body

    if (!deal_id || !ratee_id || !score) {
      return res.status(400).json({ success: false, message: 'deal_id, ratee_id and score are required' })
    }

    if (score < 1 || score > 5) {
      return res.status(400).json({ success: false, message: 'Score must be between 1 and 5' })
    }

    // Verify deal is completed
    const dealResult = await pool.query(
      'SELECT status FROM deals WHERE id = $1',
      [deal_id]
    )

    if (!dealResult.rows[0] || dealResult.rows[0].status !== 'completed') {
      return res.status(400).json({ success: false, message: 'Can only rate completed deals' })
    }

    // Check if already rated
    const already = await hasRated(deal_id, req.user.id)
    if (already) {
      return res.status(409).json({ success: false, message: 'You have already rated this deal' })
    }

    const rating = await createRating(deal_id, req.user.id, ratee_id, score, comment)
    res.status(201).json({ success: true, rating })
  } catch (err) {
    next(err)
  }
}

// @route GET /api/ratings/user/:id
const getUserRatings = async (req, res, next) => {
  try {
    const ratings = await getRatingsForUser(req.params.id)
    const stats = await getAverageRating(req.params.id)
    res.status(200).json({ success: true, ratings, stats })
  } catch (err) {
    next(err)
  }
}

// @route GET /api/ratings/me
const getMyRatings = async (req, res, next) => {
  try {
    const ratings = await getRatingsForUser(req.user.id)
    const stats = await getAverageRating(req.user.id)
    res.status(200).json({ success: true, ratings, stats })
  } catch (err) {
    next(err)
  }
}

module.exports = { submitRating, getUserRatings, getMyRatings }