---
name: jira-story-test-cases-md
description: >-
  Derives manual test cases from a Jira User Story (or Epic) into a Markdown file.
  Uses default Report Portal / EPMRPP style via workspace rule jira-test-cases-epmrpp-style
  (.mdc) — no styling prompts. Use when the user wants test cases from a Jira user story,
  QA tests from Jira into .md, or manual tests in Markdown from a story link.
---

# Jira user story → Markdown test cases

## When this skill applies

Use when the user wants **new test cases** written as **Markdown** (not Jira issue creation unless they ask separately), sourced from a **Jira User Story** or **Epic** description (acceptance criteria, Gherkin tables, scope). If the user gives a **Sub-task** key or URL (e.g. “Test design”), **resolve the parent story first** and base all tests on that story only—see **Resolve `STORY_KEY` (verify first)** below.

**Default deliverable:** one Markdown document, one `##` section per test case, with *Preconditions* / *Steps* / *Expected results* blocks.

---

## Default style (no prompts)

**Do not** ask any styling or format question. Proceed immediately with **default RPP (Path A)**:

- Do **not** fetch Jira Tests for styling.
- **Apply** the Cursor project rule **`jira-test-cases-epmrpp-style`** — read `.cursor/rules/jira-test-cases-epmrpp-style.mdc` in the **active workspace** if it is not already in context (`alwaysApply` may inject it). Use it for titles (UI / `Permissions.` / `GA.` / `API.`), Preconditions/Steps/Expected conventions, API/GA wording, etc.

### Note in the Markdown file

After the title line:

- *“**Note:** Style per EPMRPP default rule — no reference Jira Test issues were provided.”*

### Fallback if `.mdc` is missing

Use the **Markdown document shape** section in this skill only, and state that in the note.

---

## Jira data (Atlassian MCP)

Use the configured Jira tools (e.g. `user-atlassian` / `jira_get_issue`, `jira_search`, `jira_search_fields`). Set `update_history: false` on reads when supported.

### Resolve `STORY_KEY` (verify first)

**Always** determine the canonical **story** key before writing tests:

1. Parse the issue key from the user’s URL or paste (e.g. `EPMRPP-98726`).
2. **`jira_get_issue`** that key with at least **`issuetype`**, **`parent`**, **`summary`**.
3. If **`issuetype`** indicates a **Sub-task** (or equivalent) and **`parent.key`** is present, set **`<STORY_KEY> = parent.key`**. The original key is **only a trigger**; **do not** use the Sub-task’s **description** or **summary** to define test scenarios.
4. Otherwise **`<STORY_KEY>`** is the key from step 1 (the issue is the story or top-level work item you are testing from).
5. Fetch requirements from **`jira_get_issue(<STORY_KEY>)`** with at least **`summary`**, **`description`**, **`status`**, **`issuetype`**, and any AC/DoD custom fields your tool returns. Use **description** (and AC fields) for AC, Gherkin tables, in/out of scope, permissions, localization, analytics, design links.

### User Story (or Epic) — requirements fetch

After **`STORY_KEY`** is fixed per above, all test-design content comes from the **story** issue only.

### Empty story — **do not** create tests

If the story’s **description** has no substantive body (missing, null, whitespace-only, or empty ADF) **and** every **Acceptance Criteria** / **DoD** (or equivalent) custom field you fetched is also empty or missing, the story has **no testable content**. **Summary alone is not sufficient.**

Then: **do not** author test cases, **do not** create Jira Test issues, **do not** use Sub-task text as a substitute.

- **CI (`tests.json`):** write **`"tests": []`** and **`meta.json`** with **`"jiraPublish": "mcp"`** and **`"mcpCreatedKeys": []`** (see **`.cursor/rules/ai-test-generator.mdc`**).
- **Markdown deliverable:** write only a short document stating that **`STORY_KEY`** has no description/AC to derive tests from (no fabricated `##` test sections).

---

## Authoring rules

