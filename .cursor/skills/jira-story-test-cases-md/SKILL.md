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

Use when the user wants **new test cases** written as **Markdown** (not Jira issue creation unless they ask separately), sourced from a **Jira User Story** or **Epic** description (acceptance criteria, Gherkin tables, scope).

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

### User Story (or Epic)

1. Parse `<STORY_KEY>` from the user’s URL or key (e.g. `EPMRPP-98726`).
2. `jira_get_issue` with fields at least: `summary`, `description`, `status`, `issuetype`. Use **description** for AC, Gherkin tables, in/out of scope, permissions, localization, analytics, design links.

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

## Interaction with other skills and rules

- **`import-jira-tests-to-agentic-qa`:** That skill **imports existing** Jira Tests into Agentic QA. This skill **authors Markdown** from a story + references; it does not replace Jira issue creation unless the user explicitly requests creating Test issues in Jira.
- **`jira-test-cases-epmrpp-style` (.mdc):** Default **format** (default RPP); always applied without prompting.

---

## Checklist before handing off

- [ ] **EPMRPP `.mdc` rule** applied (or skill template if rule missing) + **Note** in file for Markdown deliverables.
- [ ] Story description mined for AC, scope, i18n, permissions, analytics.
- [ ] Preconditions / Steps / Expected align with **EPMRPP rule**.
- [ ] File named and story URL included.

---

## Headless CI (this repository, GitHub Actions)

**This section overrides** the Markdown-only deliverable when the agent runs in **GitHub Actions** for **ai-qa-teammate** (e.g. `CI=true`, **Generate Test Cases** workflow).

1. **Do not** ask any question. Use **default RPP (Path A)** — read **`.cursor/rules/jira-test-cases-epmrpp-style.mdc`** if it exists; if missing, use **Authoring rules** and **Markdown document shape** above as the logical style guide for titles, granularity, GA scope, and Preconditions/Steps/Expected *content*, but **do not** write a standalone `<KEY>-test-cases.md` as the pipeline deliverable.

2. **Primary deliverable:** **`generated/jira-tests/<ISSUE_KEY>/tests.json`** exactly as specified in **`.cursor/rules/ai-test-generator.mdc`** (`version`, `tests[]` with `summary`, `testSteps`, `expectedResult`, optional `description`). Map logical *Preconditions* + *Steps* into **`testSteps`** and *Expected results* into **`expectedResult`** (plain text). Use **`summary`** for the behavior-focused title (same style as a `##` heading in the Markdown shape).

3. **Required `meta.json`:** After you create **every** Test issue via **Jira MCP** and link each to the parent, write **`meta.json`** next to **`tests.json`** with **`jiraPublish`: `"mcp"`** and **`mcpCreatedKeys`** (same count and order as **`tests`**). CI runs **`scripts/verify-mcp-jira.js`** and **fails** without valid **`meta.json`**. There is no REST publish for Test issues.

4. **Jira MCP:** Use read tools on the parent **`<ISSUE_KEY>`**; create/update/link Test issues **only** via MCP. Use project, type, and custom fields from **`.cursor/rules/jira-test-create.mdc`**.

5. **No secrets** in any generated files.

6. **Project:** Prefer the same Jira **project** as the parent issue (read from **`jira_getIssue`** or equivalent).

7. **Verification:** Output must pass **`scripts/verify-mcp-jira.js`** (same as the workflow step after the agent).
