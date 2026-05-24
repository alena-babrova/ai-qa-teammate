# EPMRPP test-case generation context

Derived from all files in **`test-case-examples/`** (332 test cases across 10 stories). Use this document **together with** **`.cursor/rules/jira-test-cases-epmrpp-style.mdc`** when authoring **`tests.json`**, Jira Tests, or Markdown. Full per-story examples remain in the sibling `EPMRPP-*-test-cases.md` files for deep reference.

---

## Document shape

Every deliverable follows the same skeleton:

```markdown
# Test cases: <STORY_KEY> — <story summary from Jira>

**User story:** https://jiraeu.epam.com/browse/<STORY_KEY>

---

## <Title>

*Preconditions:*
…

*Steps:*
…

*Expected results:*
…

---
```

- One **`##`** section = **one** discrete test case.
- **`STORY_KEY` must not appear** in test titles.
- **`---`** between cases.

---

## Title patterns (Summary / `tests[].summary`)

| Prefix | When | Example |
|--------|------|---------|
| `<Area>. <Page>. <Behavior>` | UI / functional | `Organizations. Projects page. Layout` |
| `<Area>. <Page>. Permissions. <Behavior>` | Role/access matrix | `Organizations. Projects page. Permissions. Member assigned to the Organization and Projects can view only their assigned Projects` |
| `GA. <Scope>. <Page>. <Behavior>` | Analytics | `GA. Instance level. All Users page. GA is sent by clicking on the "Create user" button` |
| `API. <Controller>. <Actor>. <Behavior>` | REST | `API. Organization User. Admin unassigns another user from INTERNAL organization` |
| `<Feature>. <Behavior>` | Named feature/plugin | `Mobitru. Add Global integration`, `Cloud Devices. Empty page state` |

**Behavior verbs in titles:** Layout, Possible to…, Impossible to…, Canceling/Cancelling…, Filter tests by…, is displayed, is not displayed, can / cannot / can't.

**UI controls** in titles and steps: double quotes (`"Create user"`, `"All Filters"`). **Placeholders** in single quotes (`'Organization A'`, `'Project1'`).

---

## Granularity — how to split tests

### Page / feature coverage (UI)

Typical split for a new page or major feature:

1. **Layout / empty state** — all visible controls, labels, default states.
2. **Populated / happy path** — data present, primary interaction works.
3. **Per-field validation** — one test per mandatory field empty, one for invalid value, one for boundary length.
4. **Cancel / dismiss** — `"Cancel"`, `"Cross"`, `ESC`, click outside (with and without unsaved changes where applicable).
5. **Edge values** — long names, `0` / `n/a` in columns, pagination, fixed header on scroll.
6. **Permissions** — separate case per role × scenario; use **Permissions.** segment in title.
7. **Persistence** — localStorage, reload, tab switch (when feature implies it).
8. **GA** — event on action + same action when Analytics OFF (pair).

### Modal CRUD (e.g. Create user, Create integration)

- Modal **layout** (all fields, placeholders, default button states).
- **Happy path** create/edit/delete.
- **Each mandatory field** empty → validation (separate case or grouped “without filling mandatory fields”).
- **Each field** invalid value (URL, API key, email, password rules).
- **Cancel** variants (Cancel, X, ESC, click outside).
- **Only one** entity when business rule limits (e.g. one global integration).
- **DB check** when security matters (e.g. API key encoded).
- **Connection states** — success vs failed connection UI.
- **API permission** cases for non-admin (403) alongside UI.

### Filters / side panel

- Panel **layout and default state** (list every filter control).
- **Each filter** individually + **combinations** of filters.
- **Clear All** / **Cross icon** on filter button.
- **No results** empty message.
- **Autocomplete** behavior, remove chip, duplicate selection blocked.
- **Validation** per filter (min length, long value, contains principle).
- Close panel: click outside **with** vs **without** changed values.

### Table customization

- Table **header** inventory (columns, icons, statistics).
- Modal **layout**.
- Add column / remove column / remove all except fixed column (`Name`).
- **Reset to default** enabled/disabled states.
- Reorder columns; **cannot** move fixed column.
- Dropdown: added column removed from list; removed column returns.
- Cancel (Cancel, X, ESC, click outside with/without changes).
- **localStorage** persistence.
- **All roles** can customize (repeat for roles).

