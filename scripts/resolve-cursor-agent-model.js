#!/usr/bin/env node
/**
 * Prints the Cursor Agent CLI model id for CI: CURSOR_AGENT_MODEL env if set,
 * otherwise "model" from .cursor/ci/agent.json.
 *
 * Discover valid ids locally: agent models (with CURSOR_API_KEY set).
 */

import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const CONFIG_PATH = join(__dirname, "..", ".cursor", "ci", "agent.json");
const LOG_PREFIX = "[cursor-agent-ci]";

/** @param {string} model @param {string} source */
function logModel(model, source) {
  console.error(
    `${LOG_PREFIX} Cursor CLI will use model "${model}" (source: ${source})`
  );
}

function main() {
  const fromEnv = process.env.CURSOR_AGENT_MODEL?.trim();
  if (fromEnv) {
    logModel(fromEnv, "Actions variable CURSOR_AGENT_MODEL");
    console.log(fromEnv);
    return;
  }

  let raw;
  try {
    raw = readFileSync(CONFIG_PATH, "utf8");
  } catch (e) {
    console.error(`Missing or unreadable ${CONFIG_PATH}`);
    process.exit(1);
  }

  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch {
    console.error(`${CONFIG_PATH} is not valid JSON`);
    process.exit(1);
  }

  const model = typeof parsed.model === "string" ? parsed.model.trim() : "";
  if (!model) {
    console.error(`${CONFIG_PATH} must contain a non-empty "model" string`);
    process.exit(1);
  }

  logModel(model, ".cursor/ci/agent.json");
  console.log(model);
}

main();
