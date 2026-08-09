# Project packs

A **project pack** adds team-specific wording and examples on top of the generic style rule. **By default every Jira project uses generic rules only.** A pack applies only when its Jira project key is listed in **`projects/config.json`** (or **`PROJECT_PACK`** is set for a one-off run).

## How a pack is selected

**Default: generic only** — [`.cursor/rules/test-case-style.mdc`](../.cursor/rules/test-case-style.mdc) plus the story's vocabulary. No project pack.

When you want **generic + project pack** for a Jira project:

1. Create the pack folder (e.g. `projects/MYPROJ/` with `PROJECT.md`).
2. Add the Jira **project key** to **`projects/config.json`**:

```json
{
  "packs": {
    "MYPROJ": "projects/MYPROJ",
    "EPMRPP": "projects/EPMRPP"
  }
}
```

Resolution order:

1. **`PROJECT_PACK`** — per-run override (GitHub Actions **project pack** input, Jira automation `client_payload.project_pack`, or env var).
2. **`projects/config.json`** → `packs[<PROJECT_KEY>]` — **only** way to enable a pack for normal runs.
3. **No pack** — generic style rule only.

A folder under `projects/` is **not** picked up automatically. The Jira key must appear in config (unless you pass **`PROJECT_PACK`** for that run).

Per-run **`PROJECT_PACK`** still overrides the config file.

## Layout

```
projects/
  config.json    # Jira project key → pack folder (generic only when key is absent)
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
