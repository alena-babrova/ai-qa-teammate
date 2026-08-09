/**
 * GA coverage checks against requirement-signals.json (see scripts/extract-requirement-signals.js).
 */

import fs from "fs";
import path from "path";

/**
 * @param {string} outDir canonical generated/jira-tests/<STORY_KEY>
 * @param {Array<{ title: string, body: string }>} cases parsed from the Markdown deliverable
 * @returns {string | null} error message or null if OK
 */
export function validateGaCoverage(outDir, cases) {
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

  const gaCases = cases.filter((c) => c.title.trim().startsWith("GA."));

  if (gaCases.length < 2) {
    const titles = cases.map((c) => c.title).join("; ");
    return `GA coverage required (requirement-signals.json) but found ${gaCases.length} test case(s) titled "GA.…" (need at least 2: ON + OFF). All titles: ${titles}`;
  }

  const hints = Array.isArray(signals.gaHints) ? signals.gaHints : [];
  for (const hint of hints) {
    if (!hint.startsWith("place:")) continue;
    const placeValue = hint.slice("place:".length);
    if (!placeValue) continue;
    const found = gaCases.some((c) => c.body.includes(placeValue));
    if (!found) {
      return `GA test cases must reference authoritative place "${placeValue}" in their steps or expected results (gaHints: ${hints.join(", ")}).`;
    }
  }

  return null;
}
