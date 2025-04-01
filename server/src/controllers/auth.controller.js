const bcrypt = require('bcryptjs')
const pool = require('../config/db')
const { generateAccessToken, generateRefreshToken, verifyRefreshToken } = require('../utils/jwt.utils')

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
}

// @route POST /api/auth/register
const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'All fields are required' })
    }

    const existing = await pool.query('SELECT id FROM users WHERE email = $1', [email])
    if (existing.rows.length > 0) {
      return res.status(409).json({ success: false, message: 'Email already in use' })
    }

    const hashed = await bcrypt.hash(password, 12)

    const result = await pool.query(
      'INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING id, name, email',
      [name, email, hashed]
    )

    const user = result.rows[0]
    const accessToken = generateAccessToken({ id: user.id, email: user.email })
    const refreshToken = generateRefreshToken({ id: user.id, email: user.email })

    res
      .cookie('access_token', accessToken, { ...cookieOptions, maxAge: 15 * 60 * 1000 })
      .cookie('refresh_token', refreshToken, { ...cookieOptions, maxAge: 7 * 24 * 60 * 60 * 1000 })
      .status(201)
      .json({ success: true, user })
  } catch (err) {
    next(err)
  }
}

// @route POST /api/auth/login
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'All fields are required' })
    }

    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email])
    const user = result.rows[0]

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' })
    }

    const match = await bcrypt.compare(password, user.password_hash)
    if (!match) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' })
    }

    const accessToken = generateAccessToken({ id: user.id, email: user.email })
    const refreshToken = generateRefreshToken({ id: user.id, email: user.email })

    res
      .cookie('access_token', accessToken, { ...cookieOptions, maxAge: 15 * 60 * 1000 })
      .cookie('refresh_token', refreshToken, { ...cookieOptions, maxAge: 7 * 24 * 60 * 60 * 1000 })
      .status(200)
      .json({ success: true, user: { id: user.id, name: user.name, email: user.email } })
  } catch (err) {
    next(err)
  }
}

// @route POST /api/auth/refresh
const refresh = async (req, res, next) => {
  try {
    const token = req.cookies.refresh_token
    if (!token) return res.status(401).json({ success: false, message: 'No refresh token' })

    const decoded = verifyRefreshToken(token)
    const accessToken = generateAccessToken({ id: decoded.id, email: decoded.email })

    res
      .cookie('access_token', accessToken, { ...cookieOptions, maxAge: 15 * 60 * 1000 })
      .status(200)
      .json({ success: true, message: 'Token refreshed' })
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Invalid refresh token' })
  }
}

// @route POST /api/auth/logout
const logout = (req, res) => {
  res
    .clearCookie('access_token')
    .clearCookie('refresh_token')
    .status(200)
    .json({ success: true, message: 'Logged out' })
}

module.exports = { register, login, refresh, logout }