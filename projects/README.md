# Project packs

A **project pack** adjusts how test cases are written for one Jira project. Packs are optional: without one, the agent uses the generic conventions in **`.cursor/rules/test-case-style.mdc`**.

## How a pack is selected

The pack folder name is the **project key** — the part of the issue key before the dash. A story `PROJ-123` uses `projects/PROJ/` when that folder exists. Set the `PROJECT_PACK` environment variable (or workflow input) to a folder path to override the lookup.

## Layout

```
projects/
  PROJ/
    PROJECT.md     # required: the instructions the agent follows
    CONTEXT.md     # optional: granularity, coverage splits, calibration
    examples/      # optional: full example suites to imitate
```

Only `PROJECT.md` is required. It is **free-form Markdown** — there is no schema and no configuration keys. Write whatever a new QA joining your team would need in order to match the existing suite.

## What belongs in `PROJECT.md`

Useful things to pin down:

- **Vocabulary** — what the product, its pages, roles, and controls are called.
- **Title patterns** — the shape of a test case title in your suite.
- **Preconditions and steps** — label style, numbering, phrasing for login and navigation.
- **Expected results** — how verifications map to steps, bullet style, how much UI inventory to list.
- **Coverage expectations** — which case types your team always writes (layout, validation, permissions, API errors, analytics ON/OFF pairs) and which it never writes.
- **Anything to avoid** — scenarios your team deliberately excludes.

Instructions in `PROJECT.md` **override** `.cursor/rules/test-case-style.mdc` on conflict.

## Starting a new pack

```bash
mkdir -p projects/<PROJECT_KEY>
```

Then write `PROJECT.md`. A minimal starting point:

```markdown
# <PROJECT_KEY> (<Product name>) — project pack

Applies to stories whose key starts with **`<PROJECT_KEY>`**. Read together with
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

Adding example suites under `examples/` (real, reviewed test cases from your project) is the fastest way to calibrate granularity — reference them from `PROJECT.md` so the agent knows which example fits which kind of story.

`projects/EPMRPP/` is a worked example: a full pack with `PROJECT.md`, `CONTEXT.md`, and 20 example suites.
