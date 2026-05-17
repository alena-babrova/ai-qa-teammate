# Choosing a Jira MCP server

Your Jira host (e.g. `jiraeu.epam.com`) is often **Jira Data Center** (or Server). **Jira Cloud–only** MCPs use different auth and APIs and may **not work** against DC.

## Default in this repo: [sooperset/mcp-atlassian](https://github.com/sooperset/mcp-atlassian)

- **Image:** `ghcr.io/sooperset/mcp-atlassian:latest` ([Jira-only env](https://mcp-atlassian.soomiles.com/docs/configuration) in this repo: **`JIRA_URL`**, **`JIRA_USERNAME`**, **`JIRA_API_TOKEN`**, **`JIRA_PERSONAL_TOKEN`**).
- **Data Center:** upstream often uses **`JIRA_PERSONAL_TOKEN`** (PAT); this repo copies **`JIRA_API_TOKEN`** into **`JIRA_PERSONAL_TOKEN`** when rendering **`.cursor/mcp.json`**.
- **Configuration:** **`.cursor/mcp.template.json`** runs the container via **`${CONTAINER_CMD}`** — **`docker`** in GitHub Actions, **`podman`** by default when you run **`npm run render-mcp`** locally (override with **`CONTAINER_CMD=docker`** if needed).
- **Tool names** are upstream’s (e.g. **`jira_get_issue`**, **`jira_create_issue`**). Repo rules refer to **`get_issue`** / **`jira_getIssue`** as generic equivalents.

CI: **`.github/workflows/generate-test-cases.yml`** pulls the Atlassian, Acuvity Figma, and GitLab MCP images, then runs **`node scripts/render-mcp-config.js`** (then copies **`.cursor/mcp.json`** to **`~/.cursor/mcp.json`** for the Cursor CLI).

## Alternatives

- **[`atlassian-jira-mcp`](https://pypi.org/project/atlassian-jira-mcp/)** (PyPI) — swap **`.cursor/mcp.template.json`** for a **`command`:** **`atlassian-jira-mcp`** block and export **`JIRA_MCP_URL`** / **`JIRA_MCP_TOKEN`** in the workflow instead of Docker.
- **[`@atlassian-dc-mcp/jira`](https://www.npmjs.com/package/@atlassian-dc-mcp/jira)** — **`npx`** + **`JIRA_HOST`** + **`JIRA_API_TOKEN`**; fewer tools, DC-oriented.

## Usually not suitable for EPAM-style DC without verification

- **[`mcp-jira-cloud`](https://www.npmjs.com/package/mcp-jira-cloud)** — Cloud-oriented (`*.atlassian.net` style).
- **Atlassian Cloud / Rovo remote MCP** — Cloud products, not self-hosted DC unless documented otherwise.
