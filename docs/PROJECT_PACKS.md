# Project packs

The generator uses **generic rules by default** for every Jira project: [`.cursor/rules/test-case-style.mdc`](../.cursor/rules/test-case-style.mdc) plus the story's own vocabulary.

A **project pack** adds team-specific instructions on top of that base. It applies **only** when the Jira project key is listed in [`projects/config.json`](../projects/config.json) (or you set **`PROJECT_PACK`** for a single run). Several Jira keys can point at the same pack folder.

## Selection

**Default: generic only.** Project packs are opt-in via config.

1. **`PROJECT_PACK`** — per-run override (workflow input or env var).
2. **[`projects/config.json`](../projects/config.json)** — `packs` map: Jira project key → pack folder. **Required** to enable a pack for CI/IDE (except per-run override).
3. **No entry** — generic [`.cursor/rules/test-case-style.mdc`](../.cursor/rules/test-case-style.mdc) only.

Example — enable generic + EPMRPP pack only for `EPMRPP` stories:

```json
{
  "packs": {
    "EPMRPP": "projects/EPMRPP",
    "RP": "projects/EPMRPP"
  }
}
```

| Story | In config? | Style |
|-------|------------|--------|
| `OTHER-123` | no | Generic only |
| `EPMRPP-114990` | yes → `projects/EPMRPP` | Generic + project pack (pack wins on conflict) |

`scripts/resolve-project-pack.js` implements the lookup; `scripts/build-ci-prompt.js` states the result in the CI prompt.

## Layout

```
projects/
  config.json    # Jira project key → pack folder (opt-in; generic when unlisted)
  PROJ/
    PROJECT.md     # required: the instructions the agent follows
    CONTEXT.md     # optional: granularity, coverage splits, calibration
    examples/      # optional: full example suites to imitate
```

Only `PROJECT.md` is required. Instructions in it **override** the generic style rule on conflict.

## Writing `PROJECT.md`

Write it for a new QA joining your team. Things worth pinning down:

- **Vocabulary** — what the product, its pages, roles, and controls are called.
- **Title patterns** — the shape of a test case title in your suite.
- **Preconditions and steps** — label style, numbering, phrasing for login and navigation.
- **Expected results** — how verifications map to steps, bullet style, how much UI inventory to list.
- **Coverage expectations** — which case types your team always writes (layout, validation, permissions, API errors, analytics ON/OFF pairs) and which it never writes.
- **Anything to avoid** — scenarios your team deliberately excludes.

A starting template lives in [`projects/README.md`](../projects/README.md).

## Adding examples

Real, reviewed test cases under `examples/` are the fastest way to calibrate granularity — how finely to split validation cases, how deep a permissions matrix goes, how many cases a page-layout story deserves. Reference them from `PROJECT.md` so the agent knows which example fits which kind of story.

If your suite is large, a `CONTEXT.md` that summarizes the patterns across those examples (title shapes, splitting rules, typical case counts) keeps the agent from having to read every file.

## Worked example: `projects/EPMRPP/`

[`projects/EPMRPP/`](../projects/EPMRPP/) is a complete pack for a Report Portal project:

- [`PROJECT.md`](../projects/EPMRPP/PROJECT.md) — title patterns, precondition and step phrasing (`Login to RP as Admin`, meatball menus), API and Google Analytics conventions.
- [`CONTEXT.md`](../projects/EPMRPP/CONTEXT.md) — patterns distilled from 482 example cases, with calibration counts per story type.
- `examples/` — 20 full suites split into UI, API, and GA folders.

Copy its structure, replace the content with your project's, and delete what does not apply.
