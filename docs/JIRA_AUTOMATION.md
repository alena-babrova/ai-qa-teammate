# Jira Automation → GitHub `repository_dispatch`

## Goal

When a Jira issue is labeled **`ai_ready`**, trigger the **Generate Test Cases** workflow on GitHub so **Cursor Agent** (in Actions only) writes **`generated/jira-tests/<STORY_KEY>/<STORY_KEY>-test-cases.md`** (resolved story key—parent when the labeled issue is a Sub-task) plus **`meta.json`**, and uploads them as a workflow artifact.

**The run posts nothing back to Jira.** The labeled issue is read-only input: no comments, no Test issues, no links, no label changes. Pick up the results from the workflow artifact or the job summary.

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
         "issue_key": "{{issue.key}}",
         "cursor_model": "composer-2.5"
       }
     }
     ```

     Optional **`cursor_model`**: Cursor Agent LLM id (same strings as the **Run workflow** dropdown, e.g. **`composer-2`**, **`composer-2.5`**, **`gpt-5`**). Omit to use repository variable **`CURSOR_AGENT_MODEL`** or the workflow default **`composer-2.5`**.
     Optional **`project_pack`**: repo-relative pack folder for a one-off run (overrides config; see [`PROJECT_PACKS.md`](PROJECT_PACKS.md)).
     Use your automation’s syntax to inject **`issue_key`**: bare key (**`PROJ-123`**) or a full **browse URL** (**`…/browse/PROJ-123`**). The workflow runs **`scripts/normalize-issue-input.js`** to resolve a key from either form.

3. **Event type** must match the workflow: **`ai-test-generate`** (see `.github/workflows/generate-test-cases.yml`). The workflow file defines **`repository_dispatch`** handling; the API **`event_type`** stays **`ai-test-generate`** so existing integrations keep working.

## After a successful run

Download the **`generated-jira-tests-<ISSUE_KEY>`** artifact, or read the test cases from the workflow job summary.

Consider a follow-up automation to remove **`ai_ready`** or add **`ai_tests_generated`** to avoid duplicate dispatches. Re-running for the same story simply regenerates the Markdown; nothing is duplicated in Jira because nothing is written there.
