#!/usr/bin/env node
/**
 * CI: after MCP creates/updates Tests, normalize TM fields that the agent often skips:
 * - Folder (customfield_24001) → "AI Generated " (matches Jira option label, incl. trailing space)
 * - Test Library (customfield_24000) → "Test Library"
 * - Test requirement (customfield_29300) → STORY_KEY (payload shape varies by plugin; tries REST variants)
 *
 * Env: JIRA_URL, JIRA_USERNAME, JIRA_API_TOKEN, STORY_KEY
 * Reads: generated/jira-tests/<STORY_KEY>/meta.json (same path fallbacks as verify-mcp-jira.js)
 *
 * Usage: node scripts/ensure-jira-test-tm-fields.js <STORY_KEY>
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { createJiraClient } from "./jira-client.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

const keyRe = /^[A-Z][A-Z0-9_]+-\d+$/;

/** Jira Folder option label (manual reference EPMRPP-115879) */
const TM_FOLDER_VALUE = "AI Generated ";
const TM_LIBRARY_VALUE = "Test Library";

const CF_FOLDER = "customfield_24001";
const CF_LIBRARY = "customfield_24000";
const CF_REQUIREMENT = "customfield_29300";

function loadJson(p) {
  return JSON.parse(fs.readFileSync(p, "utf8"));
}

/** @param {unknown} raw @param {string} storyKey */
function requirementReferencesStory(raw, storyKey) {
  if (raw == null || raw === "") return false;

  const list = Array.isArray(raw) ? raw : [raw];
  for (const item of list) {
    if (typeof item === "string") {
      if (item === storyKey || item.includes(storyKey)) return true;
      // e.g. "Requirement(key=EPMRPP-114990, external=false)"
      const anyKey = /\b([A-Z][A-Z0-9_]+-\d+)\b/.exec(item);
      if (anyKey && anyKey[1] === storyKey) return true;
      const keyEq = /key=\s*([A-Z][A-Z0-9_]+-\d+)/i.exec(item);
      if (keyEq && keyEq[1] === storyKey) return true;
      continue;
    }
    if (item && typeof item === "object") {
      /** @type {{ key?: string, issueKey?: string, id?: string }} */
      const o = item;
      if (o.key === storyKey || o.issueKey === storyKey) return true;
    }
  }
  return false;
}

/** @param {unknown} raw */
function folderIsAiGenerated(raw) {
  if (raw == null) return false;
  if (typeof raw === "string") {
    return raw.trim() === TM_FOLDER_VALUE.trim();
  }
  const v =
    typeof raw === "object" &&
    raw !== null &&
    "value" in raw &&
    typeof /** @type {{ value?: unknown }} */ (raw).value === "string"
      ? /** @type {{ value: string }} */ (raw).value
      : "";
  return typeof v === "string" && v.trim() === TM_FOLDER_VALUE.trim();
}

/** @param {Record<string, unknown> | undefined} fields @param {string} storyKey */
function alreadyOk(fields, storyKey) {
  if (!fields) return false;
  const folderRaw = fields[CF_FOLDER];
  const reqRaw = fields[CF_REQUIREMENT];

  let reqInner = reqRaw;
  if (reqInner && typeof reqInner === "object" && "value" in reqInner) {
    const inner = /** @type {{ value: unknown }} */ (reqInner).value;
    if (Array.isArray(inner)) reqInner = inner;
    else if (inner != null && inner !== "") reqInner = [inner];
    else reqInner = [];
  }

  return (
    folderIsAiGenerated(folderRaw) && requirementReferencesStory(reqInner, storyKey)
  );
}

