**Headless CI.** Target **`__ISSUE_KEY__`**; story **`__STORY_KEY__`** (workflow-resolved). If **`__ISSUE_KEY__` ≠ `__STORY_KEY__`**, the Sub-task is **trigger only**—requirements, **`generated/jira-tests/__STORY_KEY__/`** paths, Test links, and completion comment rules use **`__STORY_KEY__`** / **`__ISSUE_KEY__`** as in **`.cursor/rules/jira-test-issues.mdc`**.

Follow **`.cursor/skills/jira-story-test-cases-md/SKILL.md`** end to end (pre-check, linked specs, authoring, Jira sync, empty story). Jira Test + CI contract: **`.cursor/rules/jira-test-issues.mdc`**. EPMRPP format: **`.cursor/rules/jira-test-cases-epmrpp-style.mdc`**.

**CI input:** Read **`generated/jira-tests/__STORY_KEY__/requirement-signals.json`** when present. If **`requirementsReadFailed`** is true, stop—the workflow should already have failed.

No questions; no secrets in repo files.
