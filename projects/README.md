# Project packs

A **project pack** adds team-specific wording and examples on top of the generic style rule. **By default every run uses generic rules only.**

## How a pack is selected

**Generic only** unless you pass an optional **`project`** input (CI) or ask for a pack in the IDE.

1. Set **`project`** on the workflow run — e.g. **`EPMRPP`** (uses **`projects/EPMRPP/`** when that folder exists and contains **`PROJECT.md`**). You can also pass a full path such as **`projects/EPMRPP`**.
2. If the folder is **missing** or has no **`PROJECT.md`**, the run stays **generic only** (CI logs a warning).
3. If **`project`** is **omitted**, the run is **generic only** — the Jira project key on the ticket does **not** auto-select a pack.

Jira automation can send **`client_payload.project`** (legacy **`project_pack`** is still accepted).

## Layout

```
projects/
  EPMRPP/
    PROJECT.md     # required: the instructions the agent follows
    CONTEXT.md     # optional: granularity, coverage splits, calibration
    examples/      # optional: full example suites to imitate
```

Only **`PROJECT.md`** is required. It is **free-form Markdown** — write whatever a new QA joining your team would need in order to match the existing suite. Instructions in **`PROJECT.md`** **override** **`.cursor/rules/test-case-style.mdc`** on conflict.

## What belongs in `PROJECT.md`

Useful things to pin down:

- **Vocabulary** — what the product, its pages, roles, and controls are called.
- **Title patterns** — the shape of a test case title in your suite.
- **Preconditions and steps** — label style, numbering, phrasing for login and navigation.
- **Expected results** — how verifications map to steps, bullet style, how much UI inventory to list.
- **Coverage expectations** — which case types your team always writes (layout, validation, permissions, API errors, analytics ON/OFF pairs) and which it never writes.
- **Anything to avoid** — scenarios your team deliberately excludes.

## Starting a new pack

```bash
mkdir -p projects/<PROJECT_ID>
```

Then write **`projects/<PROJECT_ID>/PROJECT.md`**. Enable it per run with workflow input **`project: <PROJECT_ID>`**.

A minimal starting point:

```markdown
# <PROJECT_ID> (<Product name>) — project pack

Applies when CI **project** input is **`<PROJECT_ID>`**. Read together with
**`.cursor/rules/test-case-style.mdc`**; where the two differ, **this file wins**.

## Vocabulary

- The product is called "…". Users log in as one of: …

## Title patterns

- UI: `<Area>. <Page>. <Behavior>`
- API: `API. <Endpoint>. <Actor>. <Behavior>`

## Preconditions and steps

- …

## Expected results

- …

## Coverage expectations

- Always cover: …
- Never write: …
```

Adding example suites under **`examples/`** is the fastest way to calibrate granularity — reference them from **`PROJECT.md`** so the agent knows which example fits which kind of story.

**`projects/EPMRPP/`** is a worked example: **`PROJECT.md`**, **`CONTEXT.md`**, and 20 example suites.
