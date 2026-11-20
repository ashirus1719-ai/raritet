/**
 * The site owner: always an administrator and the only person who can grant or revoke admin rights.
 * Stored as the account id rather than an email so the public repository holds no personal data.
 * Can be overridden with the SITE_OWNER_USER_ID environment variable.
 */
export const OWNER_USER_ID = process.env.SITE_OWNER_USER_ID?.trim() || "cmwost7p70000qge7kae22wwu";

export function isOwner(userId: string | null | undefined) {
  return Boolean(userId) && userId === OWNER_USER_ID;
}
