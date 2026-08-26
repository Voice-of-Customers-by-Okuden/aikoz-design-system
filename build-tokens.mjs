import StyleDictionary from 'style-dictionary';
import fs from 'node:fs';

const PRIM = 'tokens/primitives.json';
const brand = b => `tokens/brand/${b}.json`;
const theme = t => `tokens/theme/${t}.json`;
const bridgeSrc = 'tokens/bridge/shadcn.json';
const SEM = 'tokens/semantics.json';
const inPath = sub => t => t.filePath.includes(sub);

// hex sRGB -> composants OKLCH (matrices de Björn Ottosson). Uniquement pour
// les rares valeurs couleur littérales en hex (ex. #FFFFFF dans les thèmes) ;
// les primitives portent déjà leurs composants OKLCH dans le DTCG.
function hexToOklch(hex) {
  if (!/^#[0-9a-f]{6}$/i.test(hex)) return null;
  let r = parseInt(hex.slice(1, 3), 16) / 255;
  let g = parseInt(hex.slice(3, 5), 16) / 255;
  let b = parseInt(hex.slice(5, 7), 16) / 255;
  const lin = c => (c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4));
  r = lin(r); g = lin(g); b = lin(b);
  const l = 0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b;
  const mm = 0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b;
  const s = 0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b;
  const l_ = Math.cbrt(l), m_ = Math.cbrt(mm), s_ = Math.cbrt(s);
  const L = 0.2104542553 * l_ + 0.7936177850 * m_ - 0.0040720468 * s_;
  const A = 1.9779984951 * l_ - 2.4285922050 * m_ + 0.4505937099 * s_;
  const B = 0.0259040371 * l_ + 0.7827717662 * m_ - 0.8086757660 * s_;
  const C = Math.sqrt(A * A + B * B);
  let H = (Math.atan2(B, A) * 180) / Math.PI;
  if (H < 0) H += 360;
  const rC = Math.round(C * 1e4) / 1e4;
  return [Math.round(L * 1e4) / 1e4, rC, rC < 1e-4 ? 0 : Math.round(H * 1e3) / 1e3];
}
const isColor = token => (token.$type ?? token.type) === 'color';

// La variable CSS porte la couleur COMPLÈTE : oklch(L C H) — ou oklch(L C H / a)
// si alpha != 1. On lit les composants source du DTCG verbatim (jamais recalculés).
// Les consommateurs utilisent var(--x) brut ; la transparence passe par color-mix.
function oklchCss([L, C, H], a = 1) {
  return a === 1 ? `oklch(${L} ${C} ${H})` : `oklch(${L} ${C} ${H} / ${a})`;
}
StyleDictionary.registerTransform({
  name: 'color/oklch',
  type: 'value',
  filter: isColor,
  transform: token => {
    const v = token.value ?? token.$value;
    if (v && typeof v === 'object' && Array.isArray(v.components)) {
      return oklchCss(v.components, v.alpha ?? 1);
    }
    const c = hexToOklch(v); // littéral hex (#FFFFFF…)
    return c ? oklchCss(c) : v;
  },
});

// --- Typographie : shorthand `font` construit depuis les alias NON résolus.
// Style Dictionary rend d'abord le token objet `typography` en chaîne, puis, pour
// outputReferences, réinjecte les alias par un String.replace BRUT de la valeur
// résolue. Sur role.typography.label.sm, line-height.loose vaut `2` : le replace
// tombe sur le « 2 » de `--dimension-font-size-2xs` et corrompt la déclaration
// (`var(--dimension-font-size-var(--line-height-loose)xs)/2`). Le piège est
// structurel — toute paire {taille contenant un chiffre} x {line-height entier}
// le rejouera. On construit donc le shorthand nous-mêmes à partir de
// token.original.$value, et on coupe outputReferences sur ces tokens.
const refToVar = s =>
  typeof s === 'string' && /^\{[^{}]+\}$/.test(s.trim())
    ? `var(--${s.trim().slice(1, -1).replace(/\./g, '-')})`
    : s;

StyleDictionary.registerTransform({
  name: 'typography/css/shorthand-refs',
  type: 'value',
  transitive: true,
  filter: token => (token.$type ?? token.type) === 'typography',
  transform: token => {
    const v = token.original?.$value ?? token.original?.value ?? token.$value ?? token.value;
    if (typeof v !== 'object' || v === null) return v; // déjà transformé en chaîne
    // NB : `letterSpacing` n'est pas exprimable dans le shorthand CSS `font` —
    // il est perdu ici comme il l'était avant. Chantier ouvert, cf. INVENTORY.
    const weight = v.fontWeight ? `${refToVar(v.fontWeight)} ` : '';
    const size = v.fontSize ? refToVar(v.fontSize) : '1rem';
    const lineHeight = v.lineHeight ? `/${refToVar(v.lineHeight)}` : '';
    const family = v.fontFamily ? ` ${refToVar(v.fontFamily)}` : ' sans-serif';
    return `${weight}${size}${lineHeight}${family}`;
  },
});

