import { describe, it } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { validateFigmaRead } from "./verify-figma-read.js";

describe("validateFigmaRead", () => {
  /** @param {() => void} fn */
  function withSignalsDir(fn) {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), "figma-gate-"));
    try {
      fn(dir);
    } finally {
      fs.rmSync(dir, { recursive: true, force: true });
    }
  }

  it("fails when figma-read-failure.json exists", () => {
    withSignalsDir((tmpDir) => {
      fs.writeFileSync(
        path.join(tmpDir, "requirement-signals.json"),
        JSON.stringify({ figmaReadRequired: true, figmaFileKeys: ["key1"] }),
      );
      fs.writeFileSync(
        path.join(tmpDir, "figma-read-failure.json"),
        JSON.stringify({ failureReason: "MCP timeout" }),
      );
      const err = validateFigmaRead(tmpDir, { tests: [{ summary: "x" }] }, null);
      assert.match(err, /Figma design gate failed/);
    });
  });

  it("fails when tests exist but figmaFileKeysRead is missing or incomplete", () => {
    withSignalsDir((tmpDir) => {
      fs.writeFileSync(
        path.join(tmpDir, "requirement-signals.json"),
        JSON.stringify({ figmaReadRequired: true, figmaFileKeys: ["key1", "key2"] }),
      );
      const errMissing = validateFigmaRead(
        tmpDir,
        { tests: [{ summary: "UI case" }] },
        { figmaFileKeysRead: ["key1"] },
      );
      assert.match(errMissing, /figmaFileKeysRead does not match/);

      const errAbsent = validateFigmaRead(tmpDir, { tests: [{ summary: "UI case" }] }, {});
      assert.match(errAbsent, /figmaFileKeysRead does not match/);
    });
  });

  it("fails when figma is required but neither tests nor failure file was written", () => {
    withSignalsDir((tmpDir) => {
      fs.writeFileSync(
        path.join(tmpDir, "requirement-signals.json"),
        JSON.stringify({ figmaReadRequired: true, figmaFileKeys: ["key1"] }),
      );
      const err = validateFigmaRead(tmpDir, null, null);
      assert.match(err, /Figma design gate not satisfied/);
    });
  });

  it("passes when figmaFileKeysRead matches required keys", () => {
    withSignalsDir((tmpDir) => {
      fs.writeFileSync(
        path.join(tmpDir, "requirement-signals.json"),
        JSON.stringify({ figmaReadRequired: true, figmaFileKeys: ["key1"] }),
      );
      const err = validateFigmaRead(
        tmpDir,
        { tests: [{ summary: "UI case" }] },
        { figmaFileKeysRead: ["key1"] },
      );
      assert.equal(err, null);
    });
  });

  it("passes when figma is not required", () => {
    withSignalsDir((tmpDir) => {
      fs.writeFileSync(
        path.join(tmpDir, "requirement-signals.json"),
        JSON.stringify({ figmaReadRequired: false }),
      );
      const err = validateFigmaRead(tmpDir, { tests: [{ summary: "UI case" }] }, {});
      assert.equal(err, null);
    });
  });
});
