#!/usr/bin/env node
/**
 * Writes the Cursor Agent CI prompt to stdout (ISSUE_KEY from env).
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

const promptPath = path.join(root, "prompts", "ci-generate-tests.md");
if (!fs.existsSync(promptPath)) {
  console.error(`Missing ${promptPath}`);
  process.exit(1);
}

let text = fs.readFileSync(promptPath, "utf8");
text = text.replace(/__ISSUE_KEY__/g, issueKey);
process.stdout.write(text);
