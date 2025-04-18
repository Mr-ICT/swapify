const router = require('express').Router()
const { searchUsers } = require('../controllers/search.controller')
const { protect } = require('../middleware/auth.middleware')

router.get('/', protect, searchUsers)

module.exports = router