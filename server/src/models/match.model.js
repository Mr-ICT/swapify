const pool = require('../config/db')

const getSwipeQueue = async (userId) => {
  const result = await pool.query(
    `SELECT DISTINCT u.id, u.name, u.avatar_url, u.bio, u.location
     FROM users u
     JOIN user_skills us_them ON us_them.user_id = u.id
     JOIN user_skills us_me ON us_me.user_id = $1
     WHERE
       -- They offer what I want
       (us_them.type = 'offers' AND us_me.type = 'wants' AND us_them.skill_id = us_me.skill_id)
       OR
       -- They want what I offer
       (us_them.type = 'wants' AND us_me.type = 'offers' AND us_them.skill_id = us_me.skill_id)
     AND u.id != $1
     AND u.id NOT IN (
       SELECT swiped_id FROM swipes WHERE swiper_id = $1
     )
     LIMIT 20`,
    [userId]
  )
  return result.rows
}

const recordSwipe = async (swiperId, swipedId, direction) => {
  await pool.query(
    `INSERT INTO swipes (swiper_id, swiped_id, direction)
     VALUES ($1, $2, $3) ON CONFLICT DO NOTHING`,
    [swiperId, swipedId, direction]
  )
}

const checkMutualMatch = async (userA, userB) => {
  const result = await pool.query(
    `SELECT id FROM swipes
     WHERE swiper_id = $1 AND swiped_id = $2 AND direction = 'right'`,
    [userB, userA]
  )
  return result.rows.length > 0
}

const createMatch = async (userA, userB) => {
  const result = await pool.query(
    `INSERT INTO matches (user_a, user_b, status)
     VALUES ($1, $2, 'matched')
     ON CONFLICT DO NOTHING
     RETURNING *`,
    [userA, userB]
  )
  return result.rows[0]
}

const getUserMatches = async (userId) => {
  const result = await pool.query(
    `SELECT m.id, m.status, m.created_at,
            u.id as user_id, u.name, u.avatar_url, u.bio
     FROM matches m
     JOIN users u ON (
       CASE WHEN m.user_a = $1 THEN m.user_b ELSE m.user_a END = u.id
     )
     WHERE m.user_a = $1 OR m.user_b = $1
     AND m.status = 'matched'`,
    [userId]
  )
  return result.rows
}

module.exports = { getSwipeQueue, recordSwipe, checkMutualMatch, createMatch, getUserMatches }