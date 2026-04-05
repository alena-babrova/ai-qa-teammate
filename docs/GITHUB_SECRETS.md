# GitHub Actions secrets

Add these under **Settings → Secrets and variables → Actions → Secrets** for the repository (or organization).

| Secret | Required | Used for |
|--------|----------|----------|
| `CURSOR_API_KEY` | Yes | Cursor Agent CLI on the runner ([docs](https://docs.cursor.com/en/cli/github-actions)). |
| `JIRA_BASE_URL` | Yes | **`render-mcp-config.js`** derives **`JIRA_HOST`** for **`@atlassian-dc-mcp/jira`**. Also used by **`notify-jira-failure.js`** (REST comment on the parent issue if the workflow fails). |
| `JIRA_USER_EMAIL` | Yes | Basic auth username for **`notify-jira-failure.js`** only (email or username per your Jira). **Test issues are not created by REST in this repository.** |
| `JIRA_API_TOKEN` | Yes | Jira Data Center **personal access token** for **`@atlassian-dc-mcp/jira`** on the runner; same value is typically used as the REST password with **`JIRA_USER_EMAIL`** for the failure comment. |

## Actions variables (optional)

Under **Settings → Secrets and variables → Actions → Variables**.

| Variable | Required | Used for |
|----------|----------|----------|
| `CURSOR_AGENT_MODEL` | No | Overrides the default LLM for the headless Cursor Agent. If unset, the workflow uses **`model`** from **[`.cursor/ci/agent.json`](../.cursor/ci/agent.json)** (committed default). |

### Jira REST API version

The **Generate Test Cases** workflow sets **`JIRA_REST_API_VERSION=3`** on the job so Jira **10.x** comments use REST API **v3** with **Atlassian Document Format** (see **`scripts/jira-client.js`**). On v2, **`addComment`** with a plain string often returns HTTP success but the comment does not appear in the UI.

For **`npm run jira:pipeline-start`** or other local runs against Jira 10, export **`JIRA_REST_API_VERSION=3`** (and the usual **`JIRA_*`** variables).

To list model ids your account can use, run **`agent models`** (or **`agent --list-models`**) locally with **`CURSOR_API_KEY`** set; the string must match exactly (for example **`composer-2`**).
