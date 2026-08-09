# EPMRPP test-case generation context

Derived from all files in **`test-case-examples/tests/`**, **`test-case-examples/API tests/`**, and **`test-case-examples/GA tests/`** (**482** unique test cases: **278** UI/mixed in **`tests/`** + **194** API-only in **`API tests/`** + **10** GA reference cases in **`GA tests/`**; **`EPMRPP-99095`** is duplicated in **`tests/`** and **`API tests/`** with the same **54** cases—count once). Use this document **together with** **`.cursor/rules/jira-test-cases-epmrpp-style.mdc`** when authoring **`tests.json`**, Jira Tests, or Markdown. Full per-story examples remain in **`tests/EPMRPP-*-test-cases.md`**, **`API tests/EPMRPP-*-test-cases.md`** for REST, and **`GA tests/GA-analytics-test-cases.md`** for Google Analytics — prefer **`API tests/`** when authoring REST coverage and **`GA tests/`** when the story is GA-only or telemetry-heavy.

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

**Exception:** **`GA tests/GA-analytics-test-cases.md`** is a cross-story GA reference suite (header `# Test cases: GA analytics — reference suite`, no single **`STORY_KEY`**); individual cases still follow the same *Preconditions* / *Steps* / *Expected results* blocks.

---

## Title patterns (Summary / `tests[].summary`)

| Prefix | When | Example |
|--------|------|---------|
| `<Area>. <Page>. <Behavior>` | UI / functional | `Organizations. Projects page. Layout` |
| `<Area>. <Page>. Permissions. <Behavior>` | Role/access matrix | `Organizations. Projects page. Permissions. Member assigned to the Organization and Projects can view only their assigned Projects` |
| `GA. <Scope>. <Page>. <Behavior>` | Analytics | `GA. Instance level. All Users page. GA is sent by clicking on the "Create user" button` |
| `API. <Controller>. <Behavior>` | REST | `API. Project Controller. Admin that is assigned to the project can update project name` (see **API title variants** below for mixed-story wording) |
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

### Google Analytics (`collect` payload)

Reference suite: **`GA tests/GA-analytics-test-cases.md`**. Split and wording patterns from Jira GA Tests:

| Pattern | When | Title / steps hint |
|---------|------|-------------------|
| **Menu / meatball option** | Event on selecting an option (before confirm) | `icon_name` in payload (e.g. `delete`, `provide_admin_rights`) |
| **Modal confirm** | Click primary button in modal | `modal:` + `element_name:` (e.g. `delete_user`, `create_user`) |
| **Page open** | First paint / navigation | `en: page_view` + `place:` (e.g. `cloud_device_empty_state`) |
| **In-page control** | Button or link on a page | `category`, `place`, `element_name` or `link_name` (Promo / cloud_version) |
| **Sidebar hover** | Collapsed sidebar expand + click | `category: sidebar`, `place: sidebar_hover`, `icon_name: user_control`; scope in title (Instance / Organization / Project level) |
| **GA OFF** | Server Settings Analytics disabled | Preconditions `GA is OFF`; same steps as ON case; expected: no `collect` request (often multiple step numbers in one test) |
| **Multi-action in one test** | Several clicks each with own payload | Repeat “Check … collect” after each action; expected lines `4.`, `6.`, `8.` or `4, 6.` for OFF |
| **Title phrasing (ON)** | Any scope | `GA is sent when selecting …` (menu option); `GA is sent by clicking on …` (button); `GA is sent by opening …` (page / empty state) — see **`tests/EPMRPP-91802-test-cases.md`** and **`GA tests/`** |
| **Title phrasing (OFF)** | Paired negative | `Set GA OFF and …`; `GA is not sent … when GA OFF`; `GA OFF and …` (Project Team) |

Always pair **GA is sent** cases with **GA OFF** (or **Set GA OFF and verify…**) when the story adds new telemetry. Priority is often **Minor** (telemetry-only) unless the story is GA-only.

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

