/**
 * Minimal Jira Server/DC REST client (Basic auth).
 * Jira 10.x: set JIRA_REST_API_VERSION=3 (especially for comments — API v2 plain `body` strings
 * may not appear in the UI).
 */

import { Buffer } from "buffer";

/**
 * Plain text (with newlines) → ADF doc for POST /rest/api/3/issue/.../comment
 * @param {string} text
 */
export function plainTextToAdfDoc(text) {
  const lines = text.split("\n");
  /** @type {object[]} */
  const inline = [];
  for (let i = 0; i < lines.length; i++) {
    if (i > 0) {
      inline.push({ type: "hardBreak" });
    }
    inline.push({ type: "text", text: lines[i] });
  }
  return {
    type: "doc",
    version: 1,
    content: [
      {
        type: "paragraph",
        content: inline.length ? inline : [{ type: "text", text: "" }],
      },
    ],
  };
}

/**
 * @param {{ baseUrl: string, email: string, apiToken: string, apiVersion?: string }} opts
 */
export function createJiraClient(opts) {
  const apiVersion =
    opts.apiVersion ?? process.env.JIRA_REST_API_VERSION ?? "2";
  const { baseUrl, email, apiToken } = opts;
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
      const payload =
        apiVersion === "3"
          ? { body: plainTextToAdfDoc(bodyText) }
          : { body: bodyText };
      return request(
        "POST",
        `/issue/${encodeURIComponent(issueKey)}/comment`,
        payload,
      );
    },
  };
}
