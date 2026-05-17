---
name: jira-story-test-cases-md
description: >-
  Clarifies how Jira story content maps to manual test shape (Markdown or tests.json).
  EPMRPP formatting is in .cursor/rules/jira-test-cases-epmrpp-style.mdc; Jira Test + CI
  contract is in .cursor/rules/jira-test-issues.mdc. Use for Jira-sourced QA tests.
---

# Jira story → test cases — clarifications

## When this applies

Deriving **manual** tests from a **Jira User Story** or **Epic** (description, AC, Gherkin, scope). **Do not** ask styling questions: use **`.cursor/rules/jira-test-cases-epmrpp-style.mdc`** for all title/step/expected wording.

## How format maps to deliverables

**EPMRPP content** (Preconditions, Steps, Expected results, title patterns) is defined **only** in **`jira-test-cases-epmrpp-style.mdc`**. This skill only explains **where** that content goes:

| Deliverable | Mapping |
|-------------|---------|
| **Jira Test issue** | **Test Steps** (`customfield_19206`) + **Expected result** (`customfield_19207`) + **Test Library** (`customfield_24000`) + **Folder** (`customfield_24001`) — **Folder** = **`AI Generated`** (field id confirmed on [EPMRPP-114179](https://jiraeu.epam.com/browse/EPMRPP-114179); not **`EPMRPP`** root—**`jira-test-issues.mdc`**). Steps string: *Preconditions* + *Steps* (labels; **`1.`…`N.`** or **`# `** per **`.cursor/rules/jira-test-cases-epmrpp-style.mdc`**). **Summary** ← EPMRPP title only (**no** **`STORY_KEY`** in title). **Story ↔ Test link (EPMRPP):** After create/update, link with type **`QaSpace test`** (**link type id `12700`**): **`inwardIssue` = `STORY_KEY` (Story)**, **`outwardIssue` = Test** so the **Story** UI shows **is tested by** (not **is a test for**). See **`jira-test-issues.mdc`** → **Linking Tests to the Story** and example [EPMRPP-114990](https://jiraeu.epam.com/browse/EPMRPP-114990). |
| **`tests.json` (`tests[]`)** | One object per logical test. **`testSteps`** = same combined string as Jira Test Steps above. **`expectedResult`** = *Expected results* string. **`summary`** = Jira Test title. **`description`** = optional Markdown. |
| **Markdown file** | One **`## <title>`** per test (**no** **`STORY_KEY`** in each **`##`** title); under each, *Preconditions* / *Steps* / *Expected results* blocks matching the format rule. Top link: **`https://<your-jira>/browse/<STORY_KEY>`**. Filename: **`<STORY_KEY>-test-cases.md`** unless the user specifies otherwise. |

**Minimal Markdown shape** (repeat per case):

```markdown
# Test cases: <short title from story summary>
**User story:** https://…/browse/<STORY_KEY>
---
## <Area>. <Short behavior-focused title>
*Preconditions:*
…
*Steps:*
…
*Expected results:*
…
```

## Resolve **`STORY_KEY`** (always first)

1. Parse key from URL or paste.
2. **`jira_get_issue`** with **`issuetype`**, **`parent`**, **`summary`**, **`description`**, **`status`** (and AC/DoD-style fields your MCP exposes). Set **`update_history: false`** on reads when the tool supports it.
3. If Sub-task (or equivalent) and **`parent.key`** exists → **`STORY_KEY = parent.key`**. Original key is **trigger only**; do **not** use Sub-task body for scenarios.
4. Else **`STORY_KEY`** = that issue’s key.
5. **MCP pre-check (before generating tests):** Call **`jira_get_issue(STORY_KEY)`** via Jira MCP. **Pass** only if the call succeeds, Jira **`summary`** (issue title) is **non-empty**, and **`description`** is **present** in the payload (may be empty). **Do not** author **`tests[]`** or Markdown cases until this passes. On failure: **do not** write **`tests.json`** / **`meta.json`** in CI (job must fail at verify)—see **`.cursor/rules/jira-test-issues.mdc`** (**Pre-generation MCP gate**).
6. Use that same response for requirements: **`description`**, AC/DoD custom fields, etc. (no second fetch unless retrying after error). If those fields (or comments you fetch) contain **Confluence**, **Figma**, or **EPAM GitLab** (**`git.epam.com`**) URLs, use the **Atlassian** (Confluence), **Figma**, and **GitLab** MCP servers to **read** linked pages, designs, or GitLab files **before** authoring tests—see **`.cursor/rules/jira-test-issues.mdc`** → **Story-linked Confluence, Figma, and GitLab**.

## Reference Jira **`Test`** issues as style source (optional)

Use **only** when the user **explicitly** asks to mirror **existing Jira `Test`** issues or provides **`Test`** keys/URLs or a **parent** Story/Task/Epic whose **linked** Tests should define granularity and tone. This does **not** replace the EPMRPP rule: stay **compatible** with **`.cursor/rules/jira-test-cases-epmrpp-style.mdc`** unless the user requests strict copy from Jira.

- **Direct `Test` key(s):** For each key, **`jira_get_issue`** with fields at least **`summary`**, **`customfield_19206`** (Test Steps), **`customfield_19207`** (Expected result). Mirror summary prefix patterns, section labels, numbering (`# ` vs **`1.`**), and bundling when helpful.
- **Parent Story/Task/Epic only:** List linked Tests, e.g. JQL  
  `issue in linkedIssues(<PARENT_KEY>) AND issuetype = Test ORDER BY key ASC`  
  (paginate with your MCP’s **`limit`** / **`start_at`**). Then fetch **`customfield_19206`** / **`customfield_19207`** per **`Test`** key. **If zero linked Tests:** say so; do **not** fabricate a reference suite—proceed from the story using the EPMRPP rule only, or ask the user for **`Test`** keys.
- **Wrong field IDs:** If step/expected fields are empty, use **`jira_search_fields`** (or equivalent) for **Test steps** / **Expected result** for that project and re-fetch.

## Authoring rules

- Map story **acceptance criteria** and **numbered / Gherkin** scenarios to **discrete** test cases; split when an explicit reference suite (above) would split.
- **Localization / languages:** Do **not** add cases focused on translations, language switching, locale-only formatting, RTL, or multilingual copy—unless the user **explicitly** asks.
- **Google Analytics / telemetry:** Include GA-style cases **only** if the story or user explicitly requires them (or a reference suite you are mirroring consistently includes them).
- Respect **out of scope** in the story: do **not** add API/backend contract tests if the story says there is **no** backend/API—unless you are mirroring a reference suite **and** the user asked for that mirroring.
- Add **edge / regression** cases when the story implies them (persistence, permissions, multiple tabs, large viewport, etc.).

## Empty story

Applies **only after** a **successful** **`jira_get_issue(STORY_KEY)`** shows **description** has no substantive body **and** AC/DoD fields are empty. Then: **no** invented tests, **no** Sub-task backfill. **CI:** **`tests: []`**, **`meta.json`** with **`mcpCreatedKeys: []`** — **`jira-test-issues.mdc`**. **Markdown:** short note only, no fake **`##`** cases.

If Jira tools are **unavailable** or the fetch **errors**, **do not** use this path—**do not** write empty **`tests.json`** as if the story were empty. Fetch in **GitHub Actions** or **IDE with MCP** first (see **`jira-test-issues.mdc`** → **Jira fetch required**).

## GitHub Actions (this repo)

Primary output is **`generated/jira-tests/<STORY_KEY>/tests.json`**, Jira Test issues via MCP, and **`meta.json`**. Follow **`prompts/ci-generate-tests.md`** (from **`scripts/build-ci-prompt.js`**) and **`.cursor/rules/jira-test-issues.mdc`**. On reruns, **fetch linked Tests** for **`STORY_KEY`** first; **update** matching issues, **create** only new ones—see **Sync with existing Jira Tests** in **`jira-test-issues.mdc`**. Do **not** use Sub-task **`ISSUE_KEY`** for paths or summaries when it differs from **`STORY_KEY`**.

## Interaction with other skills

- **`import-jira-tests-to-agentic-qa`:** **imports existing** Jira Tests into Agentic QA (read-only). This skill **authors** Markdown **`tests.json`** / Jira-shaped content **from a story**; it does not replace Jira Test creation when the user or CI requests MCP sync—see **`jira-test-issues.mdc`**.

## Checklist

- [ ] **`STORY_KEY`** resolved; requirements from **story** only.
- [ ] **MCP pre-check** passed (non-empty Jira **`summary`**, **`description`** field present) before authoring.
- [ ] Confluence / Figma / GitLab MCP used for **story-linked** URLs only (**`jira-test-issues.mdc`**); dedupe URLs, **minimize** calls (one success per distinct target; **no** browsing **git.epam.com** beyond links from the story). On MCP read failure, continue from Jira **without** narrating errors or 429 in streamed output.
- [ ] Empty story → no fabricated tests **only after successful Jira fetch** (see **Empty story** above).
- [ ] **Optional reference `Test` issues:** fetched and mirrored only when the user explicitly asked; **zero linked Tests** handled without inventing a suite.
- [ ] **Localization / GA / out-of-scope** judgment applied per **Authoring rules**.
- [ ] Preconditions / Steps / Expected match **`jira-test-cases-epmrpp-style.mdc`**.
- [ ] **`tests.json`** / Jira fields aligned with **How format maps** table above.
- [ ] If the story already has linked Tests: **no duplicates**—**update** by matching **summary**, **create** only gaps (**`jira-test-issues.mdc`**).
- [ ] After successful Jira sync: story **comment** on **`STORY_KEY`** = **summary + Test key/title list only**—**no** gaps or limitations (**`jira-test-issues.mdc`** → **Story comment after successful test generation**).