/** @param {ReturnType<typeof createJiraClient>} client @param {string} issueKey @param {string} storyKey */
async function normalizeIssueTmFields(client, issueKey, storyKey) {
  const issue = await client.getIssue(issueKey, [
    CF_FOLDER,
    CF_REQUIREMENT,
    "issuetype",
  ]);
  const fields = /** @type {Record<string, unknown>} */ (
    issue?.fields ?? {}
  );

  const typeName = /** @type {{ name?: string }} | undefined */ (
    fields.issuetype
  )?.name;
  if (typeName && typeName !== "Test") {
    console.warn(`::notice::Skipping ${issueKey}: issuetype is "${typeName}", expected Test`);
    return;
  }

  if (alreadyOk(fields, storyKey)) {
    console.log(`TM fields OK on ${issueKey} (folder + requirement)`);
    return;
  }

  const baseLibraryFolder = {
    [CF_LIBRARY]: { value: TM_LIBRARY_VALUE },
    [CF_FOLDER]: { value: TM_FOLDER_VALUE },
  };

  /** @type {unknown[]} */
  const requirementVariants = [
    [{ key: storyKey }],
    { key: storyKey },
    [storyKey],
    storyKey,
  ];

  let lastErr = /** @type {Error | null} */ (null);
  for (const rq of requirementVariants) {
    try {
      await client.updateIssue(issueKey, {
        ...baseLibraryFolder,
        [CF_REQUIREMENT]: rq,
      });

      const check = await client.getIssue(issueKey, [
        CF_FOLDER,
        CF_REQUIREMENT,
      ]);
      const nf = /** @type {Record<string, unknown>} */ (
        check?.fields ?? {}
      );
      if (alreadyOk(nf, storyKey)) {
        console.log(
          `Updated ${issueKey}: ${CF_FOLDER}=AI Generated, ${CF_REQUIREMENT}→${storyKey}`,
        );
        return;
      }
    } catch (e) {
      lastErr =
        e instanceof Error ? e : new Error(typeof e === "string" ? e : String(e));
    }
  }

  if (lastErr) {
    throw new Error(
      `TM normalize failed for ${issueKey} (${storyKey}): ${lastErr.message}`,
    );
  }
  throw new Error(
    `TM normalize: could not verify ${CF_FOLDER} / ${CF_REQUIREMENT} on ${issueKey} for ${storyKey} after trying ${requirementVariants.length} requirement payload(s); check Jira REST shape for ${CF_REQUIREMENT}.`,
  );
}

async function main() {
  const storyKey = process.argv[2]?.trim();
  const issueKeyEnv = process.env.ISSUE_KEY?.trim();
  const baseUrl = process.env.JIRA_URL?.replace(/\/+$/, "");
  const email = process.env.JIRA_USERNAME;
  const apiToken = process.env.JIRA_API_TOKEN;

  if (!storyKey || !keyRe.test(storyKey)) {
    console.error(
      "Usage: node scripts/ensure-jira-test-tm-fields.js <STORY_KEY>",
    );
    process.exit(1);
  }

  if (!baseUrl || !email || !apiToken) {
    console.error(
      "ensure-jira-test-tm-fields: set JIRA_URL, JIRA_USERNAME, JIRA_API_TOKEN",
    );
    process.exit(1);
  }

  /** @type {string[]} */
  const dirKeys = [storyKey];
  if (issueKeyEnv && keyRe.test(issueKeyEnv) && issueKeyEnv !== storyKey) {
    dirKeys.push(issueKeyEnv);
  }

  let outDir = null;
  for (const key of dirKeys) {
    const metaPathCheck = path.join(
      root,
      "generated",
      "jira-tests",
      key,
      "meta.json",
    );
    if (fs.existsSync(metaPathCheck)) {
      outDir = path.dirname(metaPathCheck);
      break;
    }
  }

  if (!outDir) {
    console.error(
      "ensure-jira-test-tm-fields: meta.json missing (nothing to normalize)",
    );
    process.exit(1);
  }

  const manifestPath = path.join(outDir, "tests.json");
  const metaPath = path.join(outDir, "meta.json");
  let manifest = { tests: [] };
  if (fs.existsSync(manifestPath)) {
    manifest = loadJson(manifestPath);
  }
  if (!Array.isArray(manifest.tests) || manifest.tests.length === 0) {
    console.log(
      "ensure-jira-test-tm-fields: 0 tests (empty story) — skipping TM normalization",
    );
    return;
  }

  const meta = loadJson(metaPath);
  const keys = meta?.mcpCreatedKeys;
  if (!Array.isArray(keys) || !keys.every((k) => keyRe.test(String(k)))) {
    console.error("ensure-jira-test-tm-fields: invalid meta.json mcpCreatedKeys");
    process.exit(1);
  }

  const client = createJiraClient({ baseUrl, email, apiToken });

  for (const testKey of keys) {
    await normalizeIssueTmFields(client, String(testKey), storyKey);
  }

  console.log(
    `TM normalization done for ${keys.length} Test issue(s) → story ${storyKey}`,
  );
}

main().catch((e) => {
  console.error(e.message || e);
  process.exit(1);
});
