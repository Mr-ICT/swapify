const pool = require('../config/db')

// @route GET /api/search?q=react
const searchUsers = async (req, res, next) => {
  try {
    const { q } = req.query

    if (!q || q.trim().length < 2) {
      return res.status(400).json({ success: false, message: 'Query must be at least 2 characters' })
    }

    const result = await pool.query(
      `SELECT DISTINCT u.id, u.name, u.avatar_url, u.bio, u.location,
              array_agg(DISTINCT s.name) FILTER (WHERE us.type = 'offers') as offers,
              array_agg(DISTINCT s.name) FILTER (WHERE us.type = 'wants') as wants
       FROM users u
       LEFT JOIN user_skills us ON us.user_id = u.id
       LEFT JOIN skills s ON s.id = us.skill_id
       WHERE u.id != $1
         AND (
           u.name ILIKE $2
           OR s.name ILIKE $2
         )
       GROUP BY u.id
       LIMIT 20`,
      [req.user.id, `%${q.trim()}%`]
    )

    res.status(200).json({ success: true, users: result.rows })
  } catch (err) {
    next(err)
  }
}

module.exports = { searchUsers }