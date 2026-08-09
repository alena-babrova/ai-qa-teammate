---
name: jira-story-test-cases-md
description: >-
  Clarifies how Jira story content maps to manual test cases in Markdown. Jira reading and the
  output contract are in .cursor/rules/jira-story-input.mdc; formatting is in
  .cursor/rules/test-case-style.mdc, extended by a project pack when CI **project** input or **PROJECT** env names a folder under projects/. Very optional read-only Jira investigation (Epic closed stories,
  Test library) when examples are insufficient. Use for Jira-sourced QA tests.
---

# Jira story → test cases — clarifications

## When this applies

Deriving **manual** tests from a **Jira User Story** or **Epic** (description, AC, Gherkin, scope) into a **Markdown** file. **Do not** ask styling questions: always use **`.cursor/rules/test-case-style.mdc`**. Add a project pack **only** when the run's **project** input (CI), **`PROJECT`** env, or the user names a pack folder that exists under **`projects/`**.

**Read-only:** the Jira issue is input. Never create, update, link, label, or comment on Jira issues—see **`.cursor/rules/jira-story-input.mdc`** → **Read-only Jira**.

## Project pack (opt-in: generic + project rules)

**Default: generic only** — **`.cursor/rules/test-case-style.mdc`** and the story's vocabulary.

**Generic + pack** when **project** is set for the run (**`PROJECT`** env / CI prompt) **and** **`projects/<id>/PROJECT.md`** exists — e.g. **`project: EPMRPP`** → **`projects/EPMRPP/`**. The Jira project key on the ticket does **not** auto-select a pack.

1. Resolve pack from **project** input or explicit user request (not from **`STORY_KEY`** alone).
2. **Pack resolved:** read **`PROJECT.md`**, then **`CONTEXT.md`** if present, then matching **`examples/`** when needed. **Generic + pack**; pack **wins on conflict**.
3. **No project input / missing folder:** **generic only**.

See **`projects/README.md`**.

## Deliverable

One Markdown file at **`generated/jira-tests/<STORY_KEY>/<STORY_KEY>-test-cases.md`**, plus **`meta.json`**. Full contract (paths, `meta.json` shape, empty story, Figma gate): **`.cursor/rules/jira-story-input.mdc`** → **Output contract**.

```markdown
# Test cases: <STORY_KEY> — <short title from story summary>

**User story:** https://…/browse/<STORY_KEY>

---

## <Area>. <Short behavior-focused title>

*Preconditions:*
…

*Steps:*
…

*Expected results:*
…

---
```

- One **`##`** heading per test case; **`STORY_KEY`** (and a differing Sub-task **`ISSUE_KEY`**) must not appear in any title.
- **`meta.json`** **`caseCount`** must equal the number of **`##`** cases you wrote.

## Resolve **`STORY_KEY`** (always first)

1. Parse key from URL or paste.
2. **`jira_get_issue`** with **`issuetype`**, **`parent`**, **`summary`**, **`description`**, **`priority`**, **`status`** (and AC/DoD-style fields your MCP exposes). Set **`update_history: false`** on reads when the tool supports it.
3. If Sub-task (or equivalent) and **`parent.key`** exists → **`STORY_KEY = parent.key`**. Original key is **trigger only**; do **not** use Sub-task body for scenarios.
4. Else **`STORY_KEY`** = that issue’s key.
5. **MCP pre-check (before generating tests):** Call **`jira_get_issue(STORY_KEY)`** via Jira MCP. **Pass** only if the call succeeds, Jira **`summary`** (issue title) is **non-empty**, and **`description`** is **present** in the payload (may be empty). **Do not** author cases until this passes. On failure: **do not** write the Markdown file or **`meta.json`** in CI (the job must fail at verify)—see **`.cursor/rules/jira-story-input.mdc`** (**Pre-generation MCP gate**).
6. Use that same response for requirements: **`description`**, **`priority`**, AC/DoD custom fields, etc. (no second fetch unless retrying after error). If those fields (or comments you fetch) contain **Confluence**, **Figma**, or **GitLab** URLs, use the **Atlassian** (Confluence), **Figma**, and **GitLab** MCP servers to **read** linked pages, designs, or files **before** authoring tests—see **`.cursor/rules/jira-story-input.mdc`** → **Story-linked Confluence, Figma, and GitLab**.

