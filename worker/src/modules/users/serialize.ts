import type { User } from "../../db/schema-core";

/** Public shape of a user. Never include internal flags or identifiers beyond what the UI needs. */
export function publicUser(u: User) {
  return {
    id: u.id,
    email: u.email,
    name: u.name,
    avatarUrl: u.avatarUrl,
    role: u.role,
    country: u.country,
    timezone: u.timezone,
    createdAt: u.createdAt,
  };
}
