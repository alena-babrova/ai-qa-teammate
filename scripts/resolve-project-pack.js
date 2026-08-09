/**
 * Resolves which project pack folder to use for a Jira project key.
 *
 * Generic style only unless a pack is explicitly selected:
 * 1. PROJECT_PACK env / explicit override argument (per-run)
 * 2. projects/config.json → packs[<PROJECT_KEY>]
 * 3. null — `.cursor/rules/test-case-style.mdc` and the story's vocabulary only
 *
 * A folder under projects/ is never picked up automatically; add the Jira project key to config.
 */

import fs from "fs";
import path from "path";

export const CONFIG_PATH = "projects/config.json";

/**
 * @param {string} root Repo root (absolute).
 * @returns {{ packs: Record<string, string> } | null}
 */
export function loadProjectPackConfig(root) {
  const configFile = path.join(root, CONFIG_PATH);
  if (!fs.existsSync(configFile)) {
    return null;
  }
  try {
    const data = JSON.parse(fs.readFileSync(configFile, "utf8"));
    if (!data || typeof data !== "object" || Array.isArray(data)) {
      return null;
    }
    const packs = data.packs;
    if (!packs || typeof packs !== "object" || Array.isArray(packs)) {
      return { packs: {} };
    }
    /** @type {Record<string, string>} */
    const normalized = {};
    for (const [key, value] of Object.entries(packs)) {
      if (typeof key === "string" && typeof value === "string" && value.trim()) {
        normalized[key.trim()] = value.trim().replace(/\\/g, "/");
      }
    }
    return { packs: normalized };
  } catch {
    return null;
  }
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
 *   projectKey: string,
 *   envOverride?: string | null,
 *   config?: { packs: Record<string, string> } | null,
 * }} options
 * @returns {string | null} Repo-relative pack folder, or null.
 */
export function resolveProjectPack({
  root,
  projectKey,
  envOverride = process.env.PROJECT_PACK?.trim() || null,
  config = loadProjectPackConfig(root),
}) {
  const candidates = [];

  if (envOverride) {
    candidates.push(envOverride.replace(/\\/g, "/"));
  }

  const mapped = config?.packs?.[projectKey];
  if (mapped) {
    candidates.push(mapped);
  }

  for (const candidate of candidates) {
    if (isValidPackDir(root, candidate)) {
      return candidate;
    }
  }

  return null;
}

/**
 * @param {string | null} packPath
 * @returns {string} Sentence for the CI prompt __PROJECT_PACK__ placeholder.
 */
export function formatProjectPackPrompt(packPath) {
  return packPath
    ? `\`${packPath}/\` — use **generic** \`.cursor/rules/test-case-style.mdc\` **plus** this project pack: read \`${packPath}/PROJECT.md\` (and \`CONTEXT.md\` / \`examples/\` when present); the pack **wins on conflict**`
    : "none — **generic only**: use `.cursor/rules/test-case-style.mdc` and the story's own vocabulary; do not apply any project pack unless listed in `projects/config.json`";
}
