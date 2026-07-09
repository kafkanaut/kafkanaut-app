# CLAUDE.md — kafkanaut-app (public website + downloads)

Auto-loaded by Claude Code when working in this repo. This repo is the
**public distribution channel** for Kafkanaut: the marketing landing page
(served by GitHub Pages) plus the release binaries (GitHub Releases). It
contains **no application source** — that lives privately elsewhere (see below).

## What this repo is

- **`index.html`** — the landing page (self-contained static: local `assets/`
  fonts + screenshots, no external CDNs, `.nojekyll` so Pages serves it raw).
- **`assets/`** — screenshots, `kafkanaut-icon.png`, `fonts.css` + `fonts/`.
- **Live site:** https://smike4658.github.io/kafkanaut-app/ (Pages, main/root,
  HTTPS). Edit `index.html`/`assets`, commit, **push → Pages auto-rebuilds**.
- **Downloads:** GitHub Releases of this repo. Buttons on the page point at
  `.../releases/latest`. Current release **v0.48.0** = macOS
  `Kafkanaut_0.48.0_aarch64.dmg` (unsigned). No Windows `.exe` yet.

## Verifying the copy against the real app (do this before changing claims)

The website makes concrete claims about the app. **Do not invent or overstate
features.** Verify against the app's actual behavior:

- The **application source is a separate PRIVATE repo `kafkanaut`**, usually
  cloned as a **sibling directory** (`../kafkanaut`). If it's present locally,
  read its `README.md` (Status section = authoritative feature changelog) and
  `docs/` before editing any feature/claim on the page. If it's not present,
  ask the user rather than guessing.
- When in doubt about whether a feature exists or how it behaves, check the
  source or ask — never fabricate.

## Copy rules (keep these true)

- **Positioning: "free desktop Kafka client" — NOT "open source".** The app
  source is private. No MIT / "view source" / source-repo links.
- **Safety wording must stay precise.** Reads use `assign()` only — the app
  never joins a consumer group and never commits offsets, so browsing/tailing
  can't disturb production consumers' lag or committed offsets. Separately, the
  app *does* have full cluster admin (inspect consumer-group lag, reset
  offsets, create/delete topics) — present those as **deliberate, confirmed
  operator actions**, never "it never touches consumer groups".
- **No telemetry, no account.** Secrets live in the OS keychain. AI is opt-in
  and can run fully local (Ollama).
- **Contact:** `michal.svondr@gmail.com`. No company / Teams / "WAG".
- **Downloads → `releases/latest`**; keep the displayed version in sync with the
  latest Release.
- **Honest install note:** builds are not yet code-signed/notarized → macOS
  "right-click → Open", Windows "More info → Run anyway". Remove once notarized.

## Publishing a new app version

Binaries are built in the private `kafkanaut` repo (`pnpm tauri build`), then:
`gh release create vX.Y.Z --repo smike4658/kafkanaut-app <artifacts>`. Then bump
the version shown on the page. (macOS auto-updater will read these releases once
Apple Developer ID notarization lands.)

## Open items

- **Windows `.exe` doesn't exist yet** — the Windows download button currently
  resolves to the releases page with no installer. Consider a "Windows — coming
  soon" label until a Windows build ships.
- Two **screenshot slots** on the page (browse-tail, inspect) await real
  captures of the current teal UI.
- macOS build **not yet notarized**.
- Custom domain `kafkanaut.app` can be attached to Pages via a `CNAME` file +
  DNS later (matches the app's `dev.kafkanaut.app` identifier).

## Don't

- Don't add external CDN/script/font references — the page must stay
  self-contained for Pages.
- Don't claim "open source" or link to app source.
- Don't overstate features — verify against the private `kafkanaut` source.
