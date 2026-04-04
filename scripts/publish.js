#!/usr/bin/env node
/**
 * Reads generated/jira-tests/<ISSUE_KEY>/tests.json and creates Jira Test issues + links via REST.
 * Usage: node scripts/publish.js <PARENT_ISSUE_KEY> [path/to/config.json]
 * Env: JIRA_BASE_URL, JIRA_USER_EMAIL, JIRA_API_TOKEN
 *
 * Also exported as publishRest() for publish-if-needed.js.
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { createJiraClient } from "./jira-client.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

function loadJson(p) {
  return JSON.parse(fs.readFileSync(p, "utf8"));
}

function markerFor(parentKey, template) {
  return template.replace(/\{parentKey\}/g, parentKey);
}

async function runCreates(client, j, manifest, parentKey) {
  const markerTemplate =
    j.idempotency?.descriptionMarkerTemplate || "ai_generated_from:{parentKey}";
  const marker = markerFor(parentKey, markerTemplate);
  const runNote = process.env.GITHUB_RUN_ID
    ? `\n\n<!-- ci_run:${process.env.GITHUB_RUN_ID} -->`
    : "";

  for (const t of manifest.tests) {
    const summary = t.summary?.trim();
    if (!summary) {
      throw new Error('Each test requires non-empty "summary"');
    }

    const testSteps = t.testSteps ?? t.steps ?? "";
    const expectedResult = t.expectedResult ?? t.expected ?? "";
    const extra = t.description ? `\n\n${t.description}` : "";

    const description = `${extra ? extra.trim() + "\n\n" : ""}<!-- ${marker} -->${runNote}`;

    const fields = {
      project: { key: j.projectKey },
      summary,
      description,
      issuetype: { name: j.testIssueType },
    };

    const cf = j.customFields || {};
    if (cf.testSteps) fields[cf.testSteps] = String(testSteps);
    if (cf.expectedResult) fields[cf.expectedResult] = String(expectedResult);

    const created = await client.createIssue(fields);
    const newKey = created.key;
    console.log(`Created ${newKey}: ${summary}`);

    const inward = j.linkInwardIsNewTest !== false ? newKey : parentKey;
    const outward = j.linkInwardIsNewTest !== false ? parentKey : newKey;
    await client.createIssueLink(j.linkTypeName, inward, outward);
    console.log(`Linked ${newKey} <-> ${parentKey} (${j.linkTypeName})`);
  }
}

/**
 * @param {string} parentKey
 * @param {string} [configPath]
 */
export async function publishRest(parentKey, configPath) {
  const cfg =
    configPath || path.join(root, "config", "jira.test-generator.json");

  if (!parentKey || !/^[A-Z][A-Z0-9_]+-\d+$/.test(parentKey)) {
    throw new Error("Invalid parent issue key");
  }

  const baseUrl = process.env.JIRA_BASE_URL?.replace(/\/+$/, "");
  const email = process.env.JIRA_USER_EMAIL;
  const apiToken = process.env.JIRA_API_TOKEN;

  if (!baseUrl || !email || !apiToken) {
    throw new Error("Set JIRA_BASE_URL, JIRA_USER_EMAIL, JIRA_API_TOKEN");
  }

  if (!fs.existsSync(cfg)) {
    throw new Error(`Config not found: ${cfg}`);
  }

  const config = loadJson(cfg);
  const j = config.jira;
  const apiVersion = j.apiVersion || "2";
  const client = createJiraClient({
    baseUrl,
    email,
    apiToken,
    apiVersion,
  });

  const outDir = path.join(root, "generated", "jira-tests", parentKey);
  const manifestPath = path.join(outDir, "tests.json");

  if (!fs.existsSync(manifestPath)) {
    throw new Error(`Missing manifest: ${manifestPath}`);
  }

  const manifest = loadJson(manifestPath);
  if (manifest.version !== 1) {
    throw new Error('tests.json must have "version": 1');
  }
  if (!Array.isArray(manifest.tests) || manifest.tests.length === 0) {
    throw new Error("tests.json must contain a non-empty tests array");
  }

  const markerTemplate =
    j.idempotency?.descriptionMarkerTemplate || "ai_generated_from:{parentKey}";
  const marker = markerFor(parentKey, markerTemplate);

  if (j.idempotency?.skipIfLinkedAiTestsExist) {
    const safe = marker.replace(/"/g, '\\"');
    const jql = `issue in linkedIssues(${parentKey}) AND issuetype = Test AND text ~ "${safe}"`;
    const res = await client.search(jql, ["key", "summary"]);
    if (res.total > 0) {
      console.log(
        `Idempotency: found ${res.total} linked Test issue(s) with marker; skipping create.`,
      );
      return;
    }
  }

  await runCreates(client, j, manifest, parentKey);
}

function isMainModule() {
  const entry = path.resolve(process.argv[1] || "");
  const here = path.resolve(fileURLToPath(import.meta.url));
  return entry === here;
}

async function cliMain() {
  const parentKey = process.argv[2];
  const configPath = process.argv[3];

  if (!parentKey || !/^[A-Z][A-Z0-9_]+-\d+$/.test(parentKey)) {
    console.error("Usage: node scripts/publish.js <PARENT_ISSUE_KEY> [config.json]");
    process.exit(1);
  }

  try {
    await publishRest(parentKey, configPath);
  } catch (e) {
    console.error(e.message || e);
    process.exit(1);
  }
}

if (isMainModule()) {
  cliMain();
}
