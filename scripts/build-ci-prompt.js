#!/usr/bin/env node
/**
 * Writes the Cursor Agent CI prompt to stdout.
 * Env: ISSUE_KEY (required) — workflow dispatch key (often a Sub-task; trigger only when STORY_KEY differs).
 * STORY_KEY (optional; defaults to ISSUE_KEY) — set by the workflow after resolve-output-key.js: canonical
 * story (parent when dispatch is a Sub-task). The agent must use STORY_KEY for requirements and for the
 * generated/jira-tests/ output path — never substitute ISSUE_KEY when the two differ. Test case titles must
 * not contain either key (see .cursor/rules/test-case-style.mdc).
 * PROJECT_PACK (optional) — pack folder override; defaults to projects/<PROJECT_KEY> when that folder exists.
 * Repo contract: prompts/ci-generate-tests.md → .cursor/skills/jira-story-test-cases-md/SKILL.md +
 * .cursor/rules/jira-story-input.mdc.
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
const projectKey = storyKey.split("-")[0];

function resolveProjectPack() {
  const override = process.env.PROJECT_PACK?.trim();
  const candidate = override || path.join("projects", projectKey);
  return fs.existsSync(path.join(root, candidate)) ? candidate : null;
}

const projectPack = resolveProjectPack();

const promptPath = path.join(root, "prompts", "ci-generate-tests.md");
if (!fs.existsSync(promptPath)) {
  console.error(`Missing ${promptPath}`);
  process.exit(1);
}

let text = fs.readFileSync(promptPath, "utf8");
text = text.replace(/__ISSUE_KEY__/g, issueKey);
text = text.replace(/__STORY_KEY__/g, storyKey);
text = text.replace(/__PROJECT_KEY__/g, projectKey);
text = text.replace(
  /__PROJECT_PACK__/g,
  projectPack
    ? `\`${projectPack}/\` — read \`${projectPack}/PROJECT.md\` (plus \`CONTEXT.md\` and \`examples/\` when present); it overrides the generic style rule`
    : "none — no pack exists for this project; use `.cursor/rules/test-case-style.mdc` and the story's own vocabulary, and do not borrow another project's wording",
);
process.stdout.write(text);