## Investigating coverage in Jira (**very optional**, read-only)

**Default path:** **`.cursor/rules/test-case-style.mdc`** and the story itself—or, when **project** input names a valid pack folder, generic style **plus** that pack. That is enough for most stories—**do not** browse Jira unless you still lack ideas for **which** cases to write or **how** to split them.

**When to consider (only if needed):** the project has no pack, the pack’s examples do not cover the story area, or you want extra signal on **coverage patterns** (permissions matrix depth, validation cases, analytics pairs) before drafting cases.

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
   Fetch **`summary`** and the project’s test step / expected result fields for a **small sample** (e.g. **3–5** Tests per story, or skim titles only if the suite is large). If you do not know those field ids, use **`jira_search_fields`** for *Test steps* / *Expected result*, or read the Test **`description`**.
5. **Use for investigation only** — infer which scenario types the team already tested nearby (layout, Impossible to…, Permissions., API errors, analytics ON/OFF). **Author new cases from the current story’s AC**; do not copy unrelated closed-story scenarios verbatim.

**Skip** if there is no Epic, no closed siblings, no linked Tests, or MCP fails—proceed with the pack (or generic rules) plus story requirements.

### B. Test library keyword search

If Epic siblings are not enough (or Epic is missing):

1. **Stay read-only** — **`Test`** issues only; never mutate the library for discovery.
2. **Targeted JQL**, e.g.:
   - `project = <PROJECT_KEY> AND issuetype = Test AND summary ~ "<Area or Page from story>" ORDER BY key DESC`
   - `project = <PROJECT_KEY> AND issuetype = Test AND summary ~ "API. <Endpoint or controller>" ORDER BY key DESC`
3. **Sample lightly** — **3–5** hits; read steps/expected; infer prefix, numbering, bundling.
4. **Still author from the current story** — library Tests inform **shape/coverage ideas** only.
5. **Skip silently on failure** — do not narrate in CI output.

**User-explicit mirror:** When the user **asks** to mirror specific **`Test`** keys or linked Tests on a given parent, follow **Reference Jira `Test` issues (user request)** below instead of this investigation path.

## Reference Jira `Test` issues (user request)

Use when the user **explicitly** asks to mirror **existing Jira `Test`** issues or provides **`Test`** keys/URLs or a **parent** Story/Task/Epic whose **linked** Tests should define granularity and tone. Reading is fine; **writing back to Jira is not**.

- **Direct `Test` key(s):** For each key, **`jira_get_issue`** with at least **`summary`**, plus the project’s test step and expected result fields (or **`description`** when the project stores them there). Mirror summary prefix patterns, section labels, numbering, and bundling when helpful.
- **Parent Story/Task/Epic only:** List linked Tests, e.g. JQL  
  `issue in linkedIssues(<PARENT_KEY>) AND issuetype = Test ORDER BY key ASC`  
  (paginate with your MCP’s **`limit`** / **`start_at`**). Then fetch the step/expected fields per **`Test`** key. **If zero linked Tests:** say so; do **not** fabricate a reference suite—proceed from the story using the pack and style rule, or ask the user for **`Test`** keys.
- **Wrong field IDs:** If step/expected fields come back empty, use **`jira_search_fields`** (or equivalent) for **Test steps** / **Expected result** for that project and re-fetch.

## Authoring rules

- Map story **acceptance criteria** and **numbered / Gherkin** scenarios to **discrete** test cases; split when an explicit reference suite (above) would split.
- **Localization / languages:** Do **not** add cases focused on translations, language switching, locale-only formatting, RTL, or multilingual copy—unless the user **explicitly** asks.
- **Analytics / telemetry:** **Require** **`GA.`** tests when **any** loaded requirements source (Jira body/AC fields, **successfully fetched** GitLab/Confluence/Figma content) includes an **Analytics (GA4)** section, analytics acceptance checklist, GA4 event numbering, or **`collect`** / **`page_view`** telemetry AC. Linked specs count as part of the story—not only Jira plain text. At minimum author one **analytics ON** and one **analytics OFF** case (**`.cursor/rules/test-case-style.mdc`** → **Analytics tests**; the project pack may define exact payload wording). **Respect out of scope:** do not add analytics cases for actions explicitly deferred to another user story.
- Respect **out of scope** in the story: do **not** add API/backend contract tests if the story says there is **no** backend/API—unless you are mirroring a reference suite **and** the user asked for that mirroring.
- Add **edge / regression** cases when the story implies them (persistence, permissions, multiple tabs, large viewport, etc.).

