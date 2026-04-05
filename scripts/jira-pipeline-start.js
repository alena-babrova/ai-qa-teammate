#!/usr/bin/env node
/**
 * CI: verify Jira REST read/write for the workflow target issue, then post a start comment.
 * Read: GET issue/{ISSUE_KEY}. Write: POST comment on the same issue.
 *
 * Env: ISSUE_KEY, JIRA_BASE_URL, JIRA_USER_EMAIL, JIRA_API_TOKEN
 * Optional: GITHUB_SERVER_URL, GITHUB_REPOSITORY, GITHUB_RUN_ID (link in comment)
 */

import { createJiraClient } from "./jira-client.js";

async function main() {
  const issueKey = process.env.ISSUE_KEY?.trim();
  const baseUrl = process.env.JIRA_BASE_URL?.replace(/\/+$/, "");
  const email = process.env.JIRA_USER_EMAIL;
  const apiToken = process.env.JIRA_API_TOKEN;

  if (!issueKey) {
    console.error("jira-pipeline-start: ISSUE_KEY is required");
    process.exit(1);
  }
  if (!baseUrl || !email || !apiToken) {
    console.error(
      "jira-pipeline-start: set JIRA_BASE_URL, JIRA_USER_EMAIL, JIRA_API_TOKEN",
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

  const startedAt = new Date().toISOString();
  const server = process.env.GITHUB_SERVER_URL || "https://github.com";
  const repo = process.env.GITHUB_REPOSITORY || "";
  const runId = process.env.GITHUB_RUN_ID || "";
  const runUrl =
    runId && repo ? `${server}/${repo}/actions/runs/${runId}` : null;

  const lines = [
    `GitHub Actions **Generate Test Cases** workflow started at **${startedAt}** (UTC).`,
  ];
  if (runUrl) {
    lines.push("");
    lines.push(`Workflow run: ${runUrl}`);
  }

  const comment = await client.addComment(issueKey, lines.join("\n"));
  if (comment?.id == null) {
    console.error(
      "Jira comment API returned success but no comment id; check JIRA_REST_API_VERSION (use 3 for Jira 10.x).",
      comment,
    );
    process.exit(1);
  }
  console.log(
    `Jira write OK: comment id=${comment.id} on ${issueKey}${comment.self ? ` (${comment.self})` : ""}`,
  );
}

main().catch((e) => {
  console.error(e.message || e);
  process.exit(1);
});
