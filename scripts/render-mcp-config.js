#!/usr/bin/env node
/**
 * Reads .cursor/mcp.template.json and replaces ${ENV_NAME} with process.env[ENV_NAME].
 * Default server: ghcr.io/sooperset/mcp-atlassian (see https://github.com/sooperset/mcp-atlassian).
 * CONTAINER_CMD: podman (local default) or docker (typical in GitHub Actions).
 * Derives JIRA_URL from JIRA_BASE_URL; maps repo secrets into upstream env names.
 * Confluence vars (CONFLUENCE_URL, CONFLUENCE_USERNAME, CONFLUENCE_API_TOKEN,
 * CONFLUENCE_PERSONAL_TOKEN) are optional — defaults to empty string when unset.
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

  // Confluence — optional; derive from *_BASE_URL / *_USER_EMAIL aliases if present,
  // then fall back to empty string so the template renders without error.
  if (!process.env.CONFLUENCE_URL?.trim() && process.env.CONFLUENCE_BASE_URL?.trim()) {
    const u = deriveRootUrl(process.env.CONFLUENCE_BASE_URL);
    if (u) process.env.CONFLUENCE_URL = u;
  }

  if (!process.env.CONFLUENCE_USERNAME?.trim() && process.env.CONFLUENCE_USER_EMAIL?.trim()) {
    process.env.CONFLUENCE_USERNAME = process.env.CONFLUENCE_USER_EMAIL;
  }

  if (!process.env.CONFLUENCE_PERSONAL_TOKEN?.trim() && process.env.CONFLUENCE_API_TOKEN?.trim()) {
    process.env.CONFLUENCE_PERSONAL_TOKEN = process.env.CONFLUENCE_API_TOKEN;
  }

  // Default all Confluence vars to empty string so missing secrets don't fail the render.
  for (const key of ["CONFLUENCE_URL", "CONFLUENCE_USERNAME", "CONFLUENCE_API_TOKEN", "CONFLUENCE_PERSONAL_TOKEN"]) {
    if (!process.env[key]) process.env[key] = "";
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
  const optionalVars = new Set([
    "CONFLUENCE_URL",
    "CONFLUENCE_USERNAME",
    "CONFLUENCE_API_TOKEN",
    "CONFLUENCE_PERSONAL_TOKEN",
  ]);

  text = text.replace(pattern, (_, name) => {
    const v = process.env[name];
    if ((v === undefined || v === "") && !optionalVars.has(name)) {
      missing.add(name);
      return `\${${name}}`;
    }
    return v ?? "";
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
