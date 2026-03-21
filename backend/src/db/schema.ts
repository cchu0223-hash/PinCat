import { pgTable, text, varchar, timestamp, real, integer } from 'drizzle-orm/pg-core'

export const images = pgTable('images', {
  id: varchar('id', { length: 36 }).primaryKey(),
  date: varchar('date', { length: 10 }).notNull(), // YYYY-MM-DD
  weekKey: varchar('week_key', { length: 10 }).notNull(), // YYYY-Www
  imageUrl: text('image_url').notNull(),
  thumbnailUrl: text('thumbnail_url'),
  rotation: real('rotation').notNull().default(0),
  decoration: varchar('decoration', { length: 20 }).notNull().default('tape-yellow'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

export const terms = pgTable('terms', {
  id: varchar('id', { length: 36 }).primaryKey(),
  imageId: varchar('image_id', { length: 36 }).notNull().references(() => images.id, { onDelete: 'cascade' }),
  term: text('term').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

export const weekNotes = pgTable('week_notes', {
  id: varchar('id', { length: 36 }).primaryKey(),
  weekKey: varchar('week_key', { length: 10 }).notNull().unique(),
  content: text('content').notNull().default(''),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})
