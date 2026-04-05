# GitHub Actions secrets

Add these under **Settings → Secrets and variables → Actions → Secrets** for the repository (or organization).

| Secret | Required | Used for |
|--------|----------|----------|
| `CURSOR_API_KEY` | Yes | Cursor Agent CLI on the runner ([docs](https://docs.cursor.com/en/cli/github-actions)). |
| `JIRA_BASE_URL` | Yes | Jira instance URL; **`scripts/render-mcp-config.js`** derives **`JIRA_URL`** (scheme + host) for **[mcp-atlassian](https://github.com/sooperset/mcp-atlassian)**. Also used by **`notify-jira-failure.js`**. |
| `JIRA_USER_EMAIL` | Yes | Account id for Jira (email/username). Mapped to **`JIRA_USERNAME`** for **[mcp-atlassian](https://github.com/sooperset/mcp-atlassian)**; also used by **`notify-jira-failure.js`**. |
| `JIRA_API_TOKEN` | Yes | Data Center **personal access token** (PAT). Rendered into **`JIRA_API_TOKEN`** and **`JIRA_PERSONAL_TOKEN`** for the MCP container. Same value is typically the REST password with **`JIRA_USER_EMAIL`** for the failure comment. |

Locally, install **Docker** or **Podman**, set **`JIRA_BASE_URL`**, **`JIRA_USER_EMAIL`**, **`JIRA_API_TOKEN`**, then run **`npm run render-mcp`**. Use **`CONTAINER_CMD=docker`** if you do not use Podman.

## Actions variables (optional)

Under **Settings → Secrets and variables → Actions → Variables**.

| Variable | Required | Used for |
|----------|----------|----------|
| `CURSOR_AGENT_MODEL` | No | Overrides the default LLM for the headless Cursor Agent. If unset, the workflow uses **`model`** from **[`.cursor/ci/agent.json`](../.cursor/ci/agent.json)** (committed default). |

To list model ids your account can use, run **`agent models`** (or **`agent --list-models`**) locally with **`CURSOR_API_KEY`** set; the string must match exactly (for example **`composer-2`**).
