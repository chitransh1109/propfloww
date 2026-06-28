const express = require('express')
const http = require('http')
const mongoose = require('mongoose')
const cors = require('cors')
const dotenv = require('dotenv')

dotenv.config()

const { notFound, errorHandler } = require('./src/middleware/errorMiddleware')

const app = express()
const httpServer = http.createServer(app) // wrap express in http server

// ── Middleware ───────────────────────────────────────────
app.use(cors())
app.use(express.json())
app.use('/uploads', express.static('uploads'))

// ── Routes ───────────────────────────────────────────────
app.use('/api/auth', require('./src/routes/authRoutes'))
app.use('/api/properties', require('./src/routes/propertyRoutes'))
// app.use('/api/leads', require('./src/routes/leadRoutes')) // removed lead routes
app.use('/api/upload', require('./src/routes/UploadRoutes'))

app.use(notFound)
app.use(errorHandler)

// ── Start ────────────────────────────────────────────────
const PORT = process.env.PORT || 8000

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected')

    httpServer.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`)
    })

    // Catch port conflicts with a clear message instead of a raw stack trace
    httpServer.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.error(
          `\n❌ Port ${PORT} is already in use.\n` +
          `   Run this to free it, then restart:\n` +
          `   kill -9 $(lsof -t -i :${PORT})\n`
        )
        process.exit(1)
      } else {
        console.error('Server error:', err)
        process.exit(1)
      }
    })
  })
  .catch((err) => {
    console.error('MongoDB connection failed:', err.message)
    process.exit(1)
  })

// ── Graceful shutdown ────────────────────────────────────
// Ensures Ctrl+C / nodemon restarts actually release the port
// instead of sometimes leaving a zombie process behind.
const shutdown = (signal) => {
  console.log(`\n${signal} received: closing server gracefully...`)
  httpServer.close(() => {
    mongoose.connection.close()
      .then(() => {
        console.log('Server and DB connection closed.')
        process.exit(0)
      })
      .catch((err) => {
        console.error('Error closing Mongoose connection:', err)
        process.exit(1)
      })
  })

  // Force-exit if something hangs for more than 5s
  setTimeout(() => {
    console.error('Forcing shutdown after timeout.')
    process.exit(1)
  }, 5000)
}

process.on('SIGINT', () => shutdown('SIGINT'))
process.on('SIGTERM', () => shutdown('SIGTERM'))