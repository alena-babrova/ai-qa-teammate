import { describe, it, before, after } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { validateFigmaRead } from "./verify-figma-read.js";

describe("validateFigmaRead", () => {
  /** @type {string} */
  let tmpDir;

  before(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "figma-gate-"));
  });

  after(() => {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  it("fails when figma-read-failure.json exists", () => {
    fs.writeFileSync(
      path.join(tmpDir, "requirement-signals.json"),
      JSON.stringify({ figmaReadRequired: true, figmaFileKeys: ["key1"] }),
    );
    fs.writeFileSync(
      path.join(tmpDir, "figma-read-failure.json"),
      JSON.stringify({ failureReason: "MCP timeout" }),
    );
    const err = validateFigmaRead(tmpDir, [{ title: "x", body: "" }], null);
    assert.match(err, /Figma design gate failed/);
  });
});
