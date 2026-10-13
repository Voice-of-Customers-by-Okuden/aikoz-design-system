/**
 * Les deux chaînes de production ne peuvent plus diverger en silence.
 *
 * Aikoz livre par DEUX chaînes qui portent la même identité : ce dépôt rend
 * les interfaces, et le Claude Design rend les présentations, tableaux de bord
 * et pages. Elles n'avaient aucun point de contact.
 *
 * ── Ce qu'on compare, et pourquoi c'est subtil ───────────────────────────
 *
 * On compare l'ARTEFACT PUBLIÉ (`tokens/claude-design/tokens.json`), pas le
 * bundle exporté sur disque. Les deux existent, et leurs noms ne désignent
 * PAS les mêmes rôles : le bundle appelle `--success-text` ce que l'artefact
 * appelle `success-fill`. Comparer les noms sans vérifier les rôles fait
 * conclure que des aplats sont du texte — et rend un verdict d'accessibilité
 * entièrement faux. C'est arrivé le 13/10/2026, dans la première version de
 * ce script.
 *
 * L'artefact est aussi la bonne cible : c'est LUI qui fabrique les slides.
 *
 * ── Limite connue ────────────────────────────────────────────────────────
 *
 * On compare à une COPIE de l'artefact. La rafraîchir est manuel :
 *   Artifact read, url de l'artefact, path `project/tokens.json`
 * Un cliquet, pas une garantie. Mais l'état d'avant était l'absence totale
 * de point de contact, et les deux chaînes ont dérivé sur douze valeurs.
 */
import fs from 'node:fs';

const CLAUDE = 'tokens/claude-design/tokens.json';
const echecs = [];

if (!fs.existsSync(CLAUDE)) {
  console.error(
    `\naudit deux systèmes ÉCHOUÉ — ${CLAUDE} est absent.\n` +
      `  Sans la copie des tokens du Claude Design, ce contrôle ne compare\n` +
      `  rien : c'est exactement l'état dans lequel les deux chaînes ont\n` +
      `  divergé. Le rafraîchir : Artifact read, path \`project/tokens.json\`.`,
  );
  process.exit(1);
}

const primitives = JSON.parse(fs.readFileSync('tokens/primitives.json', 'utf8'));
const themeClair = JSON.parse(fs.readFileSync('tokens/theme/light.json', 'utf8'));
const claude = JSON.parse(fs.readFileSync(CLAUDE, 'utf8'));

// ─── Résolution des deux côtés, jusqu'à une valeur peinte ──────────────────

const noeud = (arbre, chemin) =>
  chemin.split('.').reduce((o, k) => (o ? o[k] : undefined), arbre);

/** Côté dépôt : suit la chaîne d'alias DTCG `{a.b.c}` jusqu'à un hex. */
function hexDepot(chemin, vus = new Set()) {
  if (vus.has(chemin)) throw new Error(`cycle d'alias sur ${chemin}`);
  vus.add(chemin);
  const n = noeud(themeClair, chemin) ?? noeud(primitives, chemin);
  if (!n || n.$value === undefined) throw new Error(`token introuvable : ${chemin}`);
  const v = n.$value;
  if (typeof v === 'object' && v.hex) return v.hex.toUpperCase();
  if (typeof v === 'string' && v.startsWith('{')) return hexDepot(v.slice(1, -1), vus);
  throw new Error(`valeur non résoluble : ${chemin}`);
}

const parNom = new Map(claude.color.tokens.map((t) => [t.name, t.value]));

/** Côté Claude : suit `{alias}` et prend la valeur du thème par défaut. */
function hexClaude(nom, vus = new Set()) {
  if (vus.has(nom)) throw new Error(`cycle d'alias sur ${nom}`);
  vus.add(nom);
  let v = parNom.get(nom);
  if (v === undefined) return null;
  if (typeof v === 'object') v = v.default;
  if (typeof v === 'string' && v.startsWith('{')) return hexClaude(v.slice(1, -1), vus);
  return String(v).toUpperCase();
}

// ─── Contraste ─────────────────────────────────────────────────────────────

