/**
 * Registre des marques du marché de l'assurance français.
 *
 * Les identifiants ne sont pas inventés : ils reprennent ceux du workflow n8n
 * « Aikoz - Chat » (`la-medicale`, `malakoff-humanis`, `swisslife`). Deux
 * vocabulaires pour les mêmes marques finiraient forcément par diverger.
 *
 * `color` — la teinte de la pastille. Les valeurs marquées PROVISOIRE ont été
 * extraites automatiquement du SVG officiel en prenant la couleur la plus
 * fréquente : c'est une heuristique, et elle se trompe. AXA en est l'exemple —
 * son bleu marine est la couleur de marque, mais le rouge de la diagonale
 * occupe plus de surface dans le fichier. À remplacer par la liste de
 * référence.
 *
 * `asset` — NOM DE FICHIER seul, pas un chemin. Le dossier est fourni par le
 * consommateur via `definirBaseDesLogos()` : un composant de design system ne
 * peut pas décider où une application range ses images. La valeur codée en
 * dur, `/brands/…`, ne marchait qu'à la racine d'un domaine — elle cassait
 * dès qu'on servait le tout depuis un sous-chemin, et chez tout consommateur
 * dont les assets ne sont pas à la racine.
 *
 * Absent, le composant retombe sur les initiales, ce qui n'est pas un
 * pis-aller : la pastille reste identifiable et lisible dans les quatre
 * combinaisons registre × thème.
 */

export interface Brand {
  id: string;
  name: string;
  /** Teinte de marque, en hexadécimal. */
  color: string;
  /** Initiales du repli. Deux caractères, calculés à la main pour rester lisibles. */
  initials: string;
  /** Nom du fichier, sans dossier. Absent = repli sur les initiales. */
  asset?: string;
  /**
   * `false` — le fichier existe mais ne supporte pas le masquage monochrome.
   * La plaque affiche alors le logo **en couleur d'origine sur fond clair**,
   * et surtout pas des initiales : un logo bâti sur une forme pleine n'existe
   * que par ses couleurs internes, le montrer tel quel est plus juste.
   *
   * La cause principale se MESURE : la couverture d'encre du fichier —
   * la part de sa boîte englobante réellement opaque. Au-delà d'un certain
   * seuil, le dessin repose sur une forme pleine dont le masque ne garde que
   * la silhouette, et le résultat est un aplat muet.
   *
   * Mesuré sur les 17 fichiers, rendus dans un canvas de 120 px de large.
   * La coupure est franche, il n'y a rien entre les deux groupes :
   *
   *     AXA 1,00 · MAAF 1,00 · MACIF 0,96 · MAIF 0,47 · MMA 0,44
   *     · GMF 0,43                                       ← couleur d'origine
   *     ————————————————— seuil 0,40 —————————————————
   *     Malakoff 0,30 · Allianz 0,29 · Matmut 0,28 · … · AG2R 0,14
   *                                                      ← monochrome
   *
   * Le chiffre est reporté en fin de ligne pour chaque marque. Un fichier
   * remplacé doit être remesuré : c'est une propriété du FICHIER, pas de la
   * marque.
   *
   * **La mesure ne suffit pas toute seule, et Groupama le montre.** Son
   * fichier mesure 0,26 — bien sous le seuil — parce que le logotype, tout
   * en traits fins, dilue la moyenne. Mais le SYMBOLE qui le précède est une
   * forme pleine, et le masque le réduit à un carré blanc. La couverture
   * globale ne voit pas qu'un logo peut être mixte. Le chiffre reste le bon
   * filtre de premier tri ; il ne remplace pas un coup d'œil au rendu. Les cinq recalés restent dans le dépôt — ils serviront le jour
   * où on affichera les logos en couleur d'origine.
   */
  maskable?: boolean;
}

