import { describe, it, before, after } from "node:test";
import assert from "node:assert/strict";
import fs from "fs";
import path from "node:path";
import os from "node:os";
import {
  loadProjectPackConfig,
  isValidPackDir,
  resolveProjectPack,
  formatProjectPackPrompt,
} from "./resolve-project-pack.js";

function writePack(root, packPath) {
  const dir = path.join(root, packPath);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, "PROJECT.md"), "# Pack\n");
}

describe("loadProjectPackConfig", () => {
  let tmp;

  before(() => {
    tmp = fs.mkdtempSync(path.join(os.tmpdir(), "pack-config-"));
  });

  after(() => {
    fs.rmSync(tmp, { recursive: true, force: true });
  });

  it("returns null when config file is missing", () => {
    assert.equal(loadProjectPackConfig(tmp), null);
  });

  it("loads packs mapping from projects/config.json", () => {
    fs.mkdirSync(path.join(tmp, "projects"), { recursive: true });
    fs.writeFileSync(
      path.join(tmp, "projects/config.json"),
      JSON.stringify({ packs: { PROJ: "projects/custom", EPMRPP: "projects/EPMRPP" } }),
    );
    assert.deepEqual(loadProjectPackConfig(tmp), {
      packs: { PROJ: "projects/custom", EPMRPP: "projects/EPMRPP" },
    });
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

  it("uses PROJECT_PACK override when the folder is valid", () => {
    writePack(tmp, "projects/override");
    assert.equal(
      resolveProjectPack({
        root: tmp,
        projectKey: "OTHER",
        envOverride: "projects/override",
        config: { packs: {} },
      }),
      "projects/override",
    );
  });

  it("uses config mapping when the project key is listed", () => {
    writePack(tmp, "projects/shared");
    assert.equal(
      resolveProjectPack({
        root: tmp,
        projectKey: "PROJ",
        envOverride: null,
        config: { packs: { PROJ: "projects/shared" } },
      }),
      "projects/shared",
    );
  });

  it("does not use projects/<PROJECT_KEY>/ unless listed in config", () => {
    writePack(tmp, "projects/PROJ");
    assert.equal(
      resolveProjectPack({
        root: tmp,
        projectKey: "PROJ",
        envOverride: null,
        config: { packs: {} },
      }),
      null,
    );
  });

  it("returns null when no valid pack exists", () => {
    assert.equal(
      resolveProjectPack({
        root: tmp,
        projectKey: "UNKNOWN",
        envOverride: null,
        config: { packs: {} },
      }),
      null,
    );
  });

  it("returns null when config points to a missing or invalid pack", () => {
    fs.mkdirSync(path.join(tmp, "projects/empty"), { recursive: true });
    assert.equal(
      resolveProjectPack({
        root: tmp,
        projectKey: "PROJ",
        envOverride: null,
        config: { packs: { PROJ: "projects/missing", OTHER: "projects/empty" } },
      }),
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
