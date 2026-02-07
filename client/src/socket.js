import { io } from 'socket.io-client'

const isProduction = import.meta.env.PROD
const socketUrl = isProduction
  ? '/' // In production, the server and UI are on the same origin
  : `http://localhost:5000` // In dev, use the IP in the browser bar

export const socket = io(socketUrl)
