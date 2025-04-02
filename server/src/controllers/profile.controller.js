const { findUserById, updateUser } = require('../models/user.model')
const { getUserSkills } = require('../models/skill.model')

// @route GET /api/profile/me
const getMyProfile = async (req, res, next) => {
  try {
    const user = await findUserById(req.user.id)
    if (!user) return res.status(404).json({ success: false, message: 'User not found' })

    const skills = await getUserSkills(req.user.id)
    res.status(200).json({ success: true, profile: { ...user, skills } })
  } catch (err) {
    next(err)
  }
}

// @route PUT /api/profile/me
const updateMyProfile = async (req, res, next) => {
  try {
    const { name, bio, location, avatar_url } = req.body
    const updated = await updateUser(req.user.id, { name, bio, location, avatar_url })
    res.status(200).json({ success: true, profile: updated })
  } catch (err) {
    next(err)
  }
}

// @route GET /api/profile/:id
const getUserProfile = async (req, res, next) => {
  try {
    const user = await findUserById(req.params.id)
    if (!user) return res.status(404).json({ success: false, message: 'User not found' })

    const skills = await getUserSkills(req.params.id)
    res.status(200).json({ success: true, profile: { ...user, skills } })
  } catch (err) {
    next(err)
  }
}

module.exports = { getMyProfile, updateMyProfile, getUserProfile }