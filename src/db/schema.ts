import { relations } from "drizzle-orm";
import { integer, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

// 1. Users table (Primary key maps internal ID, references Firebase Auth UID)
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  uid: text("uid").notNull().unique(), // Firebase Auth UID
  email: text("email").notNull(),
  role: text("role").default("user").notNull(), // 'admin', 'developer', 'user'
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// 2. Plans table
export const plans = pgTable("plans", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  title: text("title").notNull(),
  goal: text("goal").notNull(),
  status: text("status").default("draft").notNull(), // 'draft', 'active', 'completed', 'archived'
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// 3. Tasks table
export const tasks = pgTable("tasks", {
  id: serial("id").primaryKey(),
  planId: integer("plan_id").references(() => plans.id, { onDelete: "cascade" }).notNull(),
  name: text("name").notNull(),
  status: text("status").default("todo").notNull(), // 'todo', 'in_progress', 'completed', 'failed'
  priority: text("priority").default("medium").notNull(), // 'low', 'medium', 'high'
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// 4. Builds table
export const builds = pgTable("builds", {
  id: serial("id").primaryKey(),
  taskId: integer("task_id").references(() => tasks.id, { onDelete: "cascade" }).notNull(),
  filesJson: text("files_json").notNull(), // JSON block of generated structure/files
  status: text("status").default("queued").notNull(), // 'queued', 'building', 'success', 'failed'
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Relations Definitions
export const usersRelations = relations(users, ({ many }) => ({
  plans: many(plans),
}));

export const plansRelations = relations(plans, ({ one, many }) => ({
  user: one(users, { fields: [plans.userId], references: [users.id] }),
  tasks: many(tasks),
}));

export const tasksRelations = relations(tasks, ({ one, many }) => ({
  plan: one(plans, { fields: [tasks.planId], references: [plans.id] }),
  builds: many(builds),
}));

export const buildsRelations = relations(builds, ({ one }) => ({
  task: one(tasks, { fields: [builds.taskId], references: [tasks.id] }),
}));
