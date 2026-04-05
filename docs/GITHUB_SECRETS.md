# GitHub Actions secrets

Add these under **Settings → Secrets and variables → Actions → Secrets** for the repository (or organization).

| Secret | Required | Used for |
|--------|----------|----------|
| `CURSOR_API_KEY` | Yes | Cursor Agent CLI on the runner ([docs](https://docs.cursor.com/en/cli/github-actions)). |
| `JIRA_BASE_URL` | Yes | In Actions, the workflow derives **`JIRA_HOST`** from this URL and runs **`envsubst`** on **`.cursor/mcp.template.json`** → **`.cursor/mcp.json`**, then copies to **`~/.cursor/mcp.json`** for the Cursor CLI. Also used by **`notify-jira-failure.js`**. Locally, **`npm run render-mcp`** uses **`scripts/render-mcp-config.js`** with the same template. |
| `JIRA_USER_EMAIL` | Yes | Basic auth username for **`notify-jira-failure.js`** only (email or username per your Jira). **Test issues are not created by REST in this repository.** |
| `JIRA_API_TOKEN` | Yes | Jira Data Center **personal access token** for **`@atlassian-dc-mcp/jira`** on the runner; same value is typically used as the REST password with **`JIRA_USER_EMAIL`** for the failure comment. |

## Actions variables (optional)

Under **Settings → Secrets and variables → Actions → Variables**.

| Variable | Required | Used for |
|----------|----------|----------|
| `CURSOR_AGENT_MODEL` | No | Overrides the default LLM for the headless Cursor Agent. If unset, the workflow uses **`model`** from **[`.cursor/ci/agent.json`](../.cursor/ci/agent.json)** (committed default). |

To list model ids your account can use, run **`agent models`** (or **`agent --list-models`**) locally with **`CURSOR_API_KEY`** set; the string must match exactly (for example **`composer-2`**).
