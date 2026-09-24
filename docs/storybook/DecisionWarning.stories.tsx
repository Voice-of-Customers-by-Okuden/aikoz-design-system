import type { Meta, StoryObj } from "@storybook/react-vite";
import { useEffect, useState } from "react";
import { expect } from "storybook/test";

// ─── Mesure ──────────────────────────────────────────────────────────────────

function lineaire(L: number, C: number, H: number): [number, number, number] {
  const h = (H * Math.PI) / 180;
  const a = C * Math.cos(h);
  const b = C * Math.sin(h);
  const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3;
  return [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  ];
}
const gamma = (c: number) =>
  c <= 0.0031308
    ? 12.92 * c
    : 1.055 * Math.pow(Math.max(c, 0), 1 / 2.4) - 0.055;
const borne = (v: number) => Math.min(1, Math.max(0, v));
const versHex = (c: number[]) =>
  "#" +
  c
    .map((v) =>
      Math.round(borne(v) * 255)
        .toString(16)
        .padStart(2, "0"),
    )
    .join("")
    .toUpperCase();

/** Dans le gamut sRGB ? Un dépassement se rogne, et le rognage fait la boue. */
const dansLeGamut = (L: number, C: number, H: number) =>
  lineaire(L, C, H).every((v) => v >= -0.0005 && v <= 1.0005);

/** Chroma maximum AFFICHABLE à cette clarté et cette teinte. */
function chromaMax(L: number, H: number) {
  let bas = 0;
  let haut = 0.4;
  for (let i = 0; i < 40; i++) {
    const m = (bas + haut) / 2;
    if (dansLeGamut(L, m, H)) bas = m;
    else haut = m;
  }
  return bas;
}

const lin = (c: number) =>
  c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
const luminance = (c: number[]) =>
  0.2126 * lin(borne(c[0])) +
  0.7152 * lin(borne(c[1])) +
  0.0722 * lin(borne(c[2]));
const ratio = (a: number[], b: number[]) => {
  const x = luminance(a);
  const y = luminance(b);
  return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
};

// ─── Les candidats ───────────────────────────────────────────────────────────

type Candidat = {
  cle: string;
  nom: string;
  L: number;
  C: number;
  H: number;
  note: string;
  /** Mesuré par axe sous 4,5:1 en pastille : on montre le chiffre, pas la faute. */
  souslePlancher?: boolean;
};

const CANDIDATS: Candidat[] = [
  {
    cle: "A",
    nom: "Actuel",
    L: 0.449,
    C: 0.1355,
    H: 93.928,
    note: "La teinte de l'aplat de graphique, assombrie pour porter du texte. Elle déclare 0,1355 de chroma là où sRGB en affiche 0,0928 : le navigateur rogne, et c'est le rognage qui fait le kaki.",
  },
  {
    cle: "B",
    nom: "Même teinte, dans le gamut",
    L: 0.449,
    C: 0.092,
    H: 93.928,
    note: "La même couleur, déclarée telle qu'elle s'affiche. Honnête, et toujours terne : à cette clarté le jaune ne PEUT pas être plus saturé.",
  },
  {
    cle: "C",
    nom: "Ambre, teinte 65",
    L: 0.449,
    C: 0.1,
    H: 65,
    note: "La teinte glisse vers l'orange en s'assombrissant. C'est ce que font Radix, Carbon et Material : le jaune est la seule teinte qui ne survit pas à l'assombrissement.",
  },
  {
    cle: "D",
    nom: "Ambre soutenu, teinte 55",
    L: 0.449,
    C: 0.112,
    H: 55,
    note: "Plus chaud et plus saturé encore. Le risque est de se rapprocher du rouge d'erreur.",
  },
  {
    cle: "E",
    nom: "Jaune clair, rampe de statut",
    L: 0.5392,
    C: 0.1106,
    H: 84.636,
    souslePlancher: true,
    note: "On garde le jaune et on remonte la clarté. Mesuré par axe sur le rendu : 4,25:1 en texte de pastille, sous le plancher de 4,5. Écarté par la mesure, pas par le goût.",
  },
];

// ─── La page ─────────────────────────────────────────────────────────────────

