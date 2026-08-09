/**
 * Figma design gate checks against requirement-signals.json (see scripts/extract-requirement-signals.js).
 */

import fs from "fs";
import path from "path";

const FAILURE_FILE = "figma-read-failure.json";

/**
 * @param {string} outDir canonical generated/jira-tests/<STORY_KEY>
 * @param {Array<{ title: string }> | null} cases null when the Markdown deliverable is absent
 * @param {{ figmaFileKeysRead?: unknown } | null} meta
 * @returns {string | null}
 */
export function validateFigmaRead(outDir, cases, meta) {
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

  if (!signals.figmaReadRequired) {
    return null;
  }

  const failurePath = path.join(outDir, FAILURE_FILE);
  if (fs.existsSync(failurePath)) {
    let failure;
    try {
      failure = JSON.parse(fs.readFileSync(failurePath, "utf8"));
    } catch (e) {
      return `Invalid ${FAILURE_FILE}: ${e.message}`;
    }
    const reason =
      typeof failure.failureReason === "string"
        ? failure.failureReason
        : "Figma MCP read failed (see figma-read-failure.json)";
    return `Figma design gate failed: ${reason}. No test cases should be authored without Figma access.`;
  }

  const requiredKeys = Array.isArray(signals.figmaFileKeys)
    ? signals.figmaFileKeys.filter((k) => typeof k === "string" && k.length > 0)
    : [];

  const hasTests = Array.isArray(cases) && cases.length > 0;

  const readKeys = Array.isArray(meta?.figmaFileKeysRead)
    ? meta.figmaFileKeysRead.filter((k) => typeof k === "string")
    : [];

  const requiredSet = new Set(requiredKeys);
  const readSet = new Set(readKeys);
  const allRead =
    requiredKeys.length > 0 && requiredKeys.every((k) => readSet.has(k)) && readKeys.length === requiredSet.size;

  if (hasTests && !allRead) {
    return (
      "Figma design gate failed: test cases were authored but meta.json figmaFileKeysRead does not match " +
      `required file keys [${requiredKeys.join(", ")}]. No test cases should exist without successful Figma MCP reads.`
    );
  }

  if (!hasTests && requiredKeys.length > 0) {
    return (
      "Figma design gate not satisfied: figmaReadRequired is true but the Markdown deliverable is missing and " +
      `${FAILURE_FILE} was not written. Agent must either complete Figma MCP reads and emit test cases, or write ${FAILURE_FILE} and stop.`
    );
  }

  return null;
}
