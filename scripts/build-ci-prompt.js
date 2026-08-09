#!/usr/bin/env node
/**
 * Writes the Cursor Agent CI prompt to stdout.
 * Env: ISSUE_KEY (required) — workflow dispatch key (often a Sub-task; trigger only when STORY_KEY differs).
 * STORY_KEY (optional; defaults to ISSUE_KEY) — set by the workflow after resolve-output-key.js: canonical
 * story (parent when dispatch is a Sub-task). The agent must use STORY_KEY for requirements and for the
 * generated/jira-tests/ output path — never substitute ISSUE_KEY when the two differ. Test case titles must
 * not contain either key (see .cursor/rules/test-case-style.mdc).
 * PROJECT (optional) — project pack id or folder (e.g. EPMRPP → projects/EPMRPP/); generic when unset or missing.
 * Repo contract: prompts/ci-generate-tests.md → .cursor/skills/jira-story-test-cases-md/SKILL.md +
 * .cursor/rules/jira-story-input.mdc.
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import {
  formatProjectPackPrompt,
  resolveProjectPack,
} from "./resolve-project-pack.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

const issueKey = process.env.ISSUE_KEY?.trim();
if (!issueKey) {
  console.error("ISSUE_KEY is required");
  process.exit(1);
}
const storyKey = process.env.STORY_KEY?.trim() || issueKey;
const projectKey = storyKey.split("-")[0];

const projectPack = resolveProjectPack({ root });
if (
  (process.env.PROJECT?.trim() || process.env.PROJECT_PACK?.trim()) &&
  !projectPack
) {
  console.warn(
    "::warning::Project pack input was set but no valid projects/<id>/ folder with PROJECT.md was found — using generic style only.",
  );
}

const promptPath = path.join(root, "prompts", "ci-generate-tests.md");
if (!fs.existsSync(promptPath)) {
  console.error(`Missing ${promptPath}`);
  process.exit(1);
}

let text = fs.readFileSync(promptPath, "utf8");
text = text.replace(/__ISSUE_KEY__/g, issueKey);
text = text.replace(/__STORY_KEY__/g, storyKey);
text = text.replace(/__PROJECT_KEY__/g, projectKey);
text = text.replace(/__PROJECT_PACK__/g, formatProjectPackPrompt(projectPack));
process.stdout.write(text);
