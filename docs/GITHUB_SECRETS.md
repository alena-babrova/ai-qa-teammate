# GitHub Actions secrets

Add these under **Settings → Secrets and variables → Actions → Secrets** for the repository (or organization).

| Secret | Required | Used for |
|--------|----------|----------|
| `CURSOR_API_KEY` | Yes | Cursor Agent CLI on the runner ([docs](https://docs.cursor.com/en/cli/github-actions)). |
| `JIRA_BASE_URL` | Yes | **`render-mcp-config.js`** derives **`JIRA_HOST`** for **`@atlassian-dc-mcp/jira`**. Also used by **`notify-jira-failure.js`** (REST comment on the parent issue if the workflow fails). |
| `JIRA_USER_EMAIL` | Yes | Basic auth username for **`notify-jira-failure.js`** only (email or username per your Jira). **Test issues are not created by REST in this repository.** |
| `JIRA_API_TOKEN` | Yes | Jira Data Center **personal access token** for **`@atlassian-dc-mcp/jira`** on the runner; same value is typically used as the REST password with **`JIRA_USER_EMAIL`** for the failure comment. |
