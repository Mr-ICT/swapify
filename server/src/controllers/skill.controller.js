const { getAllSkills, addUserSkill, getUserSkills, removeUserSkill } = require('../models/skill.model')

// @route GET /api/skills
const listSkills = async (req, res, next) => {
  try {
    const skills = await getAllSkills()
    res.status(200).json({ success: true, skills })
  } catch (err) {
    next(err)
  }
}

// @route GET /api/skills/me
const getMySkills = async (req, res, next) => {
  try {
    const skills = await getUserSkills(req.user.id)
    res.status(200).json({ success: true, skills })
  } catch (err) {
    next(err)
  }
}

// @route POST /api/skills/me
const addSkill = async (req, res, next) => {
  try {
    const { skill_id, type, level } = req.body

    if (!skill_id || !type) {
      return res.status(400).json({ success: false, message: 'skill_id and type are required' })
    }

    const skill = await addUserSkill(req.user.id, skill_id, type, level)
    res.status(201).json({ success: true, skill })
  } catch (err) {
    next(err)
  }
}

// @route DELETE /api/skills/me/:id
const removeSkill = async (req, res, next) => {
  try {
    await removeUserSkill(req.params.id, req.user.id)
    res.status(200).json({ success: true, message: 'Skill removed' })
  } catch (err) {
    next(err)
  }
}

module.exports = { listSkills, getMySkills, addSkill, removeSkill }