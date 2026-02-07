import express from 'express'
import http from 'http'
import { Server } from 'socket.io'
import cors from 'cors'
import { getSystemMetrics } from './services/system.service.js'
import path from 'path'
import dotenv from 'dotenv'

dotenv.config()

const app = express()
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
  }),
)

const __dirname = path.resolve()
const server = http.createServer(app)
const io = new Server(server, { cors: { origin: '*' } })
const PORT = process.env.PORT || 5000

io.on('connection', (socket) => {
  console.log('User connected:', socket.id)

  // Use a single interval to fetch and emit all data
  const metricsInterval = setInterval(async () => {
    const data = await getSystemMetrics()
    if (!data) return

    // Emitting specific channels to match your current frontend logic
    socket.emit('cpu_update', data.cpu)
    socket.emit('memory_update', data.memory)
    socket.emit('disk_layout_update', data.diskLayout)
    socket.emit('block_devices_update', data.blockDevices)
    socket.emit('fs_size_update', data.fsSize)
    socket.emit('fs_state_update', data.fsStats)
    socket.emit('disk_io_update', data.diskIO)
    socket.emit('network_update', data.network)
  }, 1000)

  socket.on('disconnect', () => {
    clearInterval(metricsInterval)
    console.log('User disconnected:', socket.id)
  })
})

if (process.env.NODE_ENV === 'production') {
  const clientBuildPath = path.join(__dirname, '..', 'client', 'dist')

  app.use(express.static(clientBuildPath))

  app.get('/{*any}', (req, res) => {
    res.sendFile(path.join(clientBuildPath, 'index.html'))
  })
}

const startServer = async () => {
  try {
    server.listen(PORT, () => {
      console.log(`Server is running on the port: ${PORT}`)
    })
  } catch (error) {
    console.log(`Error starting the server: ${error}`)
  }
}

startServer()
