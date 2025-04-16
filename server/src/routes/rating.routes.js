const router = require('express').Router()
const { submitRating, getUserRatings, getMyRatings } = require('../controllers/rating.controller')
const { protect } = require('../middleware/auth.middleware')

router.post('/', protect, submitRating)
router.get('/me', protect, getMyRatings)
router.get('/user/:id', protect, getUserRatings)

module.exports = router