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
