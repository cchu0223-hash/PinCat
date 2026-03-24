import { Router } from 'express'
import { requireAuth } from '../middleware/auth.js'
import { v4 as uuidv4 } from 'uuid'
import { db } from '../db/index.js'
import { weekNotes } from '../db/schema.js'
import { eq, and } from 'drizzle-orm'

const router = Router()

router.put('/:weekKey', requireAuth(), async (req, res) => {
  try {
    const userId = (req as any).userId as string
    const { weekKey } = req.params
    const { content } = req.body

    const rows = await db.select().from(weekNotes)
      .where(and(eq(weekNotes.weekKey, weekKey), eq(weekNotes.userId, userId!)))
      .limit(1)
    const existing = rows[0] ?? null

    if (existing) {
      await db
        .update(weekNotes)
        .set({ content, updatedAt: new Date() })
        .where(and(eq(weekNotes.weekKey, weekKey), eq(weekNotes.userId, userId!)))
      res.json({ ...existing, content, updatedAt: new Date().toISOString() })
    } else {
      const id = uuidv4()
      await db.insert(weekNotes).values({ id, userId: userId!, weekKey, content, updatedAt: new Date() })
      res.json({ id, weekKey, content, updatedAt: new Date().toISOString() })
    }
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Save note failed' })
  }
})

export default router
