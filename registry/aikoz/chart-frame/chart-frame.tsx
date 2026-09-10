import { useId, type ReactNode } from "react";
import { cn } from "@registry/aikoz/lib/utils";
import { Table, type TableColumn } from "@registry/aikoz/table/table";

// ─── Vocabulaire des séries ──────────────────────────────────────────────────

/**
 * Six séries, trois canaux redondants chacune, dans un ordre FIXE : la
 * série 1 aura toujours le même trait plein et le même rond, quel que soit
 * le graphique. Une identité qui change d'un écran à l'autre ne s'apprend
 * pas.
 *
 * **Le pointillé et la trame ne sont pas décoratifs.** Mesuré sur notre
 * palette : la meilleure séparation atteignable entre six séries est de
 * **1,17:1 en clair, 1,23 en sombre**. Elles se confondent donc en niveaux
 * de gris et pour une part des daltonismes. La couleur ne porte pas la
 * distinction — elle la renforce, pour qui la perçoit.
 */
export const SERIES = [
  { trait: undefined, trame: undefined, nom: "trait plein" },
  { trait: "8 4", trame: "diagonales", nom: "tirets longs" },
  { trait: "2 3", trame: "points", nom: "pointillé fin" },
  { trait: "12 3 2 3", trame: "quadrillage", nom: "tiret-point" },
  { trait: "4 4", trame: "diagonales inverses", nom: "tirets courts" },
  { trait: "1 5", trame: "traits horizontaux", nom: "points espacés" },
] as const;

export const couleurSerie = (i: number) => `var(--chart-${(i % 6) + 1})`;
export const styleSerie = (i: number) => SERIES[i % SERIES.length];

// ─── Trames SVG, pour les aplats ─────────────────────────────────────────────

/**
 * Une barre ou une part de camembert n'a pas de tracé où poser un pointillé.
 * Son second canal est donc une TRAME — hachures, points, quadrillage —
 * posée par-dessus l'aplat. Même rôle, même ordre fixe.
 *
 * Rendu à 35 % d'opacité sur la couleur du fond de page : assez pour se voir,
 * pas assez pour fausser la lecture de la teinte.
 */
export function TramesSeries({ id }: { id: string }) {
  const T = (i: number, contenu: ReactNode) => (
    <pattern
      key={i}
      id={`${id}-trame-${i}`}
      width="8"
      height="8"
      patternUnits="userSpaceOnUse"
    >
      <g stroke="var(--card)" strokeWidth="1.6" opacity="0.55" fill="none">
        {contenu}
      </g>
    </pattern>
  );
  return (
    <defs>
      {T(1, <path d="M0 8 L8 0" />)}
      {T(2, <circle cx="4" cy="4" r="1.4" fill="var(--card)" stroke="none" />)}
      {T(3, <path d="M0 4 H8 M4 0 V8" />)}
      {T(4, <path d="M0 0 L8 8" />)}
      {T(5, <path d="M0 4 H8" />)}
    </defs>
  );
}

/** Remplissage d'une série d'aplat : la teinte, plus sa trame par-dessus. */
export function remplissageSerie(i: number, idTrames: string): string {
  const n = i % 6;
  return n === 0 ? couleurSerie(0) : `url(#${idTrames}-trame-${n})`;
}

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ChartSerie {
  key: string;
  label: string;
}

export interface ChartFrameProps<T> {
  /**
   * Ce que le graphique montre — **obligatoire**. C'est la légende du
   * tableau équivalent, donc le nom accessible de la donnée.
   */
  caption: string;
  /** Phrase de résumé. Complétée automatiquement par le renvoi au tableau. */
  summary: string;
  series: ChartSerie[];
  /** Données brutes, telles qu'elles alimentent le tableau équivalent. */
  data: T[];
  /** Colonnes du tableau équivalent. */
  columns: TableColumn<T>[];
  getRowKey: (row: T, index: number) => string;
  /** Colonne qui NOMME la ligne — cf. `Table`. */
  rowHeaderKey?: string;
  /** Le graphique lui-même. Reçoit l'identifiant des trames. */
  children: (idTrames: string) => ReactNode;
  height?: number;
  /** Masque la légende, quand le graphique étiquette déjà ses parts. */
  hideLegend?: boolean;
  /** Aplats plutôt que tracés : la légende montre les trames. */
  legendStyle?: "trait" | "aplat";
  tableCollapsed?: boolean;
  className?: string;
}

// ─── Composant ────────────────────────────────────────────────────────────────

