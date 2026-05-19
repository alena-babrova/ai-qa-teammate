#!/usr/bin/env node
/**
 * Prints the Cursor Agent CLI model id for CI: CURSOR_AGENT_MODEL env if set,
 * otherwise the default **composer-2.5** (same as the Generate Test Cases workflow).
 *
 * Discover valid ids locally: agent models (with CURSOR_API_KEY set).
 */

const DEFAULT_MODEL = "composer-2.5";
const LOG_PREFIX = "[cursor-agent-ci]";

/** @param {string} model @param {string} source */
function logModel(model, source) {
  console.error(
    `${LOG_PREFIX} Cursor CLI will use model "${model}" (source: ${source})`,
  );
}

function main() {
  const fromEnv = process.env.CURSOR_AGENT_MODEL?.trim();
  if (fromEnv) {
    logModel(
      fromEnv,
      "CURSOR_AGENT_MODEL env (workflow input, client_payload, repo variable, or job default)",
    );
    console.log(fromEnv);
    return;
  }

  logModel(DEFAULT_MODEL, `default (${DEFAULT_MODEL}; set CURSOR_AGENT_MODEL to override)`);
  console.log(DEFAULT_MODEL);
}

main();
