/**
 * Drizzle mirror of migrations/core/*.sql. SQL migrations are the source of truth;
 * worker/test/schema.test.ts verifies this mirror against the migrated database.
 */
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  email: text("email").notNull(),
  emailVerified: integer("email_verified", { mode: "boolean" }).notNull().default(false),
  name: text("name"),
  avatarUrl: text("avatar_url"),
  role: text("role", { enum: ["user", "admin"] })
    .notNull()
    .default("user"),
  country: text("country"),
  timezone: text("timezone"),
  createdAt: integer("created_at").notNull(),
  updatedAt: integer("updated_at").notNull(),
});

export const oauthAccounts = sqliteTable("oauth_accounts", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull(),
  provider: text("provider", { enum: ["google"] }).notNull(),
  providerUserId: text("provider_user_id").notNull(),
  email: text("email"),
  createdAt: integer("created_at").notNull(),
  updatedAt: integer("updated_at").notNull(),
});

export const sessions = sqliteTable("sessions", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull(),
  createdAt: integer("created_at").notNull(),
  expiresAt: integer("expires_at").notNull(),
  lastSeenAt: integer("last_seen_at").notNull(),
  userAgent: text("user_agent"),
  country: text("country"),
});

export const googleConnections = sqliteTable("google_connections", {
  userId: text("user_id").primaryKey(),
  scopes: text("scopes").notNull(),
  refreshTokenCiphertext: text("refresh_token_ciphertext").notNull(),
  wrappedDataKey: text("wrapped_data_key").notNull(),
  keyVersion: integer("key_version").notNull().default(1),
  historyId: text("history_id"),
  connectedAt: integer("connected_at").notNull(),
  revokedAt: integer("revoked_at"),
});

export const files = sqliteTable("files", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull(),
  kind: text("kind", { enum: ["resume"] }).notNull(),
  r2Key: text("r2_key").notNull(),
  filename: text("filename").notNull(),
  contentType: text("content_type").notNull(),
  sizeBytes: integer("size_bytes").notNull(),
  sha256: text("sha256").notNull(),
  createdAt: integer("created_at").notNull(),
});

export const automationSettings = sqliteTable("automation_settings", {
  userId: text("user_id").primaryKey(),
  paused: integer("paused", { mode: "boolean" }).notNull().default(false),
  followupsEnabled: integer("followups_enabled", { mode: "boolean" }).notNull().default(true),
  dailyCap: integer("daily_cap").notNull().default(20),
  updatedAt: integer("updated_at").notNull(),
});

export const auditLog = sqliteTable("audit_log", {
  id: text("id").primaryKey(),
  userId: text("user_id"),
  action: text("action").notNull(),
  target: text("target"),
  metadata: text("metadata"),
  createdAt: integer("created_at").notNull(),
});

export const events = sqliteTable("events", {
  id: text("id").primaryKey(),
  userId: text("user_id"),
  name: text("name").notNull(),
  props: text("props"),
  createdAt: integer("created_at").notNull(),
});

export type User = typeof users.$inferSelect;
export type FileRow = typeof files.$inferSelect;
