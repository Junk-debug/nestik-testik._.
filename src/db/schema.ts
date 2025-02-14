import { pgTable, uuid, timestamp, text } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

export const linksTable = pgTable('Links', {
  id: uuid('id')
    .default(sql`gen_random_uuid()`)
    .primaryKey(),
  key: text().notNull().unique(),
  url: text().notNull().unique(),
  expiredAt: timestamp({ precision: 3, mode: 'date' }),
  createdAt: timestamp({ precision: 3, mode: 'date' })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp({ precision: 3, mode: 'date' })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull()
    .$defaultFn(() => new Date())
    .$onUpdateFn(() => new Date()),
});
