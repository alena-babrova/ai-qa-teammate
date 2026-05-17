#!/usr/bin/env node
/**
 * Posts a comment on the workflow target Jira issue (ISSUE_KEY) when CI fails.
 * Env: ISSUE_KEY, JIRA_*, GITHUB_SERVER_URL, GITHUB_REPOSITORY, GITHUB_RUN_ID
 */

import { createJiraClient } from "./jira-client.js";

async function main() {
  const parentKey = process.env.ISSUE_KEY?.trim();
  const baseUrl = process.env.JIRA_URL?.replace(/\/+$/, "");
  const email = process.env.JIRA_USERNAME;
  const apiToken = process.env.JIRA_API_TOKEN;

  if (!parentKey || !baseUrl || !email || !apiToken) {
    console.error("notify-jira-failure: missing ISSUE_KEY or JIRA_* env");
    process.exit(0);
  }

  const server = process.env.GITHUB_SERVER_URL || "https://github.com";
  const repo = process.env.GITHUB_REPOSITORY || "";
  const runId = process.env.GITHUB_RUN_ID || "";
  const runUrl =
    runId && repo ? `${server}/${repo}/actions/runs/${runId}` : "(run URL n/a)";

  const body = `Generate Test Cases workflow failed.

Workflow run: ${runUrl}

See GitHub Actions logs for details.`;

  const client = createJiraClient({ baseUrl, email, apiToken });
  await client.addComment(parentKey, body);
  console.log(`Posted failure comment on ${parentKey}`);
}

main().catch((e) => {
  console.error(e.message || e);
  process.exit(0);
});
