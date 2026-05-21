import { getCloudflareContext } from "@opennextjs/cloudflare";

export function getDB() {
  return getCloudflareContext().env.DB;
}

export function getJWTSecret() {
  return getCloudflareContext().env.JWT_SECRET;
}
