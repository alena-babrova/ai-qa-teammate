import { describe, it, before, after } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { parseTestCases, missingSections } from "./parse-test-cases-md.js";
import { validateGaCoverage } from "./verify-ga-coverage.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

const CASE = `## Organizations. Projects page. Layout

*Preconditions:*
Administrator user is logged in

*Steps:*
1. Open the "Projects" page

*Expected results:*
1. The page is displayed
`;

function doc(...cases) {
  return `# Test cases: PROJ-1 — Title\n\n**User story:** https://jira.example.com/browse/PROJ-1\n\n---\n\n${cases.join("\n---\n\n")}`;
}

describe("parseTestCases", () => {
  it("splits on ## headings and keeps the body", () => {
    const cases = parseTestCases(doc(CASE, CASE.replace("Layout", "Sorting")));
    assert.equal(cases.length, 2);
    assert.equal(cases[0].title, "Organizations. Projects page. Layout");
    assert.match(cases[0].body, /Preconditions/);
    assert.deepEqual(missingSections(cases[0]), []);
  });

  it("ignores ### subheadings and ## inside fenced code", () => {
    const cases = parseTestCases(
      doc(`${CASE}\n### Not a case\n\n\`\`\`\n## Also not a case\n\`\`\`\n`),
    );
    assert.equal(cases.length, 1);
  });

  it("reports missing sections", () => {
    const [only] = parseTestCases(doc("## Title only\n\nsome text\n"));
    assert.deepEqual(missingSections(only), [
      "preconditions",
      "steps",
      "expectedResults",
    ]);
  });
});

describe("validateGaCoverage", () => {
  /** @type {string} */
  let tmpDir;

  before(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "ga-coverage-"));
  });

  after(() => {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  it("requires two GA cases and the authoritative place value", () => {
    fs.writeFileSync(
      path.join(tmpDir, "requirement-signals.json"),
      JSON.stringify({
        gaCoverageRequired: true,
        gaHints: ["place:projects_list"],
      }),
    );

    const one = [{ title: "GA. Instance level. Projects page. GA is sent", body: "place: projects_list" }];
    assert.match(validateGaCoverage(tmpDir, one), /need at least 2/);

    const withoutPlace = [
      { title: "GA. Instance level. Projects page. GA is sent", body: "collect" },
      { title: "GA. Instance level. Projects page. GA OFF", body: "collect" },
    ];
    assert.match(validateGaCoverage(tmpDir, withoutPlace), /projects_list/);

    assert.equal(validateGaCoverage(tmpDir, [...withoutPlace, ...one]), null);
  });
});

describe("verify-generated-tests CLI", () => {
  /** @type {string} */
  let outDir;

  before(() => {
    outDir = path.join(root, "generated", "jira-tests", "ZZTEST-1");
    fs.mkdirSync(outDir, { recursive: true });
  });

  after(() => {
    fs.rmSync(outDir, { recursive: true, force: true });
  });

  /** @returns {{ status: number, output: string }} */
  function run() {
    try {
      const output = execFileSync(
        process.execPath,
        [path.join(root, "scripts", "verify-generated-tests.js"), "ZZTEST-1"],
        { encoding: "utf8", stdio: "pipe" },
      );
      return { status: 0, output };
    } catch (e) {
      return { status: e.status ?? 1, output: `${e.stdout ?? ""}${e.stderr ?? ""}` };
    }
  }

  it("fails when the Markdown deliverable is missing", () => {
    const { status, output } = run();
    assert.equal(status, 1);
    assert.match(output, /Missing generated test cases/);
  });

  it("fails when caseCount disagrees with the Markdown", () => {
    fs.writeFileSync(path.join(outDir, "ZZTEST-1-test-cases.md"), doc(CASE));
    fs.writeFileSync(
      path.join(outDir, "meta.json"),
      JSON.stringify({ storyKey: "ZZTEST-1", caseCount: 3, empty: false }),
    );
    const { status, output } = run();
    assert.equal(status, 1);
    assert.match(output, /caseCount is 3/);
  });

  it("fails when a title contains the story key", () => {
    fs.writeFileSync(
      path.join(outDir, "ZZTEST-1-test-cases.md"),
      doc(CASE.replace("Layout", "ZZTEST-1 Layout")),
    );
    fs.writeFileSync(
      path.join(outDir, "meta.json"),
      JSON.stringify({ storyKey: "ZZTEST-1", caseCount: 1, empty: false }),
    );
    const { status, output } = run();
    assert.equal(status, 1);
    assert.match(output, /must not contain the story key/);
  });

  it("passes for a well-formed deliverable", () => {
    fs.writeFileSync(path.join(outDir, "ZZTEST-1-test-cases.md"), doc(CASE));
    fs.writeFileSync(
      path.join(outDir, "meta.json"),
      JSON.stringify({ storyKey: "ZZTEST-1", caseCount: 1, empty: false }),
    );
    const { status, output } = run();
    assert.equal(status, 0, output);
    assert.match(output, /OK: 1 test case/);
  });

  it("accepts an empty story when meta marks it empty", () => {
    fs.writeFileSync(
      path.join(outDir, "ZZTEST-1-test-cases.md"),
      "# Test cases: ZZTEST-1 — Title\n\nThe story has no testable content.\n",
    );
    fs.writeFileSync(
      path.join(outDir, "meta.json"),
      JSON.stringify({ storyKey: "ZZTEST-1", caseCount: 0, empty: true }),
    );
    const { status, output } = run();
    assert.equal(status, 0, output);
    assert.match(output, /0 test cases/);
  });
});
