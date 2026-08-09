# Project packs

The generator uses **generic rules by default** for every run: [`.cursor/rules/test-case-style.mdc`](../.cursor/rules/test-case-style.mdc) plus the story's own vocabulary.

A **project pack** adds team-specific instructions on top of that base. It applies **only** when you set the optional **`project`** workflow input (or **`PROJECT`** env var) **and** the matching folder under **`projects/`** exists with a **`PROJECT.md`** file.

## Selection

| Workflow **project** input | `projects/<id>/` with `PROJECT.md`? | Result |
|----------------------------|-------------------------------------|--------|
| *(empty)* | — | **Generic only** |
| `EPMRPP` | yes | **Generic +** `projects/EPMRPP/` |
| `EPMRPP` | no | **Generic only** (CI warning) |
| `UNKNOWN` | no | **Generic only** |

The Jira issue key (e.g. `EPMRPP-114990`) does **not** auto-select a pack. Pass **`project: EPMRPP`** when you want Report Portal styling for that run.

**GitHub Actions:** **Run workflow** → optional **project** field (e.g. `EPMRPP`).

**Jira automation:** `"project": "EPMRPP"` in `client_payload` (legacy `"project_pack"` still works).

**IDE:** Tell the agent which pack to use (e.g. *use project pack EPMRPP*) or set **`PROJECT=EPMRPP`**.

`scripts/resolve-project-pack.js` implements the lookup; `scripts/build-ci-prompt.js` states the result in the CI prompt.

## Layout

```
projects/
  EPMRPP/
    PROJECT.md     # required
    CONTEXT.md     # optional
    examples/      # optional
```

## Writing `PROJECT.md`

Write it for a new QA joining your team. Things worth pinning down:

- **Vocabulary** — product, pages, roles, controls.
- **Title patterns** — test case title shape.
- **Preconditions and steps** — phrasing for login and navigation.
- **Expected results** — step mapping, bullet style, UI inventory depth.
- **Coverage expectations** — case types to always or never write.

A starting template lives in [`projects/README.md`](../projects/README.md).

## Worked example: `projects/EPMRPP/`

[`projects/EPMRPP/`](../projects/EPMRPP/) is a complete pack for Report Portal:

- [`PROJECT.md`](../projects/EPMRPP/PROJECT.md) — title patterns, precondition phrasing, API and GA conventions.
- [`CONTEXT.md`](../projects/EPMRPP/CONTEXT.md) — patterns distilled from 482 example cases.
- `examples/` — 20 full suites (UI, API, GA).

Copy its structure, replace the content with your project's, and run with **`project: YOUR_ID`**.
