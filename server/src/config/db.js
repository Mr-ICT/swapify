const { Pool } = require('pg')
const { DB_URL } = require('./env')

const pool = new Pool({
  connectionString: DB_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
})

pool.on('connect', () => console.log('📦 Database connected'))
pool.on('error', (err) => console.error('Database error:', err))

module.exports = pool