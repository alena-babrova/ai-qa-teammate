/**
 * Minimal read-only Jira Server/DC REST client (Basic auth).
 * Uses REST API v2 only (`/rest/api/2/...`). This pipeline never writes to Jira, so no
 * create/update/comment helpers are exposed here.
 */

import { Buffer } from "buffer";

/** @param {{ baseUrl: string, email: string, apiToken: string }} opts */
export function createJiraClient(opts) {
  const { baseUrl, email, apiToken } = opts;
  const base = baseUrl.replace(/\/+$/, "");
  const auth = Buffer.from(`${email}:${apiToken}`, "utf8").toString("base64");

  async function request(method, apiPath) {
    const url = `${base}/rest/api/2${apiPath}`;
    const headers = {
      Authorization: `Basic ${auth}`,
      Accept: "application/json",
    };
    const res = await fetch(url, { method, headers });
    const text = await res.text();
    let json;
    try {
      json = text ? JSON.parse(text) : null;
    } catch {
      json = { raw: text };
    }
    if (!res.ok) {
      const msg = json?.errorMessages?.join("; ") || json?.message || text || res.statusText;
      throw new Error(`Jira ${method} ${apiPath} failed ${res.status}: ${msg}`);
    }
    return json;
  }

  return {
    base,
    async getIssue(issueKey, fields = ["summary", "description", "issuetype"]) {
      const params = new URLSearchParams({ fields: fields.join(",") });
      return request(
        "GET",
        `/issue/${encodeURIComponent(issueKey)}?${params.toString()}`,
      );
    },
    async search(jql, fields = ["summary", "description", "key"]) {
      const params = new URLSearchParams({
        jql,
        maxResults: "50",
        fields: fields.join(","),
      });
      return request("GET", `/search?${params.toString()}`);
    },
  };
}
