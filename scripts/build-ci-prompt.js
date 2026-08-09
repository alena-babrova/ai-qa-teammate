#!/usr/bin/env node
/**
 * Writes the Cursor Agent CI prompt to stdout.
 * Env: ISSUE_KEY (required) — workflow dispatch key (often a Sub-task; trigger only when STORY_KEY differs).
 * STORY_KEY (optional; defaults to ISSUE_KEY) — set by workflow after resolve-output-key.js: canonical story
 * (parent when dispatch is Sub-task). The agent must use STORY_KEY for requirements, generated/jira-tests/ paths,
 * and linking Tests — never substitute ISSUE_KEY when the two differ. Discover linked Tests on STORY_KEY first; update existing, create only missing (jira-test-issues.mdc). Test titles (tests[].summary) must not contain STORY_KEY or ISSUE_KEY when they differ (see jira-test-cases-epmrpp-style.mdc). After successful sync, post the completion summary comment only on ISSUE_KEY when ISSUE_KEY ≠ STORY_KEY (Test Design Sub-task), never on STORY_KEY (jira-test-issues.mdc).
 * Repo contract: prompts/ci-generate-tests.md → .cursor/skills/jira-story-test-cases-md/SKILL.md + .cursor/rules/jira-test-issues.mdc.
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
