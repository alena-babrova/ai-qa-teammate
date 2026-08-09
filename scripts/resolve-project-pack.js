/**
 * Resolves an optional project pack folder for a CI run or IDE session.
 *
 * Generic style only unless PROJECT (or legacy PROJECT_PACK) is set and
 * projects/<id>/ exists with PROJECT.md:
 * 1. Normalize input (EPMRPP → projects/EPMRPP; projects/EPMRPP accepted as-is)
 * 2. Valid pack folder → repo-relative path
 * 3. Unset input or missing/invalid folder → null (generic only)
 */

import fs from "fs";
import path from "path";

/**
 * @param {string | null | undefined} raw Workflow input, env var, or user-provided id.
 * @returns {string | null} Repo-relative pack folder candidate, or null when unset.
 */
export function normalizePackInput(raw) {
  const value = raw?.trim();
  if (!value) {
    return null;
  }
  const normalized = value.replace(/\\/g, "/").replace(/\/+$/, "");
  if (normalized.includes("..")) {
    return null;
  }
  if (normalized.startsWith("projects/")) {
    return normalized;
  }
  return `projects/${normalized}`;
}

/**
 * @param {string} root
 * @param {string} packPath Repo-relative pack folder.
 * @returns {boolean}
 */
export function isValidPackDir(root, packPath) {
  if (!packPath || packPath.includes("..")) {
    return false;
  }
  const dir = path.join(root, packPath);
  if (!fs.existsSync(dir) || !fs.statSync(dir).isDirectory()) {
    return false;
  }
  return fs.existsSync(path.join(dir, "PROJECT.md"));
}

/**
 * @param {{
 *   root: string,
 *   projectInput?: string | null,
 * }} options
 * @returns {string | null} Repo-relative pack folder, or null.
 */
export function resolveProjectPack({
  root,
  projectInput =
    process.env.PROJECT?.trim() ||
    process.env.PROJECT_PACK?.trim() ||
    null,
}) {
  const candidate = normalizePackInput(projectInput);
  if (!candidate || !isValidPackDir(root, candidate)) {
    return null;
  }
  return candidate;
}

/**
 * @param {string | null} packPath
 * @returns {string} Sentence for the CI prompt __PROJECT_PACK__ placeholder.
 */
export function formatProjectPackPrompt(packPath) {
  return packPath
    ? `\`${packPath}/\` — use **generic** \`.cursor/rules/test-case-style.mdc\` **plus** this project pack: read \`${packPath}/PROJECT.md\` (and \`CONTEXT.md\` / \`examples/\` when present); the pack **wins on conflict**`
    : "none — **generic only**: use `.cursor/rules/test-case-style.mdc` and the story's own vocabulary; no project pack for this run";
}