Reference suites live in **`test-case-examples/API tests/`** (7 stories, **194** cases). **`tests/EPMRPP-93348-test-cases.md`** adds **30** DELETE cases using the same patterns. Split by **endpoint shape** first, then apply the cross-cutting matrix below.

#### By endpoint type

| Type | Example story | Typical cases |
|------|---------------|---------------|
| **GET list** | EPMRPP-91805 | Happy path per role (Admin/Manager/Member); Admin without org assignment; empty array; 403 for disallowed role; missing/invalid/non-existent `org_id`; 401 (no/invalid/revoked token); default query params (`limit` 300, `offset` 0, `sort`, `order`); sort ASC/DESC; limit above/below 300; offset pagination; sort only by allowed field |
| **POST create** | EPMRPP-96639 | Admin happy path + 201 response body; 403 non-Admin; 401 auth; mandatory field missing/empty; invalid email/length/password/full name; duplicate email; disallowed account types; enum variants (role, account type, activity); defaults when optional fields omitted; DB row check; login after create-with-password; security rules on password |
| **PATCH JSON Patch** | EPMRPP-99095, EPMRPP-104599, EPMRPP-97280 | `replace` / `remove` ops on `name`, `slug`, `users`; role × assignment matrix (Admin/Manager/Member-editor/viewer); simultaneous multi-field or multi-user ops; each invalid `op` / `path` / `value`; missing path param; invalid/non-existent IDs; 400 field validation; 200 + success message + **DB verify** |
| **POST search / filter** | EPMRPP-98512 | Admin filtered list; 403 non-Admin; 401 auth; one case per **filter_key** (uuid, email, full name, account type, instance role, activity, dates, org id, …); operator matrix (`EQ`, `IN`, …) where applicable; invalid filter key/operator; default limit 300; custom limit; default sort; custom sort field/direction; pagination |
| **GET resource** | EPMRPP-97027 | Happy path per role; invalid/non-existent `user_id`; 401 auth; query params (e.g. `thumbnail`); deprecated endpoints (Swagger UI observation) |
| **DELETE remove** | EPMRPP-93348 | Happy path per role (Admin/Manager unassign self or other); Member self-unassign only; UPSA / EXTERNAL org business rules; **cannot** / **Impossible to** matrix; 401 auth; missing/invalid/non-existent `org_id` / `user_id`; 403 for disallowed role |

#### Cross-cutting matrix (all API types)

| Category | Cases |
|----------|--------|
| **Happy path / permissions** | Each allowed role × assignment variant (org+project, org only, not assigned to org, viewer vs editor); **Possible to** / **can** in title |
| **Denied access** | **Impossible to** / **cannot** / **Non-Admin user cannot**; 403 with `"You do not have enough permissions…"` |
| **Auth** | No token, non-existent token, revoked token → 401 `"Invalid access token"`; often exercised via **Postman** |
| **Path / ID validation** | Missing ID, invalid ID (letters), non-existent ID → 400 / 404 / 500 as per API |
| **Body / patch validation** | Empty mandatory field, invalid length, invalid characters, empty `op`/`path`/`value`, invalid enum, duplicate within scope |
| **Business rules** | Slug lowercasing, special chars → `-`, project key unchanged, defaults applied, login generated from email |
| **Combined operations** | Update name + slug + user role + remove user in one PATCH body |
| **Deprecation / migration** | Observe endpoint in Swagger before/after version upgrade |

#### API title shape

Prefer `API. <Controller name>. <Behavior>` — **Controller** matches Swagger grouping (`Project Controller`, `Organization User Controller`, `User Controller`, `Organization-Projects Controller`, `File Storage Controller`). **Actor and assignment** are usually embedded in the behavior phrase, not a separate title segment:

- `API. Project Controller. Admin that is assigned to the project can update project name`
- `API. Organization User Controller. Member cannot get a list of users…`
- `API. User Controller. Filtering users by email`
- `API. User Controller. Default values are applied to non-required fields when they are not specified`

**API title variants** (mixed UI+API stories in **`tests/`** — mirror the linked suite when one exists):

