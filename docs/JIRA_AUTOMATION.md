# Jira Automation → GitHub `repository_dispatch`

## Goal

When a Jira issue is labeled **`ai_ready`**, trigger the **Generate Test Cases** workflow on GitHub so **Cursor Agent** (in Actions only) generates **`generated/jira-tests/<KEY>/tests.json`** and **`publish.js`** creates **Test** issues in Jira.

## Jira Automation rule (outline)

1. **Trigger:** Issue labeled → **Label added** = `ai_ready` (add filters for project or issue type if needed).
2. **Action:** Send **web request** (outbound HTTP).
   - **Method:** `POST`
   - **URL:** `https://api.github.com/repos/<OWNER>/<REPO>/dispatches`
   - **Headers:**
     - `Accept: application/vnd.github+json`
     - `Authorization: Bearer <GITHUB_PAT>`  
       Use a GitHub PAT with permission to trigger workflows on that repo (e.g. classic **`repo`** or fine-grained repo access). Store it in Jira secrets or your vault; it is not a secret of this workflow.
     - `X-GitHub-Api-Version: 2022-11-28` (or current GitHub API version from docs)
   - **Body (JSON):**
     ```json
     {
       "event_type": "ai-test-generate",
       "client_payload": {
         "issue_key": "{{issue.key}}"
       }
     }
     ```
     Use your automation’s syntax to inject the issue key (e.g. smart value for **Issue key**).

3. **Event type** must match the workflow: **`ai-test-generate`** (see `.github/workflows/generate-test-cases.yml`). The workflow file defines **`repository_dispatch`** handling; the API **`event_type`** stays **`ai-test-generate`** so existing integrations keep working.

## After a successful run

Consider a follow-up automation to remove **`ai_ready`** or add **`ai_tests_generated`** to avoid duplicate dispatches. **`publish.js`** also supports skipping when linked **Test** issues with the idempotency marker already exist (see `config/jira.test-generator.json`).