export const BRANDS: Brand[] = [
  { id: "credit-agricole",  name: "Crédit Agricole",  color: "#006C50", initials: "CA", asset: "credit-agricole.svg" }, // encre 0.26
  { id: "allianz",          name: "Allianz",          color: "#004A93", initials: "AZ", asset: "allianz.svg" }, // encre 0.29
  { id: "axa",              name: "AXA",              color: "#00008F", initials: "AX", asset: "axa.svg", maskable: false }, // encre 1.00
  { id: "macif",            name: "MACIF",            color: "#005F9E", initials: "MC", asset: "macif.png", maskable: false }, // encre 0.96
  { id: "matmut",           name: "Matmut",           color: "#000069", initials: "MT", asset: "matmut.svg" }, // encre 0.28
  { id: "groupama",         name: "Groupama",         color: "#2A6654", initials: "GA", asset: "groupama.svg", maskable: false }, // encre 0.26 — mais symbole plein, cf. note
  { id: "mma",              name: "MMA",              color: "#E2001A", initials: "MM", asset: "mma.svg", maskable: false }, // encre 0.44
  { id: "generali",         name: "Generali",         color: "#C12129", initials: "GE", asset: "generali.svg" }, // encre 0.18
  { id: "maaf",             name: "MAAF",             color: "#0093D0", initials: "MA", asset: "maaf.png", maskable: false }, // encre 1.00
  { id: "gmf",              name: "GMF",              color: "#004696", initials: "GM", asset: "gmf.svg", maskable: false }, // encre 0.43
  { id: "maif",             name: "MAIF",             color: "#ED2131", initials: "MI", asset: "maif.svg", maskable: false }, // encre 0.47
  { id: "swisslife",        name: "Swiss Life",       color: "#004750", initials: "SL" },
  { id: "abeille",          name: "Abeille",          color: "#FFD500", initials: "AB", asset: "abeille.svg" }, // encre 0.24
  { id: "harmonie-mutuelle",name: "Harmonie Mutuelle",color: "#E94E24", initials: "HM", asset: "harmonie-mutuelle.png" }, // encre 0.25
  { id: "aesio",            name: "AÉSIO",            color: "#E62C33", initials: "AE", asset: "aesio.svg" }, // encre 0.28
  { id: "malakoff-humanis", name: "Malakoff Humanis", color: "#6E7B85", initials: "MH", asset: "malakoff-humanis.png" }, // encre 0.30 (0,10 avant rognage des marges)
  { id: "macsf",            name: "MACSF",            color: "#E10000", initials: "MS", asset: "macsf.svg" }, // encre 0.14
  { id: "ag2r",             name: "AG2R La Mondiale", color: "#5A3318", initials: "AG", asset: "ag2r.svg" }, // encre 0.14
  { id: "la-medicale",      name: "La Médicale",      color: "#C8102E", initials: "LM", asset: "la-medicale.png" }, // encre 0.18
];

/**
 * Dossier des logos. `/brands/` par défaut — ce qui convient au dépôt tel
 * quel — et modifiable une fois, au démarrage de l'application.
 *
 * L'état est au niveau du module, ce qui est un compromis assumé : c'est la
 * forme la plus simple pour un réglage qui vaut pour toute l'application, et
 * elle évite de faire descendre un prop à travers `LogoMarquee`, `Leaderboard`
 * et tout ce qui affichera une marque demain. La contrepartie est qu'on ne
 * peut pas servir deux bases différentes dans la même page ; aucun usage
 * connu ne le demande, et le jour où il se présentera ce sera un contexte
 * React, pas un prop de plus.
 */
let baseDesLogos = "/brands/";

export function definirBaseDesLogos(base: string): void {
  baseDesLogos = base.endsWith("/") ? base : base + "/";
}

export function cheminLogo(fichier: string): string {
  return baseDesLogos + fichier;
}

export const BRAND_BY_ID: Record<string, Brand> = Object.fromEntries(
  BRANDS.map((b) => [b.id, b])
);

/**
 * Noir ou blanc sur une teinte donnée, décidé par la MESURE et non à l'œil.
 *
 * On calcule le contraste de la teinte contre les DEUX encres réellement
 * utilisées, et on retient la meilleure. « Réellement utilisées » n'est pas
 * une précaution de style : la première version décidait en comparant au noir
 * PUR puis rendait un noir adouci (#0B0B0B), et perdait 0,3 point au passage.
 * AÉSIO en faisait les frais — 4,49:1 mesuré là où le calcul annonçait 4,79,
 * donc sous le seuil sans que rien ne le signale. Décider sur une valeur
 * qu'on ne rend pas, c'est mesurer autre chose que ce qu'on affiche.
 *
 * L'encre sombre est donc le noir franc. Sur une pastille de 24 px portant
 * deux lettres à 11 px, la lisibilité prime sur la douceur du gris.
 */
const NOIR = "#000000";
const BLANC = "#FFFFFF";

function luminance(hex: string): number {
  const h = hex.replace("#", "");
  const v = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(v.slice(i, i + 2), 16) / 255);
  const lin = (c: number) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
}

/** Contraste WCAG entre deux couleurs hexadécimales. */
export function contraste(a: string, b: string): number {
  const x = luminance(a);
  const y = luminance(b);
  return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
}

export function surTeinte(hex: string): typeof NOIR | typeof BLANC {
  return contraste(hex, NOIR) >= contraste(hex, BLANC) ? NOIR : BLANC;
}
