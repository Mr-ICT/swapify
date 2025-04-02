require('dotenv').config({ path: __dirname + '/../.env' })
const app = require('./app')
const { PORT } = require('./config/env')
require('./config/db')

app.listen(PORT, () => {
  console.log(`🚀 Swapify server running on port ${PORT}`)
})