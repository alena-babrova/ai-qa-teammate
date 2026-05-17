# GitHub Actions secrets

Add these under **Settings → Secrets and variables → Actions → Secrets** for the repository (or organization).

| Secret | Required | Used for |
|--------|----------|----------|
| `CURSOR_API_KEY` | Yes | Cursor Agent CLI on the runner ([docs](https://docs.cursor.com/en/cli/github-actions)). |
| `JIRA_USERNAME` | Yes | Account email or username for Jira. Passed as **`JIRA_USERNAME`** to **[mcp-atlassian](https://github.com/sooperset/mcp-atlassian)** and to Jira REST scripts (**`jira-pipeline-start.js`**, **`notify-jira-failure.js`**, etc.). |
| `JIRA_API_TOKEN` | Yes | Data Center **personal access token** (PAT). Rendered into **`JIRA_API_TOKEN`** and **`JIRA_PERSONAL_TOKEN`** for the MCP container. Same value is used as the REST password with **`JIRA_USERNAME`** for the failure comment. |
| `CONFLUENCE_USER_EMAIL` | No | Account email/username for Confluence. Rendered into **`CONFLUENCE_USERNAME`** for the MCP container. |
| `CONFLUENCE_API_TOKEN` | No | Personal access token for Confluence. Rendered into **`CONFLUENCE_API_TOKEN`** for the MCP container. |
| `FIGMA_API_KEY` | No | Figma API token for **[acuvity/mcp-server-figma](https://hub.docker.com/r/acuvity/mcp-server-figma)** (`FIGMA_API_KEY` in rendered **`mcp.json`** env). Optional — leave unset if you do not use Figma in test generation. When set, the workflow runs **`scripts/verify-figma-access.js`** (Figma **`GET /v1/me`**) before MCP config generation; **if that check fails, the workflow stops** (no MCP render or agent steps). |
| `GITLAB_PERSONAL_ACCESS_TOKEN` | No | GitLab **personal access token** for **[mcp/gitlab](https://hub.docker.com/r/mcp/gitlab)** (`GITLAB_PERSONAL_ACCESS_TOKEN` in rendered **`mcp.json`**). Optional — leave unset if you do not use GitLab MCP in test generation. Pair with repository variable **`GITLAB_API_URL`**. |

**`JIRA_URL`** and **`CONFLUENCE_URL`** are **repository variables only** (not secrets). The workflow injects them with **`vars.JIRA_URL`** and **`vars.CONFLUENCE_URL`**—they do **not** appear under **Actions → Secrets**. Add them under **Settings → Secrets and variables → Actions → Variables**.

**`scripts/render-mcp-config.js`** normalizes those values to **scheme + host** and substitutes **[`.cursor/mcp.template.json`](../.cursor/mcp.template.json)** placeholders **`${JIRA_URL}`** / **`${CONFLUENCE_URL}`** into **`mcp.json`**.

Locally, install **Docker** or **Podman**, set **`JIRA_URL`**, **`JIRA_USERNAME`**, **`JIRA_API_TOKEN`** (and optionally **`CONFLUENCE_URL`**, `CONFLUENCE_*`, **`FIGMA_API_KEY`**, **`GITLAB_API_URL`**, **`GITLAB_PERSONAL_ACCESS_TOKEN`**), then run **`npm run render-mcp`**. Use **`CONTAINER_CMD=docker`** if you do not use Podman.

## Actions variables (instance URLs — not secrets)

Under **Settings → Secrets and variables → Actions → Variables** (the **Variables** tab, not **Secrets**).

| Variable | Required | Used for |
|----------|----------|----------|
| `JIRA_URL` | Yes (CI) | Jira instance URL (e.g. `https://jira.company.com`). **Variable only.** Used by Jira REST scripts and the Atlassian MCP container after **`render-mcp-config.js`** normalizes to scheme + host. |
| `CONFLUENCE_URL` | No | Confluence instance URL when using Confluence MCP. **Variable only.** Same normalization; omit if unused. |
| `CURSOR_AGENT_MODEL` | No | Optional repo-wide LLM override when the workflow is **not** started from the Actions UI with a model choice. **Precedence:** **Run workflow** input **`cursor_model`** → **`repository_dispatch`** payload **`client_payload.cursor_model`** → this variable → default **`composer-2`**. Locally, **`scripts/resolve-cursor-agent-model.js`** uses **`composer-2`** when **`CURSOR_AGENT_MODEL`** is unset. |
| `GITLAB_API_URL` | No | GitLab **HTTP API base URL** (e.g. `https://gitlab.com/api/v4` or `https://git.example.com/api/v4`). Passed to the GitLab MCP container. Optional — omit if you do not use GitLab MCP. |

To list model ids your account can use, run **`agent models`** (or **`agent --list-models`**) locally with **`CURSOR_API_KEY`** set; the string must match exactly (for example **`composer-2`**).