const isTypography = token => (token.$type ?? token.type) === 'typography';

// Groupe css avec sortie couleur en oklch() au lieu de hex.
const cssOklch = StyleDictionary.hooks.transformGroups.css.map(
  n => (n === 'color/css' ? 'color/oklch' : n),
);

function make(destination, source, { selector, filter, refs = true, transforms, buildPath = 'build/' }) {
  return new StyleDictionary({
    source,
    platforms: { css: {
      ...(transforms ? { transforms } : { transformGroup: 'css' }),
      buildPath,
      files: [{ destination, format: 'css/variables', filter,
        options: { selector, outputReferences: refs } }]
    }},
    log: { verbosity: 'silent' }
  });
}

// Couche 1 — primitives : valeurs brutes, :root, pas de références
await make('primitives.css', [PRIM], { selector: ':root', filter: inPath('primitives'), refs: false, transforms: cssOklch }).buildAllPlatforms();
// Couche 2 — brand (rôles) : Aikoz par défaut sur :root, Generali scopé
await make('brand-aikoz.css',    [PRIM, brand('aikoz')],    { selector: ':root',                    filter: inPath('brand/aikoz'),    transforms: cssOklch }).buildAllPlatforms();
await make('brand-generali.css', [PRIM, brand('generali')], { selector: '[data-brand="generali"]',  filter: inPath('brand/generali'), transforms: cssOklch }).buildAllPlatforms();
// Couche 3 — theme (sémantique) : light sur :root, dark sur .dark
await make('theme-light.css', [PRIM, brand('aikoz'), theme('light')], { selector: ':root',  filter: inPath('theme/light'), transforms: cssOklch }).buildAllPlatforms();
await make('theme-dark.css',  [PRIM, brand('aikoz'), theme('dark')],  { selector: '.dark',  filter: inPath('theme/dark'), transforms: cssOklch }).buildAllPlatforms();

// Couche 3bis — semantics : rôles MODE-INDÉPENDANTS (radius, shadow, border-width, typography).
// :root unique (pas de variante light/dark). refs:true → alias émis en var(--…).
// Le groupe 'css' rend nativement le format dimension { value, unit } en v5 (vérifié).
// semantics.json n'a aucun token couleur.
// Typographie : on substitue notre shorthand (alias var() posés à la source) au
// shorthand natif, et on désactive outputReferences sur ces seuls tokens — sinon le
// String.replace de SD viendrait re-corrompre le résultat. Les autres rôles
// (radius, border-width) gardent outputReferences : leur valeur est une chaîne
// simple, le remplacement y passe par une regex sur `{alias}` et reste sûr.
const cssSemantics = StyleDictionary.hooks.transformGroups.css.map(
  n => (n === 'typography/css/shorthand' ? 'typography/css/shorthand-refs' : n),
);
await make('semantics.css', [PRIM, SEM], {
  selector: ':root', filter: inPath('semantics'),
  transforms: cssSemantics, refs: token => !isTypography(token),
}).buildAllPlatforms();

// Couche 4 — bridge shadcn : RUNTIME généré depuis le DTCG, oklch() complet.
// C'est le fichier consommé par les composants (playground/demo). Ne pas éditer à la main.
const bridgeTransforms = ['attribute/cti', 'name/kebab', 'color/oklch', 'size/rem'];
await make('.tmp-shadcn-light.css', [PRIM, brand('aikoz'), theme('light'), SEM, bridgeSrc], {
  selector: ':root', filter: inPath('bridge/shadcn'), refs: false,
  transforms: bridgeTransforms, buildPath: 'bridge/',
}).buildAllPlatforms();
await make('.tmp-shadcn-dark.css', [PRIM, brand('aikoz'), theme('dark'), SEM, bridgeSrc], {
  selector: '.dark', filter: inPath('bridge/shadcn'), refs: false,
  transforms: bridgeTransforms, buildPath: 'bridge/',
}).buildAllPlatforms();

const bridgeHeader = `/* ============================================================\n   shadcn-bridge.css — GÉNÉRÉ depuis tokens/ (DTCG) par build-tokens.mjs\n   NE PAS ÉDITER À LA MAIN — régénérer via: npm run build:tokens\n   ============================================================ */\n\n`;
fs.writeFileSync(
  'bridge/shadcn-bridge.css',
  bridgeHeader +
    fs.readFileSync('bridge/.tmp-shadcn-light.css', 'utf8') +
    '\n' +
    fs.readFileSync('bridge/.tmp-shadcn-dark.css', 'utf8')
);
fs.unlinkSync('bridge/.tmp-shadcn-light.css');
fs.unlinkSync('bridge/.tmp-shadcn-dark.css');

console.log('build OK');
