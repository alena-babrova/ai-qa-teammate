#!/usr/bin/env node
/**
 * Verifies that MCP created every Test issue: valid tests.json + meta.json (jiraPublish=mcp, mcpCreatedKeys).
 * CI fails if the agent did not complete Jira creation via MCP.
 *
 * Usage: node scripts/verify-mcp-jira.js <STORY_KEY>
 * Looks for generated/jira-tests/<STORY_KEY>/tests.json first; if missing, tries ISSUE_KEY env
 * when it differs (agent sometimes writes under the Sub-task key by mistake).
 * Summary checks always use STORY_KEY (canonical story key).
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

const keyRe = /^[A-Z][A-Z0-9_]+-\d+$/;

function loadJson(p) {
  return JSON.parse(fs.readFileSync(p, "utf8"));
}

function validateMcpMeta(manifest, meta) {
  if (!meta || meta.jiraPublish !== "mcp") {
    return "meta.json must exist with \"jiraPublish\": \"mcp\".";
  }
  const keys = meta.mcpCreatedKeys;
  if (!Array.isArray(keys) || keys.length !== manifest.tests.length) {
    return `meta.json: expected mcpCreatedKeys length ${manifest.tests.length}, got ${keys?.length ?? 0}.`;
  }
  if (!keys.every((k) => typeof k === "string" && keyRe.test(k))) {
    return "meta.json: mcpCreatedKeys must be valid Jira issue keys.";
  }
  return null;
}

/** @param {{ tests: unknown[] }} manifest @param {string} storyKey */
function validateSummariesIncludeStoryKey(manifest, storyKey) {
  for (let i = 0; i < manifest.tests.length; i++) {
    const t = manifest.tests[i];
    const summary = t && typeof t === "object" && t !== null ? t.summary : undefined;
    if (typeof summary !== "string" || !summary.includes(storyKey)) {
      return `tests[${i}].summary must include story key "${storyKey}" (Sub-task dispatch key must not replace story key in titles).`;
    }
  }
  return null;
}

function main() {
  const storyKey = process.argv[2]?.trim();
  const issueKey = process.env.ISSUE_KEY?.trim();

  if (!storyKey || !keyRe.test(storyKey)) {
    console.error("Usage: node scripts/verify-mcp-jira.js <STORY_KEY>");
    process.exit(1);
  }

  /** @type {string[]} */
  const dirKeys = [storyKey];
  if (issueKey && keyRe.test(issueKey) && issueKey !== storyKey) {
    dirKeys.push(issueKey);
  }

  let outDir = null;
  let dirUsed = null;
  for (const key of dirKeys) {
    const dir = path.join(root, "generated", "jira-tests", key);
    const mp = path.join(dir, "tests.json");
    if (fs.existsSync(mp)) {
      outDir = dir;
      dirUsed = key;
      break;
    }
  }

  if (!outDir) {
    const tried = dirKeys.map((k) =>
      path.join(root, "generated", "jira-tests", k, "tests.json"),
    );
    console.error(`Missing tests.json (tried):\n${tried.join("\n")}`);
    process.exit(1);
  }

  if (dirUsed !== storyKey) {
    console.warn(
      `::warning::tests.json was found under ${dirUsed} but canonical output is generated/jira-tests/${storyKey}/. Prefer writing to the story key folder when ISSUE_KEY is a Sub-task.`,
    );
  }

  const manifestPath = path.join(outDir, "tests.json");
  const metaPath = path.join(outDir, "meta.json");

  const manifest = loadJson(manifestPath);
  if (manifest.version !== 1) {
    console.error('tests.json must have "version": 1');
    process.exit(1);
  }
  if (!Array.isArray(manifest.tests) || manifest.tests.length === 0) {
    console.error("tests.json must contain a non-empty tests array.");
    process.exit(1);
  }

  const summaryErr = validateSummariesIncludeStoryKey(manifest, storyKey);
  if (summaryErr) {
    console.error(summaryErr);
    process.exit(1);
  }

  let meta = null;
  if (fs.existsSync(metaPath)) {
    try {
      meta = loadJson(metaPath);
    } catch (e) {
      console.error(`Invalid meta.json: ${e.message}`);
      process.exit(1);
    }
  }

  const err = validateMcpMeta(manifest, meta);
  if (err) {
    console.error(err);
    console.error(
      "All Test issues must be created and linked via Jira MCP; REST publish is not used.",
    );
    process.exit(1);
  }

  console.log(
    `OK: MCP created ${meta.mcpCreatedKeys.length} Test issue(s): ${meta.mcpCreatedKeys.join(", ")}`,
  );
}

main();
