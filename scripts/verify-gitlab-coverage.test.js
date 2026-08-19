import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { countGherkinScenarios, validateGitLabCoverage } from "./verify-gitlab-coverage.js";

test("countGherkinScenarios counts scenario headers", () => {
  const md = `
#### Scenario 1: One
- [ ] **Given** a
#### Scenario 2: Two
- [ ] **Given** b
`;
  assert.equal(countGherkinScenarios(md), 2);
});

test("validateGitLabCoverage fails when tests fewer than GitLab scenarios", () => {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "gitlab-gate-"));
  const linkedDir = path.join(tmp, "linked-requirements");
  fs.mkdirSync(linkedDir, { recursive: true });
  fs.writeFileSync(
    path.join(tmp, "requirement-signals.json"),
    JSON.stringify({
      gitlabOnlyDescription: true,
      gitlabContentFiles: ["linked-requirements/spec.md"],
    }),
  );
  fs.writeFileSync(
    path.join(linkedDir, "spec.md"),
    "#### Scenario 1: A\n#### Scenario 2: B\n#### Scenario 3: C\n",
  );

  const err = validateGitLabCoverage(tmp, { tests: [{ summary: "One" }, { summary: "Two" }] });
  assert.match(err ?? "", /3 Gherkin scenario/);
  fs.rmSync(tmp, { recursive: true, force: true });
});

test("validateGitLabCoverage passes when tests cover all scenarios", () => {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "gitlab-gate-"));
  const linkedDir = path.join(tmp, "linked-requirements");
  fs.mkdirSync(linkedDir, { recursive: true });
  fs.writeFileSync(
    path.join(tmp, "requirement-signals.json"),
    JSON.stringify({
      gitlabOnlyDescription: true,
      gitlabContentFiles: ["linked-requirements/spec.md"],
    }),
  );
  fs.writeFileSync(path.join(linkedDir, "spec.md"), "#### Scenario 1: A\n#### Scenario 2: B\n");

  const err = validateGitLabCoverage(tmp, {
    tests: [{ summary: "A" }, { summary: "B" }],
  });
  assert.equal(err, null);
  fs.rmSync(tmp, { recursive: true, force: true });
});