/**
 * Coque commune à tous les graphiques.
 *
 * Elle existe pour que le contrat d'accessibilité soit tenu **par
 * construction** plutôt que répété — et oublié une fois sur cinq. Tout
 * graphique du système passe par elle, et en hérite :
 *
 * 1. **Le graphique est masqué, le tableau EST le contenu.** Un SVG de
 *    données ne se lit pas : on ne peut ni comparer deux valeurs, ni en
 *    retrouver une, ni copier quoi que ce soit. Le `aria-label` donne le
 *    résumé, le tableau donne la donnée — et il réutilise `Table`, donc ses
 *    en-têtes de ligne et de colonne.
 * 2. **La légende arrive AVANT le graphique.** Elle en est la clé de
 *    lecture ; en dessous, elle arrive trop tard.
 * 3. **Trois canaux par série**, jamais la couleur seule (WCAG 1.4.1).
 * 4. **Aucune animation** (WCAG 2.3.3).
 *
 * Le tableau est replié dans un `details` par défaut : présent dans le
 * document et lu, sans occuper la place.
 */
export function ChartFrame<T>({
  caption,
  summary,
  series,
  data,
  columns,
  getRowKey,
  rowHeaderKey,
  children,
  height = 280,
  hideLegend = false,
  legendStyle = "trait",
  tableCollapsed = true,
  className,
}: ChartFrameProps<T>) {
  const uid = useId().replace(/:/g, "");

  const tableau = (
    <Table
      caption={caption}
      captionHidden
      columns={columns}
      rows={data}
      getRowKey={getRowKey}
      rowHeaderKey={rowHeaderKey}
      density="compact"
    />
  );

  return (
    <figure className={cn("m-0 flex flex-col gap-4", className)}>
      <figcaption className="text-sm font-medium text-foreground">
        {caption}
      </figcaption>

      {!hideLegend && <ChartLegend series={series} style={legendStyle} />}

      <div
        role="img"
        aria-label={`${summary} Les valeurs exactes sont dans le tableau qui suit.`}
        style={{ height }}
        className="w-full"
      >
        {children(uid)}
      </div>

      {tableCollapsed ? (
        <details className="group">
          <summary
            className={cn(
              "cursor-pointer list-none text-sm font-medium text-[var(--secondary)]",
              "min-h-11 inline-flex items-center gap-1.5 rounded-[var(--radius)]",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
            )}
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 12 12"
              className="size-3 transition-transform group-open:rotate-90 motion-reduce:transition-none"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M4.5 2.5 8 6l-3.5 3.5" />
            </svg>
            Voir les données
          </summary>
          <div className="pt-3">{tableau}</div>
        </details>
      ) : (
        tableau
      )}
    </figure>
  );
}

// ─── Légende ──────────────────────────────────────────────────────────────────

export interface ChartLegendProps {
  series: ChartSerie[];
  /** `trait` pour les courbes, `aplat` pour les barres et les parts. */
  style?: "trait" | "aplat";
  className?: string;
}

/**
 * Légende d'un graphique.
 *
 * Chaque entrée montre les canaux tels qu'on les reconnaîtra dans le
 * graphique — la couleur ET le tracé, ou la couleur ET la trame. Une légende
 * réduite à une pastille de couleur est inutile à qui distingue les séries
 * par leur pointillé.
 *
 * Le nom du canal est aussi écrit en `sr-only`. Sans lui, la légende lue à
 * voix haute donne une liste de noms sans clé de lecture.
 */
export function ChartLegend({ series, style = "trait", className }: ChartLegendProps) {
  const uid = useId().replace(/:/g, "");
  return (
    <ul className={cn("flex flex-wrap gap-x-5 gap-y-2 list-none m-0 p-0", className)}>
      {style === "aplat" && (
        <svg aria-hidden="true" className="absolute size-0">
          <TramesSeries id={uid} />
        </svg>
      )}
      {series.map((s, i) => {
        const v = styleSerie(i);
        const c = couleurSerie(i);
        return (
          <li key={s.key} className="inline-flex items-center gap-2 text-sm">
            <svg aria-hidden="true" viewBox="0 0 28 12" className="h-3 w-7 shrink-0" fill="none">
              {style === "trait" ? (
                <>
                  <line x1="0" y1="6" x2="28" y2="6" stroke={c} strokeWidth="2" strokeDasharray={v.trait} />
                  <circle cx="14" cy="6" r="3.5" fill={c} />
                </>
              ) : (
                <>
                  <rect x="0" y="0" width="28" height="12" rx="2" fill={c} />
                  {i % 6 !== 0 && (
                    <rect x="0" y="0" width="28" height="12" rx="2" fill={`url(#${uid}-trame-${i % 6})`} />
                  )}
                </>
              )}
            </svg>
            <span className="text-foreground">{s.label}</span>
            <span className="sr-only">
              ({style === "trait" ? v.nom : v.trame ?? "aplat uni"})
            </span>
          </li>
        );
      })}
    </ul>
  );
}
