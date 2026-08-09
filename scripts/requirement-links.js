/**
 * Link extraction for story requirements. Hosts are derived from configuration
 * (GITLAB_API_URL / CONFLUENCE_URL) so no instance is hardcoded; when a host is unknown the
 * patterns fall back to shape-based matching.
 */

/** @param {string} value */
function escapeRe(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * @param {string | undefined | null} url e.g. https://gitlab.example.com/api/v4
 * @returns {string | null} host, or null when the URL is unusable
 */
export function hostFromUrl(url) {
  const trimmed = url?.trim();
  if (!trimmed) return null;
  try {
    const withProto = trimmed.includes("://") ? trimmed : `https://${trimmed}`;
    return new URL(withProto).host;
  } catch {
    return null;
  }
}

/** @param {string | null} host */
function hostPattern(host) {
  return host ? escapeRe(host) : "[^\\s/)]+";
}

/** @param {string} url */
function trimTrailingPunctuation(url) {
  return url.replace(/[).,]+$/, "");
}

/**
 * Matches `/-/blob/` URLs, including nested subgroups (group/subgroup/project).
 * @param {string} text
 * @param {string | null} host
 * @returns {string[]} unique URLs
 */
export function gitLabBlobUrls(text, host) {
  const re = new RegExp(
    `https?://${hostPattern(host)}/[^\\s?#)]+?/-/blob/[^/\\s?#)]+/[^\\s)]+`,
    "gi",
  );
  const urls = new Set();
  for (const match of text.matchAll(re)) {
    urls.add(trimTrailingPunctuation(match[0]));
  }
  return [...urls];
}

/**
 * @param {string} url
 * @param {string | null} host
 * @returns {{ projectPath: string, ref: string, filePath: string } | null}
 */
export function parseGitLabBlobUrl(url, host) {
  const re = new RegExp(
    `^https?://${hostPattern(host)}/(.+?)/-/blob/([^/?#]+)/(.+?)(?:\\?[^#]*)?(?:#.*)?$`,
    "i",
  );
  const m = url.match(re);
  if (!m) return null;
  return {
    projectPath: m[1],
    ref: m[2],
    filePath: decodeURIComponent(m[3]),
  };
}

/**
 * True when the description contains nothing but GitLab links (the requirements live there).
 * @param {string} text
 * @param {string | null} host
 */
export function isGitLabOnlyDescription(text, host) {
  const trimmed = text.trim();
  if (!trimmed) return false;
  const re = new RegExp(`https?://${hostPattern(host)}/[^\\s)]+`, "gi");
  const withoutUrls = host
    ? trimmed.replace(re, "").trim()
    : trimmed.replace(/https?:\/\/[^\s)]*\/-\/blob\/[^\s)]+/gi, "").trim();
  return withoutUrls === "";
}

/**
 * Matches Confluence page URLs (`…/pages/<id>`). Without a configured host, only URLs that also
 * look like Confluence (`/spaces/`, `/wiki/`, or a `confluence` host) are accepted.
 * @param {string} text
 * @param {string | null} host
 * @returns {string[]} unique URLs
 */
export function confluencePageUrls(text, host) {
  const re = new RegExp(
    `https?://${hostPattern(host)}[^\\s)]*/pages/\\d+[^\\s)]*`,
    "gi",
  );
  const urls = new Set();
  for (const match of text.matchAll(re)) {
    const url = trimTrailingPunctuation(match[0]);
    if (host || /\/spaces\/|\/wiki\/|confluence/i.test(url)) {
      urls.add(url);
    }
  }
  return [...urls];
}

/** @param {string} url */
export function confluencePageIdFromUrl(url) {
  const m = url.match(/\/pages\/(\d+)/);
  return m ? m[1] : null;
}
