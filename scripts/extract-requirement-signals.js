#!/usr/bin/env node
/**
 * Fetches Jira story text + linked GitLab requirement files; detects GA coverage signals.
 * Writes generated/jira-tests/<STORY_KEY>/requirement-signals.json for CI agent + verify.
 *
 * Env: STORY_KEY, JIRA_URL, JIRA_USERNAME, JIRA_API_TOKEN
 * Optional: CONFLUENCE_URL, CONFLUENCE_API_TOKEN, CONFLUENCE_USER_EMAIL
 * Required when Jira description contains git.epam.com /-/blob/ links: GITLAB_API_URL, GITLAB_PERSONAL_ACCESS_TOKEN
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { createJiraClient } from "./jira-client.js";
import { extractFigmaSignals } from "./figma-signals.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

const GITLAB_BLOB_RE =
  /https?:\/\/git\.epam\.com\/([^/\s]+)\/([^/\s]+)\/-\/blob\/([^/\s#]+)\/([^\s)]+)/gi;
const CONFLUENCE_PAGE_RE =
  /https?:\/\/[^\s)]*(?:kb\.epam\.com|confluence\.[^\s/]+)\/spaces\/[^/]+\/pages\/(\d+)[^\s)]*/gi;

/** @param {unknown} desc */
function descriptionToPlainText(desc) {
  if (desc == null) return "";
  if (typeof desc === "string") return desc;
  if (typeof desc === "object" && desc !== null) {
    /** @type {{ content?: unknown[] }} */
    const doc = desc;
    if (Array.isArray(doc.content)) {
      return extractAdfText(doc.content);
    }
  }
  return String(desc);
}

/** @param {unknown[]} nodes */
function extractAdfText(nodes) {
  let out = "";
  for (const node of nodes) {
    if (!node || typeof node !== "object") continue;
    const n = /** @type {{ type?: string; text?: string; content?: unknown[]; attrs?: { url?: string } }} */ (
      node
    );
    if (n.type === "text" && n.text) out += n.text;
    if (n.type === "inlineCard" && n.attrs?.url) out += ` ${n.attrs.url} `;
    if (n.type === "hardBreak") out += "\n";
    if (Array.isArray(n.content)) out += extractAdfText(n.content);
  }
  return out;
}

/** @param {string} text */
function uniqueGitLabBlobUrls(text) {
  const urls = new Set();
  let m;
  GITLAB_BLOB_RE.lastIndex = 0;
  while ((m = GITLAB_BLOB_RE.exec(text)) !== null) {
    urls.add(m[0].replace(/[).,]+$/, ""));
  }
  return [...urls];
}

/** @param {string} url */
function parseGitLabBlobUrl(url) {
  const re =
    /https?:\/\/git\.epam\.com\/([^/]+)\/([^/]+)\/-\/blob\/([^/?#]+)\/(.+?)(?:\?[^#]*)?(?:#.*)?$/i;
  const m = url.match(re);
  if (!m) return null;
  return {
    projectPath: `${m[1]}/${m[2]}`,
    ref: m[3],
    filePath: decodeURIComponent(m[4]),
  };
}

/** @param {string} url @param {number} index */
function gitlabContentFilename(url, index) {
  const parsed = parseGitLabBlobUrl(url);
  if (!parsed) return `gitlab-requirement-${index + 1}.md`;
  const base = path.basename(parsed.filePath, path.extname(parsed.filePath));
  const safe = base.replace(/[^\w.-]+/g, "_").replace(/_+/g, "_").replace(/^_|_$/g, "");
  return `${safe || `gitlab-requirement-${index + 1}`}.md`;
}

/** @param {string} text */
function uniqueConfluencePageUrls(text) {
  const urls = new Set();
  let m;
  CONFLUENCE_PAGE_RE.lastIndex = 0;
  while ((m = CONFLUENCE_PAGE_RE.exec(text)) !== null) {
    urls.add(m[0].replace(/[).,]+$/, ""));
  }
  return [...urls];
}

/** @param {string} url */
function confluencePageIdFromUrl(url) {
  const m = url.match(/\/pages\/(\d+)/);
  return m ? m[1] : null;
}

/**
 * @param {string} apiBase e.g. https://git.epam.com/api/v4
 * @param {string} token
 * @param {string} blobUrl
 */
async function fetchGitLabRawFile(apiBase, token, blobUrl) {
  const parsed = parseGitLabBlobUrl(blobUrl);
  if (!parsed) throw new Error(`Unrecognized GitLab blob URL: ${blobUrl}`);
  const project = encodeURIComponent(parsed.projectPath);
  const filePath = encodeURIComponent(parsed.filePath);
  const url = `${apiBase.replace(/\/+$/, "")}/projects/${project}/repository/files/${filePath}/raw?ref=${encodeURIComponent(parsed.ref)}`;
  const headers = { Accept: "text/plain" };
  if (token) headers["PRIVATE-TOKEN"] = token;
  const res = await fetch(url, { headers });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`GitLab ${res.status} for ${parsed.filePath}: ${body.slice(0, 200)}`);
  }
  return res.text();
}

