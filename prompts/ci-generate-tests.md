**Headless CI.** Target **`__ISSUE_KEY__`**; story **`__STORY_KEY__`** (workflow-resolved); project **`__PROJECT_KEY__`**. If **`__ISSUE_KEY__` ≠ `__STORY_KEY__`**, the Sub-task is **trigger only**—requirements and the **`generated/jira-tests/__STORY_KEY__/`** path use **`__STORY_KEY__`** as in **`.cursor/rules/jira-story-input.mdc`**.

**Read-only.** Jira is an input. Do **not** create, update, transition, link, label, or comment on any Jira issue.

**Deliverable:** **`generated/jira-tests/__STORY_KEY__/__STORY_KEY__-test-cases.md`** plus **`meta.json`** (**`caseCount`** must match the number of **`##`** cases). Nothing else is published.

**Project pack:** __PROJECT_PACK__

Follow **`.cursor/skills/jira-story-test-cases-md/SKILL.md`** end to end (pre-check, linked specs, authoring, empty story). Jira input + output contract: **`.cursor/rules/jira-story-input.mdc`**. Format defaults: **`.cursor/rules/test-case-style.mdc`**.

**CI input:** Read **`generated/jira-tests/__STORY_KEY__/requirement-signals.json`** when present. If **`requirementsReadFailed`** is true, stop—the workflow should already have failed.

No questions; no secrets in repo files.
