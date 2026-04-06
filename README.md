# ai-qa-teammate

Turns a **Jira story or task** (the parent issue) into **Jira Test issues** with steps and expected results, using **Cursor** in **GitHub Actions**. You supply the issue key; the automation generates the cases, creates the Test work items in Jira, and checks that the run completed end-to-end.

## How it runs (CI)

The **Generate Test Cases** workflow runs in **GitHub Actions** in two jobs: **1. Verify configuration** (issue key, Jira, Figma, MCP render) and **2. Generate tests** (Cursor Agent + `tests.json` verification). The second job runs only if the first succeeds.

## Starting a run

- **From GitHub:** **Actions** → **Generate Test Cases** → **Run workflow** → enter the Jira **issue key** (e.g. `PROJ-123`).
- **From Jira:** You can drive the same workflow with automation (see [`docs/JIRA_AUTOMATION.md`](docs/JIRA_AUTOMATION.md)).

## Required GitHub secrets and variables

**Secrets:** **Settings** → **Secrets and variables** → **Actions** → **Secrets**. (Organization secrets are supported if your org allows this repo to use them.)

**Variables** (not secrets): same page → **Variables** tab — set **`JIRA_URL`** (required) and optionally **`CONFLUENCE_URL`**. These instance URLs are **never** stored as Actions secrets; the workflow reads **`vars.JIRA_URL`** / **`vars.CONFLUENCE_URL`** only.

**Secrets to create:**

| Secret | Required | Purpose (summary) |
|--------|----------|-------------------|
| `CURSOR_API_KEY` | Yes | Cursor Agent in Actions |
| `JIRA_USERNAME` | Yes | Jira account identifier for automation (email or username) |
| `JIRA_API_TOKEN` | Yes | Jira token for the agent and related steps |
| `CONFLUENCE_USER_EMAIL` | No | Confluence account identifier |
| `CONFLUENCE_API_TOKEN` | No | Confluence personal access token |
| `FIGMA_API_KEY` | No | Figma API token for the Figma MCP server |

`CONFLUENCE_*` and **`FIGMA_API_KEY`** are optional. When set, the agent can use Confluence and/or Figma for extra context during test generation.

**Repository variables** (**Variables** tab, not **Secrets**): **`JIRA_URL`** (required for CI) and optional **`CONFLUENCE_URL`**. Passed into **`scripts/render-mcp-config.js`** → **`mcp.json`**. Details: **`docs/GITHUB_SECRETS.md`**.

For full detail on each secret and variable, see **[`docs/GITHUB_SECRETS.md`](docs/GITHUB_SECRETS.md)**.

**Cursor Agent model in CI:** default is **[`.cursor/ci/agent.json`](.cursor/ci/agent.json)** (`model`). Optional GitHub Actions variable **`CURSOR_AGENT_MODEL`** overrides it without a commit. See **`docs/GITHUB_SECRETS.md`**.

## Other setup

- **Jira Test issues, custom fields, and CI manifests:** [`.cursor/rules/jira-test-issues.mdc`](.cursor/rules/jira-test-issues.mdc).
- **Conventions** for titles, steps, and expected results: [`.cursor/rules/`](.cursor/rules/).

## Output

Generated content for each run lives under **`generated/jira-tests/<STORY_KEY>/`**, where **`STORY_KEY`** is the **story** the workflow resolves from your input (the **parent** when you dispatch a **Sub-task**, otherwise the same as the key you entered). Gitignored except a **`.gitkeep`**. Helper scripts are listed in **`package.json`**.

## Documentation

- [`docs/JIRA_AUTOMATION.md`](docs/JIRA_AUTOMATION.md) — wiring Jira to GitHub.
