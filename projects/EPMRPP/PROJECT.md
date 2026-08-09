# EPMRPP (Report Portal) — project pack

Applies to stories whose key starts with **`EPMRPP`**. Read together with **`.cursor/rules/test-case-style.mdc`**; where the two differ, **this file wins**.

For **granularity, coverage splits, and tone**, read **`CONTEXT.md`** in this folder and the matching full suites under **`examples/`**.

| Example file | Use when the story is similar to |
|--------------|-----------------------------------|
| `examples/tests/EPMRPP-89670-test-cases.md` | Organization-level UI page layout, table columns, pagination, permissions matrix |
| `examples/tests/EPMRPP-91802-test-cases.md` | Instance-level modal CRUD, field validation, org/project assignment, GA events |
| `examples/tests/EPMRPP-105682-test-cases.md` | Invitation / registration flow, email link activation, redirect after signup |
| `examples/tests/EPMRPP-111251-test-cases.md` | Filters side panel, filter combinations, “All Filters” UX, autocomplete fields |
| `examples/tests/EPMRPP-108273-test-cases.md` | Table customization (columns modal, localStorage, reset to default) |
| `examples/tests/EPMRPP-114379-test-cases.md` | Org settings integrations page, mixed UI + API + GA coverage |
| `examples/tests/EPMRPP-114952-test-cases.md` | Global plugin integration CRUD, validation, connection states, API permissions |
| `examples/tests/EPMRPP-114989-test-cases.md` | Project-level plugin page, empty vs configured states, device list |
| `examples/tests/EPMRPP-93348-test-cases.md` | REST API endpoint, role/org-type permission matrix, error codes |
| `examples/tests/EPMRPP-99095-test-cases.md` | REST API partial update, field validation, slug/name rules, auth errors |
| `examples/GA tests/GA-analytics-test-cases.md` | Google Analytics — `collect` payload, GA ON/OFF pairs, scope in title (Instance / Organization / Project level) |

**Very optional:** when planning coverage, search the story’s **Epic** for **Closed** sibling stories and read linked **`Test`** issues from the closest matches (read-only); otherwise a small **`Test`** library JQL sample—see the skill → **Investigating coverage in Jira**.

## Summary line (title)

- **UI / functional:** `<Area>. <Page>. <Behavior>` — segments separated by **period + space**.
- **Page naming:** Either `Projects page` or `"Projects"` page (quoted page name when it matches the nav label); modal/feature names in **double quotes** (`"Rename project"`).
- **Permissions:** Insert an extra segment: `<Area>. <Page>. Permissions. <Behavior>` (e.g. Admin not assigned to project can still rename).
- **Google Analytics:** `GA. <Scope>. <Page>. <Behavior>` (scope e.g. **Instance level**).
- **API:** `API. <Controller name>. <Actor/role>. <Behavior>` — e.g. `API. Organization User Controller. Admin assigns Internal user to External organization`.
- Use **technical identifiers** in titles when needed (`project.key`, `project.slug`).

## Preconditions and steps