function Decision() {
  // Le fond de carte du thème CLAIR. Cette page ne traite que lui : en
  // sombre, `--warning` vaut un jaune CLAIR (oklch 0.889 0.156 95,5) posé
  // sur un fond profond, il se lit très bien, et la question ne se pose pas.
  // Le défaut est une affaire de thème clair, et d'elle seule.
  const fond = lineaire(1, 0, 0).map(gamma);
  const rouge = lineaire(0.464, 0.1602, 30.474).map(gamma);

  return (
    <div className="flex min-w-0 flex-col gap-5 bg-background p-6 text-foreground">
      <div>
        <h2 className="m-0 font-heading text-lg font-semibold">
          Quelle couleur pour l'avertissement ?
        </h2>
        <p className="m-0 mt-1 max-w-prose text-sm text-muted-foreground">
          <strong>Thème clair uniquement.</strong> En sombre, ce rôle vaut un
          jaune clair sur fond profond : il se lit, et rien n'est à trancher.
          <br />
          La teinte est la tienne. Ce qui n'est pas arbitrable : une valeur
          déclarée doit être <em>affichable</em>. Chaque ligne est rendue, puis
          mesurée par cette page.
        </p>
      </div>

      <div className="min-w-0 overflow-x-auto">
        <table className="w-full min-w-[46rem] border-collapse text-sm">
          <caption className="sr-only">
            Cinq candidats pour la couleur d'avertissement, mesurés
          </caption>
          <thead>
            <tr className="border-b-2 border-[var(--border-strong)] text-left">
              {[
                ["Candidat", true],
                ["Rendu", false],
                ["Déclaré", false],
                ["Affichable ?", false],
                ["Sur le fond", false],
                ["Écart au rouge", false],
              ].map(([h, masque]) => (
                <th
                  key={h as string}
                  scope="col"
                  className="px-3 py-2 font-semibold"
                >
                  {/* Un en-tête de colonne ne peut pas être vide : sans texte,
                      la colonne n'a pas de nom pour un lecteur d'écran, et
                      axe le refuse à juste titre. */}
                  <span className={masque ? "sr-only" : undefined}>
                    {h as string}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {CANDIDATS.map((c) => {
              const brut = lineaire(c.L, c.C, c.H);
              const rendu = brut.map(gamma);
              const ok = dansLeGamut(c.L, c.C, c.H);
              const max = chromaMax(c.L, c.H);
              const contraste = ratio(rendu, fond);
              const dEcart = Math.abs(c.H - 30.474);
              return (
                <tr
                  key={c.cle}
                  className="border-b border-border last:border-0"
                >
                  <th
                    scope="row"
                    className="px-3 py-4 text-left align-top font-medium"
                  >
                    {c.cle} · {c.nom}
                    <p className="m-0 mt-1 max-w-[22rem] text-xs font-normal text-muted-foreground">
                      {c.note}
                    </p>
                  </th>
                  <td className="px-3 py-4 align-top">
                    {c.souslePlancher ? (
                      <span className="flex items-center gap-2 text-xs">
                        <span
                          aria-hidden="true"
                          className="inline-block size-5 rounded-full border border-border"
                          style={{ background: versHex(rendu) }}
                        />
                        <span className="text-[var(--destructive-text)]">
                          4,25:1 — écarté
                        </span>
                      </span>
                    ) : (
                      <span
                        className="inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold"
                        style={{
                          color: versHex(rendu),
                          borderColor: versHex(rendu),
                          background: `color-mix(in oklch, ${versHex(rendu)}, transparent 92%)`,
                        }}
                      >
                        Renvoyée pour correction
                      </span>
                    )}
                  </td>
                  <td className="px-3 py-4 align-top font-mono text-xs tabular-nums">
                    {c.L} {c.C} {Math.round(c.H)}
                    <br />
                    <span className="text-muted-foreground">
                      {versHex(rendu)}
                    </span>
                  </td>
                  <td className="px-3 py-4 align-top text-xs tabular-nums">
                    {ok ? (
                      <span className="text-[var(--success)]">oui</span>
                    ) : (
                      <span className="text-[var(--destructive-text)]">
                        non — max {max.toFixed(4)}
                      </span>
                    )}
                  </td>
                  <td className="px-3 py-4 align-top tabular-nums">
                    {contraste.toFixed(2)}:1
                  </td>
                  <td className="px-3 py-4 align-top tabular-nums">
                    {Math.round(dEcart)}°
                    <br />
                    <span
                      aria-hidden="true"
                      className="mt-1 inline-block size-3 rounded-full align-middle"
                      style={{ background: versHex(rouge) }}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const meta = {
  title: "Design system/Décision — couleur d'avertissement",
  component: Decision,
  parameters: { layout: "fullscreen", mesures: false },
} satisfies Meta<typeof Decision>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Choisir: Story = {
  name: "Cinq candidats, mesurés",
  // Épinglée en clair : les valeurs comparées SONT celles du thème clair.
  // Rendues sur un fond sombre, elles échouent — et c'est une paire qui
  // n'existe nulle part.
  globals: { theme: "clair" },
  play: async ({ canvasElement }) => {
    // Le constat qui n'est PAS arbitrable : la valeur actuelle déclare une
    // saturation que sRGB ne sait pas afficher, donc le rendu n'est pas le
    // déclaré. Quelle que soit la teinte retenue, elle doit tenir dans le
    // gamut.
    const a = CANDIDATS[0];
    await expect(dansLeGamut(a.L, a.C, a.H)).toBe(false);
    await expect(chromaMax(a.L, a.H)).toBeLessThan(a.C);
    // Et les quatre propositions, elles, sont affichables.
    for (const c of CANDIDATS.slice(1)) {
      await expect(dansLeGamut(c.L, c.C, c.H), `${c.cle} sort du gamut`).toBe(
        true,
      );
    }

    // Le contraste, lui, est mesuré par l'addon a11y sur CHAQUE histoire :
    // c'est lui qui a écarté le candidat E à 4,25:1, et c'est la seule
    // autorité sur le sujet. Mon premier jet le recalculait à côté et
    // trouvait 4,62 puis 6,25 selon la façon de composer le voile à 8 % —
    // deux mesures d'un modèle, pas du rendu. Deux autorités sur un même
    // chiffre, c'est une de trop.
  },
};
