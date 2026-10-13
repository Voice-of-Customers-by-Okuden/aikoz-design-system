/**
 * Tout ratio écrit dans la charte est remesuré.
 *
 * `DESIGN.md` annonçait VINGT ET UN ratios de contraste. Dix-sept étaient
 * faux, et deux d'entre eux portaient la mention « ✓ WCAG AA » pour des
 * couleurs mesurées à 3,30:1 et 3,19:1 — sous le seuil de 4,5:1 d'un texte.
 *
 * Ce n'est pas une coquille, c'est un mécanisme. Le Claude Design a été
 * construit À PARTIR de `DESIGN.md` : il a hérité des valeurs ET des fausses
 * garanties, et il les porte encore. Un nombre écrit dans de la prose que
 * personne ne remesure ne produit pas une erreur — il produit de la confiance
 * imméritée, qui se propage à tout ce qui lit le document.
 *
 * C'était la troisième occurrence du même défaut le 13/10/2026 : le
 * commentaire de `BarChart` annonçait 4,62 et 6,64 contre 14,92 et 3,40
 * mesurés, et `tokens/README.md` annonçait un `typography.metric` jamais créé.
 *
 * ── La forme canonique ───────────────────────────────────────────────────
 *
 *     #ENCRE sur #FOND — N,NN:1
 *
 * Les deux couleurs sont nommées, donc la mesure est reproductible. Une
 * affirmation qui ne nomme pas ses deux couleurs n'est pas vérifiable : elle
 * échoue aussi, parce qu'une garantie invérifiable n'est pas une garantie.
 */
import fs from 'node:fs';

const CHARTE = 'DESIGN.md';
const texte = fs.readFileSync(CHARTE, 'utf8');
const lignes = texte.split('\n');
const echecs = [];

function luminance(h) {
  const c = [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16) / 255);
  const l = c.map((x) => (x <= 0.03928 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4));
  return 0.2126 * l[0] + 0.7152 * l[1] + 0.0722 * l[2];
}
function ratio(a, b) {
  const [x, y] = [luminance(a), luminance(b)];
  return Math.round(((Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05)) * 100) / 100;
}

const CANONIQUE = /#([0-9A-Fa-f]{6})\s+sur\s+#([0-9A-Fa-f]{6})\s*—\s*([\d]+[.,][\d]+):1/g;

/**
 * Une affirmation de ratio qui n'est PAS canonique. On ne cherche que les
 * formes `N:1` ou `N,NN:1` : un seuil nu (« viser 4,5:1 ») reste une consigne,
 * pas une mesure, et se reconnaît à l'absence de hex sur la ligne.
 */
const SUSPECTE = /([\d]+[.,]?[\d]*)\s*:\s*1/;

// ── La tolérance ───────────────────────────────────────────────────────────
//
// 0,05 : de quoi absorber l'arrondi à deux décimales, pas de quoi laisser
// passer un chiffre inventé. Les écarts relevés allaient de 0,2 à 5,3.
const TOLERANCE = 0.05;

let verifies = 0;
lignes.forEach((ligne, i) => {
  const n = i + 1;
  let m;
  let canoniqueSurLaLigne = false;
  CANONIQUE.lastIndex = 0;
  while ((m = CANONIQUE.exec(ligne))) {
    canoniqueSurLaLigne = true;
    verifies++;
    const [, encre, fond, dit] = m;
    const annonce = parseFloat(dit.replace(',', '.'));
    const mesure = ratio(`#${encre}`, `#${fond}`);
    if (Math.abs(mesure - annonce) > TOLERANCE) {
      echecs.push(
        `${CHARTE}:${n} — annonce ${annonce}:1 pour #${encre.toUpperCase()} sur ` +
          `#${fond.toUpperCase()}, qui vaut ${mesure}:1.`,
      );
    }
  }

  // Un ratio affirmé à côté d'une couleur, hors forme canonique : invérifiable.
  if (!canoniqueSurLaLigne && SUSPECTE.test(ligne) && /#[0-9A-Fa-f]{6}/.test(ligne)) {
    echecs.push(
      `${CHARTE}:${n} — affirme un ratio sans nommer ses deux couleurs :\n      ` +
        `${ligne.trim()}\n    L'écrire \`#encre sur #fond — N,NN:1\` le rend ` +
        `mesurable. Une garantie invérifiable n'est pas une garantie.`,
    );
  }
});

if (!verifies) {
  echecs.push(
    `aucune affirmation canonique trouvée dans ${CHARTE}. Soit la charte n'en ` +
      `contient plus, soit la forme a changé et ce contrôle ne mesure plus rien.`,
  );
}

if (echecs.length) {
  console.error('\naudit ratios charte ÉCHOUÉ :');
  for (const e of echecs) console.error('  ✗ ' + e);
  process.exit(1);
}

console.log(`audit ratios charte OK — ${verifies} ratios remesurés, tous justes.`);
