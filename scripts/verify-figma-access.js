#!/usr/bin/env node
/**
 * CI: optional check that FIGMA_API_KEY can call Figma REST (GET /v1/me).
 * Env: FIGMA_API_KEY — if unset or empty, exits 0 (Figma MCP is optional).
 */

const FIGMA_ME = "https://api.figma.com/v1/me";

async function main() {
  const token = process.env.FIGMA_API_KEY?.trim();
  if (!token) {
    console.log("FIGMA_API_KEY not set; skipping Figma access check (optional).");
    process.exit(0);
  }

  const res = await fetch(FIGMA_ME, {
    headers: { "X-Figma-Token": token },
  });

  const text = await res.text();
  let body;
  try {
    body = text ? JSON.parse(text) : null;
  } catch {
    body = null;
  }

  if (!res.ok) {
    const err = body?.err || body?.message || text?.slice(0, 200) || res.statusText;
    const msg = `Figma API check failed: HTTP ${res.status} — ${err}`;
    console.error(`::error::${msg}`);
    console.error(msg);
    process.exit(1);
  }

  const handle = body?.handle ?? body?.email ?? "(user)";
  console.log(`Figma API OK: authenticated as ${handle}`);
}

main().catch((e) => {
  const msg = e.message || String(e);
  console.error(`::error::Figma API check failed: ${msg}`);
  console.error(msg);
  process.exit(1);
});
