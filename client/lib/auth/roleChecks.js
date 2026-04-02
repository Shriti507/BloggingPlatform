/**
 * Role helpers — source of truth is `public.users.role` (viewer | author | admin).
 * Use these in API routes and UI so checks stay consistent.
 */

export function normalizeRole(raw) {
  const r = String(raw ?? "")
    .trim()
    .toLowerCase();
  if (r === "admin" || r === "author" || r === "viewer") return r;
  return "viewer";
}

export function canCreatePosts(role) {
  const r = normalizeRole(role);
  return r === "author" || r === "admin";
}

/**
 * Edit post: admin → any post; author → own posts only; viewer → never (even if row ownership matches legacy data).
 */
export function canEditPost({ role, userId, postAuthorId }) {
  const r = normalizeRole(role);
  if (r === "viewer") return false;
  if (r === "admin") return true;
  if (r === "author") {
    return Boolean(userId && postAuthorId && userId === postAuthorId);
  }
  return false;
}

export function isAdminRole(role) {
  return normalizeRole(role) === "admin";
}
