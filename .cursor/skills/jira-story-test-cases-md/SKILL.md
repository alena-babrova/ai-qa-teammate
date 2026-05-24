---
name: jira-story-test-cases-md
description: >-
  Clarifies how Jira story content maps to manual test shape (Markdown or tests.json).
  EPMRPP formatting is in .cursor/rules/jira-test-cases-epmrpp-style.mdc; Jira Test + CI
  contract is in .cursor/rules/jira-test-issues.mdc. Style context in test-case-examples/CONTEXT.md;
  full examples in test-case-examples/. Very optional Jira investigation (Epic closed stories,
  Test library) when examples are insufficient. Use for Jira-sourced QA tests.
---

# Jira story → test cases — clarifications

## When this applies

Deriving **manual** tests from a **Jira User Story** or **Epic** (description, AC, Gherkin, scope). **Do not** ask styling questions: use **`.cursor/rules/jira-test-cases-epmrpp-style.mdc`** for format rules and **`test-case-examples/CONTEXT.md`** for granularity, title patterns, and coverage splits (synthesized from all example suites below).

## Reference examples (`test-case-examples/`)

Before authoring **`tests.json`**, Jira Tests, or Markdown:

1. **Read `test-case-examples/CONTEXT.md`** — consolidated patterns (granularity, title shapes, preconditions/steps/expected conventions, calibration counts).
2. **Use the per-story `.md` files** when you need full step-level examples for a similar feature type.

| Example file | Use when the story is similar to |
|--------------|-----------------------------------|
| `EPMRPP-89670-test-cases.md` | Organization-level UI page layout, table columns, pagination, permissions matrix |
| `EPMRPP-91802-test-cases.md` | Instance-level modal CRUD, field validation, org/project assignment, GA events |
| `EPMRPP-105682-test-cases.md` | Invitation / registration flow, email link activation, redirect after signup |
| `EPMRPP-111251-test-cases.md` | Filters side panel, filter combinations, “All Filters” UX, autocomplete fields |
| `EPMRPP-108273-test-cases.md` | Table customization (columns modal, localStorage, reset to default) |
| `EPMRPP-114379-test-cases.md` | Org settings integrations page, mixed UI + API + GA coverage |
| `EPMRPP-114952-test-cases.md` | Global plugin integration CRUD, validation, connection states, API permissions |
| `EPMRPP-114989-test-cases.md` | Project-level plugin page, empty vs configured states, device list |
| `EPMRPP-93348-test-cases.md` | REST API endpoint, role/org-type permission matrix, error codes |
| `EPMRPP-99095-test-cases.md` | REST API partial update, field validation, slug/name rules, auth errors |

## How format maps to deliverables

**EPMRPP content** (Preconditions, Steps, Expected results, title patterns) is defined **only** in **`jira-test-cases-epmrpp-style.mdc`**. This skill only explains **where** that content goes:

