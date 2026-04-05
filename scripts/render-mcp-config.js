#!/usr/bin/env node
/**
 * Reads .cursor/mcp.template.json and replaces ${ENV_NAME} with process.env[ENV_NAME].
 * Default server: ghcr.io/sooperset/mcp-atlassian (Jira-only; see https://github.com/sooperset/mcp-atlassian).
 * CONTAINER_CMD: podman (local default) or docker (typical in GitHub Actions).
 * Derives JIRA_URL from JIRA_BASE_URL; maps repo secrets into upstream env names.
 * Writes .cursor/mcp.json. Does not print secrets.
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
function deriveRootUrl(baseUrl) {
  const trimmed = baseUrl.trim();
  if (!trimmed) return undefined;
  try {
    const withProto = trimmed.includes("://") ? trimmed : `https://${trimmed}`;
    const u = new URL(withProto);
    return `${u.protocol}//${u.host}`;
  } catch {
    return undefined;
  }
}

function applyDefaults() {
  if (!process.env.CONTAINER_CMD?.trim()) {
    process.env.CONTAINER_CMD = "podman";
  }

  if (!process.env.JIRA_URL?.trim() && process.env.JIRA_BASE_URL?.trim()) {
    const u = deriveRootUrl(process.env.JIRA_BASE_URL);
    if (u) process.env.JIRA_URL = u;
  }

  if (!process.env.JIRA_USERNAME?.trim() && process.env.JIRA_USER_EMAIL?.trim()) {
    process.env.JIRA_USERNAME = process.env.JIRA_USER_EMAIL;
  }

  if (!process.env.JIRA_PERSONAL_TOKEN?.trim() && process.env.JIRA_API_TOKEN?.trim()) {
    process.env.JIRA_PERSONAL_TOKEN = process.env.JIRA_API_TOKEN;
  }
}

function main() {
  applyDefaults();

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
