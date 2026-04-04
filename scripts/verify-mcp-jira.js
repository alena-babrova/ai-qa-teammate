#!/usr/bin/env node
/**
 * Verifies that MCP created every Test issue: valid tests.json + meta.json (jiraPublish=mcp, mcpCreatedKeys).
 * CI fails if the agent did not complete Jira creation via MCP.
 *
 * Usage: node scripts/verify-mcp-jira.js <PARENT_ISSUE_KEY>
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

function main() {
  const parentKey = process.argv[2];

  if (!parentKey || !keyRe.test(parentKey)) {
    console.error("Usage: node scripts/verify-mcp-jira.js <PARENT_ISSUE_KEY>");
    process.exit(1);
  }

  const outDir = path.join(root, "generated", "jira-tests", parentKey);
  const manifestPath = path.join(outDir, "tests.json");
  const metaPath = path.join(outDir, "meta.json");

  if (!fs.existsSync(manifestPath)) {
    console.error(`Missing manifest: ${manifestPath}`);
    process.exit(1);
  }

  const manifest = loadJson(manifestPath);
  if (manifest.version !== 1) {
    console.error('tests.json must have "version": 1');
    process.exit(1);
  }
  if (!Array.isArray(manifest.tests) || manifest.tests.length === 0) {
    console.error("tests.json must contain a non-empty tests array.");
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