/**
 * @param {string} baseUrl Confluence root
 * @param {string} email
 * @param {string} token
 * @param {string} pageId
 */
async function fetchConfluencePage(baseUrl, email, token, pageId) {
  const base = baseUrl.replace(/\/+$/, "");
  const url = `${base}/rest/api/content/${pageId}?expand=body.storage`;
  const auth = Buffer.from(`${email}:${token}`, "utf8").toString("base64");
  const res = await fetch(url, {
    headers: { Authorization: `Basic ${auth}`, Accept: "application/json" },
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Confluence ${res.status} page ${pageId}: ${body.slice(0, 200)}`);
  }
  const json = await res.json();
  const html = json?.body?.storage?.value;
  return typeof html === "string" ? stripHtml(html) : "";
}

/** @param {string} html */
function stripHtml(html) {
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** @param {string} combined */
function detectGaSignals(combined) {
  const lower = combined.toLowerCase();
  const gaCoverageRequired =
    /analytics\s*\(ga4\)/i.test(combined) ||
    /acceptance\s*\(analytics\)/i.test(combined) ||
    /ga4\s+event/i.test(combined) ||
    /ga4\s*[–-]\s*plugins/i.test(combined) ||
    (lower.includes("page_view") && /event\s*#?\s*\d+/i.test(combined)) ||
    (lower.includes("ga4") && lower.includes("collect"));

  /** @type {string[]} */
  const gaHints = [];
  const placeMarkdown = combined.match(/`place`:\*\*\s*`([a-z0-9_]+)`/i);
  const placeBacktick = combined.match(/`place`:\s*`([^`]+)`/i);
  const placeBold = combined.match(/\*\*place:\*\*\s*`([^`]+)`/i);
  const placeInline = combined.match(/place:\s*`([a-z0-9_]+)`/i);
  const placePlain = combined.match(/\bplace:\s*([a-z][a-z0-9_]+)\b/i);
  const place =
    placeMarkdown?.[1] ||
    placeBacktick?.[1] ||
    placeBold?.[1] ||
    placeInline?.[1] ||
    placePlain?.[1];
  if (place) gaHints.push(`place:${place}`);

  const event17 = /event\s*#?\s*17/i.test(combined) && /page_view/i.test(combined);
  if (event17) gaHints.push("event_17_page_view");

  if (/`category`:\s*`plugins`/i.test(combined) || /\*\*category:\*\*\s*`plugins`/i.test(combined)) {
    gaHints.push("category:plugins");
  }

  return { gaCoverageRequired, gaHints: [...new Set(gaHints)] };
}

/** @param {string} text */
function isGitLabOnlyDescription(text) {
  const trimmed = text.trim();
  if (!trimmed) return false;
  const withoutUrls = trimmed.replace(/https?:\/\/git\.epam\.com\/[^\s)]+/gi, "").trim();
  return withoutUrls === "";
}

/**
 * @param {string} outPath
 * @param {Record<string, unknown>} payload
 */
function failRequirementsRead(outPath, payload) {
  const body = { requirementsReadFailed: true, ...payload };
  fs.writeFileSync(outPath, `${JSON.stringify(body, null, 2)}\n`, "utf8");
  const reason =
    typeof body.failureReason === "string" ? body.failureReason : "Requirements read failed";
  console.error(`::error::${reason}`);
  console.error(reason);
  process.exit(1);
}

async function main() {
  const storyKey = process.env.STORY_KEY?.trim() || process.argv[2]?.trim();
  const baseUrl = process.env.JIRA_URL?.replace(/\/+$/, "");
  const email = process.env.JIRA_USERNAME;
  const apiToken = process.env.JIRA_API_TOKEN;
  const gitlabApi = process.env.GITLAB_API_URL?.trim();
  const gitlabToken = process.env.GITLAB_PERSONAL_ACCESS_TOKEN?.trim();
  const confluenceUrl = process.env.CONFLUENCE_URL?.trim();
  const confluenceToken =
    process.env.CONFLUENCE_API_TOKEN?.trim() || process.env.CONFLUENCE_PERSONAL_TOKEN?.trim();
  const confluenceEmail =
    process.env.CONFLUENCE_USER_EMAIL?.trim() || process.env.CONFLUENCE_USERNAME?.trim();

  if (!storyKey) {
    console.error("STORY_KEY env or argv required");
    process.exit(1);
  }
  if (!baseUrl || !email || !apiToken) {
    console.error("Set JIRA_URL, JIRA_USERNAME, JIRA_API_TOKEN");
    process.exit(1);
  }

  const outDir = path.join(root, "generated", "jira-tests", storyKey);
  fs.mkdirSync(outDir, { recursive: true });
  const outPath = path.join(outDir, "requirement-signals.json");

  const client = createJiraClient({ baseUrl, email, apiToken });
  const issue = await client.getIssue(storyKey, ["description"]);
  const jiraText = descriptionToPlainText(issue?.fields?.description);

  /** @type {string[]} */
  const sources = ["jira:description"];
  let combined = jiraText;

  const gitlabUrls = uniqueGitLabBlobUrls(jiraText);
  const gitlabOnly = isGitLabOnlyDescription(jiraText);
  /** @type {string[]} paths relative to outDir */
  const gitlabContentFiles = [];

  if (gitlabUrls.length > 0) {
    if (!gitlabApi || !gitlabToken) {
      const missing = [
        !gitlabApi && "GITLAB_API_URL (Actions variable vars.GITLAB_API_URL, e.g. https://git.epam.com/api/v4)",
        !gitlabToken &&
          "GITLAB_PERSONAL_ACCESS_TOKEN (Actions secret secrets.GITLAB_PERSONAL_ACCESS_TOKEN)",
      ].filter(Boolean);
      failRequirementsRead(outPath, {
        storyKey,
        gaCoverageRequired: false,
        gaHints: [],
        sources,
        gitlabUrls,
        gitlabOnlyDescription: gitlabOnly,
        gitlabContentFiles,
        failureReason: `Jira description links GitLab requirement file(s) but missing: ${missing.join("; ")}`,
      });
    }
    const linkedReqDir = path.join(outDir, "linked-requirements");
    fs.mkdirSync(linkedReqDir, { recursive: true });
    for (let i = 0; i < gitlabUrls.length; i++) {
      const url = gitlabUrls[i];
      try {
        const body = await fetchGitLabRawFile(gitlabApi, gitlabToken, url);
        combined += `\n\n${body}`;
        sources.push(`gitlab:${url}`);
        const filename = gitlabContentFilename(url, i);
        const relativePath = path.join("linked-requirements", filename);
        const filePath = path.join(outDir, relativePath);
        const header = `<!-- source: ${url} -->\n\n`;
        fs.writeFileSync(filePath, `${header}${body}\n`, "utf8");
        gitlabContentFiles.push(relativePath.replace(/\\/g, "/"));
      } catch (e) {
        failRequirementsRead(outPath, {
          storyKey,
          gaCoverageRequired: false,
          gaHints: [],
          sources,
          gitlabUrls,
          gitlabOnlyDescription: gitlabOnly,
          gitlabContentFiles,
          failureReason: `Failed to read GitLab requirements: ${e.message || e}`,
        });
      }
    }
  }

  const nestedConfluenceUrls = uniqueConfluencePageUrls(combined);
  if (confluenceUrl && confluenceToken && confluenceEmail && nestedConfluenceUrls.length > 0) {
    const seenIds = new Set();
    for (const pageUrl of nestedConfluenceUrls) {
      const pageId = confluencePageIdFromUrl(pageUrl);
      if (!pageId || seenIds.has(pageId)) continue;
      seenIds.add(pageId);
      try {
        const body = await fetchConfluencePage(confluenceUrl, confluenceEmail, confluenceToken, pageId);
        combined += `\n\n${body}`;
        sources.push(`confluence:${pageId}`);
      } catch (e) {
        console.error(`Confluence fetch skipped for ${pageId}: ${e.message || e}`);
      }
    }
  }

  const { gaCoverageRequired, gaHints } = detectGaSignals(combined);
  const { figmaUrls, figmaFileKeys, figmaReadRequired } = extractFigmaSignals(combined);

  const figmaToken = process.env.FIGMA_API_KEY?.trim();

  if (figmaReadRequired && !figmaToken) {
    failRequirementsRead(outPath, {
      storyKey,
      gaCoverageRequired,
      gaHints,
      sources,
      failureReason:
        "Requirements include Figma link(s) but FIGMA_API_KEY is unset; cannot run Figma MCP",
      gitlabUrls,
      gitlabOnlyDescription: gitlabOnly,
      gitlabContentFiles,
      figmaReadRequired: true,
      figmaUrls,
      figmaFileKeys,
    });
  }

  const payload = {
    storyKey,
    gaCoverageRequired,
    gaHints,
    sources,
    requirementsReadFailed: false,
    gitlabUrls,
    gitlabOnlyDescription: gitlabOnly,
    gitlabContentFiles,
    figmaReadRequired,
    figmaUrls,
    figmaFileKeys,
  };

  fs.writeFileSync(outPath, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
  console.log(
    `Wrote ${outPath} (gaCoverageRequired=${gaCoverageRequired}, figmaReadRequired=${figmaReadRequired}, gitlabFiles=${gitlabContentFiles.length}, hints=${gaHints.join(",") || "none"})`,
  );
}

main().catch((e) => {
  console.error(e.message || e);
  process.exit(1);
});
