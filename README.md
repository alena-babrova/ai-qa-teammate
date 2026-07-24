# ai-qa-teammate

Turns a **Jira story or task** (the parent issue) into **Jira Test issues** with steps and expected results, using **Cursor** in **GitHub Actions**. You supply the issue key; the automation generates the cases, creates the Test work items in Jira, and checks that the run completed end-to-end.

## How it runs (CI)

The **Generate Test Cases** workflow runs in **GitHub Actions** as **one job** on a **single runner**: steps **1. Verify** (issue key, Jira, Figma, **one** MCP config render) then **2. Generate** (resolve story key, Cursor Agent, `tests.json` verification). The same workspace is reused—**`mcp.json` is not generated twice** (splitting across jobs would require artifacting secrets).

## Starting a run

- **From GitHub:** **Actions** → **Generate Test Cases** → **Run workflow** → enter the Jira **issue key** (`PROJ-123`) **or** paste the **browse URL** (`…/browse/PROJ-123`); then choose **Cursor Agent LLM** (default **`composer-2.5`**; run **`agent models`** locally if an id fails for your account).
- **From Jira:** You can drive the same workflow with automation (see [`docs/JIRA_AUTOMATION.md`](docs/JIRA_AUTOMATION.md)).

## Required GitHub secrets and variables

**Secrets:** **Settings** → **Secrets and variables** → **Actions** → **Secrets**. (Organization secrets are supported if your org allows this repo to use them.)

**Variables** (not secrets): same page → **Variables** tab. Instance URLs are **never** stored as Actions secrets; the workflow reads **`vars.*`** only.

**Secrets to create:**

| Secret | Required | Purpose (summary) |
|--------|----------|-------------------|
| `CURSOR_API_KEY` | Yes | Cursor Agent in Actions |
| `JIRA_USERNAME` | Yes | Jira account identifier for automation (email or username) |
| `JIRA_API_TOKEN` | Yes | Jira token for the agent and related steps |
| `CONFLUENCE_USER_EMAIL` | No | Confluence account identifier |
| `CONFLUENCE_API_TOKEN` | No | Confluence personal access token |
| `FIGMA_API_KEY` | No* | Figma API token for the Figma MCP server |
| `GITLAB_PERSONAL_ACCESS_TOKEN` | No** | GitLab personal access token for GitLab MCP and requirement extract |

\* **Required** when merged requirements (Jira + linked GitLab/Confluence) contain any **`figma.com`** URL—see **`scripts/extract-requirement-signals.js`** and **`figmaReadRequired`** in **`requirement-signals.json`**.

\** **Required** when the User Story description contains any **`git.epam.com`** `/-/blob/` requirements link (see **`scripts/extract-requirement-signals.js`**).

**Repository variables** (**Variables** tab, not **Secrets**):

| Variable | Required | Purpose (summary) |
|----------|----------|-------------------|
| `JIRA_URL` | Yes | Jira instance URL (required for CI) |
| `CONFLUENCE_URL` | No | Confluence instance URL for Confluence MCP |
| `CURSOR_AGENT_MODEL` | No | Default Cursor Agent model when the run does not pass one (see below) |
| `GITLAB_API_URL` | No* | GitLab API base URL (e.g. `https://git.epam.com/api/v4`) |

`CONFLUENCE_*`, **`FIGMA_API_KEY`** (required for stories with Figma links), and **`GITLAB_*`** are optional when unused—when set, the agent can use those MCP servers for story-linked context. Passed into **`scripts/render-mcp-config.js`** → **`mcp.json`**.

**Cursor Agent model in CI:** **Run workflow** includes a **model** dropdown (default **`composer-2.5`**). **`repository_dispatch`** / Jira automation can send **`client_payload.cursor_model`**; optional variable **`CURSOR_AGENT_MODEL`** applies when neither is set.

For full detail on each secret and variable, see **[`docs/GITHUB_SECRETS.md`](docs/GITHUB_SECRETS.md)**.

## Other setup

- **Jira Test issues, custom fields, and CI manifests:** [`.cursor/rules/jira-test-issues.mdc`](.cursor/rules/jira-test-issues.mdc).
- **Conventions** for titles, steps, and expected results: [`.cursor/rules/`](.cursor/rules/).

## Output

Generated content for each run lives under **`generated/jira-tests/<STORY_KEY>/`**, where **`STORY_KEY`** is the **story** the workflow resolves from your input (the **parent** when you dispatch a **Sub-task**, otherwise the same as the key you entered). Gitignored except a **`.gitkeep`**. Helper scripts are listed in **`package.json`**.

## Documentation

- [`docs/JIRA_AUTOMATION.md`](docs/JIRA_AUTOMATION.md) — wiring Jira to GitHub.
