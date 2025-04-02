const router = require('express').Router()
const { getMyProfile, updateMyProfile, getUserProfile } = require('../controllers/profile.controller')
const { protect } = require('../middleware/auth.middleware')

router.get('/me', protect, getMyProfile)
router.put('/me', protect, updateMyProfile)
router.get('/:id', protect, getUserProfile)

module.exports = router