| Variant | Example file | Example title |
|---------|--------------|---------------|
| Title Case **Controller** | **`API tests/`**, EPMRPP-99095 | `API. Project Controller. Admin that is assigned to the project can update project name` |
| Resource name (no **Controller** suffix) | EPMRPP-93348 | `API. Organization User. Admin unassigns another user from INTERNAL organization` |
| Lowercase controller + HTTP code in title | EPMRPP-114379 | `API. organization-integrations controller. 400 error on using org_id = non-integer when retrieving organization integrations` |
| Feature/plugin as middle segment | EPMRPP-114952 | `API. Mobitru. Non-admin user cannot create global integration` |

**Behavior verbs:** **Possible to** / **Impossible to** / **can** / **cannot** / **gets** / **Filtering** / **Default parameter values** / **Sorting** / **Maximum N users are returned by default**; error-focused titles may lead with **`400 error`** / **`401 error`** / **`403 error`** / **`404 error`** (EPMRPP-114379).

#### API preconditions

API suites heavily use **`# `** lines. Common fixture blocks:

```
# 'Organization A' is created
# 'ProjectA' is created in the 'Organization A'
# User is assigned to 'Organization A' and 'ProjectA'
# User has 'MEMBER' organization role at 'Organization A'
# User has 'EDITOR' project role at 'ProjectA'
# Admin is on the API Documentation page
```

Shorter POST suites may use **plain lines**: `Admin user exists on the instance`. Call out **token state** (`Authentication token doesn't exist`, token revoked) for 401 cases.

#### API steps — two execution paths

**1. Swagger UI (`"API Documentation"` page)** — default for happy path and most validation:

```
# Login as Admin -> Go to "API Documentation" page
# Navigate to "<Controller>" -> <METHOD>/<path>
# Fill '<param>' with …
# Fill body of the request
{code:java}
[ … JSON … ]
{code}
# Send the request
# Verify the response
# Go to DB -> "public" schema -> "<table>" table:
SELECT …
```

**2. Postman** — typical for auth edge cases and malformed URLs:

```
# For the request in Postman fill the field 'Token', in Authorization tab, with non-existent token
# Send the request via Postman GET/organizations/{org_id}/users
# Verify the response
```

**PATCH body** — JSON Patch array; show inline or in `{code:java}`:

```
[
  { "op": "replace", "path": "name", "value": "<updated_project_name>" }
]
```

or `op: "remove"`, `path: "users"`, `value: [{ "id": <user_id> }]` / `value: null` (remove all).

**POST body** — prefix with `Request body example:` and wrap in `{code:java}` (single-quoted JSON string is OK in examples).

**Multi-scenario in one test:** extra numbered steps or `*Repeat test case for GITHUB/LDAP/SAML account type*` / `*Repeat test case with different sort parameters*`.

#### API expected results

Numbered lines map to **Steps** (`# ` lines count as 1…N). Typical success block:

```
5. The request is sent
6. The response contains:
* Code 200
* "The update was completed successfully." message

7. The name is updated in the DB
```

Error block:

```
3. The response contains:
* Code: 403
* "You do not have enough permissions. Access is denied" message
```

**201 create** — include full **Response example** in `{code:java}`. **GET list** — include paginated schema (`offset`, `limit`, `total_count`, `items[]`). **DB checks** — own step numbers after response (`There is *no* a record in the table`, role = *MEMBER*, *VIEWER*).

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

1. **Plain lines** (no numbers, no trailing period) — common in UI and simple POST create:  
   `'Organization A' is created with at least one Project`  
   `Administrator user is logged in to RP`  
   `Admin user exists on the instance`

2. **`# ` numbered lines** (hash + space) — **default for API** (PATCH, GET list, remove user, role change):  
   `# 'Organization A' is created`  
   `# Admin is on the API Documentation page`

3. **`1.` numbered list** — occasional (e.g. deprecation checks in Swagger):  
   `1. ReportPortal instance is deployed with version 24.2 and lower`

