# Changelog

All notable changes to makr.css. Versions follow [semver](https://semver.org):
patch = fixes, minor = additions, major = breaking changes.

## [2.0.0] — 2026-11-12

Project renamed to **makr.css**. Nothing about the CSS itself changed.
Class names, variables and how things look are the same. It's a major
version because the file and layer names changed:

### Changed
- Files are now `makr.css`, `makr.min.css`, `makr-legacy.css` and `makr.js`.
- Cascade layers are now `makr.*` (e.g. `@layer makr.components`).
- Package name is now `makr-css`.

## [1.0.0] — 2026-11-06

First release, built from the MBM site's `helper.css`, `mbm.styles.css` and `editions.css`.

### Added
- Design tokens (`src/settings/tokens.css`) for colors, fonts, type, spacing, layout, radius, shadows, motion and component defaults.
- A fluid type scale (`--step--2` … `--step-7`) built in pure CSS from 6 variables, with no build step needed to re-tune it.
- Light theme by default, plus `data-theme="dark"` and `data-theme="auto"`. Themes can be applied per section.
- An MBM preset (`presets/mbm.css`) that recreates the current site's look.
- A Bootstrap-compatible 12-column grid with variable-driven gutters (`g-*`, `gx-*`, `gy-*`).
- Layout primitives: `auto-grid`, `with-sidebar`, `switcher`, `stack`, `cluster`, `split`, `center`, `full-bleed`.
- Responsive utilities generated from `framework.config.mjs`: display, flex, gap, text-align, order, spacing.
- Components: buttons (incl. the rolling `data-hover` effect), forms, tables, section heading, cards, badges, tags, alerts, accordion (`<details>` + old markup), tabs.
- `addons/legacy.css`, with the old helper class names on their original breakpoints and colors as variables.
- `addons/makr.js`, an optional ~1 KB helper for tabs and old-style accordions.
- A zero-dependency build (`npm run build`) and a release script (`npm run release`).
- `demo/index.html`, a kitchen-sink page.

### Fixed (compared with the original files)
- Grid gutters now work. The old `[class*="col-"]{padding:0}` rule had disabled them.
- `.text-lg` … `.text-xxxlg` work now. Their `calc()` was invalid.
- Headings get their font-family. The selector list had a trailing comma, so browsers dropped the rule.
- h4–h6 are fluid instead of fixed px.
- Breakpoints were consolidated from about 25 values to 5: 576 / 768 / 1024 / 1280 / 1440.
