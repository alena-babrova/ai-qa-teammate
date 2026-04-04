# ai-qa-teammate

Repository for **generating Jira Test issues from a parent story** using **Cursor Agent** in **GitHub Actions**. **Test issues are created and linked only through Jira MCP** (`@atlassian-dc-mcp/jira`). CI validates success with **`scripts/verify-mcp-jira.js`** (required **`meta.json`**); there is **no** REST publisher for Tests.

## What runs where

- **CI (only place for headless agent):** The **Generate Test Cases** workflow ([`.github/workflows/generate-test-cases.yml`](.github/workflows/generate-test-cases.yml)) checks out the repo, renders **`.cursor/mcp.json`** from [`.cursor/mcp.template.json`](.cursor/mcp.template.json), runs the **Cursor Agent CLI** with [`prompts/ci-generate-tests.md`](prompts/ci-generate-tests.md), then runs [`scripts/verify-mcp-jira.js`](scripts/verify-mcp-jira.js) to confirm MCP recorded all created Test keys in **`meta.json`**.
- **Local:** Use **Cursor IDE** with [`.cursor/rules/`](.cursor/rules/) and [`.cursor/skills/`](.cursor/skills/). Do **not** run the headless `cursor-agent` / `agent` CLI on a developer machine as part of this project’s automation.

## Triggers

- **Manual:** GitHub → **Actions** → **Generate Test Cases** → **Run workflow** → enter **`issue_key`** (e.g. `PROJ-123`).
- **API:** `repository_dispatch` with **`event_type`: `ai-test-generate`** and `client_payload.issue_key` (see [`docs/JIRA_AUTOMATION.md`](docs/JIRA_AUTOMATION.md) for Jira Automation examples).

## Configuration

| Item | Purpose |
|------|---------|
| [`config/jira.test-generator.json`](config/jira.test-generator.json) | Jira project key, Test issue type, custom field IDs for steps / expected result (for MCP payloads). |
| [`.cursor/mcp.template.json`](.cursor/mcp.template.json) | MCP server **`npx -y @atlassian-dc-mcp/jira`**; placeholders substituted by [`scripts/render-mcp-config.js`](scripts/render-mcp-config.js). |
| [`.cursor/rules/`](.cursor/rules/) | Generator behavior, EPMRPP-style conventions ([`jira-test-cases-epmrpp-style.mdc`](.cursor/rules/jira-test-cases-epmrpp-style.mdc)). |

## GitHub secrets

Required secrets are listed in [`docs/GITHUB_SECRETS.md`](docs/GITHUB_SECRETS.md). **`JIRA_*`** credentials are used for MCP config on the runner and for the optional **failure comment** on the parent issue (small REST helper); **Test creation is not done by REST scripts in this repo.**

## npm scripts

Requires **Node.js ≥ 20**.

| Script | Command |
|--------|---------|
| `npm run render-mcp` | Writes **`.cursor/mcp.json`** from the template (set `JIRA_API_TOKEN` and `JIRA_BASE_URL` or `JIRA_HOST` in the environment). |
| `npm run verify:jira-mcp -- <ISSUE_KEY>` | Checks **`generated/jira-tests/<ISSUE_KEY>/`** for valid **`tests.json`** + **`meta.json`** (MCP publish proof). Same check as CI after a local agent run. |

## Outputs

- Generated artifacts live under **`generated/jira-tests/<ISSUE_KEY>/`**: **`tests.json`** and **required** **`meta.json`** after the agent completes MCP creation. That tree is gitignored except **`generated/jira-tests/.gitkeep`**.

## More documentation

- [`docs/JIRA_AUTOMATION.md`](docs/JIRA_AUTOMATION.md) — calling **`repository_dispatch`** from Jira.
- [`docs/GITHUB_SECRETS.md`](docs/GITHUB_SECRETS.md) — Actions secrets reference.