**Fixtures:** name orgs/projects `'Organization A'`, `'ProjectA'`, `'Project1'`; spell out **org role** and **project role** (`'MEMBER'`, `'EDITOR'`, `'VIEWER'`, `'MANAGER'`). Use `*NOT*` / `*not*` for negative assignment. Call out plugin installed, integration exists, launch data, Analytics ON/OFF, SSO toggles when relevant.

---

## Steps

- **UI:** Imperative — `Login to RP as Admin`, `Go to "All Users" page`, `Click on "Meatball" menu -> Select "Create user" option`, `Navigate to Organization settings > Integrations > Email Server`.
- **Numbering:** UI often uses **`1.` `2.` `3.`**; **API** suites prefer **`# `** lines (count as steps 1…N for expected mapping). Do not end step text with a trailing period after the list marker.
- **API (Swagger):** `Navigate to <Controller> -> <METHOD>/<path>` or `Login as Admin -> Navigate to Organization-Projects Controller -> PATCH/organizations/{org_id}/projects/{project_id}`; then `Fill … in the 'org_id' field`, `Send the request`, `Verify the response`.
- **API (Postman):** `Send the request via Postman <METHOD>/<path>`; auth cases fill `'Token'` in Authorization tab.
- **API body:** JSON in steps as raw array, or `Request body example:` + `{code:java}…{code}`; path placeholders `<org_id>`, `<user_id>`, `<project_id>`.
- **API DB:** `Go to DB -> "public" schema -> "<table>" table:` + `SELECT …` as separate `# ` steps after the request.
- **Multi-scenario in one test:** extra steps in the same case (e.g. send with invalid email, then without full name) or `*Repeat test case …*` footnote.

**Role repetition** (instead of duplicating whole tests):

```
*Repeat test case as Manager, Member-editor, Member-viewer*
*Repeat test case for GITHUB/LDAP/SAML account type*
*Repeat test case with different sort parameters (e.g. email, instance_role, etc.)*
```

---

## Expected results

- **Map line numbers to step numbers** that exist in *Steps* (gaps OK; do not exceed last step index). For **`# `** steps, count top-level `# ` lines in order as 1…N.
- **One step, many checks:** use step number once with sub-bullets (` - ` or `*`).
- **API success:** `N. The request is sent` then `N. The response contains:` with `* Code 200` (or `201`) and quoted message; optional `{code:java}` response schema.
- **API errors:** `* Code: 400` / `401` / `403` / `404` / `409` / `500` plus quoted or structured `message` / `errorCode`.
- **API side effects:** separate numbered lines for DB (`The name is updated in the DB`, `There is *no* a record in the table`, project role = *VIEWER*).
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
| Modal create user | EPMRPP-91802 | 45 | Validation heavy + org/project assignment matrix + 5 GA |
| Invitation flow | EPMRPP-105682 | 34 | Form validation + redirect matrix + invite variants |
| Plugin CRUD | EPMRPP-114952 | 32 | 27 UI + 5 API (403/409 permission and duplicate integration) |
| Integrations page | EPMRPP-114379 | 41 | 9 UI + 30 API (list/pagination/errors) + 2 GA |
| API unassign user | EPMRPP-93348 | 30 | Role × org-type matrix + 401/403/404/400 |
| **API PATCH project (name/slug)** | **API tests/EPMRPP-99095** | **54** | Field/path/auth/permission matrix; DB checks |
| **API PATCH project (role change)** | **API tests/EPMRPP-104599** | **39** | JSON Patch `users`; self-role rules; combined ops |
| **API PATCH remove user** | **API tests/EPMRPP-97280** | **23** | `remove` op; role matrix; bulk remove; DB |
| **API GET org users list** | **API tests/EPMRPP-91805** | **18** | Pagination/sort/defaults + 401/403/404 |
| **API POST create user** | **API tests/EPMRPP-96639** | **27** | Validation + enums + password rules + DB |
| **API POST user search** | **API tests/EPMRPP-98512** | **25** | Per filter_key + operators + sort/limit |
| **API GET avatar** | **API tests/EPMRPP-97027** | **8** | Small resource GET + deprecation |

