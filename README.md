# ai-qa-teammate

Repository for **generating Jira Test issues from a parent story** using **Cursor Agent** in **GitHub Actions**, with optional creation via **Jira MCP** (`@atlassian-dc-mcp/jira`) and a **REST** fallback to publish **`tests.json`**.

## What runs where

- **CI (only place for headless agent):** The **Generate Test Cases** workflow ([`.github/workflows/generate-test-cases.yml`](.github/workflows/generate-test-cases.yml)) checks out the repo, renders **`.cursor/mcp.json`** from [`.cursor/mcp.template.json`](.cursor/mcp.template.json), runs the **Cursor Agent CLI** with [`prompts/ci-generate-tests.md`](prompts/ci-generate-tests.md), then runs [`scripts/publish-if-needed.js`](scripts/publish-if-needed.js) so Jira gets Test issues (MCP path or REST).
- **Local:** Use **Cursor IDE** with [`.cursor/rules/`](.cursor/rules/) and [`.cursor/skills/`](.cursor/skills/). Do **not** run the headless `cursor-agent` / `agent` CLI on a developer machine as part of this project’s automation.

## Triggers

- **Manual:** GitHub → **Actions** → **Generate Test Cases** → **Run workflow** → enter **`issue_key`** (e.g. `PROJ-123`).
- **API:** `repository_dispatch` with **`event_type`: `ai-test-generate`** and `client_payload.issue_key` (see [`docs/JIRA_AUTOMATION.md`](docs/JIRA_AUTOMATION.md) for Jira Automation examples).

## Configuration

| Item | Purpose |
|------|---------|
| [`config/jira.test-generator.json`](config/jira.test-generator.json) | Jira project, Test issue type, link type, custom field IDs for steps / expected result, idempotency. |
| [`.cursor/mcp.template.json`](.cursor/mcp.template.json) | MCP server **`npx -y @atlassian-dc-mcp/jira`**; placeholders substituted by [`scripts/render-mcp-config.js`](scripts/render-mcp-config.js). |
| [`.cursor/rules/`](.cursor/rules/) | Generator behavior, EPMRPP-style conventions ([`jira-test-cases-epmrpp-style.mdc`](.cursor/rules/jira-test-cases-epmrpp-style.mdc)). |

## GitHub secrets

Required secrets are listed in [`docs/GITHUB_SECRETS.md`](docs/GITHUB_SECRETS.md) (`CURSOR_API_KEY`, `JIRA_BASE_URL`, `JIRA_USER_EMAIL`, `JIRA_API_TOKEN`).

## npm scripts

Requires **Node.js ≥ 20**.

| Script | Command |
|--------|---------|
| `npm run render-mcp` | Writes **`.cursor/mcp.json`** from the template (set `JIRA_API_TOKEN` and `JIRA_BASE_URL` or `JIRA_HOST` in the environment). |
| `npm run publish:jira -- <ISSUE_KEY>` | Publishes from **`generated/jira-tests/<ISSUE_KEY>/tests.json`** if MCP did not already create issues (see **`publish-if-needed.js`**). |
| `npm run publish:jira:rest -- <ISSUE_KEY>` | Forces REST publish via **`publish.js`**. |

## Outputs

- Generated manifests live under **`generated/jira-tests/<ISSUE_KEY>/`** (e.g. **`tests.json`**, optional **`meta.json`** when MCP created all Tests). That tree is gitignored except **`generated/jira-tests/.gitkeep`**.

## More documentation

- [`docs/JIRA_AUTOMATION.md`](docs/JIRA_AUTOMATION.md) — calling **`repository_dispatch`** from Jira.
- [`docs/GITHUB_SECRETS.md`](docs/GITHUB_SECRETS.md) — Actions secrets reference.
