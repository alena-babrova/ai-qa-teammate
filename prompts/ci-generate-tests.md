**Headless CI.** Target **`__ISSUE_KEY__`**; story **`__STORY_KEY__`** (workflow-resolved). If **`__ISSUE_KEY__` ≠ `__STORY_KEY__`**, the Sub-task is **trigger only**—requirements, paths, and Test links use **`__STORY_KEY__`** only.

1. **Verify you can read the story (Jira MCP).** Before any test work, **`jira_get_issue(__STORY_KEY__)`** / **`jira_getIssue(__STORY_KEY__)`** must **succeed** with non-empty Jira **`summary`** and **`description`** present on the issue (body may be empty). If MCP is missing or the call fails: **do not** write **`generated/jira-tests/__STORY_KEY__/tests.json`** or **`meta.json`**—let verify fail. Full gate, empty story, **`tests.json`** / **`meta.json`**, MCP-only writes: **`.cursor/rules/jira-test-issues.mdc`**.

2. **Generate tests.** Use **only** that story payload (never Sub-task body when keys differ). Emit **`generated/jira-tests/__STORY_KEY__/tests.json`**, create/link **Test** issues via MCP, and **`meta.json`** as in **`jira-test-issues.mdc`**.

3. **Format and shape.** Style and wording: **`.cursor/rules/jira-test-cases-epmrpp-style.mdc`**. How fields map to **`tests[]`** / Jira: **`.cursor/skills/jira-story-test-cases-md/SKILL.md`**.

No questions; no secrets in repo files.
