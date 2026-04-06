#!/usr/bin/env node
/**
 * Normalizes workflow ISSUE_KEY: accepts a bare Jira key (PROJ-123) or a Jira browse URL.
 * Prints `ISSUE_KEY=<normalized>` for appending to GITHUB_ENV (GitHub Actions).
 * Env: ISSUE_KEY (raw input). Optional argv[2] overrides env for local use.
 */

const raw = (process.argv[2] || process.env.ISSUE_KEY || "").trim();

if (!raw) {
  console.error(
    "ISSUE_KEY is required: Jira issue key (e.g. PROJ-123) or a browse URL (…/browse/PROJ-123).",
  );
  process.exit(1);
}

/** @param {string} s */
function normalizeKey(s) {
  const m = String(s).trim().match(/^([A-Za-z][A-Za-z0-9_]*)-(\d+)$/);
  if (!m) return null;
  return `${m[1].toUpperCase()}-${m[2]}`;
}

/** @param {string} urlStr */
function extractFromUrl(urlStr) {
  try {
    const u = new URL(urlStr);
    const path = u.pathname.replace(/\/+$/, "");

    let m = path.match(/\/browse\/([A-Za-z][A-Za-z0-9_]*-\d+)(?:\/|$)/i);
    if (m) return normalizeKey(m[1]);

    const fromQuery =
      u.searchParams.get("selectedIssue") ||
      u.searchParams.get("issueKey") ||
      u.searchParams.get("key");
    if (fromQuery) return normalizeKey(fromQuery.trim());

    m = path.match(/\/issues\/([A-Za-z][A-Za-z0-9_]*-\d+)(?:\/|$)/i);
    if (m) return normalizeKey(m[1]);

    return null;
  } catch {
    return null;
  }
}

let key;
if (/^https?:\/\//i.test(raw)) {
  key = extractFromUrl(raw);
  if (!key) {
    console.error(
      "Could not parse a Jira issue key from the URL. Use …/browse/PROJ-123 or include selectedIssue=PROJ-123 in the query string.",
    );
    process.exit(1);
  }
} else {
  key = normalizeKey(raw);
  if (!key) {
    console.error(
      "Invalid issue key or URL. Expected PROJ-123 or a Jira browse URL containing the key.",
    );
    process.exit(1);
  }
}

console.log(`ISSUE_KEY=${key}`);
