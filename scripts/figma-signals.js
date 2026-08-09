/**
 * Figma URL / file-key extraction from requirement text (Jira, GitLab, Confluence).
 */

const FIGMA_URL_RE =
  /https?:\/\/(?:www\.)?figma\.com\/(?:design|file)\/([A-Za-z0-9]+)[^\s)]*/gi;

/**
 * @param {string} figmaUrl
 * @returns {string | null} API node id (e.g. "19210:4980") or null
 */
export function figmaNodeIdFromUrl(figmaUrl) {
  const m = figmaUrl.match(/[?&]node-id=([^&\s)]+)/i);
  if (!m) return null;
  return decodeURIComponent(m[1]).replace(/-/g, ":");
}

/**
 * Build a lightweight Figma REST URL for CI preflight (avoids full-file 400s on large files).
 *
 * @param {string} fileKey
 * @param {string[]} [nodeIds]
 * @returns {string}
 */
export function buildFigmaPreflightUrl(fileKey, nodeIds = []) {
  const encoded = encodeURIComponent(fileKey);
  if (nodeIds.length > 0) {
    const params = new URLSearchParams();
    params.set("ids", nodeIds.join(","));
    params.set("depth", "1");
    return `https://api.figma.com/v1/files/${encoded}/nodes?${params}`;
  }
  const params = new URLSearchParams({ depth: "1" });
  return `https://api.figma.com/v1/files/${encoded}?${params}`;
}

/**
 * @param {string} text
 * @returns {{
 *   figmaUrls: string[];
 *   figmaFileKeys: string[];
 *   figmaNodeIdsByFileKey: Record<string, string[]>;
 *   figmaReadRequired: boolean;
 * }}
 */
export function extractFigmaSignals(text) {
  const urlSet = new Set();
  const keyOrder = [];
  const keySeen = new Set();
  /** @type {Map<string, string[]>} */
  const nodesByKey = new Map();

  let m;
  FIGMA_URL_RE.lastIndex = 0;
  while ((m = FIGMA_URL_RE.exec(text)) !== null) {
    const raw = m[0].replace(/[).,]+$/, "");
    urlSet.add(raw);
    const fileKey = m[1];
    if (fileKey && !keySeen.has(fileKey)) {
      keySeen.add(fileKey);
      keyOrder.push(fileKey);
    }
    const nodeId = figmaNodeIdFromUrl(raw);
    if (fileKey && nodeId) {
      const list = nodesByKey.get(fileKey) ?? [];
      if (!list.includes(nodeId)) list.push(nodeId);
      nodesByKey.set(fileKey, list);
    }
  }

  const figmaUrls = [...urlSet];
  const figmaFileKeys = keyOrder;
  const figmaNodeIdsByFileKey = Object.fromEntries(nodesByKey);
  const figmaReadRequired = figmaFileKeys.length > 0;

  return { figmaUrls, figmaFileKeys, figmaNodeIdsByFileKey, figmaReadRequired };
}

/**
 * @param {string} token
 * @param {string} fileKey
 * @param {string[]} [nodeIds] from linked Figma URLs (node-id query param)
 */
export async function figmaRestPreflightFile(token, fileKey, nodeIds = []) {
  const url = buildFigmaPreflightUrl(fileKey, nodeIds);
  const res = await fetch(url, {
    headers: { "X-Figma-Token": token },
  });
  const text = await res.text();
  let body;
  try {
    body = text ? JSON.parse(text) : null;
  } catch {
    body = null;
  }
  if (!res.ok) {
    const err = body?.err || body?.message || text?.slice(0, 200) || res.statusText;
    throw new Error(`Figma API HTTP ${res.status} for file ${fileKey}: ${err}`);
  }
  return body;
}
