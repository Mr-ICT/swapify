const router = require('express').Router()
const { getQueue, swipe, getMatches } = require('../controllers/match.controller')
const { protect } = require('../middleware/auth.middleware')

router.get('/queue', protect, getQueue)
router.post('/swipe', protect, swipe)
router.get('/', protect, getMatches)

module.exports = router