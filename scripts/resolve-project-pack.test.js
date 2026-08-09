import { describe, it, before, after } from "node:test";
import assert from "node:assert/strict";
import fs from "fs";
import path from "node:path";
import os from "node:os";
import {
  normalizePackInput,
  isValidPackDir,
  resolveProjectPack,
  formatProjectPackPrompt,
} from "./resolve-project-pack.js";

function writePack(root, packPath) {
  const dir = path.join(root, packPath);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, "PROJECT.md"), "# Pack\n");
}

describe("normalizePackInput", () => {
  it("maps a short id to projects/<id>", () => {
    assert.equal(normalizePackInput("EPMRPP"), "projects/EPMRPP");
  });

  it("accepts a full projects/ path", () => {
    assert.equal(normalizePackInput("projects/EPMRPP"), "projects/EPMRPP");
  });

  it("returns null for empty or path traversal", () => {
    assert.equal(normalizePackInput(""), null);
    assert.equal(normalizePackInput("  "), null);
    assert.equal(normalizePackInput("../escape"), null);
  });
});

describe("resolveProjectPack", () => {
  let tmp;

  before(() => {
    tmp = fs.mkdtempSync(path.join(os.tmpdir(), "pack-resolve-"));
  });

  after(() => {
    fs.rmSync(tmp, { recursive: true, force: true });
  });

  it("uses the pack when project input matches an existing folder", () => {
    writePack(tmp, "projects/EPMRPP");
    assert.equal(
      resolveProjectPack({ root: tmp, projectInput: "EPMRPP" }),
      "projects/EPMRPP",
    );
  });

  it("returns null when project input is not set", () => {
    writePack(tmp, "projects/EPMRPP");
    assert.equal(resolveProjectPack({ root: tmp, projectInput: null }), null);
  });

  it("returns null when the project folder is missing", () => {
    assert.equal(
      resolveProjectPack({ root: tmp, projectInput: "UNKNOWN" }),
      null,
    );
  });

  it("returns null when the folder exists but lacks PROJECT.md", () => {
    fs.mkdirSync(path.join(tmp, "projects/empty"), { recursive: true });
    assert.equal(
      resolveProjectPack({ root: tmp, projectInput: "empty" }),
      null,
    );
  });
});

describe("isValidPackDir", () => {
  let tmp;

  before(() => {
    tmp = fs.mkdtempSync(path.join(os.tmpdir(), "pack-valid-"));
  });

  after(() => {
    fs.rmSync(tmp, { recursive: true, force: true });
  });

  it("requires PROJECT.md inside the pack folder", () => {
    writePack(tmp, "projects/ok");
    assert.equal(isValidPackDir(tmp, "projects/ok"), true);
    fs.mkdirSync(path.join(tmp, "projects/no-md"), { recursive: true });
    assert.equal(isValidPackDir(tmp, "projects/no-md"), false);
    assert.equal(isValidPackDir(tmp, "../escape"), false);
  });
});

describe("formatProjectPackPrompt", () => {
  it("describes generic-only or generic-plus-pack", () => {
    assert.match(formatProjectPackPrompt("projects/EPMRPP"), /generic.*plus/i);
    assert.match(formatProjectPackPrompt(null), /generic only/i);
  });
});