- Map story **acceptance criteria** and **numbered / Gherkin** scenarios to **discrete** test cases; split when the reference suite would split (e.g. one scenario per `##`).
- Add **edge / regression** cases when the story implies them (persistence, `localStorage`, permissions, multiple tabs, i18n, large viewport, etc.).
- Respect **out of scope** in the story: do **not** add API/backend contract tests if the story states there is **no** backend/API for the feature—unless reference Tests consistently include a parallel pattern **and** the user asked to mirror that pattern; when in doubt, follow the **story**.
- **Google Analytics / telemetry:** Include GA cases **only** if the story or user explicitly requires them; otherwise omit or add a single optional case with a pointer to the team KB (same judgment as the reference suite density).
- **Naming:** With references, mirror their area prefix and tone. **Without** references, follow `.cursor/rules/jira-test-cases-epmrpp-style.mdc` in the workspace (e.g. `Organizations. <Page>. …`, `API. <Controller>. …`).
- **Output filename:** Prefer `<STORY_KEY>-test-cases.md` unless the user specifies a path.
- **Story link** at the top:
  ```
  **User story:** https://jiraeu.epam.com/browse/<STORY_KEY>
  ```
  If the instance host differs, substitute the user’s base URL.

---

## Markdown document shape

```markdown
# Test cases: <STORY_KEY> — <short title from story summary>

**User story:** https://jiraeu.epam.com/browse/<STORY_KEY>

---

## <Area>. <Short behavior-focused title>

*Preconditions:*

# ...

*Steps:*

# ...

*Expected results:*

# ...

---

(repeat for each test case)
```

- Use `---` between cases if it improves readability (optional but consistent with prior deliverables).
- Body should contain **test cases only** unless the user asked for extra sections (traceability matrix, etc.).

---

## Headless CI (this repository, GitHub Actions)

When **`CI=true`** (or the run is the **Generate Test Cases** workflow), this skill’s **Markdown file** is **not** the primary deliverable. Follow **`.cursor/rules/ai-test-generator.mdc`** and the rendered prompt from **`prompts/ci-generate-tests.md`** (via **`scripts/build-ci-prompt.js`**).

**Verify first:** The workflow sets **`ISSUE_KEY`** (dispatch target, often a Sub-task) and **`STORY_KEY`** (canonical story—the **parent** when the target is a Sub-task). If **`ISSUE_KEY` ≠ `STORY_KEY`**, the Sub-task is **only a trigger**; **never** use its description or summary for test design.

**Then:**

- Derive tests using the same **authoring rules** as above (AC mapping, scope, GA judgment, EPMRPP style via **`.cursor/rules/jira-test-cases-epmrpp-style.mdc`**), but source **only** **`jira_getIssue(STORY_KEY)`** (or equivalent) for requirements. If the story is **empty** per **Empty story — do not create tests** above, emit **`tests: []`** and **`meta.json`** with **`mcpCreatedKeys: []`**—**no** MCP Test creation.
- Emit **`generated/jira-tests/<STORY_KEY>/tests.json`** (and **`meta.json`** after MCP creates Tests, or empty manifests when there are no tests)—**never** use **`ISSUE_KEY`** as the folder name when the two keys differ.
- Each **`tests[].summary`** must contain **`STORY_KEY`**; **do not** put the Sub-task key in summaries when it differs from **`STORY_KEY`**.

---

## Checklist before handing off

- [ ] **`STORY_KEY` resolved** (Sub-task → parent); requirements taken **only** from the story issue, not from a trigger Sub-task.
- [ ] If story **description** and **AC/DoD** fields are empty: **no** invented tests—**`tests: []`** + empty **`mcpCreatedKeys`**, or Markdown note only.
- [ ] **EPMRPP `.mdc` rule** applied (or skill template if rule missing) + **Note** in file for Markdown deliverables.
- [ ] Story description mined for AC, scope, i18n, permissions, analytics.
- [ ] Preconditions / Steps / Expected align with **EPMRPP rule**.
- [ ] File named and story URL included (URL uses **`<STORY_KEY>`**, the canonical story).