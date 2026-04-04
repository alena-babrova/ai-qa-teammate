# ai-qa-teammate

Turns a **Jira story or task** (the parent issue) into **Jira Test issues** with steps and expected results, using **Cursor** in **GitHub Actions**. You supply the issue key; the automation generates the cases, creates the Test work items in Jira, and checks that the run completed end-to-end.

## How it runs

- **In GitHub:** The **Generate Test Cases** workflow runs on demand or when another system triggers it. It uses the Cursor agent with this repository’s rules and prompts, then validates the outcome before the job finishes.
- **On your machine:** Open the repo in **Cursor** to work with the same rules and skills. Day-to-day authoring and review happen in the IDE; the unattended run is intended for GitHub Actions only.

## Starting a run

- **From GitHub:** **Actions** → **Generate Test Cases** → **Run workflow** → enter the Jira **issue key** (e.g. `PROJ-123`).
- **From Jira:** You can drive the same workflow with automation (see [`docs/JIRA_AUTOMATION.md`](docs/JIRA_AUTOMATION.md)).

## Setup

- **Secrets and variables** for Actions: [`docs/GITHUB_SECRETS.md`](docs/GITHUB_SECRETS.md).
- **Jira field mapping** (project, Test type, custom fields): [`config/jira.test-generator.json`](config/jira.test-generator.json).
- **Conventions** for titles, steps, and expected results: [`.cursor/rules/`](.cursor/rules/).

## Output

Generated content for each run lives under **`generated/jira-tests/<ISSUE_KEY>/`** (gitignored except a **`.gitkeep`**). Helper scripts are listed in **`package.json`**.

## Documentation

- [`docs/JIRA_AUTOMATION.md`](docs/JIRA_AUTOMATION.md) — wiring Jira to GitHub.
- [`docs/GITHUB_SECRETS.md`](docs/GITHUB_SECRETS.md) — required secrets.
