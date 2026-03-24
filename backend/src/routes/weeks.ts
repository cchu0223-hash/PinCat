import { Router } from 'express'
import { requireAuth } from '../middleware/auth.js'
import { db } from '../db/index.js'
import { images, terms, weekNotes } from '../db/schema.js'
import { eq, inArray, and } from 'drizzle-orm'
import { getWeekBounds } from '../lib/weekUtils.js'

const router = Router()

router.get('/:weekKey', requireAuth(), async (req, res) => {
  try {
    const userId = (req as any).userId as string
    const { weekKey } = req.params
    const { start, end } = getWeekBounds(weekKey)

    const weekImages = await db
      .select()
      .from(images)
      .where(and(eq(images.weekKey, weekKey), eq(images.userId, userId!)))

    const imageIds = weekImages.map(img => img.id)
    let allTerms: (typeof terms.$inferSelect)[] = []
    if (imageIds.length > 0) {
      allTerms = await db
        .select()
        .from(terms)
        .where(inArray(terms.imageId, imageIds))
    }

    const termsByImage: Record<string, (typeof terms.$inferSelect)[]> = {}
    for (const term of allTerms) {
      if (!termsByImage[term.imageId]) termsByImage[term.imageId] = []
      termsByImage[term.imageId].push(term)
    }

    const imageEntries = weekImages.map(img => ({
      id: img.id,
      date: img.date,
      imageUrl: img.imageUrl,
      rotation: img.rotation,
      decoration: img.decoration,
      terms: (termsByImage[img.id] || []).map(t => ({
        id: t.id,
        term: t.term,
        imageId: t.imageId,
      })),
      createdAt: img.createdAt.toISOString(),
    }))

    const noteRows = await db
      .select()
      .from(weekNotes)
      .where(and(eq(weekNotes.weekKey, weekKey), eq(weekNotes.userId, userId!)))
      .limit(1)
    const note = noteRows[0] ?? null

    const [, weekPart] = weekKey.split('-W')

    res.json({
      weekKey,
      weekNumber: parseInt(weekPart),
      startDate: start,
      endDate: end,
      images: imageEntries,
      note: note
        ? {
            id: note.id,
            weekKey: note.weekKey,
            content: note.content,
            updatedAt: note.updatedAt.toISOString(),
          }
        : null,
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to fetch week data' })
  }
})

export default router