| Deliverable | Mapping |
|-------------|---------|
| **Jira Test issue** | **Test Steps** (`customfield_19206`) + **Expected result** (`customfield_19207`) + **Test Library** (`customfield_24000`) + **Folder** (`customfield_24001`) + **Test Requirement** (`customfield_29300` → **`STORY_KEY`**; UI **Test Requirement**; example unset: [EPMRPP-115882](https://jiraeu.epam.com/browse/EPMRPP-115882); **Folder** = **`AI Generated`** (field id on [EPMRPP-114179](https://jiraeu.epam.com/browse/EPMRPP-114179); not **`EPMRPP`** root—**`jira-test-issues.mdc`**). **`priority`**: risk-based per **`jira-test-issues.mdc`** → **Test priority** (**do not** default every Test to **Major**). Steps string: *Preconditions* + *Steps* (labels; **`1.`…`N.`** or **`# `** per **`.cursor/rules/jira-test-cases-epmrpp-style.mdc`**). **Summary** ← EPMRPP title only (**no** **`STORY_KEY`** in title). **Story ↔ Test link (EPMRPP):** After create/update, link with type **`QaSpace test`** (**link type id `12700`**): **`inwardIssue` = `STORY_KEY` (Story)**, **`outwardIssue` = Test** so the **Story** UI shows **is tested by** (not **is a test for**). See **`jira-test-issues.mdc`** → **Linking Tests to the Story** and example [EPMRPP-114990](https://jiraeu.epam.com/browse/EPMRPP-114990). |
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
2. **`jira_get_issue`** with **`issuetype`**, **`parent`**, **`summary`**, **`description`**, **`priority`**, **`status`** (and AC/DoD-style fields your MCP exposes). Set **`update_history: false`** on reads when the tool supports it.
3. If Sub-task (or equivalent) and **`parent.key`** exists → **`STORY_KEY = parent.key`**. Original key is **trigger only**; do **not** use Sub-task body for scenarios.
4. Else **`STORY_KEY`** = that issue’s key.
5. **MCP pre-check (before generating tests):** Call **`jira_get_issue(STORY_KEY)`** via Jira MCP. **Pass** only if the call succeeds, Jira **`summary`** (issue title) is **non-empty**, and **`description`** is **present** in the payload (may be empty). **Do not** author **`tests[]`** or Markdown cases until this passes. On failure: **do not** write **`tests.json`** / **`meta.json`** in CI (job must fail at verify)—see **`.cursor/rules/jira-test-issues.mdc`** (**Pre-generation MCP gate**).
6. Use that same response for requirements: **`description`**, **`priority`** (for calibrating each Jira Test **priority**), AC/DoD custom fields, etc. (no second fetch unless retrying after error). If those fields (or comments you fetch) contain **Confluence**, **Figma**, or **EPAM GitLab** (**`git.epam.com`**) URLs, use the **Atlassian** (Confluence), **Figma**, and **GitLab** MCP servers to **read** linked pages, designs, or GitLab files **before** authoring tests—see **`.cursor/rules/jira-test-issues.mdc`** → **Story-linked Confluence, Figma, and GitLab**.

## Investigating coverage in Jira (**very optional**)

**Default path:** **`test-case-examples/CONTEXT.md`** + matching **`EPMRPP-*-test-cases.md`** files + **`.cursor/rules/jira-test-cases-epmrpp-style.mdc`**. That is enough for most stories—**do not** browse Jira unless you still lack ideas for **which** cases to write or **how** to split them.

**When to consider (only if needed):** Repo examples do not cover the story area, or you want extra signal on **coverage patterns** (permissions matrix depth, validation cases, GA pairs) before drafting **`tests[]`**.

### A. Related Epic → **Closed** stories → linked Tests

While planning **which** test cases to create (after **`jira_get_issue(STORY_KEY)`**, before bulk authoring):

1. **Resolve the Epic** for **`STORY_KEY`** from the story payload—e.g. Epic Link / parent Epic / `"Epic Link"` custom field (field id varies; use whatever **`jira_get_issue`** returns). If **`STORY_KEY`** **is** an Epic, use it directly.
2. **Find closed sibling stories** under that Epic (**read-only** **`jira_search`**). Try JQL that fits your instance, e.g.:
   - `"Epic Link" = <EPIC_KEY> AND status = Closed AND issuetype in (Story, "User Story") ORDER BY updated DESC`
   - `parent = <EPIC_KEY> AND status in (Closed, Done) AND issuetype in (Story, "User Story") ORDER BY updated DESC`
   - `issue in linkedIssues(<EPIC_KEY>) AND issuetype in (Story, "User Story") AND statusCategory = Done ORDER BY updated DESC`
3. **Pick 1–3 closed stories** whose **summary** is closest to the current story (same page, plugin, controller, or feature area)—not every child of the Epic.
4. For each chosen story, list linked Tests:  
   `issue in linkedIssues(<CLOSED_STORY_KEY>) AND issuetype = Test ORDER BY key ASC`  
   Fetch **`summary`**, **`customfield_19206`**, **`customfield_19207`** for a **small sample** (e.g. **3–5** Tests per story, or skim titles only if the suite is large).
5. **Use for investigation only** — infer which scenario types the team already tested nearby (layout, Impossible to…, Permissions., API errors, GA ON/OFF). **Author new cases from the current story’s AC**; do not copy unrelated closed-story scenarios verbatim.

**Skip** if there is no Epic, no closed siblings, no linked Tests, or MCP fails—proceed with repo examples + story requirements.

### B. Test library keyword search

If Epic siblings are not enough (or Epic is missing):

1. **Stay read-only** — **`Test`** issues only; never mutate the library for discovery.
2. **Targeted JQL**, e.g.:
   - `project = EPMRPP AND issuetype = Test AND summary ~ "<Area or Page from story>" ORDER BY key DESC`
   - `project = EPMRPP AND issuetype = Test AND summary ~ "API. <Controller name>" ORDER BY key DESC`
3. **Sample lightly** — **3–5** hits; fetch steps/expected; infer prefix, numbering, bundling.
4. **Still author from the current story** — library Tests inform **shape/coverage ideas** only.
5. **Skip silently on failure** — do not narrate in CI output or Jira comments.

**User-explicit mirror:** When the user **asks** to mirror specific **`Test`** keys or linked Tests on a given parent, follow **Reference Jira `Test` issues (user request)** below instead of this investigation path.

## Reference Jira `Test` issues (user request)

Use when the user **explicitly** asks to mirror **existing Jira `Test`** issues or provides **`Test`** keys/URLs or a **parent** Story/Task/Epic whose **linked** Tests should define granularity and tone. Stay **compatible** with **`.cursor/rules/jira-test-cases-epmrpp-style.mdc`** unless the user requests strict copy from Jira.

- **Direct `Test` key(s):** For each key, **`jira_get_issue`** with fields at least **`summary`**, **`customfield_19206`** (Test Steps), **`customfield_19207`** (Expected result). Mirror summary prefix patterns, section labels, numbering (`# ` vs **`1.`**), and bundling when helpful.
- **Parent Story/Task/Epic only:** List linked Tests, e.g. JQL  
  `issue in linkedIssues(<PARENT_KEY>) AND issuetype = Test ORDER BY key ASC`  
  (paginate with your MCP’s **`limit`** / **`start_at`**). Then fetch **`customfield_19206`** / **`customfield_19207`** per **`Test`** key. **If zero linked Tests:** say so; do **not** fabricate a reference suite—proceed from the story using CONTEXT + EPMRPP rule, or ask the user for **`Test`** keys.
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
- [ ] **Reference context:** **`test-case-examples/CONTEXT.md`** read; relevant **`EPMRPP-*-test-cases.md`** examples consulted for similar story shape.
- [ ] **MCP pre-check** passed (non-empty Jira **`summary`**, **`description`** field present) before authoring.
- [ ] Confluence / Figma / GitLab MCP used for **story-linked** URLs only (**`jira-test-issues.mdc`**); dedupe URLs, **minimize** calls (one success per distinct target; **no** browsing **git.epam.com** beyond links from the story). On MCP read failure, continue from Jira **without** narrating errors or 429 in streamed output.
- [ ] Empty story → no fabricated tests **only after successful Jira fetch** (see **Empty story** above).
- [ ] **Optional Jira investigation:** Epic → **Closed** sibling stories → linked **`Test`** samples, and/or library JQL—**read-only**, small sample only; skipped when not needed.
- [ ] **User-requested `Test` mirror:** fetched only when the user explicitly asked; **zero linked Tests** handled without inventing a suite.
- [ ] **Localization / GA / out-of-scope** judgment applied per **Authoring rules**.
- [ ] Preconditions / Steps / Expected match **`jira-test-cases-epmrpp-style.mdc`**.
- [ ] **`tests.json`** / Jira fields aligned with **How format maps** table above (**`customfield_29300`** **Test Requirement** → **`STORY_KEY`**; **`priority`** per **Test priority**—not all **Major**).
- [ ] If the story already has linked Tests: **no duplicates**—**update** by matching **summary**, **create** only gaps (**`jira-test-issues.mdc`**).
- [ ] After successful Jira sync: completion **comment only on the Test Design Sub-task** (**never** on **`STORY_KEY`**) per **`jira-test-issues.mdc`** → **Test Design sub-task comment after successful test generation** (headless CI: **`__ISSUE_KEY__`** when **`__ISSUE_KEY__` ≠ `__STORY_KEY__`**; otherwise **omit**).
