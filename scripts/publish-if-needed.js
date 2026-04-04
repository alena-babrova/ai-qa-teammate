#!/usr/bin/env node
/**
 * If the agent wrote meta.json with jiraPublish=mcp and valid mcpCreatedKeys, skip REST.
 * Otherwise runs publishRest() (Jira REST).
 *
 * Usage: node scripts/publish-if-needed.js <PARENT_ISSUE_KEY> [config.json]
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { publishRest } from "./publish.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

const keyRe = /^[A-Z][A-Z0-9_]+-\d+$/;

function loadJson(p) {
  return JSON.parse(fs.readFileSync(p, "utf8"));
}

function shouldSkipRest(manifest, meta) {
  if (!meta || meta.jiraPublish !== "mcp") {
    return false;
  }
  const keys = meta.mcpCreatedKeys;
  if (!Array.isArray(keys) || keys.length !== manifest.tests.length) {
    console.warn(
      `meta.json: expected mcpCreatedKeys length ${manifest.tests.length}, got ${keys?.length ?? 0}; falling back to REST publish.`,
    );
    return false;
  }
  if (!keys.every((k) => typeof k === "string" && keyRe.test(k))) {
    console.warn(
      "meta.json: mcpCreatedKeys must be valid Jira issue keys; falling back to REST publish.",
    );
    return false;
  }
  return true;
}

async function main() {
  const parentKey = process.argv[2];
  const configPath = process.argv[3];

  if (!parentKey || !keyRe.test(parentKey)) {
    console.error(
      "Usage: node scripts/publish-if-needed.js <PARENT_ISSUE_KEY> [config.json]",
    );
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
  let meta = null;
  if (fs.existsSync(metaPath)) {
    try {
      meta = loadJson(metaPath);
    } catch (e) {
      console.warn(`Invalid meta.json (${e.message}); using REST publish.`);
    }
  }

  if (shouldSkipRest(manifest, meta)) {
    console.log(
      `Skipping REST publish: MCP created ${meta.mcpCreatedKeys.length} Test issue(s): ${meta.mcpCreatedKeys.join(", ")}`,
    );
    return;
  }

  await publishRest(parentKey, configPath);
}

main().catch((e) => {
  console.error(e.message || e);
  process.exit(1);
});
