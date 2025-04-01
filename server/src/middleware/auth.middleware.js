const { verifyAccessToken } = require('../utils/jwt.utils')

const protect = (req, res, next) => {
  try {
    const token = req.cookies.access_token

    if (!token) {
      return res.status(401).json({ success: false, message: 'Unauthorized' })
    }

    const decoded = verifyAccessToken(token)
    req.user = decoded
    next()
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Invalid or expired token' })
  }
}

module.exports = { protect }