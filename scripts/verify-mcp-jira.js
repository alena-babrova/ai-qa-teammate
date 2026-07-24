#!/usr/bin/env node
/**
 * Verifies tests.json + meta.json (jiraPublish=mcp, mcpCreatedKeys length matches tests).
 * Allows tests.length === 0 when the story had no testable content (empty mcpCreatedKeys).
 * CI fails if the agent did not write valid manifests or mismatched key counts.
 *
 * Usage: node scripts/verify-mcp-jira.js <STORY_KEY>
 * Looks for generated/jira-tests/<STORY_KEY>/tests.json first; if missing, tries ISSUE_KEY env
 * when it differs (agent sometimes writes under the Sub-task key by mistake).
 * Summary checks: each test title must be non-empty and must not contain STORY_KEY (or ISSUE_KEY when it differs).
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { validateGaCoverage } from "./verify-ga-coverage.js";

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

/** @param {{ tests: unknown[] }} manifest @param {string} storyKey @param {string | undefined} issueKey */
function validateSummariesOmitIssueKeys(manifest, storyKey, issueKey) {
  for (let i = 0; i < manifest.tests.length; i++) {
    const t = manifest.tests[i];
    const summary = t && typeof t === "object" && t !== null ? t.summary : undefined;
    if (typeof summary !== "string" || summary.trim() === "") {
      return `tests[${i}].summary must be a non-empty string.`;
    }
    if (summary.includes(storyKey)) {
      return `tests[${i}].summary must not contain the User Story key "${storyKey}" (use EPMRPP title only; traceability is via folder link and Jira relations).`;
    }
    if (
      issueKey &&
      keyRe.test(issueKey) &&
      issueKey !== storyKey &&
      summary.includes(issueKey)
    ) {
      return `tests[${i}].summary must not contain Sub-task dispatch key "${issueKey}" when it differs from story key "${storyKey}".`;
    }
  }
  return null;
}

function main() {
  const storyKey = process.argv[2]?.trim();
  const issueKeyEnv = process.env.ISSUE_KEY?.trim();

  if (!storyKey || !keyRe.test(storyKey)) {
    console.error("Usage: node scripts/verify-mcp-jira.js <STORY_KEY>");
    process.exit(1);
  }

  /** @type {string[]} */
  const dirKeys = [storyKey];
  if (issueKeyEnv && keyRe.test(issueKeyEnv) && issueKeyEnv !== storyKey) {
    dirKeys.push(issueKeyEnv);
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
  if (!Array.isArray(manifest.tests)) {
    console.error("tests.json must contain a tests array.");
    process.exit(1);
  }

  if (manifest.tests.length === 0) {
    let metaEmpty = null;
    if (fs.existsSync(metaPath)) {
      try {
        metaEmpty = loadJson(metaPath);
      } catch (e) {
        console.error(`Invalid meta.json: ${e.message}`);
        process.exit(1);
      }
    }
    const emptyErr = validateMcpMeta(manifest, metaEmpty);
    if (emptyErr) {
      console.error(
        "tests.json has 0 tests (empty story): meta.json must exist with \"jiraPublish\": \"mcp\" and \"mcpCreatedKeys\": [].",
      );
      console.error(emptyErr);
      process.exit(1);
    }
    console.log(
      "OK: 0 tests (story had no testable description/AC content); meta.json mcpCreatedKeys is [].",
    );
    process.exit(0);
  }

  const summaryErr = validateSummariesOmitIssueKeys(
    manifest,
    storyKey,
    issueKeyEnv,
  );
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
      "All Test issues must be synced via Jira MCP (create/update); REST publish is not used.",
    );
    process.exit(1);
  }

  const canonicalDir = path.join(root, "generated", "jira-tests", storyKey);
  const gaErr = validateGaCoverage(
    fs.existsSync(path.join(canonicalDir, "requirement-signals.json"))
      ? canonicalDir
      : outDir,
    manifest,
  );
  if (gaErr) {
    console.error(gaErr);
    process.exit(1);
  }

  console.log(
    `OK: MCP synced ${meta.mcpCreatedKeys.length} Test issue(s): ${meta.mcpCreatedKeys.join(", ")}`,
  );
}

main();
