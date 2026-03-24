import { Router } from 'express'
import { requireAuth } from '../middleware/auth.js'
import { db } from '../db/index.js'
import { terms } from '../db/schema.js'
import { eq } from 'drizzle-orm'

const router = Router()

router.delete('/:id', requireAuth(), async (req, res) => {
  try {
    await db.delete(terms).where(eq(terms.id, req.params.id))
    res.json({ success: true })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Delete failed' })
  }
})

export default router
