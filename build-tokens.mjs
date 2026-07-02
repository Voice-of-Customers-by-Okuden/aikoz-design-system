import StyleDictionary from 'style-dictionary';
import Color from 'tinycolor2';
import fs from 'node:fs';

const PRIM = 'tokens/primitives.json';
const brand = b => `tokens/brand/${b}.json`;
const theme = t => `tokens/theme/${t}.json`;
const bridgeSrc = 'tokens/bridge/shadcn.json';
const inPath = sub => t => t.filePath.includes(sub);

// Transform custom — couche bridge uniquement : triplet "H S% L%" (sans hsl(), sans alpha),
// pour rester compatible avec la syntaxe hsl(var(--x)/alpha) déjà utilisée par les composants.
StyleDictionary.registerTransform({
  name: 'color/hslTriplet',
  type: 'value',
  filter: token => (token.$type ?? token.type) === 'color',
  transform: token => {
    const raw = token.value ?? token.$value;
    const { h, s, l } = Color(raw).toHsl();
    return `${Math.round(h)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
  },
});

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
await make('primitives.css', [PRIM], { selector: ':root', filter: inPath('primitives'), refs: false }).buildAllPlatforms();
// Couche 2 — brand (rôles) : Aikoz par défaut sur :root, Generali scopé
await make('brand-aikoz.css',    [PRIM, brand('aikoz')],    { selector: ':root',                    filter: inPath('brand/aikoz') }).buildAllPlatforms();
await make('brand-generali.css', [PRIM, brand('generali')], { selector: '[data-brand="generali"]',  filter: inPath('brand/generali') }).buildAllPlatforms();
// Couche 3 — theme (sémantique) : light sur :root, dark sur .dark
await make('theme-light.css', [PRIM, brand('aikoz'), theme('light')], { selector: ':root',  filter: inPath('theme/light') }).buildAllPlatforms();
await make('theme-dark.css',  [PRIM, brand('aikoz'), theme('dark')],  { selector: '.dark',  filter: inPath('theme/dark') }).buildAllPlatforms();

// Couche 4 (TEMPORAIRE, comparaison uniquement) — bridge shadcn généré depuis le DTCG, triplets HSL.
// Ne remplace pas bridge/shadcn-bridge.css. Écrit dans bridge/ pour être diffé contre le .bak à la main.
const bridgeTransforms = ['attribute/cti', 'name/kebab', 'color/hslTriplet'];
await make('.tmp-shadcn-light.css', [PRIM, brand('aikoz'), theme('light'), bridgeSrc], {
  selector: ':root', filter: inPath('bridge/shadcn'), refs: false,
  transforms: bridgeTransforms, buildPath: 'bridge/',
}).buildAllPlatforms();
await make('.tmp-shadcn-dark.css', [PRIM, brand('aikoz'), theme('dark'), bridgeSrc], {
  selector: '.dark', filter: inPath('bridge/shadcn'), refs: false,
  transforms: bridgeTransforms, buildPath: 'bridge/',
}).buildAllPlatforms();

const bridgeHeader = `/* ============================================================\n   shadcn-bridge.generated.css — GÉNÉRÉ depuis tokens/ (DTCG)\n   Fichier de COMPARAISON temporaire — ne remplace pas shadcn-bridge.css\n   ============================================================ */\n\n`;
fs.writeFileSync(
  'bridge/shadcn-bridge.generated.css',
  bridgeHeader +
    fs.readFileSync('bridge/.tmp-shadcn-light.css', 'utf8') +
    '\n' +
    fs.readFileSync('bridge/.tmp-shadcn-dark.css', 'utf8')
);
fs.unlinkSync('bridge/.tmp-shadcn-light.css');
fs.unlinkSync('bridge/.tmp-shadcn-dark.css');

console.log('build OK');
