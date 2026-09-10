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
 * `asset` — chemin sous `/brands/`. Absent, le composant retombe sur les
 * initiales, ce qui n'est pas un pis-aller : la pastille reste identifiable et
 * lisible dans les quatre combinaisons registre × thème.
 */

export interface Brand {
  id: string;
  name: string;
  /** Teinte de marque, en hexadécimal. */
  color: string;
  /** Initiales du repli. Deux caractères, calculés à la main pour rester lisibles. */
  initials: string;
  /** Fichier sous `/brands/`. Absent = repli sur les initiales. */
  asset?: string;
  /**
   * `false` — le fichier existe mais ne supporte pas le masquage monochrome,
   * et la plaque retombe donc sur les initiales.
   *
   * La cause est unique et se MESURE : la couverture d'encre du fichier —
   * la part de sa boîte englobante réellement opaque. Au-delà d'un certain
   * seuil, le dessin repose sur une forme pleine dont le masque ne garde que
   * la silhouette, et le résultat est un aplat muet.
   *
   * Mesuré sur les 17 fichiers, rendus dans un canvas de 120 px de large.
   * La coupure est franche, il n'y a rien entre les deux groupes :
   *
   *     AXA 1,00 · MAAF 1,00 · MACIF 0,96 · MAIF 0,47 · GMF 0,43   ← aplats
   *     ————————————————— seuil 0,40 —————————————————
   *     Allianz 0,29 · Matmut 0,28 · … · Malakoff 0,10             ← lisibles
   *
   * Le chiffre est reporté en fin de ligne pour chaque marque. Un fichier
   * remplacé doit être remesuré : c'est une propriété du FICHIER, pas de la
   * marque. Les cinq recalés restent dans le dépôt — ils serviront le jour
   * où on affichera les logos en couleur d'origine.
   */
  maskable?: boolean;
}

export const BRANDS: Brand[] = [
  { id: "credit-agricole",  name: "Crédit Agricole",  color: "#006C50", initials: "CA", asset: "/brands/credit-agricole.svg" }, // encre 0.26
  { id: "allianz",          name: "Allianz",          color: "#004A93", initials: "AZ", asset: "/brands/allianz.svg" }, // encre 0.29
  { id: "axa",              name: "AXA",              color: "#00008F", initials: "AX", asset: "/brands/axa.svg", maskable: false }, // encre 1.00
  { id: "macif",            name: "MACIF",            color: "#005F9E", initials: "MC", asset: "/brands/macif.png", maskable: false }, // encre 0.96
  { id: "matmut",           name: "Matmut",           color: "#000069", initials: "MT", asset: "/brands/matmut.svg" }, // encre 0.28
  { id: "groupama",         name: "Groupama",         color: "#2A6654", initials: "GA", asset: "/brands/groupama.svg" }, // encre 0.26
  { id: "mma",              name: "MMA",              color: "#E2001A", initials: "MM" },
  { id: "generali",         name: "Generali",         color: "#C12129", initials: "GE", asset: "/brands/generali.svg" }, // encre 0.18
  { id: "maaf",             name: "MAAF",             color: "#0093D0", initials: "MA", asset: "/brands/maaf.png", maskable: false }, // encre 1.00
  { id: "gmf",              name: "GMF",              color: "#004696", initials: "GM", asset: "/brands/gmf.svg", maskable: false }, // encre 0.43
  { id: "maif",             name: "MAIF",             color: "#ED2131", initials: "MI", asset: "/brands/maif.svg", maskable: false }, // encre 0.47
  { id: "swisslife",        name: "Swiss Life",       color: "#004750", initials: "SL" },
  { id: "abeille",          name: "Abeille",          color: "#FFD500", initials: "AB", asset: "/brands/abeille.svg" }, // encre 0.24
  { id: "harmonie-mutuelle",name: "Harmonie Mutuelle",color: "#E94E24", initials: "HM", asset: "/brands/harmonie-mutuelle.png" }, // encre 0.25
  { id: "aesio",            name: "AÉSIO",            color: "#E62C33", initials: "AE", asset: "/brands/aesio.svg" }, // encre 0.28
  { id: "malakoff-humanis", name: "Malakoff Humanis", color: "#6E7B85", initials: "MH", asset: "/brands/malakoff-humanis.png" }, // encre 0.10
  { id: "macsf",            name: "MACSF",            color: "#E10000", initials: "MS", asset: "/brands/macsf.svg" }, // encre 0.14
  { id: "ag2r",             name: "AG2R La Mondiale", color: "#5A3318", initials: "AG", asset: "/brands/ag2r.svg" }, // encre 0.14
  { id: "la-medicale",      name: "La Médicale",      color: "#C8102E", initials: "LM", asset: "/brands/la-medicale.png" }, // encre 0.18
];

export const BRAND_BY_ID: Record<string, Brand> = Object.fromEntries(
  BRANDS.map((b) => [b.id, b])
);

/**
 * Noir ou blanc sur une teinte donnée, décidé par la MESURE et non à l'œil.
 *
 * On calcule la luminance relative WCAG de la couleur, puis on retient celui
 * des deux qui contraste le plus. C'est ce qui rend le jaune d'Abeille
 * (#FFD500) et le marine de Matmut (#000069) également lisibles sans que
 * personne ait à trancher marque par marque — et ce qui empêche une couleur
 * ajoutée demain d'arriver avec du texte illisible.
 */
export function surTeinte(hex: string): "#FFFFFF" | "#0B0B0B" {
  const h = hex.replace("#", "");
  const v = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(v.slice(i, i + 2), 16) / 255);
  const lin = (c: number) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
  const L = 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
  // Contraste contre blanc et contre quasi-noir, on garde le meilleur.
  const surBlanc = 1.05 / (L + 0.05);
  const surNoir = (L + 0.05) / 0.05;
  return surNoir >= surBlanc ? "#0B0B0B" : "#FFFFFF";
}
