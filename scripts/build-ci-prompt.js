#!/usr/bin/env node
/**
 * Writes the Cursor Agent CI prompt to stdout.
 * Env: ISSUE_KEY (required) — workflow dispatch key (often a Sub-task).
 * STORY_KEY (optional; defaults to ISSUE_KEY) — set by workflow after resolve-output-key.js: parent story when dispatch is Sub-task; used for paths, Jira links, and Test summary prefixes.
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

const issueKey = process.env.ISSUE_KEY?.trim();
if (!issueKey) {
  console.error("ISSUE_KEY is required");
  process.exit(1);
}
const storyKey = process.env.STORY_KEY?.trim() || issueKey;

const promptPath = path.join(root, "prompts", "ci-generate-tests.md");
if (!fs.existsSync(promptPath)) {
  console.error(`Missing ${promptPath}`);
  process.exit(1);
}

let text = fs.readFileSync(promptPath, "utf8");
text = text.replace(/__ISSUE_KEY__/g, issueKey);
text = text.replace(/__STORY_KEY__/g, storyKey);
process.stdout.write(text);
