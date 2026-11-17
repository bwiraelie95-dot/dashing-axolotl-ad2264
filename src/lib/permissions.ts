export const roles = [
  "super-admin",
  "admin",
  "editor",
  "communication-manager",
  "program-manager",
  "finance-manager",
  "viewer",
] as const;
export type Role = (typeof roles)[number];
const editorial = [
  "articles",
  "programs",
  "pages",
  "banners",
  "media",
  "policies",
  "fieldNotes",
];
export function can(role: string, entity: string, action: string): boolean {
  if (role === "super-admin") return true;
  if (entity === "users" || entity === "siteSettings" || entity === "auditLogs")
    return false;
  if (role === "admin") return true;
  if (role === "editor") return editorial.includes(entity);
  if (role === "communication-manager")
    return ["articles", "media", "pages", "banners", "fieldNotes"].includes(
      entity,
    );
  if (role === "program-manager")
    return ["programs", "stats", "media"].includes(entity);
  if (role === "finance-manager")
    return entity === "donors" && ["read", "export"].includes(action);
  if (role === "viewer")
    return (
      action === "read" &&
      [
        ...editorial,
        "team",
        "stats",
        "partners",
        "testimonials",
        "governance",
      ].includes(entity)
    );
  return false;
}