### REST API endpoints

Split systematically:

| Category | Cases |
|----------|--------|
| **Happy path** | Each allowed role × org assignment variant (assigned to org+project, org only, admin not assigned, etc.) |
| **Field validation** | Empty body field, short/long length, invalid characters, duplicate within org, valid UTF-8/spaces |
| **Path/query params** | Missing org_id, project_id, invalid/non-integer/float/negative/special chars, non-existent IDs |
| **Auth** | No token, invalid token, revoked token → 401 |
| **Permissions** | 403 per disallowed role; org type variants (INTERNAL, EXTERNAL, PERSONAL, UPSA vs non-UPSA) |
| **Business rules** | Slug lowercasing, special chars → `-`, project key unchanged, simultaneous name+slug update, duplicate request body keys |
| **HTTP method/path** | Invalid operator, invalid path → 4xx |

**API steps template:**

```
Navigate to <Controller> ->
Send the request: <METHOD> <path>
{body if needed}
and verify the response
[Optional: Login as … and verify UI/DB]
```

**API expected template:**

```
Response code: <code>
* Code: <code>
* "<message>" message
[Side effects: DB row, UI list, assignment removed, etc.]
```

### Invitation / registration flows

- Email content, registration form layout.
- **Each field** validation + length + special symbols.
- Cannot submit with empty/partial fields; email field read-only.
- Activate link from email vs copied invitation link.
- Redirect target by invite scope (instance, org, project, multiple orgs/projects).
- Expired link; cannot activate twice.
- User appears in All Users; personal org ON/OFF.

---

## Preconditions

Three styles appear in examples — **pick one per test and stay consistent within that test**:

1. **Plain lines** (no numbers, no trailing period):  
   `'Organization A' is created with at least one Project`  
   `Administrator user is logged in to RP`

2. **`# ` numbered lines** (hash + space):  
   `# 'Organization_1' has type 'internal'`  
   `# Admin user is logged in`

3. **`1.` numbered list** (common in API suites):  
   `1. 'Organization_1' has type 'internal'`

**Fixtures:** name orgs/projects `'Organization A'`, `'Project1'`, `'Organization_1'`; users `User_1`, `Admin user`, `Manager user`. Call out plugin installed, integration exists, launch data, Analytics ON/OFF, SSO toggles when relevant.

---

## Steps

- **UI:** Imperative — `Login to RP as Admin`, `Go to "All Users" page`, `Click on "Meatball" menu -> Select "Create user" option`, `Navigate to Organization settings > Integrations > Email Server`.
- **Numbering:** Either **`1.` `2.` `3.`** (Markdown exports) or **`# `** lines (Jira-native); both appear in examples.
- **API:** Controller name + HTTP method + path; include JSON body in steps when needed.
- **Multi-scenario in one test:** extra steps numbered sequentially (e.g. invalid URL then invalid HTTPS host).

**Role repetition** (instead of duplicating whole tests):

```
*Repeat test case as Manager, Member-editor, Member-viewer*
*Repeat test case as Member*
```

---

## Expected results

- **Map line numbers to step numbers** that exist in *Steps* (gaps OK; do not exceed last step index).
- **One step, many checks:** use step number once with sub-bullets (` - ` or `*`).
- **UI inventory:** quote control names; state **enabled** / **disabled** / **default**; success toasts in quotes (`'Integration successfully added'`).
- **Layout cases:** nested bullets for header / sections / columns (`*`, `**`, `---` hierarchy as in examples).
- **Skip dash for N/A step:** `-` when a step has no separate verification (see Create button behaviour case).
- **Out of scope:** mark with `{color:#de350b}out of scope{color}` when examples do (89670 layout).

---

## Calibration — test counts by story type

