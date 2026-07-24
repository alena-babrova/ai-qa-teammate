/**
 * GA coverage checks against requirement-signals.json (see scripts/extract-requirement-signals.js).
 */

import fs from "fs";
import path from "path";

/**
 * @param {string} outDir canonical generated/jira-tests/<STORY_KEY>
 * @param {{ tests: Array<{ summary?: string; testSteps?: string; expectedResult?: string }> }} manifest
 * @returns {string | null} error message or null if OK
 */
export function validateGaCoverage(outDir, manifest) {
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

  if (signals.requirementsReadFailed) {
    return "requirement-signals.json has requirementsReadFailed: true (requirements were not loaded).";
  }

  if (!signals.gaCoverageRequired) {
    return null;
  }

  const gaTests = manifest.tests.filter(
    (t) => typeof t.summary === "string" && t.summary.trim().startsWith("GA."),
  );

  if (gaTests.length < 2) {
    const summaries = manifest.tests.map((t) => t.summary).join("; ");
    return `GA coverage required (requirement-signals.json) but found ${gaTests.length} test(s) with summary starting with "GA." (need at least 2: ON + OFF). All summaries: ${summaries}`;
  }

  const hints = Array.isArray(signals.gaHints) ? signals.gaHints : [];
  for (const hint of hints) {
    if (!hint.startsWith("place:")) continue;
    const placeValue = hint.slice("place:".length);
    if (!placeValue) continue;
    const found = gaTests.some((t) => {
      const blob = `${t.testSteps ?? ""}\n${t.expectedResult ?? ""}`;
      return blob.includes(placeValue);
    });
    if (!found) {
      return `GA tests must reference authoritative place "${placeValue}" in testSteps or expectedResult (gaHints: ${hints.join(", ")}).`;
    }
  }

  return null;
}
