const pool = require('../config/db')

const findUserById = async (id) => {
  const result = await pool.query(
    'SELECT id, name, email, avatar_url, bio, location, is_verified, created_at FROM users WHERE id = $1',
    [id]
  )
  return result.rows[0]
}

const findUserByEmail = async (email) => {
  const result = await pool.query('SELECT * FROM users WHERE email = $1', [email])
  return result.rows[0]
}

const updateUser = async (id, fields) => {
  const { name, bio, location, avatar_url } = fields
  const result = await pool.query(
    `UPDATE users SET
      name = COALESCE($1, name),
      bio = COALESCE($2, bio),
      location = COALESCE($3, location),
      avatar_url = COALESCE($4, avatar_url),
      updated_at = NOW()
    WHERE id = $5
    RETURNING id, name, email, avatar_url, bio, location`,
    [name, bio, location, avatar_url, id]
  )
  return result.rows[0]
}

module.exports = { findUserById, findUserByEmail, updateUser }