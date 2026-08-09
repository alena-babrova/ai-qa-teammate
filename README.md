# ai-qa-teammate

Turns a **Jira story or task** into a **Markdown file of manual test cases**, using **Cursor** in **GitHub Actions**. You supply the issue key; the automation reads the story (and the specs it links to), writes the test cases, and publishes them as a workflow artifact.

**Nothing is written back to Jira.** The issue is an input: the pipeline never creates, updates, links, labels, or comments on Jira issues. The Atlassian MCP server runs with `READ_ONLY_MODE`, and the REST helper in `scripts/jira-client.js` exposes read calls only.

**Default: generic style for every Jira project.** Test cases use [`.cursor/rules/test-case-style.mdc`](.cursor/rules/test-case-style.mdc) and the story's vocabulary. To add a **project pack** (generic + team rules), list the Jira project key in [`projects/config.json`](projects/config.json) — see [`docs/PROJECT_PACKS.md`](docs/PROJECT_PACKS.md).

## How it runs (CI)

The **Generate Test Cases** workflow runs in **GitHub Actions** as **one job** on a **single runner**: steps **1. Verify** (issue key, Jira read access, Figma, **one** MCP config render) then **2. Generate** (resolve story key, Cursor Agent, verification of the generated Markdown). The same workspace is reused—**`mcp.json` is not generated twice** (splitting across jobs would require artifacting secrets).

## Starting a run

- **From GitHub:** **Actions** → **Generate Test Cases** → **Run workflow** → enter the Jira **issue key** (`PROJ-123`) **or** paste the **browse URL** (`…/browse/PROJ-123`); then choose **Cursor Agent LLM** (default **`composer-2.5`**; run **`agent models`** locally if an id fails for your account). Optionally set **project pack** to override the pack folder.
- **From Jira:** You can drive the same workflow with automation (see [`docs/JIRA_AUTOMATION.md`](docs/JIRA_AUTOMATION.md)).

## Output

Each run writes to **`generated/jira-tests/<STORY_KEY>/`**, where **`STORY_KEY`** is the **story** the workflow resolves from your input (the **parent** when you dispatch a **Sub-task**, otherwise the key you entered):

| File | Contents |
|------|----------|
| `<STORY_KEY>-test-cases.md` | The deliverable: one `## ` heading per test case, each with *Preconditions*, *Steps*, and *Expected results* |
| `meta.json` | Run metadata: story key, project key, project pack used, case count, Figma file keys read |
| `requirement-signals.json` | Analytics and linked-spec signals extracted before the agent runs |

The folder is uploaded as the **`generated-jira-tests-<ISSUE_KEY>`** artifact on every run, and the Markdown is also printed to the job summary. The directory is gitignored except a **`.gitkeep`**.

## Project packs

**Generic by default.** The agent uses the generic style rule and the story's vocabulary. **Generic + project pack** applies only when the Jira project key is in [`projects/config.json`](projects/config.json) (or you set the workflow **project pack** input for one run). See [`docs/PROJECT_PACKS.md`](docs/PROJECT_PACKS.md).

[`projects/EPMRPP/`](projects/EPMRPP/) is a full worked example. See [`projects/README.md`](projects/README.md) for how to add your own.

## Required GitHub secrets and variables

**Secrets:** **Settings** → **Secrets and variables** → **Actions** → **Secrets**. (Organization secrets are supported if your org allows this repo to use them.)

**Variables** (not secrets): same page → **Variables** tab. Instance URLs are **never** stored as Actions secrets; the workflow reads **`vars.*`** only.

**Secrets to create:**

| Secret | Required | Purpose (summary) |
|--------|----------|-------------------|
| `CURSOR_API_KEY` | Yes | Cursor Agent in Actions |
| `JIRA_USERNAME` | Yes | Jira account identifier for automation (email or username) |
| `JIRA_API_TOKEN` | Yes | Jira token for the agent and related steps (**read** access is enough) |
| `CONFLUENCE_USER_EMAIL` | No | Confluence account identifier |
| `CONFLUENCE_API_TOKEN` | No | Confluence personal access token |
| `FIGMA_API_KEY` | No* | Figma API token for the Figma MCP server |
| `GITLAB_PERSONAL_ACCESS_TOKEN` | No** | GitLab personal access token for GitLab MCP and requirement extract |

\* **Required** when merged requirements (Jira + linked GitLab/Confluence) contain any **`figma.com`** URL—see **`scripts/extract-requirement-signals.js`** and **`figmaReadRequired`** in **`requirement-signals.json`**.

\** **Required** when the story description links requirement files on your GitLab instance (`/-/blob/` URLs on the host from **`GITLAB_API_URL`**).

**Repository variables** (**Variables** tab, not **Secrets**):

| Variable | Required | Purpose (summary) |
|----------|----------|-------------------|
| `JIRA_URL` | Yes | Jira instance URL (required for CI) |
| `CONFLUENCE_URL` | No | Confluence instance URL for Confluence MCP and link detection |
| `CURSOR_AGENT_MODEL` | No | Default Cursor Agent model when the run does not pass one (see below) |
| `GITLAB_API_URL` | No* | GitLab API base URL (e.g. `https://gitlab.example.com/api/v4`) |

`CONFLUENCE_*`, **`FIGMA_API_KEY`** (required for stories with Figma links), and **`GITLAB_*`** are optional when unused—when set, the agent can use those MCP servers for story-linked context. Passed into **`scripts/render-mcp-config.js`** → **`mcp.json`**.

**Cursor Agent model in CI:** **Run workflow** includes a **model** dropdown (default **`composer-2.5`**). **`repository_dispatch`** / Jira automation can send **`client_payload.cursor_model`**; optional variable **`CURSOR_AGENT_MODEL`** applies when neither is set.

For full detail on each secret and variable, see **[`docs/GITHUB_SECRETS.md`](docs/GITHUB_SECRETS.md)**.

## Other setup

- **Jira reading, linked specs, and the output contract:** [`.cursor/rules/jira-story-input.mdc`](.cursor/rules/jira-story-input.mdc).
- **Conventions** for titles, steps, and expected results: [`.cursor/rules/test-case-style.mdc`](.cursor/rules/test-case-style.mdc).
- Helper scripts are listed in **`package.json`**; run **`npm test`** for the script unit tests.

## Documentation

- [`docs/PROJECT_PACKS.md`](docs/PROJECT_PACKS.md) — adjusting style per Jira project.
- [`docs/JIRA_AUTOMATION.md`](docs/JIRA_AUTOMATION.md) — wiring Jira to GitHub.
- [`docs/GITHUB_SECRETS.md`](docs/GITHUB_SECRETS.md) — secrets and variables in detail.
- [`docs/JIRA_MCP_OPTIONS.md`](docs/JIRA_MCP_OPTIONS.md) — choosing a Jira MCP server.
