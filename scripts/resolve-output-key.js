#!/usr/bin/env node
/**
 * Prints STORY_KEY=<key> for GITHUB_ENV.
 * If ISSUE_KEY is a Jira Sub-task (by issue type name), uses parent issue key; else ISSUE_KEY.
 *
 * Env: ISSUE_KEY, JIRA_URL, JIRA_USERNAME, JIRA_API_TOKEN
 */

import { createJiraClient } from "./jira-client.js";

/** @param {string} name */
function isSubTaskType(name) {
  const n = (name || "").toLowerCase().replace(/\s+/g, " ").trim();
  return n === "sub-task" || n === "subtask" || n.includes("sub-task") || n.includes("subtask");
}

function main() {
  const issueKey = process.env.ISSUE_KEY?.trim() || process.argv[2]?.trim();
  const baseUrl = process.env.JIRA_URL?.replace(/\/+$/, "");
  const email = process.env.JIRA_USERNAME;
  const apiToken = process.env.JIRA_API_TOKEN;

  if (!issueKey) {
    console.error("ISSUE_KEY env or argv required");
    process.exit(1);
  }
  if (!baseUrl || !email || !apiToken) {
    console.error("Set JIRA_URL, JIRA_USERNAME, JIRA_API_TOKEN");
    process.exit(1);
  }

  const client = createJiraClient({ baseUrl, email, apiToken });

  client
    .getIssue(issueKey, ["issuetype", "parent"])
    .then((json) => {
      const typeName = json?.fields?.issuetype?.name;
      const parentKey = json?.fields?.parent?.key;
      let storyKey = issueKey;
      if (isSubTaskType(typeName) && typeof parentKey === "string" && parentKey) {
        storyKey = parentKey;
      }
      console.log(`STORY_KEY=${storyKey}`);
    })
    .catch((e) => {
      console.error(e.message || e);
      process.exit(1);
    });
}

main();
