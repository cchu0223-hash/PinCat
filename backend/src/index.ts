import express from 'express'
import cors from 'cors'
import path from 'path'
import { fileURLToPath } from 'url'
import 'dotenv/config'

import imagesRouter from './routes/images.js'
import termsRouter from './routes/terms.js'
import weeksRouter from './routes/weeks.js'
import notesRouter from './routes/notes.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const app = express()
const PORT = process.env.PORT || 3001

const allowedOrigins = [
  'http://localhost:5173',
  'https://pin-cat.vercel.app',
  process.env.FRONTEND_URL,
].filter(Boolean) as string[]

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.some(o => origin.startsWith(o))) {
      callback(null, true)
    } else {
      callback(new Error(`CORS blocked: ${origin}`))
    }
  },
}))
app.use(express.json())

// API routes
app.use('/api/images', imagesRouter)
app.use('/api/terms', termsRouter)
app.use('/api/weeks', weeksRouter)
app.use('/api/notes', notesRouter)

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

app.listen(PORT, () => {
  console.log(`PinCat backend running on http://localhost:${PORT}`)
})
