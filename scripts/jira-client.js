/**
 * Minimal Jira Server/DC REST client (Basic auth).
 */

import { Buffer } from "buffer";

/**
 * @param {{ baseUrl: string, email: string, apiToken: string, apiVersion?: string }} opts
 */
export function createJiraClient(opts) {
  const { baseUrl, email, apiToken, apiVersion = "2" } = opts;
  const base = baseUrl.replace(/\/+$/, "");
  const auth = Buffer.from(`${email}:${apiToken}`, "utf8").toString("base64");

  async function request(method, apiPath, body) {
    const url = `${base}/rest/api/${apiVersion}${apiPath}`;
    const headers = {
      Authorization: `Basic ${auth}`,
      Accept: "application/json",
      "Content-Type": "application/json",
    };
    const res = await fetch(url, {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
    });
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
    async search(jql, fields = ["summary", "description", "key"]) {
      const params = new URLSearchParams({
        jql,
        maxResults: "50",
        fields: fields.join(","),
      });
      return request("GET", `/search?${params.toString()}`);
    },
    async createIssue(fields) {
      return request("POST", "/issue", { fields });
    },
    async createIssueLink(typeName, inwardKey, outwardKey) {
      return request("POST", "/issueLink", {
        type: { name: typeName },
        inwardIssue: { key: inwardKey },
        outwardIssue: { key: outwardKey },
      });
    },
    async addComment(issueKey, bodyText) {
      return request("POST", `/issue/${encodeURIComponent(issueKey)}/comment`, {
        body: bodyText,
      });
    },
  };
}
