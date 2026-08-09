# Project packs

The generator works on any Jira project out of the box: it reads the story and writes test cases using the project-agnostic conventions in [`.cursor/rules/test-case-style.mdc`](../.cursor/rules/test-case-style.mdc).

A **project pack** is how you adjust that for one project — its vocabulary, title patterns, coverage habits, and examples. Packs are plain Markdown; there is no schema, no configuration keys, and no Jira field ids to look up.

## Selection

The pack folder is named after the **project key**, the part of the issue key before the dash.

| Story | Pack folder |
|-------|-------------|
| `PROJ-123` | `projects/PROJ/` |
| `EPMRPP-114990` | `projects/EPMRPP/` |

If the folder does not exist, the agent uses the generic style rule alone and takes wording from the story itself. To point a run at a different folder, set the **project pack** workflow input (or the `PROJECT_PACK` environment variable) to a repo-relative path.

`scripts/build-ci-prompt.js` resolves the pack and states it in the CI prompt, so the agent is told explicitly which folder to read or that no pack exists.

## Layout

```
projects/
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
