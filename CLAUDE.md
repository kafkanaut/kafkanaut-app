# CLAUDE.md — kafkanaut-app (public website + downloads)

Auto-loaded by Claude Code when working in this repo. This repo is the
**public distribution channel** for Kafkanaut: the marketing landing page
(served by GitHub Pages) plus the release binaries (GitHub Releases). It
contains **no application source** — that lives privately elsewhere (see below).

## What this repo is

- **`index.html`** — the landing page (self-contained static: local `assets/`
  fonts + screenshots, no external CDNs, `.nojekyll` so Pages serves it raw).
- **`assets/`** — screenshots, `kafkanaut-icon.png`, `fonts.css` + `fonts/`.
- **Live site:** https://kafkanaut.github.io/kafkanaut-app/ (Pages, main/root,
  HTTPS). Edit `index.html`/`assets`, commit, **push → Pages auto-rebuilds**.
- **Downloads:** GitHub Releases of this repo. Buttons point at
  `releases/latest/download/Kafkanaut_macOS_universal.dmg` (stable name).
  Current release **v0.48.0** = macOS universal (Apple Silicon + Intel,
  ~19 MB, unsigned); legacy aarch64-only DMGs also attached. No Windows
  `.exe` yet. Homebrew: `brew install --cask kafkanaut/tap/kafkanaut`
  (tap repo `kafkanaut/homebrew-tap`; bump version + sha256 per release).

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
- **No telemetry, no account.** Secrets are stored in a local file readable
  only by the user's account (0600) — **do NOT claim "OS keychain"**; the
  keychain dependency was deliberately removed from the implementation (see
  `../kafkanaut/src-tauri/src/secrets_store.rs`). AI is opt-in and can run
  fully local (Ollama).
- **Contact:** `michal.svondr@gmail.com`. No company / Teams / "WAG".
- **Download buttons trigger the download directly** via the stable-named
  asset `releases/latest/download/Kafkanaut_macOS_universal.dmg` — no GitHub
  detour, and the URL never changes between releases. Every release MUST
  upload this stable-named copy alongside the versioned DMG (see the
  release checklist in `../kafkanaut/CLAUDE.md`), otherwise the buttons
  404. On release, only the displayed version strings on the page change.
  The "all releases" link next to the version points at `/releases`.
- **Honest install note:** builds are not yet code-signed/notarized → macOS
  "right-click → Open", Windows "More info → Run anyway". Remove once notarized.

## Publishing a new app version

Binaries are built in the private `kafkanaut` repo (`pnpm tauri build`), then
published with **both** the versioned DMG and a stable-named copy
(`Kafkanaut_macOS_aarch64.dmg`) — full commands in the release checklist in
`../kafkanaut/CLAUDE.md`. Then bump the version shown on the page (the
download URLs point at `releases/latest/download/` and never change).
(macOS auto-updater will read these releases once Apple Developer ID
notarization lands.)

## Open items

- **Windows `.exe` doesn't exist yet** — the page shows a disabled
  "Windows — coming soon" card. Turn it back into a download button once a
  Windows build ships. (Intel macOS: resolved — v0.48.0 ships a universal
  DMG and the page advertises Apple Silicon & Intel.)
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
