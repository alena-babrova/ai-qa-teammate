/**
 * Figma URL / file-key extraction from requirement text (Jira, GitLab, Confluence).
 */

const FIGMA_URL_RE =
  /https?:\/\/(?:www\.)?figma\.com\/(?:design|file)\/([A-Za-z0-9]+)[^\s)]*/gi;

/**
 * @param {string} text
 * @returns {{ figmaUrls: string[]; figmaFileKeys: string[]; figmaReadRequired: boolean }}
 */
export function extractFigmaSignals(text) {
  const urlSet = new Set();
  const keyOrder = [];
  const keySeen = new Set();

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
  }

  const figmaUrls = [...urlSet];
  const figmaFileKeys = keyOrder;
  const figmaReadRequired = figmaFileKeys.length > 0;

  return { figmaUrls, figmaFileKeys, figmaReadRequired };
}

/**
 * @param {string} token
 * @param {string} fileKey
 */
export async function figmaRestPreflightFile(token, fileKey) {
  const url = `https://api.figma.com/v1/files/${encodeURIComponent(fileKey)}`;
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
