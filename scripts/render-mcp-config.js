#!/usr/bin/env node
/**
 * Reads .cursor/mcp.template.json and replaces ${ENV_NAME} with process.env[ENV_NAME].
 * If JIRA_HOST is unset but JIRA_BASE_URL is set, derives JIRA_HOST (hostname[:port]) for @atlassian-dc-mcp/jira.
 * Writes .cursor/mcp.json. Exits non-zero if any placeholder remains or JSON is invalid.
 * Does not print the rendered file (CI safety).
 *
 * CI may use envsubst + copy to ~/.cursor/mcp.json instead; keep this script for local / cross-platform use.
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const templatePath = path.join(root, ".cursor", "mcp.template.json");
const outPath = path.join(root, ".cursor", "mcp.json");

const pattern = /\$\{([A-Z][A-Z0-9_]*)\}/g;

/** @param {string} baseUrl */
function deriveJiraHostFromBaseUrl(baseUrl) {
  const trimmed = baseUrl.trim();
  if (!trimmed) return undefined;
  try {
    const u = new URL(trimmed.includes("://") ? trimmed : `https://${trimmed}`);
    return u.host;
  } catch {
    return undefined;
  }
}

function main() {
  if (!process.env.JIRA_HOST?.trim() && process.env.JIRA_BASE_URL?.trim()) {
    const host = deriveJiraHostFromBaseUrl(process.env.JIRA_BASE_URL);
    if (host) process.env.JIRA_HOST = host;
  }

  if (!fs.existsSync(templatePath)) {
    console.error(`Missing template: ${templatePath}`);
    process.exit(1);
  }

  let text = fs.readFileSync(templatePath, "utf8");
  const missing = new Set();

  text = text.replace(pattern, (_, name) => {
    const v = process.env[name];
    if (v === undefined || v === "") {
      missing.add(name);
      return `\${${name}}`;
    }
    return v;
  });

  if (missing.size > 0) {
    console.error(
      "Missing or empty environment variables for placeholders:",
      [...missing].join(", "),
    );
    process.exit(1);
  }

  if (/\$\{[A-Z][A-Z0-9_]*\}/.test(text)) {
    console.error("Unresolved ${PLACEHOLDERS} remain in mcp config after substitution.");
    process.exit(1);
  }

  let parsed;
  try {
    parsed = JSON.parse(text);
  } catch (e) {
    console.error("Rendered mcp.json is not valid JSON:", e.message);
    process.exit(1);
  }

  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, JSON.stringify(parsed, null, 2), "utf8");
  console.log("Wrote .cursor/mcp.json (content not logged).");
}

main();
