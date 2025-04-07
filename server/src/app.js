const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const morgan = require('morgan')
const cookieParser = require('cookie-parser')
const { CLIENT_URL } = require('./config/env')
const errorMiddleware = require('./middleware/error.middleware')

const app = express()


// Security & parsing
app.use(helmet())
app.use(cors({
  origin: CLIENT_URL,
  credentials: true,
}))
app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

// Routes
app.use('/api/auth', require('./routes/auth.routes'))
app.use('/api/skills', require('./routes/skill.routes'))
app.use('/api/profile', require('./routes/profile.routes'))
app.use('/api/matches', require('./routes/match.routes'))

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'Swapify API running ✅' }))

// Error handler (always last)
app.use(errorMiddleware)

module.exports = app