function luminance(h) {
  const c = [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16) / 255);
  const l = c.map((x) => (x <= 0.03928 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4));
  return 0.2126 * l[0] + 0.7152 * l[1] + 0.0722 * l[2];
}
const ratio = (a, b) => {
  const [x, y] = [luminance(a), luminance(b)];
  return Math.round(((Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05)) * 100) / 100;
};

// ─── Les rôles mis en face, par SENS et non par nom ────────────────────────

const ROLES = [
  ['success-text', 'color.status.success-text'],
  ['success-fill', 'color.status.success'],
  ['success-bg', 'color.status.success-subtle'],
  ['warning-text', 'color.status.warning-text'],
  ['warning-fill', 'color.status.warning'],
  ['warning-bg', 'color.status.warning-subtle'],
  ['error-text', 'color.status.error-text'],
  ['error-fill', 'color.status.error'],
  ['error-bg', 'color.status.error-subtle'],
  ['info-text', 'color.status.info-text'],
  ['info-fill', 'color.status.info'],
  ['info-bg', 'color.status.info-subtle'],
];

/** Les paires qui PORTENT du texte, mesurées des deux côtés. */
const PAIRES = [
  ['success-text', 'success-bg', 'color.status.success-text', 'color.status.success-subtle'],
  ['warning-text', 'warning-bg', 'color.status.warning-text', 'color.status.warning-subtle'],
  ['error-text', 'error-bg', 'color.status.error-text', 'color.status.error-subtle'],
  ['info-text', 'info-bg', 'color.status.info-text', 'color.status.info-subtle'],
];

const POLICES = [
  ['ui', 'font-family.body'],
  ['mono', 'font-family.mono'],
];

let compares = 0;
const divergences = [];

for (const [nomClaude, cheminDepot] of ROLES) {
  const vClaude = hexClaude(nomClaude);
  if (!vClaude) {
    echecs.push(`« ${nomClaude} » n'existe plus côté Claude Design : le nom a changé, remettre les rôles en face.`);
    continue;
  }
  compares++;
  if (vClaude !== hexDepot(cheminDepot)) {
    divergences.push(`${nomClaude.padEnd(13)} ${vClaude}  ≠  ${hexDepot(cheminDepot)}  (${cheminDepot})`);
  }
}

const tete = (p) => (p ?? '').split(',')[0].replace(/["']/g, '').trim();
for (const [famille, cheminDepot] of POLICES) {
  const vClaude = tete(claude.type?.families?.[famille]);
  const vDepot = tete(noeud(primitives, cheminDepot)?.$value);
  compares++;
  if (vClaude !== vDepot) {
    divergences.push(`police « ${famille} » : ${vClaude} ≠ ${vDepot} (${cheminDepot})`);
  }
}

if (divergences.length) {
  echecs.push(
    `${divergences.length} rôle(s) divergent entre les deux chaînes :\n      ` +
      divergences.join('\n      ') +
      `\n    Les deux portent la même marque : un statut ne peut pas avoir deux ` +
      `couleurs selon qu'on livre un écran ou une présentation. Le dépôt fait ` +
      `foi — il mesure chaque couleur sur huit combinaisons avant publication.`,
  );
}

// ── Les deux chaînes tiennent-elles le seuil, chacune de son côté ? ────────
//
// Une divergence n'est pas forcément un défaut d'accessibilité. On mesure
// donc séparément, et on le DIT : conclure « ils divergent donc ils échouent »
// est précisément l'erreur commise le 13/10/2026.
for (const [tC, fC, tD, fD] of PAIRES) {
  const rc = ratio(hexClaude(tC), hexClaude(fC));
  const rd = ratio(hexDepot(tD), hexDepot(fD));
  if (rc < 4.5) {
    echecs.push(
      `la paire ${tC}/${fC} du Claude Design donne ${rc}:1, sous le seuil de ` +
        `4,5:1 d'un texte. La nôtre donne ${rd}:1.`,
    );
  }
}

if (echecs.length) {
  console.error('\naudit deux systèmes ÉCHOUÉ :');
  for (const e of echecs) console.error('  ✗ ' + e);
  console.error(`\n${compares} rôles comparés.`);
  process.exit(1);
}

console.log(`audit deux systèmes OK — ${compares} rôles comparés, aucune divergence.`);