Use these counts as **density targets**: exhaustive API endpoint stories **18–54** cases by surface area (small GET **~8**; list **~18**; PATCH matrix **40+**; POST create **~27**; filter API **~25**); focused UI **6–15**; full page + permissions **25–45**.

---

## Patterns to reuse verbatim

| Pattern | Wording |
|---------|---------|
| Cancel modal | `Click on "Cancel" button / "X" button / "ESC" key` |
| Meatball menu | `Click on "Meatball" menu -> Select "…" option` |
| Mandatory empty | `"Field is required"` validation message; field highlighted in red |
| API Swagger entry | `Login as Admin -> Go to "API Documentation" page` |
| API navigate | `Navigate to "<Controller>" -> <METHOD>/<path>` |
| API send / verify | `# Send the request` / `# Verify the response` |
| PATCH success | `Code 200`, `"The update was completed successfully." message` |
| POST create success | `Code: 201` + response example in `{code:java}` |
| Permission denied | `Code: 403`, `"You do not have enough permissions. Access is denied" message` |
| Invalid token | `Code: 401`, `"Invalid access token" message` |
| Not found | `Code: 404`, `"User '<user_id>' not found."` / `"Organization '<id>' not found…"` |
| Success create (UI) | green bar / `'…successfully added'` message |
| DB verify | `Go to DB -> "public" schema -> "<table>" table:` + `SELECT …` |

---

## Source index

### UI / mixed examples (`tests/`)

| File | Story focus |
|------|-------------|
| `tests/EPMRPP-89670-test-cases.md` | Organization Projects page, table, permissions |
| `tests/EPMRPP-91802-test-cases.md` | Create user modal, validation, GA, assignments |
| `tests/EPMRPP-105682-test-cases.md` | Invitation link, registration, redirects |
| `tests/EPMRPP-111251-test-cases.md` | All Filters side panel, filter combinations |
| `tests/EPMRPP-108273-test-cases.md` | Customize Columns modal, localStorage |
| `tests/EPMRPP-114379-test-cases.md` | Org Email Server integrations, UI + API + GA |
| `tests/EPMRPP-114952-test-cases.md` | Mobitru global integration CRUD |
| `tests/EPMRPP-114989-test-cases.md` | Cloud Devices page, Mobitru attachment |
| `tests/EPMRPP-93348-test-cases.md` | DELETE org user API (`API. Organization User. …`), org types, UPSA |
| `tests/EPMRPP-99095-test-cases.md` | PATCH project name/slug API (also in **API tests/**) |

### GA analytics examples (`GA tests/`)

| File | Story focus |
|------|-------------|
| `GA tests/GA-analytics-test-cases.md` | **10** curated `collect` payload checks — Instance / Org / Project scope, `page_view`, sidebar hover, GA OFF pairs, Promo `link_name` (Jira Test sources listed in file header) |

### API-only examples (`API tests/`)

| File | Story focus |
|------|-------------|
| `API tests/EPMRPP-99095-test-cases.md` | PATCH project `name` / `slug` — validation, permissions, DB |
| `API tests/EPMRPP-104599-test-cases.md` | PATCH project user `role` — JSON Patch `users`, self-role rules |
| `API tests/EPMRPP-97280-test-cases.md` | PATCH `remove` user from project — bulk, combined ops, DB |
| `API tests/EPMRPP-91805-test-cases.md` | GET org users list — pagination, sort, defaults, auth |
| `API tests/EPMRPP-96639-test-cases.md` | POST create user — validation, enums, password, DB |
| `API tests/EPMRPP-98512-test-cases.md` | POST user search — filters, operators, sort/limit |
| `API tests/EPMRPP-97027-test-cases.md` | GET user avatar — auth, invalid id, deprecation |

When generating new tests, **read this file first**, then open matching files from **`tests/`**, **`GA tests/`**, and/or **`API tests/`** for full step-level examples. For new **REST-only** stories, start from the closest row in **API tests/**. For **GA.** stories or AC that mandate telemetry, start from **`GA tests/GA-analytics-test-cases.md`**.

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
