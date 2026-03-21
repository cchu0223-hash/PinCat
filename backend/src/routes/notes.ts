import { Router } from 'express'
import { v4 as uuidv4 } from 'uuid'
import { db } from '../db/index.js'
import { weekNotes } from '../db/schema.js'
import { eq } from 'drizzle-orm'

const router = Router()

router.put('/:weekKey', async (req, res) => {
  try {
    const { weekKey } = req.params
    const { content } = req.body

    const rows = await db.select().from(weekNotes).where(eq(weekNotes.weekKey, weekKey)).limit(1)
    const existing = rows[0] ?? null

    if (existing) {
      await db
        .update(weekNotes)
        .set({ content, updatedAt: new Date() })
        .where(eq(weekNotes.weekKey, weekKey))

      res.json({ ...existing, content, updatedAt: new Date().toISOString() })
    } else {
      const id = uuidv4()
      await db.insert(weekNotes).values({
        id,
        weekKey,
        content,
        updatedAt: new Date(),
      })
      res.json({ id, weekKey, content, updatedAt: new Date().toISOString() })
    }
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Save note failed' })
  }
})

export default router