| Story type | Example | Unique tests | Notes |
|------------|---------|--------------|-------|
| Small UI feature | EPMRPP-114989 | 6 | Empty + configured states, tabs, cards, all roles |
| Org projects list | EPMRPP-89670 | 33 | Layout + columns + pagination + 8 permission cases |
| Filters panel | EPMRPP-111251 | 31 | ~1 case per filter + combinations + clear/cross |
| Column customization | EPMRPP-108273 | 26 | Modal CRUD + localStorage + reset |
| Modal create user | EPMRPP-91802 | 45 | Validation heavy + org/project assignment matrix + 6 GA |
| Invitation flow | EPMRPP-105682 | 34 | Form validation + redirect matrix + invite variants |
| Plugin CRUD | EPMRPP-114952 | 32 | Per-field validation + API 403/409 |
| Integrations page | EPMRPP-114379 | 41 | UI states + API list/pagination/errors + 2 GA |
| API unassign user | EPMRPP-93348 | 30 | Role × org-type matrix + 401/403/404/400 |
| API partial update | EPMRPP-99095 | 54 | Exhaustive field/path/auth/permission coverage |

Use these counts as **density targets**: API stories tend toward **30–54** cases; focused UI toward **6–15**; full page + permissions **25–45**.

---

## Patterns to reuse verbatim

| Pattern | Wording |
|---------|---------|
| Cancel modal | `Click on "Cancel" button / "X" button / "ESC" key` |
| Meatball menu | `Click on "Meatball" menu -> Select "…" option` |
| Mandatory empty | `"Field is required"` validation message; field highlighted in red |
| Permission denied | `Code: 403 Forbidden`, `"You do not have enough permissions."` |
| Invalid token | `Code: 401`, `"Invalid access token"` |
| Success create | green bar / `'…successfully added'` message |
| DB verify | `Go to DB -> … schema -> … table` |

---

## Source index

| File | Story focus |
|------|-------------|
| `EPMRPP-89670-test-cases.md` | Organization Projects page, table, permissions |
| `EPMRPP-91802-test-cases.md` | Create user modal, validation, GA, assignments |
| `EPMRPP-105682-test-cases.md` | Invitation link, registration, redirects |
| `EPMRPP-111251-test-cases.md` | All Filters side panel, filter combinations |
| `EPMRPP-108273-test-cases.md` | Customize Columns modal, localStorage |
| `EPMRPP-114379-test-cases.md` | Org Email Server integrations, UI + API + GA |
| `EPMRPP-114952-test-cases.md` | Mobitru global integration CRUD |
| `EPMRPP-114989-test-cases.md` | Cloud Devices page, Mobitru attachment |
| `EPMRPP-93348-test-cases.md` | DELETE org user API, org types, UPSA |
| `EPMRPP-99095-test-cases.md` | PATCH project name/slug API |

When generating new tests, **read this file first**, then open any **`EPMRPP-*-test-cases.md`** files that match the story shape for full step-level examples.

---

## Investigating coverage in Jira (very optional)

Use when repo examples are not enough to decide **which** scenarios to include or **how** to split them.

### Related Epic → Closed stories

1. Resolve the **Epic** for the current story from **`jira_get_issue(STORY_KEY)`** (Epic Link / parent).
2. Search **Closed** (or Done) **User Stories** under that Epic—e.g.  
   `"Epic Link" = <EPIC_KEY> AND status = Closed AND issuetype in (Story, "User Story") ORDER BY updated DESC`
3. Pick **1–3** closed stories with summaries closest to the current feature.
4. For each, list linked Tests:  
   `issue in linkedIssues(<CLOSED_STORY_KEY>) AND issuetype = Test ORDER BY key ASC`  
   Sample **`customfield_19206`** / **`customfield_19207`** for a few cases (or skim **`summary`** titles only).
5. Use to inspire **coverage types** (layout, validation, permissions, GA, API errors)—**author from the current story**, do not copy unrelated cases.

### Test library search

If Epic siblings help little or Epic is missing:

- `project = EPMRPP AND issuetype = Test AND summary ~ "<Area or Page>" ORDER BY key DESC`
- Read **~3–5** hits; read-only; skip on failure.

Full rules: **`.cursor/skills/jira-story-test-cases-md/SKILL.md`** → **Investigating coverage in Jira**.
