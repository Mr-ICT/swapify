require('dotenv').config({ path: __dirname + '/../.env' })
const http = require('http')
const { Server } = require('socket.io')
const app = require('./app')
const { PORT, CLIENT_URL } = require('./config/env')
require('./config/db')

const server = http.createServer(app)

const io = new Server(server, {
  cors: {
    origin: CLIENT_URL,
    credentials: true,
  },
})

io.on('connection', (socket) => {
  console.log(`🔌 Socket connected: ${socket.id}`)

  socket.on('join_deal', (deal_id) => {
    socket.join(deal_id)
    console.log(`Socket ${socket.id} joined deal room: ${deal_id}`)
  })

  socket.on('send_message', ({ deal_id, message }) => {
    io.to(deal_id).emit('receive_message', message)
  })

  socket.on('disconnect', () => {
    console.log(`🔌 Socket disconnected: ${socket.id}`)
  })
})

server.listen(PORT, () => {
  console.log(`🚀 Swapify server running on port ${PORT}`)
})