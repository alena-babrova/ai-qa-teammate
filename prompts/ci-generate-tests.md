**GitHub Actions (headless).** Parent Jira issue: **`__ISSUE_KEY__`**.

1. Follow **`.cursor/rules/ai-test-generator.mdc`** (canonical schema, **Jira MCP only** for creating/linking Tests, no interactive questions).
2. Follow **`.cursor/skills/jira-story-test-cases-md/SKILL.md`**, especially **`## Headless CI (this repository, GitHub Actions)`**, for how to derive tests from the story.
3. **Task:** Load **`__ISSUE_KEY__`** via Jira MCP (`jira_getIssue`, `jira_searchIssues`, etc.). Write **`generated/jira-tests/__ISSUE_KEY__/tests.json`**. Create **every** Test issue and link to the parent **via MCP only**; then add required **`meta.json`** (`jiraPublish`, `mcpCreatedKeys`) as defined in the rules.
4. Do **not** ask questions; do **not** put secrets in files.
