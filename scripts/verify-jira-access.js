#!/usr/bin/env node
/**
 * CI: verify Jira REST read access for the workflow target issue. Read-only — this pipeline
 * never creates, updates, links, or comments on Jira issues.
 *
 * Env: ISSUE_KEY, JIRA_URL, JIRA_USERNAME, JIRA_API_TOKEN
 */

import { createJiraClient } from "./jira-client.js";

async function main() {
  const issueKey = process.env.ISSUE_KEY?.trim();
  const baseUrl = process.env.JIRA_URL?.replace(/\/+$/, "");
  const email = process.env.JIRA_USERNAME;
  const apiToken = process.env.JIRA_API_TOKEN;

  if (!issueKey) {
    console.error("verify-jira-access: ISSUE_KEY is required");
    process.exit(1);
  }
  if (!baseUrl || !email || !apiToken) {
    console.error(
      "verify-jira-access: set JIRA_URL, JIRA_USERNAME, JIRA_API_TOKEN",
    );
    process.exit(1);
  }

  const client = createJiraClient({ baseUrl, email, apiToken });

  const issue = await client.getIssue(issueKey, [
    "summary",
    "issuetype",
    "parent",
  ]);
  const summary = issue?.fields?.summary ?? "(no summary)";
  const typeName = issue?.fields?.issuetype?.name ?? "?";
  console.log(
    `Jira read OK: ${issueKey} [${typeName}] ${summary.slice(0, 120)}${summary.length > 120 ? "…" : ""}`,
  );
}

main().catch((e) => {
  console.error(e.message || e);
  process.exit(1);
});
