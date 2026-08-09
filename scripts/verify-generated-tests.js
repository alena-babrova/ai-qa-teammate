#!/usr/bin/env node
/**
 * Verifies the generated Markdown deliverable and meta.json for a story.
 * The pipeline is read-only towards Jira: the artifact is the product, so CI fails when the
 * agent did not write a usable Markdown file.
 *
 * Usage: node scripts/verify-generated-tests.js <STORY_KEY>
 * Looks in generated/jira-tests/<STORY_KEY>/ first; if missing, tries ISSUE_KEY env when it
 * differs (the agent sometimes writes under the Sub-task key by mistake).
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { parseTestCases, missingSections } from "./parse-test-cases-md.js";
import { validateGaCoverage } from "./verify-ga-coverage.js";
import { validateFigmaRead } from "./verify-figma-read.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

const keyRe = /^[A-Z][A-Z0-9_]+-\d+$/;

/**
 * Preferred name is <KEY>-test-cases.md; any other .md in the folder is accepted so a differently
 * named deliverable still gets validated instead of silently passing as "missing".
 * @param {string} dir
 * @param {string} key
 */
function findMarkdown(dir, key) {
  const preferred = path.join(dir, `${key}-test-cases.md`);
  if (fs.existsSync(preferred)) return preferred;
  if (!fs.existsSync(dir)) return null;
  const md = fs
    .readdirSync(dir)
    .filter((f) => f.toLowerCase().endsWith(".md"))
    .sort();
  return md.length > 0 ? path.join(dir, md[0]) : null;
}

/**
 * @param {unknown} meta
 * @param {Array<{ title: string }>} cases
 * @returns {string | null}
 */
function validateMeta(meta, cases) {
  if (!meta || typeof meta !== "object") {
    return 'meta.json must exist and contain run metadata (storyKey, caseCount, and "empty" when there are no cases).';
  }
  const { caseCount, empty } = /** @type {{ caseCount?: unknown, empty?: unknown }} */ (meta);
  if (typeof caseCount !== "number" || !Number.isInteger(caseCount)) {
    return "meta.json: caseCount must be an integer.";
  }
  if (caseCount !== cases.length) {
    return `meta.json: caseCount is ${caseCount} but the Markdown file has ${cases.length} "## " test case(s).`;
  }
  if (cases.length === 0 && empty !== true) {
    return 'meta.json: 0 test cases are only allowed for an empty story — set "empty": true.';
  }
  return null;
}

/**
 * @param {Array<{ title: string, body: string }>} cases
 * @param {string} storyKey
 * @param {string | undefined} issueKey
 * @returns {string | null}
 */
function validateCases(cases, storyKey, issueKey) {
  for (let i = 0; i < cases.length; i++) {
    const { title } = cases[i];
    if (title.includes(storyKey)) {
      return `Test case title ${i + 1} must not contain the story key "${storyKey}": ${title}`;
    }
    if (
      issueKey &&
      keyRe.test(issueKey) &&
      issueKey !== storyKey &&
      title.includes(issueKey)
    ) {
      return `Test case title ${i + 1} must not contain the Sub-task dispatch key "${issueKey}" when it differs from story key "${storyKey}": ${title}`;
    }
    const missing = missingSections(cases[i]);
    if (missing.length > 0) {
      return `Test case "${title}" is missing section(s): ${missing.join(", ")}.`;
    }
  }
  return null;
}

function main() {
  const storyKey = process.argv[2]?.trim();
  const issueKeyEnv = process.env.ISSUE_KEY?.trim();

  if (!storyKey || !keyRe.test(storyKey)) {
    console.error("Usage: node scripts/verify-generated-tests.js <STORY_KEY>");
    process.exit(1);
  }

  /** @type {string[]} */
  const dirKeys = [storyKey];
  if (issueKeyEnv && keyRe.test(issueKeyEnv) && issueKeyEnv !== storyKey) {
    dirKeys.push(issueKeyEnv);
  }

  let markdownPath = null;
  let dirUsed = null;
  for (const key of dirKeys) {
    const found = findMarkdown(
      path.join(root, "generated", "jira-tests", key),
      key,
    );
    if (found) {
      markdownPath = found;
      dirUsed = key;
      break;
    }
  }

  const canonicalDir = path.join(root, "generated", "jira-tests", storyKey);

  if (!markdownPath) {
    const figmaErr = validateFigmaRead(canonicalDir, null, null);
    if (figmaErr) {
      console.error(figmaErr);
      process.exit(1);
    }
    const tried = dirKeys.map((k) =>
      path.join(root, "generated", "jira-tests", k, `${k}-test-cases.md`),
    );
    console.error(`Missing generated test cases (tried):\n${tried.join("\n")}`);
    process.exit(1);
  }

  const outDir = path.dirname(markdownPath);
  if (dirUsed !== storyKey) {
    console.warn(
      `::warning::Test cases were found under ${dirUsed} but canonical output is generated/jira-tests/${storyKey}/. Prefer writing to the story key folder when ISSUE_KEY is a Sub-task.`,
    );
  }

  const text = fs.readFileSync(markdownPath, "utf8");
  if (text.trim() === "") {
    console.error(`${path.relative(root, markdownPath)} is empty.`);
    process.exit(1);
  }

  const cases = parseTestCases(text);

  const metaPath = path.join(outDir, "meta.json");
  let meta = null;
  if (fs.existsSync(metaPath)) {
    try {
      meta = JSON.parse(fs.readFileSync(metaPath, "utf8"));
    } catch (e) {
      console.error(`Invalid meta.json: ${e.message}`);
      process.exit(1);
    }
  }

  const metaErr = validateMeta(meta, cases);
  if (metaErr) {
    console.error(metaErr);
    process.exit(1);
  }

  const caseErr = validateCases(cases, storyKey, issueKeyEnv);
  if (caseErr) {
    console.error(caseErr);
    process.exit(1);
  }

  const signalsDir = fs.existsSync(
    path.join(canonicalDir, "requirement-signals.json"),
  )
    ? canonicalDir
    : outDir;

  const figmaErr = validateFigmaRead(signalsDir, cases, meta);
  if (figmaErr) {
    console.error(figmaErr);
    process.exit(1);
  }

  const gaErr = validateGaCoverage(signalsDir, cases);
  if (gaErr) {
    console.error(gaErr);
    process.exit(1);
  }

  if (cases.length === 0) {
    console.log(
      "OK: 0 test cases (story had no testable description/AC content); meta.json marks the story empty.",
    );
    return;
  }

  console.log(
    `OK: ${cases.length} test case(s) in ${path.relative(root, markdownPath)}`,
  );
}

main();