## Empty story

Applies **only after** a **successful** **`jira_get_issue(STORY_KEY)`** shows **description** has no substantive body **and** AC/DoD fields are empty. Then: **no** invented tests. Write the Markdown file with its header plus a short note that the story has no testable content (no fake **`##`** cases), and **`meta.json`** with **`"caseCount": 0`** and **`"empty": true`** — **`.cursor/rules/jira-story-input.mdc`**.

If Jira tools are **unavailable** or the fetch **errors**, **do not** use this path—**do not** write an empty deliverable as if the story were empty. Fetch in **GitHub Actions** or **IDE with MCP** first (see **`jira-story-input.mdc`** → **Jira fetch required**).

## GitHub Actions (this repo)

The output is **`generated/jira-tests/<STORY_KEY>/<STORY_KEY>-test-cases.md`** plus **`meta.json`**, uploaded as a workflow artifact. **`scripts/build-ci-prompt.js`** substitutes **`__ISSUE_KEY__`**, **`__STORY_KEY__`**, **`__PROJECT_KEY__`**, and **`__PROJECT_PACK__`** into **`prompts/ci-generate-tests.md`** and points here; full contract: **`.cursor/rules/jira-story-input.mdc`**. Do **not** use Sub-task **`ISSUE_KEY`** for paths or titles when it differs from **`STORY_KEY`**. Nothing is written back to Jira.

## Interaction with other skills

- **`import-jira-tests-to-agentic-qa`:** **imports existing** Jira Tests into Agentic QA (read-only). This skill **authors** Markdown test cases **from a story**.

## Checklist

- [ ] **`STORY_KEY`** resolved; requirements from **story** only.
- [ ] **Project pack:** from **project** input / user request only; when set and folder valid, generic **plus** pack; otherwise **generic only**.
- [ ] **MCP pre-check** passed (non-empty Jira **`summary`**, **`description`** field present) before authoring.
- [ ] Confluence / GitLab MCP used for **story-linked** URLs only (**`jira-story-input.mdc`**); dedupe URLs, **minimize** calls (one success per distinct target; **no** repository browsing beyond links from the story); fetch **nested** authoritative analytics/Confluence/Figma links cited inside fetched specs when needed. On **Confluence/GitLab** MCP read failure, continue from Jira **without** narrating errors or 429 in streamed output. When **`figmaReadRequired`** (signals or any **`figma.com`** URL in loaded requirements): **mandatory** Figma MCP—on failure write **`figma-read-failure.json`**, **no** deliverable, **no** invented UI.
- [ ] **CI:** Read **`generated/jira-tests/<STORY_KEY>/requirement-signals.json`** when present; if **`gaCoverageRequired`** is true, include ≥2 **`GA.`** cases and align payload details with the KB/spec. If **`figmaReadRequired`** is true, use **`figmaNodeIdsByFileKey`** for scoped Figma MCP reads and set **`meta.json`** **`figmaFileKeysRead`** after every required file key is read.
- [ ] Empty story → no fabricated tests **only after successful Jira fetch**.
- [ ] **Optional Jira investigation:** Epic → **Closed** sibling stories → linked **`Test`** samples, and/or library JQL—**read-only**, small sample only; skipped when not needed.
- [ ] **User-requested `Test` mirror:** fetched only when the user explicitly asked; **zero linked Tests** handled without inventing a suite.
- [ ] **Localization / analytics / out-of-scope** judgment applied per **Authoring rules**.
- [ ] Preconditions / Steps / Expected match **`.cursor/rules/test-case-style.mdc`** and the active pack.
- [ ] Markdown written to **`generated/jira-tests/<STORY_KEY>/<STORY_KEY>-test-cases.md`**; **`meta.json`** **`caseCount`** matches the **`##`** case count.
- [ ] **Nothing written to Jira** — no issues created or updated, no links, no comments.
