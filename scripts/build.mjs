/**
 * Embee CSS build — zero dependencies, just Node 18+.
 *
 *   npm run build     regenerate grid/utilities, bundle + minify into dist/
 *   npm run release   build, then freeze a copy in releases/v<version>/
 *
 * The version comes from package.json ("version"). Bump it first with
 *   npm version patch|minor|major --no-git-tag-version
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync, statSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
import { gzipSync } from 'node:zlib';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const pkg = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'));
const isRelease = process.argv.includes('--release');
const dist = join(root, 'dist');

// 1. regenerate grid + utilities from framework.config.mjs
execFileSync(process.execPath, [join(root, 'scripts', 'generate.mjs')], { stdio: 'inherit' });

const banner = (what) =>
  `/*! Embee CSS v${pkg.version}${what ? ' — ' + what : ''} | Embee Media Lab | built ${new Date().toISOString().slice(0, 10)} */\n`;

/** Inline `@import url("x") layer(name);` as `@layer name { …x… }` */
function bundle(entry) {
  const dir = dirname(entry);
  const src = readFileSync(entry, 'utf8');
  return src.replace(/@import\s+url\(["']?([^"')]+)["']?\)\s*layer\(([^)]+)\)\s*;/g, (_, file, layer) => {
    const css = readFileSync(join(dir, file), 'utf8').trim();
    return `@layer ${layer} {\n${css}\n}`;
  });
}

/** Small, safe minifier: protects strings, strips comments & whitespace. */
function minify(css) {
  const strings = [];
  css = css.replace(/(["'])(?:\\.|(?!\1)[^\\\n])*\1/g, (m) => `\u0000${strings.push(m) - 1}\u0000`);
  css = css
    .replace(/\/\*(?!!)[\s\S]*?\*\//g, '')
    .replace(/\s+/g, ' ')
    .replace(/\s*([{};,>~])\s*/g, '$1')
    .replace(/:\s+/g, ':')
    .replace(/;}/g, '}')
    .replace(/\s*!important/g, '!important')
    .trim();
  return css.replace(/\u0000(\d+)\u0000/g, (_, i) => strings[i]);
}

const kb = (s) => `${(Buffer.byteLength(s) / 1024).toFixed(1)} KB (${(gzipSync(s).length / 1024).toFixed(1)} KB gzip)`;
/** copy a file or folder by reading/writing (works on synced & network drives) */
function copy(src, dest) {
  if (statSync(src).isDirectory()) {
    mkdirSync(dest, { recursive: true });
    for (const f of readdirSync(src)) copy(join(src, f), join(dest, f));
  } else {
    mkdirSync(dirname(dest), { recursive: true });
    writeFileSync(dest, readFileSync(src));
  }
}

const out = (name, css) => {
  const p = join(dist, name);
  mkdirSync(dirname(p), { recursive: true });
  writeFileSync(p, css);
  return p;
};

mkdirSync(dist, { recursive: true });

// 2. core framework
const core = bundle(join(root, 'src', 'embee.css'));
out('embee.css', banner() + core);
const coreMin = banner() + minify(core);
out('embee.min.css', coreMin);
console.log(`dist/embee.min.css            ${kb(coreMin)}`);

// 3. presets
for (const f of readdirSync(join(root, 'presets')).filter((f) => f.endsWith('.css'))) {
  const css = readFileSync(join(root, 'presets', f), 'utf8');
  const name = f.replace(/\.css$/, '');
  out(`presets/${f}`, banner(`${name} preset`) + css);
  const m = banner(`${name} preset`) + minify(css);
  out(`presets/${name}.min.css`, m);
  console.log(`dist/presets/${name}.min.css      ${kb(m)}`);
}

// 4. legacy add-on (optional)
const legacyPath = join(root, 'addons', 'legacy.css');
if (existsSync(legacyPath)) {
  const css = readFileSync(legacyPath, 'utf8');
  out('embee-legacy.css', banner('legacy helper classes') + css);
  const m = banner('legacy helper classes') + minify(css);
  out('embee-legacy.min.css', m);
  console.log(`dist/embee-legacy.min.css     ${kb(m)}`);
}

// 5. optional JS
copy(join(root, 'addons', 'embee.js'), join(dist, 'embee.js'));

// 6. release: freeze dist/ into releases/v<version>/
if (isRelease) {
  const target = join(root, 'releases', `v${pkg.version}`);
  if (existsSync(target)) {
    console.error(`\n✖ releases/v${pkg.version} already exists. Bump the version in package.json first:\n  npm version patch --no-git-tag-version`);
    process.exit(1);
  }
  copy(dist, target);
  const files = [];
  const walk = (d) => readdirSync(d).forEach((f) => (statSync(join(d, f)).isDirectory() ? walk(join(d, f)) : files.push(relative(target, join(d, f)))));
  walk(target);
  console.log(`\n✔ Released v${pkg.version} → releases/v${pkg.version}/ (${files.length} files)`);
  console.log(`  Next: add a CHANGELOG entry, then\n  git add -A && git commit -m "Release v${pkg.version}" && git tag v${pkg.version}`);
}
