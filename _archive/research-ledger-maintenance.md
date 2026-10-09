# Research ledger maintenance

Repository: `ruijia-z/ruijia-z.github.io`, publishing branch `master`.
Public entry: https://ruijia-z.github.io/research/

## Content architecture

- `_data/research_ledger.json`: current ledger state, source registry, review history and scheduling label.
- `_includes/research-ledger.html`: accessible controls, embedded JSON and no-JavaScript fallback.
- `assets/js/research-ledger.js`: search, combined filters, ordering, details, browser-local bookmarks and permalink handling. Data is rendered with `textContent`, not `innerHTML`.
- `assets/css/research-ledger.css`: responsive styling scoped to Research.
- Keep the Research page's `author_profile: true` and the shared personal-profile sidebar. On narrow screens, use the theme's compact profile above the ledger.
- Inherit the site's shared font family and body type scale; keep ledger prose aligned with homepage paragraphs. Avoid nested `dl`/`dd` font-size reductions and separate numeral fonts.
- `_pages/research-updates/YYYYMMDD-YYYYMMDD.md`: dated, immutable Chinese issue snapshots. Keep the existing `weekly_update`, `week_end` and permalink convention so the archive discovers them.
- The original first English issue is retained at `/research/20261002-20261009/en/` and has `weekly_update: false` to avoid duplicate archive entries.

The ledger is a current-state view; past weekly articles are snapshots. Do not generate old articles dynamically from mutable ledger fields. Corrections to old articles must be explicitly dated. Never change stable entry IDs to make a duplicate appear new.

## Scope

Core: Hessian and Hessian quotient equations, Monge–Ampère equations, fully nonlinear elliptic PDE, curvature estimates, convex hypersurface flows, prescribed curvature, Minkowski problems and convex geometric inequalities.

Adjacent: conformal geometry and Q/σk curvature, geometric measure theory, minimal surfaces, stability and singularities, Allen–Cahn, Bernoulli/free boundaries, nonlinear spectral and variational methods. Explain a concrete connection to the core; do not restrict selection to the website owner's papers or publish private research notes.

AI: OpenAI, Anthropic, Google DeepMind, Microsoft Research and other established research groups where relevant. Track mathematical discovery, proof checking and formalization, research agents, public code, model/tool releases that materially affect research workflows, evaluations, costs and reproducibility. Do not present product benchmarks as theorem-proving evidence. Differentiate an official claim, a preprint, a checked formal artifact, and independent mathematical acceptance.

## Weekly workflow

1. Read the latest remote branch and ledger before editing. Fetch primary sources since the last successful scan, overlapping by one day to avoid timezone gaps. Use Asia/Shanghai for report periods; retain the source's original date and timezone when needed.
2. Search arXiv (math.AP, math.DG, math.MG, math.CA and relevant cross-lists), journal online-first pages, author/institution pages, and official AI research/news/changelog pages and repositories. MathOverflow, Math StackExchange and Reddit may identify references, objections or counterexamples; resolve consequential claims against primary sources. Skip login walls and inaccessible material rather than inventing content.
3. Recheck existing questions for new results, corrections, counterexamples and retractions. Match the precise equation, dimension, regularity, convexity/admissibility, boundary conditions and normalization. A weaker theorem must not close a stronger problem.
4. Add only meaningful items. Separate newly published/revised work from historical context added for the first time. Do not fabricate scanned-paper counts, ranks, certainty, journal status or the number of independently solved problems.
5. Each entry records formulation, known results, remaining gap, method, relevance, next step, source IDs, original source date, check date, status and dated history. Each source records authors, title, URL, version/date, type and actual reading depth. Recommendation levels are editorial reading priorities, not objective importance or difficulty scores.
6. Status rules: `open` only for a precisely identified question explicitly posed in the source and rechecked; `watch` for a new proof claim requiring review or an editorial extension whose novelty is unverified; `preprint` for reported paper results; `partial` only with exact solved/unsolved scopes; `established` for a verified publication/established theorem with a precise source, without implying an independent proof audit; `released` means an official AI announcement exists, not that all advertised capabilities are independently verified. `evidence` is independently one of `explicit`, `extension`, `theorem`, `official`.
7. Date substantive status changes in `history`; update `checked_on` only for entries actually rechecked. `last_scan.checked_on` denotes a successfully completed scan, never just an attempted run. Keep source dates separate from addition dates. For GitHub papers use a commit-pinned URL when available, and record revisions.
8. Write a concise Chinese weekly snapshot linking changed entries via `/research/?entry=ENTRY_ID#ledger` and to primary sources. Include an AI section and a short review of changed problem states. If there are no material advances, say so; retain a dated scan record without padding.
9. Run `python _checks/validate_research_ledger.py` and `node --check assets/js/research-ledger.js`. Validate new issue metadata and links. Use the repo's current frontend; do not redesign it during a content update.
10. Publish a reviewable commit, advance `master` with `expected_sha`/non-forced fast-forward, and verify GitHub Pages build/deploy plus live data and issue URLs. If the branch changes, re-read and merge changes; do not overwrite concurrent edits. Notify the user with the issue link and count of actual additions/status changes. If publication fails, report that failure and do not claim an update is live.

## Data contract

Entry IDs and topic IDs are lowercase hyphenated slugs. Dates are ISO `YYYY-MM-DD`. Source URLs use HTTPS. An entry can belong to multiple topics. `company` is a literal institution name or the empty string; the UI discovers companies from entries. `priority` is 1 (持续关注), 2 (建议浏览), or 3 (优先精读). `issues` contains date-range IDs for existing weekly articles. No HTML is accepted in prose data. Use explicit TeX commands such as `\prime` instead of smart-quote-sensitive apostrophes.

Bookmarks are stored only in the visitor's local browser; they are not account-synced and are never sent to the site owner. Empty searches, blocked storage and disabled JavaScript must remain usable. Test mobile width, combined filters, detail links, sort order and bookmark persistence when changing the frontend.

## Scheduling

The weekly scan is scheduled through ChatGPT, not through a browser-open timer or a GitHub Action with embedded API keys. The task reads this guide and the latest repo on each run. Its successful configuration is reflected in `schedule.enabled`; do not claim that creating a static page alone enables automatic research. Credentials and automation IDs must not be embedded in public site data.
