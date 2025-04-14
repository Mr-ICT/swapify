const pool = require('../config/db')

const createDeal = async (match_id, proposed_by, description) => {
  const result = await pool.query(
    `INSERT INTO deals (match_id, proposed_by, description)
     VALUES ($1, $2, $3) RETURNING *`,
    [match_id, proposed_by, description]
  )
  return result.rows[0]
}

const getDealByMatchId = async (match_id) => {
  const result = await pool.query(
    `SELECT d.*, u.name as proposed_by_name
     FROM deals d
     JOIN users u ON u.id = d.proposed_by
     WHERE d.match_id = $1
     ORDER BY d.created_at DESC
     LIMIT 1`,
    [match_id]
  )
  return result.rows[0]
}

const getUserDeals = async (user_id) => {
  const result = await pool.query(
    `SELECT d.*, m.user_a, m.user_b,
            u.name as proposed_by_name
     FROM deals d
     JOIN matches m ON m.id = d.match_id
     JOIN users u ON u.id = d.proposed_by
     WHERE m.user_a = $1 OR m.user_b = $1
     ORDER BY d.updated_at DESC`,
    [user_id]
  )
  return result.rows
}

const updateDealStatus = async (id, status) => {
  const result = await pool.query(
    `UPDATE deals SET status = $1, updated_at = NOW()
     WHERE id = $2 RETURNING *`,
    [status, id]
  )
  return result.rows[0]
}

const getMessages = async (deal_id) => {
  const result = await pool.query(
    `SELECT m.*, u.name as sender_name, u.avatar_url as sender_avatar
     FROM messages m
     JOIN users u ON u.id = m.sender_id
     WHERE m.deal_id = $1
     ORDER BY m.created_at ASC`,
    [deal_id]
  )
  return result.rows
}

const createMessage = async (deal_id, sender_id, content) => {
  const result = await pool.query(
    `INSERT INTO messages (deal_id, sender_id, content)
     VALUES ($1, $2, $3) RETURNING *`,
    [deal_id, sender_id, content]
  )
  return result.rows[0]
}

module.exports = {
  createDeal,
  getDealByMatchId,
  getUserDeals,
  updateDealStatus,
  getMessages,
  createMessage,
}