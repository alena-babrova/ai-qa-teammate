import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  hostFromUrl,
  gitLabBlobUrls,
  parseGitLabBlobUrl,
  isGitLabOnlyDescription,
  confluencePageUrls,
  confluencePageIdFromUrl,
} from "./requirement-links.js";

describe("hostFromUrl", () => {
  it("takes the host from an API base URL", () => {
    assert.equal(hostFromUrl("https://gitlab.example.com/api/v4"), "gitlab.example.com");
    assert.equal(hostFromUrl("gitlab.example.com"), "gitlab.example.com");
    assert.equal(hostFromUrl(""), null);
    assert.equal(hostFromUrl(undefined), null);
  });
});

describe("gitLabBlobUrls", () => {
  const host = "gitlab.example.com";

  it("finds blob URLs on the configured host and dedupes them", () => {
    const text = `see https://gitlab.example.com/group/project/-/blob/main/docs/req.md
      and https://gitlab.example.com/group/project/-/blob/main/docs/req.md again`;
    assert.deepEqual(gitLabBlobUrls(text, host), [
      "https://gitlab.example.com/group/project/-/blob/main/docs/req.md",
    ]);
  });

  it("supports nested subgroups and strips trailing punctuation", () => {
    const text = "(https://gitlab.example.com/group/sub/project/-/blob/main/a/b.md).";
    const [url] = gitLabBlobUrls(text, host);
    assert.equal(url, "https://gitlab.example.com/group/sub/project/-/blob/main/a/b.md");
    assert.deepEqual(parseGitLabBlobUrl(url, host), {
      projectPath: "group/sub/project",
      ref: "main",
      filePath: "a/b.md",
    });
  });

  it("ignores other hosts when a host is configured", () => {
    const text = "https://other.example.com/group/project/-/blob/main/req.md";
    assert.deepEqual(gitLabBlobUrls(text, host), []);
    assert.deepEqual(gitLabBlobUrls(text, null), [text]);
  });

  it("decodes the file path and drops query and hash", () => {
    const parsed = parseGitLabBlobUrl(
      "https://gitlab.example.com/g/p/-/blob/main/docs/my%20file.md?ref_type=heads#L10",
      host,
    );
    assert.equal(parsed.filePath, "docs/my file.md");
    assert.equal(parsed.ref, "main");
  });
});

describe("isGitLabOnlyDescription", () => {
  const host = "gitlab.example.com";

  it("is true when the description is nothing but GitLab links", () => {
    assert.equal(
      isGitLabOnlyDescription("https://gitlab.example.com/g/p/-/blob/main/req.md", host),
      true,
    );
    assert.equal(
      isGitLabOnlyDescription("Requirements: https://gitlab.example.com/g/p/-/blob/main/req.md", host),
      false,
    );
    assert.equal(isGitLabOnlyDescription("   ", host), false);
  });
});

describe("confluencePageUrls", () => {
  it("matches page URLs on the configured host", () => {
    const text = "spec: https://kb.example.com/spaces/QA/pages/12345/GA4 events";
    assert.deepEqual(confluencePageUrls(text, "kb.example.com"), [
      "https://kb.example.com/spaces/QA/pages/12345/GA4",
    ]);
    assert.equal(
      confluencePageIdFromUrl("https://kb.example.com/spaces/QA/pages/12345/GA4"),
      "12345",
    );
  });

  it("without a configured host, accepts only Confluence-shaped URLs", () => {
    assert.deepEqual(
      confluencePageUrls("https://wiki.example.com/wiki/spaces/QA/pages/9/x", null),
      ["https://wiki.example.com/wiki/spaces/QA/pages/9/x"],
    );
    assert.deepEqual(confluencePageUrls("https://shop.example.com/pages/9", null), []);
  });
});
