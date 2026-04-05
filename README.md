# ai-qa-teammate

Turns a **Jira story or task** (the parent issue) into **Jira Test issues** with steps and expected results, using **Cursor** in **GitHub Actions**. You supply the issue key; the automation generates the cases, creates the Test work items in Jira, and checks that the run completed end-to-end.

## How it runs (CI)

The **Generate Test Cases** workflow in this repository runs in **GitHub Actions**—on demand or when another system triggers it. It uses the Cursor agent with this repo’s rules and prompts, then validates the outcome before the job finishes.

## Starting a run

- **From GitHub:** **Actions** → **Generate Test Cases** → **Run workflow** → enter the Jira **issue key** (e.g. `PROJ-123`).
- **From Jira:** You can drive the same workflow with automation (see [`docs/JIRA_AUTOMATION.md`](docs/JIRA_AUTOMATION.md)).

## Required GitHub secrets

**Where to set them:** open the repository on GitHub → **Settings** → **Secrets and variables** → **Actions** → **Secrets** → **New repository secret**. (Organization secrets are also supported if your org allows this repo to use them.)

**What to define:** create these four secrets:

| Secret | Purpose (summary) |
|--------|-------------------|
| `CURSOR_API_KEY` | Cursor Agent in Actions |
| `JIRA_BASE_URL` | Your Jira instance URL |
| `JIRA_USER_EMAIL` | Jira account identifier for automation |
| `JIRA_API_TOKEN` | Jira token for the agent and related steps |

For full detail on each secret, see **[`docs/GITHUB_SECRETS.md`](docs/GITHUB_SECRETS.md)**.

**Cursor Agent model in CI:** default is **[`.cursor/ci/agent.json`](.cursor/ci/agent.json)** (`model`). Optional GitHub Actions variable **`CURSOR_AGENT_MODEL`** overrides it without a commit. See **`docs/GITHUB_SECRETS.md`**.

## Other setup

- **Jira project, Test type, and custom fields:** [`.cursor/rules/jira-test-create.mdc`](.cursor/rules/jira-test-create.mdc).
- **Conventions** for titles, steps, and expected results: [`.cursor/rules/`](.cursor/rules/).

## Output

Generated content for each run lives under **`generated/jira-tests/<STORY_KEY>/`**, where **`STORY_KEY`** is the **story** the workflow resolves from your input (the **parent** when you dispatch a **Sub-task**, otherwise the same as the key you entered). Gitignored except a **`.gitkeep`**. Helper scripts are listed in **`package.json`**.

## Documentation

- [`docs/JIRA_AUTOMATION.md`](docs/JIRA_AUTOMATION.md) — wiring Jira to GitHub.
