const router = require('express').Router()
const { listSkills, getMySkills, addSkill, removeSkill } = require('../controllers/skill.controller')
const { protect } = require('../middleware/auth.middleware')

router.get('/', listSkills)
router.get('/me', protect, getMySkills)
router.post('/me', protect, addSkill)
router.delete('/me/:id', protect, removeSkill)

module.exports = router