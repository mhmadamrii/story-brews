import { relations } from 'drizzle-orm'
import { integer, pgTable, text, timestamp, uuid, varchar } from 'drizzle-orm/pg-core'
import { user } from './auth'

export const storyBlocks = pgTable('story_block', {
  id: uuid('id').primaryKey().defaultRandom(),
  storyId: uuid('story_id').references(() => stories.id, { onDelete: 'cascade' }),
  userId: text('user_id').references(() => user.id, { onDelete: 'cascade' }),
  content: text('content').notNull(),
  order: integer('order').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

export const stories = pgTable('stories', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: text('user_id').references(() => user.id, { onDelete: 'cascade' }),
  title: varchar('title', { length: 255 }).notNull(),
  content: text('content'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

export const storyRelations = relations(stories, ({ many }) => ({
  blocks: many(storyBlocks),
}))

export const storyBlockRelations = relations(storyBlocks, ({ one }) => ({
  story: one(stories, {
    fields: [storyBlocks.storyId],
    references: [stories.id],
  }),
  user: one(user, {
    fields: [storyBlocks.userId],
    references: [user.id],
  }),
}))

export const userRelations = relations(user, ({ many }) => ({
  blocks: many(storyBlocks),
  stories: many(stories),
}))
