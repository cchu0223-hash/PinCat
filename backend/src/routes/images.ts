import { Router } from 'express'
import multer from 'multer'
import path from 'path'
import { v4 as uuidv4 } from 'uuid'
import fs from 'fs/promises'
import { db } from '../db/index.js'
import { images, terms } from '../db/schema.js'
import { eq } from 'drizzle-orm'
import { generateDesignTerms } from '../lib/gemini.js'
import { dateToWeekKey } from '../lib/weekUtils.js'
import 'dotenv/config'

const router = Router()

const uploadDir = process.env.UPLOAD_DIR || './uploads'

const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    await fs.mkdir(uploadDir, { recursive: true })
    cb(null, uploadDir)
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname) || '.jpg'
    cb(null, `${uuidv4()}${ext}`)
  },
})

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true)
    } else {
      cb(new Error('Only images allowed'))
    }
  },
})

const DECORATIONS = ['tape-yellow', 'tape-blue', 'tape-washi', 'pin-red', 'pin-yellow', 'clip'] as const

// Upload image
router.post('/', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' })
    }

    const { date } = req.body
    if (!date) {
      return res.status(400).json({ error: 'Date is required' })
    }

    const imageId = uuidv4()
    const weekKey = dateToWeekKey(date)
    const rotation = (Math.random() - 0.5) * 12
    const decoration = DECORATIONS[Math.floor(Math.random() * DECORATIONS.length)]
    const backendBase = process.env.BACKEND_URL || `http://localhost:${process.env.PORT || 3001}`
    const imageUrl = `${backendBase}/api/images/file/${req.file.filename}`

    await db.insert(images).values({
      id: imageId,
      date,
      weekKey,
      imageUrl,
      rotation,
      decoration,
    })

    // Generate terms — await so response includes terms
    const imagePath = req.file.path
    let termList: { id: string; term: string; imageId: string }[] = []
    try {
      const generatedTerms = await generateDesignTerms(imagePath)
      console.log(`Generated ${generatedTerms.length} terms for image ${imageId}:`, generatedTerms)
      const termRecords = generatedTerms.map(term => ({
        id: uuidv4(),
        imageId,
        term,
      }))
      if (termRecords.length > 0) {
        await db.insert(terms).values(termRecords)
        termList = termRecords
      }
    } catch (err) {
      console.error('Failed to generate terms:', err)
    }

    const newImage = {
      id: imageId,
      date,
      weekKey,
      imageUrl,
      rotation,
      decoration,
      terms: termList,
      createdAt: new Date().toISOString(),
    }

    res.json(newImage)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Upload failed' })
  }
})

// Serve uploaded files
router.get('/file/:filename', async (req, res) => {
  try {
    const filePath = path.join(process.cwd(), uploadDir, req.params.filename)
    res.sendFile(filePath)
  } catch {
    res.status(404).json({ error: 'File not found' })
  }
})

// Delete image
router.delete('/:id', async (req, res) => {
  try {
    const imageRows = await db.select().from(images).where(eq(images.id, req.params.id)).limit(1)
    const image = imageRows[0] ?? null
    if (!image) return res.status(404).json({ error: 'Not found' })

    await db.delete(images).where(eq(images.id, req.params.id))

    // Delete file
    try {
      const filename = image.imageUrl.split('/').pop()!
      await fs.unlink(path.join(process.cwd(), uploadDir, filename))
    } catch {}

    res.json({ success: true })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Delete failed' })
  }
})

// Regenerate terms
router.post('/:id/regenerate', async (req, res) => {
  try {
    const imageRows2 = await db.select().from(images).where(eq(images.id, req.params.id)).limit(1)
    const image = imageRows2[0] ?? null
    if (!image) return res.status(404).json({ error: 'Not found' })

    const filename = image.imageUrl.split('/').pop()!
    const imagePath = path.join(process.cwd(), uploadDir, filename)

    // Delete existing terms
    await db.delete(terms).where(eq(terms.imageId, req.params.id))

    // Regenerate
    const generatedTerms = await generateDesignTerms(imagePath)
    const termRecords = generatedTerms.map(term => ({
      id: uuidv4(),
      imageId: req.params.id,
      term,
    }))
    if (termRecords.length > 0) {
      await db.insert(terms).values(termRecords)
    }

    const newTerms = await db.select().from(terms).where(eq(terms.imageId, req.params.id))

    res.json({
      ...image,
      terms: newTerms,
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Regenerate failed' })
  }
})

export default router
