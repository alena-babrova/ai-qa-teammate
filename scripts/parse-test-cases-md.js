/**
 * Parses the generated Markdown deliverable (generated/jira-tests/<STORY_KEY>/<STORY_KEY>-test-cases.md).
 * One `## ` heading = one test case; everything until the next `## ` heading is its body.
 */

const CASE_HEADING = /^##[ \t]+(.*\S)[ \t]*$/;

const SECTION_PATTERNS = {
  preconditions: /^[*_\s]*pre-?conditions\b/im,
  steps: /^[*_\s]*steps\b/im,
  expectedResults: /^[*_\s]*expected[ \t]+results?\b/im,
};

/**
 * @param {string} text
 * @returns {Array<{ title: string, body: string }>}
 */
export function parseTestCases(text) {
  /** @type {Array<{ title: string, body: string }>} */
  const cases = [];
  /** @type {{ title: string, body: string } | null} */
  let current = null;
  let inFence = false;

  for (const line of text.split(/\r?\n/)) {
    if (/^\s*```/.test(line)) {
      inFence = !inFence;
    } else if (!inFence) {
      const heading = CASE_HEADING.exec(line);
      if (heading) {
        current = { title: heading[1].trim(), body: "" };
        cases.push(current);
        continue;
      }
    }
    if (current) current.body += `${line}\n`;
  }

  return cases;
}

/**
 * @param {{ body: string }} testCase
 * @returns {string[]} names of the required sections that are missing
 */
export function missingSections(testCase) {
  return Object.entries(SECTION_PATTERNS)
    .filter(([, pattern]) => !pattern.test(testCase.body))
    .map(([name]) => name);
}
