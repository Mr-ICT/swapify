const router = require('express').Router()
const {
  proposeDeal,
  getMyDeals,
  getDealForMatch,
  updateStatus,
  fetchMessages,
  sendMessage,
} = require('../controllers/deal.controller')
const { protect } = require('../middleware/auth.middleware')

router.post('/', protect, proposeDeal)
router.get('/', protect, getMyDeals)
router.get('/match/:match_id', protect, getDealForMatch)
router.patch('/:id/status', protect, updateStatus)
router.get('/:id/messages', protect, fetchMessages)
router.post('/:id/messages', protect, sendMessage)

module.exports = router