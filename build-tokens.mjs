import StyleDictionary from 'style-dictionary';

const PRIM = 'tokens/primitives.json';
const brand = b => `tokens/brand/${b}.json`;
const theme = t => `tokens/theme/${t}.json`;
const inPath = sub => t => t.filePath.includes(sub);

function make(destination, source, { selector, filter, refs = true }) {
  return new StyleDictionary({
    source,
    platforms: { css: {
      transformGroup: 'css', buildPath: 'build/',
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

console.log('build OK');