- **Label variants:** `*Preconditions*:` or `*Pre-conditions:*` (hyphen allowed). Same for `*Steps*:`.
- **Preconditions body (two acceptable patterns):**
  - **Plain lines** (no leading numbers): short fixture sentences, e.g. `Administrator user is logged in to RP` or `'Organization A' is created with at least one Project (e.g. Project1)`; **do not** add a trailing period (`.`) to any plain-line precondition. Use **single quotes** around org/project placeholders. Use `*italic*` for emphasis (`*External*`, `*not*`).
  - **Numbered `# ` lines** (hash + space): same as [EPMRPP-91802](https://jiraeu.epam.com/browse/EPMRPP-91802) style when the team uses list preconditions throughout.
- **Steps — numbering:** Give **Steps** a single ordered list **`1.`**, **`2.`**, **`3.`**, … (one action per line). **Alternative** when matching an existing suite: each step on its own line with **`# `** (a **leading space before `#`** is OK). Imperative voice. **Do not** end step text with a trailing period (`.`); the dot after the step number is the list marker only (e.g. `1. Go to "Projects" page`, not `1. Go to "Projects" page.`).
- **Navigation:** `Login to RP as Admin` (or **Administrator user is logged in** / **Login to RP as the user from the preconditions**); `Go to "All Users" page` **or** `Navigate to "Projects" page of the 'Organization A'`; meatball menu phrasing: `Click on meatball menu for a project` / `Click meatball menu for 'Project1'`; `Click on "Meatball" menu -> Select "…" option` where applicable.

## API test steps and expectations

- Point to **controller + HTTP method + path** (e.g. `Organizations User Controller --> POST/organizations/{org_id}/users`).
- Include **request body** in steps as JSON when needed; call out path params (e.g. `org_id`, `user_id`).
- Steps: **Send the request**, **Verify the response**; optional **DB** verification (`Go to DB -> "public" schema -> "organization_user" table` with example `SELECT`).
- **Expected results:** HTTP **Code: 200** (or relevant), response/message bullets using `*`; schema/table outcomes (e.g. new row, role = *MEMBER*).

## Expected results

- **Map every expected line to a real step:** The number at the start of each expected line must be a **step index that exists** in *Steps*. If steps use **`1.` … `N.`**, those indices are explicit; if steps use **`# `** lines only, count **top-level** step lines in order as **`1`** … **`N`** for mapping. **Do not** use expected numbers **greater than** the last step index (wrong: four steps but expected `5.`–`7.` — there is no step 5).
- **Gaps are OK:** You may **skip** expected lines for steps that need no separate verification (e.g. only `3.` and `4.` when steps are `1.`–`4.`). Numbers must still refer to **actual** steps, not a separate counter.
- **Several checks for one step:** Put **one** step number and group detail under it using sub-bullets (` - ` or `*`), e.g. after step 4 “Observe the modal”, use **`4.`** with bullets for *Name* field, *Cancel*, *Create*, close icon — **not** new top-level `5.`, `6.`, `7.`.
- **Bullets:** use ` - ` (space-hyphen-space) **or** leading `*` lines (`* Team`) depending on reference; stay consistent within one test case.
- UI inventory: control names in **double quotes**, **enabled** / **disabled** / **default**, success toasts (e.g. green bar text in quotes).
- **Figma-linked stories:** When requirements include **`figma.com`** URLs and **`figmaReadRequired`** applies (**`.cursor/rules/jira-story-input.mdc`**), do **not** author UI control/layout inventory in expected results unless Figma was **successfully** read via MCP. When Figma was read, prefer design-backed control names for UI cases; do not invent breadcrumbs, menus, or chrome not grounded in design + explicit AC.

## GA tests

- Title starts with **`GA.`**; include **scope** and **page** before the action.
- **Scope segment** (after `GA.`): **`Instance level`**, **`Project level`**, or area prefix such as **`Organizations.`** / **`Organizations. <Page>.`** when the scenario is org- or project-scoped (sidebar, Project Team). Match linked Jira Tests for the same feature.
- **Behavior in title:** `GA is sent …` for Analytics ON; **`Set GA OFF`**, **`GA OFF`**, or **`GA is not sent … when GA OFF`** for negative cases. One user action (or one verification point) per positive test when possible; combine multiple OFF checks in one test only when the team already does (comma-separated step numbers in expected).
- **Preconditions:** `Analytics is ON on the instance` / `GA is ON` or `GA is OFF` / `Analytics is OFF in Server Settings`; **`Browser Dev tools are opened`** (optionally **Network tab**). Project-level cases: plugin/integration preconditions (e.g. Mobitru installed, no integration on `'Project1'`). Role/level: `Instance level is opened`, `Organization level is opened`, `Project level is opened`, collapsed sidebar when testing **sidebar_hover**.
- **Steps:** Perform the UI action, then **`Check the data in the Request Payload of "collect" HTTP request in Browser Dev tools`** (repeat after each action when multiple events are asserted). Steps may use **`# `** lines or **`1.`** numbering—stay consistent within one test.
- **Expected results:** Map step numbers to the **collect** check step(s). **Positive:** `The collect request contains the following data:` (or `The request contains the following data:`) then list payload fields; emphasize event dimensions with `*category:*`, `*place:*`, `*element_name:*`, `*icon_name:*`, `*link_name:*`, `*modal:*`, `en: page_view` as in Jira. Include common context fields when the suite does: `instanceID`, `version`, `uid`, `timestamp`, `organization_id`, `project_id`, `auto_analysis`, `pattern_analysis`, `kind`. **Negative:** `GA event is not sent - "collect" HTTP request is not displayed in Browser Dev tools` or `GA is not sent. "collect" HTTP request is not displayed in Browser Dev tools`; use **`4, 6.`** style when one test covers multiple check steps.
- **Plugins / instance detail:** Match linked suite titles (e.g. **`GA. Plugins. …`**) and KB **`place`** values (e.g. **`instance_plugin_detail`**) from the story or GA4 spec—do not invent alternate **`place`** patterns.
- **Full examples:** **`examples/GA tests/GA-analytics-test-cases.md`**; additional GA cases in **`examples/tests/EPMRPP-91802-test-cases.md`** and **`examples/tests/EPMRPP-114379-test-cases.md`**.
