import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const appEvents = pgTable("app_events", {
  id: serial("id").primaryKey(),
  eventType: text("event_type").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
