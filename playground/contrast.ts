/**
 * Ratio de contraste WCAG.
 *
 * Les tokens portent des couleurs OKLCH. Piège : `getComputedStyle(el).color`
 * les restitue VERBATIM en `oklch(L C H)`, pas en `rgb()` — lire les trois
 * nombres comme du RGB donne des ratios absurdes (1.02:1 sur du texte lisible).
 * On passe donc par un canvas : le navigateur fait lui-même la conversion vers
 * sRGB et `getImageData` rend les octets réels, quelle que soit la syntaxe source.
 */
let probeCtx: CanvasRenderingContext2D | null = null;

export function toSrgb(color: string): [number, number, number] | null {
  if (!probeCtx) {
    probeCtx = document.createElement("canvas").getContext("2d", {
      willReadFrequently: true,
    });
  }
  if (!probeCtx) return null;
  // Sentinelle : si la couleur est invalide, fillStyle garde la valeur précédente.
  probeCtx.fillStyle = "#000000";
  probeCtx.fillStyle = color;
  if (probeCtx.fillStyle === "#000000" && !/^#0{3,8}$|black/i.test(color.trim())) {
    return null;
  }
  probeCtx.clearRect(0, 0, 1, 1);
  probeCtx.fillRect(0, 0, 1, 1);
  const d = probeCtx.getImageData(0, 0, 1, 1).data;
  return [d[0], d[1], d[2]];
}

export function relLuminance(color: string): number | null {
  const rgb = toSrgb(color);
  if (!rgb) return null;
  const [r, g, b] = rgb.map((v) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function contrast(fg: string, bg: string): number | null {
  const l1 = relLuminance(fg);
  const l2 = relLuminance(bg);
  if (l1 === null || l2 === null) return null;
  return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
}

/** Valeur résolue d'une variable CSS sur :root (ou sur l'élément fourni). */
export function cssVar(name: string, el: Element = document.documentElement) {
  return getComputedStyle(el).getPropertyValue(name).trim();
}
