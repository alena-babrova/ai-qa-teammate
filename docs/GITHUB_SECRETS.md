# GitHub Actions secrets

Add these under **Settings → Secrets and variables → Actions → Secrets** for the repository (or organization).

| Secret | Required | Used for |
|--------|----------|----------|
| `CURSOR_API_KEY` | Yes | Cursor Agent CLI on the runner ([docs](https://docs.cursor.com/en/cli/github-actions)). |
| `JIRA_BASE_URL` | Yes | Jira REST (**`publish.js`** / **`notify-jira-failure.js`**). **`render-mcp-config.js`** derives **`JIRA_HOST`** for **`@atlassian-dc-mcp/jira`** from this URL. |
| `JIRA_USER_EMAIL` | Yes | Basic auth username for Jira REST (**`publish.js`** / **`notify-jira-failure.js`**): account email or username, per your Jira. |
| `JIRA_API_TOKEN` | Yes | Jira Data Center **personal access token** for MCP; same value is typically used as the REST password with **`JIRA_USER_EMAIL`**. |
