/**
 * GitLab requirements gate when Jira description is only a git.epam.com link.
 * CI extract writes linked-requirements/*.md; the agent must cover Gherkin scenarios from those files.
 */

import fs from "fs";
import path from "path";

/**
 * @param {string} markdown
 * @returns {number}
 */
export function countGherkinScenarios(markdown) {
  const scenarioHeaders = markdown.match(/####\s+Scenario\s+\d+:/gi);
  if (scenarioHeaders?.length) return scenarioHeaders.length;
  const givens = markdown.match(/- \[ \] \*\*Given\*\*/g);
  return givens?.length ?? 0;
}

/**
 * @param {string} outDir canonical generated/jira-tests/<STORY_KEY>
 * @param {{ tests?: unknown[] }} manifest
 * @returns {string | null}
 */
export function validateGitLabCoverage(outDir, manifest) {
  const signalsPath = path.join(outDir, "requirement-signals.json");
  if (!fs.existsSync(signalsPath)) {
    return null;
  }

  let signals;
  try {
    signals = JSON.parse(fs.readFileSync(signalsPath, "utf8"));
  } catch (e) {
    return `Invalid requirement-signals.json: ${e.message}`;
  }

  const gitlabOnly = signals.gitlabOnlyDescription === true;
  const contentFiles = Array.isArray(signals.gitlabContentFiles)
    ? signals.gitlabContentFiles.filter((f) => typeof f === "string" && f.length > 0)
    : [];

  if (!gitlabOnly || contentFiles.length === 0) {
    return null;
  }

  let scenarioCount = 0;
  for (const relativePath of contentFiles) {
    const filePath = path.join(outDir, relativePath);
    if (!fs.existsSync(filePath)) {
      return (
        `GitLab requirements gate failed: missing ${relativePath} referenced in requirement-signals.json. ` +
        "Re-run extract-requirement-signals.js or read linked GitLab specs before authoring tests."
      );
    }
    scenarioCount += countGherkinScenarios(fs.readFileSync(filePath, "utf8"));
  }

  const tests = manifest?.tests;
  const testCount = Array.isArray(tests) ? tests.length : 0;

  if (scenarioCount > 0 && testCount < scenarioCount) {
    return (
      `GitLab requirements gate failed: linked GitLab spec defines ${scenarioCount} Gherkin scenario(s) ` +
      `but tests.json has ${testCount} test(s). Map each scenario to at least one Test when Jira description is GitLab-only.`
    );
  }

  if (scenarioCount === 0 && testCount === 0) {
    return (
      "GitLab requirements gate failed: Jira description is GitLab-only but no Gherkin scenarios were detected " +
      "and tests.json is empty. Read linked-requirements/*.md and author tests from that content."
    );
  }

  return null;
}
