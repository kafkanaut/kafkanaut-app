// Layout contract for the landing page.
//
// Encodes the layout the maintainer signed off on (2026-07-11). Any copy or
// CSS change that breaks one of these invariants must be AGREED first, then
// the numbers here updated in the same commit. CI runs this on every push.
//
// Run locally:  npx -y playwright@1.54 install chromium && node tests/layout-contract.mjs
import { chromium } from "playwright";
import { fileURLToPath } from "node:url";
import path from "node:path";

const page_url =
  "file://" + path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "index.html");

const failures = [];
const check = (cond, msg) => { if (!cond) failures.push(msg); };

const browser = await chromium.launch();
const page = await browser.newPage();

// ── Invariant 1: no horizontal scroll at any common width ──
for (const width of [390, 768, 1280, 1440, 1920, 2560]) {
  await page.setViewportSize({ width, height: 1080 });
  await page.goto(page_url);
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  check(overflow <= 0, `horizontal overflow of ${overflow}px at width ${width}`);
}

// ── Invariants 2-4: desktop composition (1440+) ──
for (const width of [1440, 1920, 2560]) {
  await page.setViewportSize({ width, height: 1080 });
  await page.goto(page_url);
  const m = await page.evaluate(() => {
    const h = (sel) => document.querySelector(sel)?.getBoundingClientRect().height ?? -1;
    return {
      heroMeta: h(".hero-meta"),
      statHeights: [...document.querySelectorAll(".stat")].map(
        (s) => s.getBoundingClientRect().height,
      ),
      statsBottom: document.querySelector(".stats")?.getBoundingClientRect().bottom ?? -1,
    };
  });
  // 2: hero-meta stays a single line (wrap once pushed the fold — 2026-07-11)
  check(
    m.heroMeta > 0 && m.heroMeta < 26,
    `hero-meta wraps (${Math.round(m.heroMeta)}px) at width ${width}`,
  );
  // 3: every stat cell stays single-line (uniform height < 72px)
  m.statHeights.forEach((sh, i) =>
    check(sh < 72, `stat #${i} wraps (${Math.round(sh)}px) at width ${width}`),
  );
  // 4: the stat strip ends within the first 1080p screen (hero doesn't grow)
  if (width === 1920) {
    check(
      m.statsBottom > 0 && m.statsBottom <= 1080,
      `stat strip below the fold at 1920×1080 (bottom=${Math.round(m.statsBottom)}px)`,
    );
  }
}

// ── Invariant 5: stat strip sits FLUSH at the bottom of the first screen ──
// The fold (nav + hero + stat strip) fills exactly one viewport, so the strip's
// bottom edge lands on the viewport bottom: no dead gap below it on short laptop
// windows, and no overflow past the fold on tall ones. 2px tolerance for
// sub-pixel rounding of 100svh.
// Matrix covers short laptop windows, wide-but-short windows (browser chrome
// eating height — the 2026-07-23 bug), and tall monitors.
for (const [width, height] of [
  [1280, 690], [1440, 820], [1512, 820], [1710, 860],
  [1920, 940], [1920, 1000], [1993, 1080], [2560, 1310],
]) {
  await page.setViewportSize({ width, height });
  await page.goto(page_url);
  const statsBottom = await page.evaluate(
    () => document.querySelector(".stats")?.getBoundingClientRect().bottom ?? -1,
  );
  check(
    statsBottom > 0 && Math.abs(statsBottom - height) <= 2,
    `stat strip not flush with the fold bottom at ${width}×${height} ` +
      `(bottom=${Math.round(statsBottom)}px, expected ~${height}px)`,
  );
}

await browser.close();

if (failures.length) {
  console.error("LAYOUT CONTRACT VIOLATED:");
  for (const f of failures) console.error("  ✗ " + f);
  process.exit(1);
}
console.log("layout contract OK");
