const pool = require('../config/db')

const getAllSkills = async () => {
  const result = await pool.query('SELECT * FROM skills ORDER BY category, name')
  return result.rows
}

const addUserSkill = async (user_id, skill_id, type, level) => {
  const result = await pool.query(
    `INSERT INTO user_skills (user_id, skill_id, type, level)
     VALUES ($1, $2, $3, $4)
     ON CONFLICT (user_id, skill_id, type) DO NOTHING
     RETURNING *`,
    [user_id, skill_id, type, level]
  )
  return result.rows[0]
}

const getUserSkills = async (user_id) => {
  const result = await pool.query(
    `SELECT us.id, us.type, us.level, s.name, s.category
     FROM user_skills us
     JOIN skills s ON s.id = us.skill_id
     WHERE us.user_id = $1`,
    [user_id]
  )
  return result.rows
}

const removeUserSkill = async (id, user_id) => {
  await pool.query('DELETE FROM user_skills WHERE id = $1 AND user_id = $2', [id, user_id])
}

module.exports = { getAllSkills, addUserSkill, getUserSkills, removeUserSkill }