import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  buildFigmaPreflightUrl,
  extractFigmaSignals,
  figmaNodeIdFromUrl,
} from "./figma-signals.js";

const US_PLG_005_SNIPPET = `
## Design / Figma mockups
| Instance Plugins | [Figma](https://www.figma.com/design/PxNk9h6CS9Y4Mxcl2fS9HF/RP5?node-id=19210-4980) |
`;

describe("extractFigmaSignals", () => {
  it("detects design URL and file key from US-PLG-005-style markdown", () => {
    const { figmaReadRequired, figmaFileKeys, figmaUrls, figmaNodeIdsByFileKey } =
      extractFigmaSignals(US_PLG_005_SNIPPET);
    assert.equal(figmaReadRequired, true);
    assert.deepEqual(figmaFileKeys, ["PxNk9h6CS9Y4Mxcl2fS9HF"]);
    assert.deepEqual(figmaNodeIdsByFileKey.PxNk9h6CS9Y4Mxcl2fS9HF, ["19210:4980"]);
    assert.equal(figmaUrls.length, 1);
    assert.match(figmaUrls[0], /figma\.com\/design\/PxNk9h6CS9Y4Mxcl2fS9HF/);
  });

  it("supports /file/ URLs and dedupes keys", () => {
    const text = `
https://www.figma.com/file/AbCdEfGh/Name
https://figma.com/design/AbCdEfGh/Other
`;
    const { figmaReadRequired, figmaFileKeys } = extractFigmaSignals(text);
    assert.equal(figmaReadRequired, true);
    assert.deepEqual(figmaFileKeys, ["AbCdEfGh"]);
  });

  it("returns false when no Figma URLs", () => {
    const { figmaReadRequired, figmaFileKeys, figmaUrls, figmaNodeIdsByFileKey } =
      extractFigmaSignals("No design here.");
    assert.equal(figmaReadRequired, false);
    assert.deepEqual(figmaFileKeys, []);
    assert.deepEqual(figmaUrls, []);
    assert.deepEqual(figmaNodeIdsByFileKey, {});
  });
});

describe("figmaNodeIdFromUrl", () => {
  it("converts node-id query param to API id", () => {
    assert.equal(
      figmaNodeIdFromUrl(
        "https://www.figma.com/design/AbCd/file?node-id=19210-4980",
      ),
      "19210:4980",
    );
  });
});

describe("buildFigmaPreflightUrl", () => {
  it("uses depth=1 when no node ids are linked", () => {
    const url = buildFigmaPreflightUrl("e8vBoLmhDhs1fxrcFYpxdJ");
    assert.equal(url, "https://api.figma.com/v1/files/e8vBoLmhDhs1fxrcFYpxdJ?depth=1");
  });

  it("uses nodes endpoint when node ids are linked", () => {
    const url = buildFigmaPreflightUrl("e8vBoLmhDhs1fxrcFYpxdJ", ["19210:4980", "1:2"]);
    assert.equal(
      url,
      "https://api.figma.com/v1/files/e8vBoLmhDhs1fxrcFYpxdJ/nodes?ids=19210%3A4980%2C1%3A2&depth=1",
    );
  });
});
