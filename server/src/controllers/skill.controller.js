const { getAllSkills, addUserSkill, getUserSkills, removeUserSkill } = require('../models/skill.model')
const pool = require('../config/db')
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
// @route POST /api/skills/me
const addSkill = async (req, res, next) => {
  try {
    const { skill_name, type, level } = req.body

    if (!skill_name || !type) {
      return res.status(400).json({ success: false, message: 'skill_name and type are required' })
    }

    // Auto-create skill if it doesn't exist
    const skillResult = await pool.query(
      `INSERT INTO skills (name) VALUES ($1)
       ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name
       RETURNING id`,
      [skill_name.trim()]
    )

    const skill_id = skillResult.rows[0].id
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