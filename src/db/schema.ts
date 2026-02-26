// src/db/schema.ts
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

// Subscribers Table
export const subscribers = sqliteTable('subscribers', {
  userId: integer('user_id').primaryKey(),
  role: text('role', { enum: ['admin', 'tester', 'user'] }).notNull().default('user'),
  joinedAt: integer('joined_at', { mode: 'timestamp' }).notNull().default(sql`(strftime('%s', 'now'))`),
});

// Events Table
export const events = sqliteTable('events', {
  id: text('id').primaryKey(), // UUID stored as text
  jalaliMonth: integer('jalali_month').notNull(),
  jalaliDay: integer('jalali_day').notNull(),
  contentTitle: text('content_title').notNull(),
  contentText: text('content_text').notNull(),
  historicalYear: text('historical_year').notNull(),
  imageUrl: text('image_url'),
  isApproved: integer('is_approved', { mode: 'boolean' }).notNull().default(false),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`(strftime('%s', 'now'))`),
});