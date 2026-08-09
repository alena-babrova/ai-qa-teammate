#!/usr/bin/env node
/**
 * Fetches Jira story text + linked GitLab requirement files; detects GA coverage signals.
 * Writes generated/jira-tests/<STORY_KEY>/requirement-signals.json for CI agent + verify.
 *
 * Env: STORY_KEY, JIRA_URL, JIRA_USERNAME, JIRA_API_TOKEN
 * Optional: CONFLUENCE_URL, CONFLUENCE_API_TOKEN, CONFLUENCE_USER_EMAIL
 * Required when the Jira description contains GitLab /-/blob/ links: GITLAB_API_URL, GITLAB_PERSONAL_ACCESS_TOKEN
 * GitLab and Confluence hosts are derived from GITLAB_API_URL / CONFLUENCE_URL (see requirement-links.js).
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { createJiraClient } from "./jira-client.js";
import { extractFigmaSignals } from "./figma-signals.js";
import {
  hostFromUrl,
  gitLabBlobUrls,
  parseGitLabBlobUrl,
  isGitLabOnlyDescription,
  confluencePageUrls,
  confluencePageIdFromUrl,
} from "./requirement-links.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

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

/**
 * @param {string} apiBase e.g. https://gitlab.example.com/api/v4
 * @param {string} token
 * @param {string} blobUrl
 * @param {string | null} host
 */
async function fetchGitLabRawFile(apiBase, token, blobUrl, host) {
  const parsed = parseGitLabBlobUrl(blobUrl, host);
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

  const gitlabHost = hostFromUrl(gitlabApi);
  const confluenceHost = hostFromUrl(confluenceUrl);

  const gitlabUrls = gitLabBlobUrls(jiraText, gitlabHost);
  const gitlabOnly = isGitLabOnlyDescription(jiraText, gitlabHost);

  if (gitlabUrls.length > 0) {
    if (!gitlabApi || !gitlabToken) {
      const missing = [
        !gitlabApi &&
          "GITLAB_API_URL (Actions variable vars.GITLAB_API_URL, e.g. https://gitlab.example.com/api/v4)",
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
        failureReason: `Jira description links GitLab requirement file(s) but missing: ${missing.join("; ")}`,
      });
    }
    for (const url of gitlabUrls) {
      try {
        const body = await fetchGitLabRawFile(gitlabApi, gitlabToken, url, gitlabHost);
        combined += `\n\n${body}`;
        sources.push(`gitlab:${url}`);
      } catch (e) {
        failRequirementsRead(outPath, {
          storyKey,
          gaCoverageRequired: false,
          gaHints: [],
          sources,
          gitlabUrls,
          gitlabOnlyDescription: gitlabOnly,
          failureReason: `Failed to read GitLab requirements: ${e.message || e}`,
        });
      }
    }
  }

  const nestedConfluenceUrls = confluencePageUrls(combined, confluenceHost);
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
  const { figmaUrls, figmaFileKeys, figmaNodeIdsByFileKey, figmaReadRequired } =
    extractFigmaSignals(combined);

  const figmaToken = process.env.FIGMA_API_KEY?.trim();

  if (figmaReadRequired && !figmaToken) {
    failRequirementsRead(outPath, {
      storyKey,
      gaCoverageRequired,
      gaHints,
      sources,
      failureReason:
        "Requirements include Figma link(s) but FIGMA_API_KEY is unset; run verify-figma-access (GET /v1/me) and Figma MCP require a token",
      gitlabUrls,
      gitlabOnlyDescription: gitlabOnly,
      figmaReadRequired: true,
      figmaUrls,
      figmaFileKeys,
      figmaNodeIdsByFileKey,
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
    figmaReadRequired,
    figmaUrls,
    figmaFileKeys,
    figmaNodeIdsByFileKey,
  };

  fs.writeFileSync(outPath, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
  console.log(
    `Wrote ${outPath} (gaCoverageRequired=${gaCoverageRequired}, figmaReadRequired=${figmaReadRequired}, hints=${gaHints.join(",") || "none"})`,
  );
}

main().catch((e) => {
  console.error(e.message || e);
  process.exit(1);
});
