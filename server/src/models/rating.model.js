const pool = require('../config/db')

const createRating = async (deal_id, rater_id, ratee_id, score, comment) => {
  const result = await pool.query(
    `INSERT INTO ratings (deal_id, rater_id, ratee_id, score, comment)
     VALUES ($1, $2, $3, $4, $5)
     ON CONFLICT (deal_id, rater_id) DO NOTHING
     RETURNING *`,
    [deal_id, rater_id, ratee_id, score, comment]
  )
  return result.rows[0]
}

const getRatingsForUser = async (user_id) => {
  const result = await pool.query(
    `SELECT r.*, u.name as rater_name, u.avatar_url as rater_avatar
     FROM ratings r
     JOIN users u ON u.id = r.rater_id
     WHERE r.ratee_id = $1
     ORDER BY r.created_at DESC`,
    [user_id]
  )
  return result.rows
}

const getAverageRating = async (user_id) => {
  const result = await pool.query(
    `SELECT 
       ROUND(AVG(score)::numeric, 1) as average,
       COUNT(*) as total
     FROM ratings
     WHERE ratee_id = $1`,
    [user_id]
  )
  return result.rows[0]
}

const hasRated = async (deal_id, rater_id) => {
  const result = await pool.query(
    `SELECT id FROM ratings WHERE deal_id = $1 AND rater_id = $2`,
    [deal_id, rater_id]
  )
  return result.rows.length > 0
}

module.exports = { createRating, getRatingsForUser, getAverageRating, hasRated }