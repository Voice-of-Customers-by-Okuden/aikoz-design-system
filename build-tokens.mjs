import StyleDictionary from 'style-dictionary';
import fs from 'node:fs';
import { fileHeader } from 'style-dictionary/utils';

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

// --- Typographie : rôles émis en LONGHAND, une propriété CSS par token.
//
// Le shorthand `font` est écarté pour deux raisons mesurées en navigateur :
// il ne transporte pas `letter-spacing` (Style Dictionary le classait en
// unknownProps et le jetait, warning masqué par verbosity:'silent'), et il
// RÉINITIALISE `font-feature-settings` / `font-variant-numeric` — donc
// `font: var(--role-typography-metric)` cassait l'alignement des chiffres
// sur le rôle des KPI.
//
// Un token typography doit produire PLUSIEURS variables : c'est un format,
// pas un transform (un transform rend une valeur pour un token).
const refToVar = s =>
  typeof s === 'string' && /^\{[^{}]+\}$/.test(s.trim())
    ? `var(--${s.trim().slice(1, -1).replace(/\./g, '-')})`
    : null;

// Propriété CSS émise pour chaque clé DTCG du token typography.
const TYPO_PROPS = {
  fontFamily: 'font-family',
  fontSize: 'font-size',
  fontWeight: 'font-weight',
  lineHeight: 'line-height',
  letterSpacing: 'letter-spacing',
};

StyleDictionary.registerFormat({
  name: 'css/variables-aikoz-semantics',
  format: async ({ dictionary, file, options }) => {
    const header = await fileHeader({ file });
    const lines = [];

    for (const token of dictionary.allTokens) {
      const type = token.$type ?? token.type;
      const original = token.original?.$value ?? token.original?.value;
      const note = token.$description ? ` /** ${token.$description} */` : '';

      if (type === 'typography' && original && typeof original === 'object') {
        // 5 variables, alias posés directement — aucune substitution de chaîne,
        // donc aucune collision possible entre une valeur et un nom de variable.
        if (lines.length) lines.push('');
        if (token.$description) lines.push(`  /* ${token.$description} */`);
        for (const [key, prop] of Object.entries(TYPO_PROPS)) {
          const ref = original[key];
          if (ref == null) continue;
          const value = refToVar(ref) ?? ref;
          lines.push(`  --${token.name}-${prop}: ${value};`);
        }
        continue;
      }

      // Autres rôles : alias simple -> var(--…), sinon valeur transformée.
      if (lines.length && lines[lines.length - 1].includes('letter-spacing')) lines.push('');
      const value = refToVar(original) ?? (token.$value ?? token.value);
      lines.push(`  --${token.name}: ${value};${note}`);
    }

    return `${header}${options.selector} {\n${lines.join('\n')}\n}\n`;
  },
});

// Groupe css avec sortie couleur en oklch() au lieu de hex.
const cssOklch = StyleDictionary.hooks.transformGroups.css.map(
  n => (n === 'color/css' ? 'color/oklch' : n),
);

function make(destination, source, { selector, filter, refs = true, transforms, buildPath = 'build/', format = 'css/variables' }) {
  return new StyleDictionary({
    source,
    platforms: { css: {
      ...(transforms ? { transforms } : { transformGroup: 'css' }),
      buildPath,
      files: [{ destination, format, filter,
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
// `.light` double `:root` : purement additif, aucune valeur ajoutée, mais il donne
// une échappatoire imbriquée. Sans elle, un bloc « clair » posé dans une page `.dark`
// hérite du dark — impossible de rendre deux thèmes côte à côte honnêtement.
// C'est la réciproque manquante de `.dark`.
await make('theme-light.css', [PRIM, brand('aikoz'), theme('light')], { selector: ':root, .light',  filter: inPath('theme/light'), transforms: cssOklch }).buildAllPlatforms();
await make('theme-dark.css',  [PRIM, brand('aikoz'), theme('dark')],  { selector: '.dark',  filter: inPath('theme/dark'), transforms: cssOklch }).buildAllPlatforms();

// Couche 3bis — semantics : rôles MODE-INDÉPENDANTS (radius, shadow, border-width, typography).
// :root unique (pas de variante light/dark). refs:true → alias émis en var(--…).
// Le groupe 'css' rend nativement le format dimension { value, unit } en v5 (vérifié).
// semantics.json n'a aucun token couleur.
// Format maison : les rôles typographiques sortent en longhand (5 variables),
// les autres en une variable. Les alias sont posés directement en var(--…),
// donc outputReferences est inutile ici — et surtout inoffensif.
await make('semantics.css', [PRIM, SEM], {
  selector: ':root', filter: inPath('semantics'),
  format: 'css/variables-aikoz-semantics',
}).buildAllPlatforms();

// Couche 4 — bridge shadcn : RUNTIME généré depuis le DTCG, oklch() complet.
// C'est le fichier consommé par les composants (playground/demo). Ne pas éditer à la main.
const bridgeTransforms = ['attribute/cti', 'name/kebab', 'color/oklch', 'size/rem'];
await make('.tmp-shadcn-light.css', [PRIM, brand('aikoz'), theme('light'), SEM, bridgeSrc], {
  selector: ':root, .light', filter: inPath('bridge/shadcn'), refs: false,
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
