import http from 'http'
import express from 'express'
import IO from 'socket.io'
import { Nuxt, Builder } from 'nuxt'

// Import and Set Nuxt.js options
const config = require('../nuxt.config.js')
config.dev = process.env.NODE_ENV !== 'production'

async function start() {
  const app = express()
  const server = http.createServer(app)
  const io = IO(server)
  // Init Nuxt.js
  const nuxt = new Nuxt(config)

  const { host, port } = nuxt.options.server

  await nuxt.ready()
  // Build only in dev mode
  if (config.dev) {
    const builder = new Builder(nuxt)
    await builder.build()
  }

  app.use(express.json())
  app.use(express.urlencoded({ extended: false }))
  io.on('connection', (socket) => {
    console.log('connected')
    socket.on('chat-message', (msg) => {
      console.log('chat-message', msg)
      socket.broadcast.emit('chat-message', msg)
    })
  })
  // // Give nuxt middleware to express
  app.use(nuxt.render)

  // Listen the server
  server.listen(port, host)
}
start()
