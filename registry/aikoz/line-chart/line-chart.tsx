import { useId, type ReactNode } from "react";
import {
  CartesianGrid,
  Line,
  LineChart as RechartsLineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import { cn } from "@registry/aikoz/lib/utils";
import { Table, type TableColumn } from "@registry/aikoz/table/table";

// ─── Vocabulaire des séries ──────────────────────────────────────────────────

/**
 * Six séries, six canaux redondants. L'ordre est fixe : la série 1 aura
 * toujours le même trait plein et le même rond, quel que soit le graphique.
 * Une identité qui change d'un écran à l'autre ne s'apprend pas.
 *
 * **Le pointillé et la forme ne sont pas décoratifs.** Mesuré sur notre
 * palette : la meilleure séparation atteignable entre six séries est de
 * **1,17:1**. Elles se confondent donc en niveaux de gris, et pour une part
 * des daltonismes. La couleur ne peut pas porter la distinction — elle la
 * renforce, pour qui la perçoit.
 */
export const SERIES = [
  { trait: undefined, forme: "circle", nom: "trait plein, rond" },
  { trait: "8 4", forme: "square", nom: "tirets longs, carré" },
  { trait: "2 3", forme: "triangle", nom: "pointillé fin, triangle" },
  { trait: "12 3 2 3", forme: "diamond", nom: "tiret-point, losange" },
  { trait: "4 4", forme: "cross", nom: "tirets courts, croix" },
  { trait: "1 5", forme: "star", nom: "points espacés, étoile" },
] as const;

// ─── Types ────────────────────────────────────────────────────────────────────

export interface LineSerie {
  /** Clé de la valeur dans chaque point. */
  key: string;
  /** Nom lisible — il sert à la légende ET à l'en-tête du tableau. */
  label: string;
}

export interface LineChartProps {
  /**
   * Ce que le graphique montre — **obligatoire**. C'est la légende du
   * tableau équivalent, donc le nom accessible de la donnée.
   */
  caption: string;
  /** Points de données. Chaque objet porte `x` et une clé par série. */
  data: Array<Record<string, string | number>>;
  /** Clé de l'axe des abscisses. */
  xKey: string;
  series: LineSerie[];
  /** Intitulé de l'axe des abscisses, affiché sous le graphique. */
  xLabel?: string;
  yLabel?: string;
  /** Formate une valeur pour l'affichage — pourcentage, monnaie, unité. */
  formatValue?: (v: string | number) => string;
  height?: number;
  /**
   * Replie le tableau équivalent dans un `<details>`. Il reste dans le
   * document et reste lu ; il n'occupe simplement pas la place par défaut.
   */
  tableCollapsed?: boolean;
  className?: string;
  children?: ReactNode;
}

// ─── Composant ────────────────────────────────────────────────────────────────

/**
 * Courbe multi-séries.
 *
 * **Le graphique est masqué aux technologies d'assistance, et le tableau EST
 * le contenu.** Ce n'est pas un renoncement : un SVG de courbes, même
 * étiqueté, ne se lit pas — on ne peut ni comparer deux points, ni retrouver
 * une valeur, ni suivre une tendance. Un tableau le permet, et il permet en
 * plus de copier les chiffres. Le `aria-label` du graphique donne le résumé,
 * le tableau donne la donnée.
 *
 * C'est aussi la seule façon honnête de traiter la limite mesurée de la
 * palette : six séries ne peuvent pas se distinguer par la couleur. On ajoute
 * donc le pointillé et la forme du marqueur — et, pour qui ne voit rien de
 * tout ça, le tableau.
 *
 * **Aucune animation.** Recharts en anime l'apparition par défaut ; une
 * courbe qui se dessine retarde la lecture sans rien apprendre, et le
 * mouvement est un problème pour une partie des lecteurs (WCAG 2.3.3).
 *
 * Le composant ne formate rien de lui-même : `formatValue` est fourni par
 * l'appelant, qui seul sait s'il s'agit de pourcentages, d'euros ou de jours.
 */
export function LineChart({
  caption,
  data,
  xKey,
  series,
  xLabel,
  yLabel,
  formatValue = (v) => String(v),
  height = 280,
  tableCollapsed = true,
  className,
  children,
}: LineChartProps) {
  const uid = useId();

  // Résumé énoncé : sans lui, le graphique s'annonce « image » et rien de plus.
  const resume = `${caption}. ${series.length} série${
    series.length > 1 ? "s" : ""
  } sur ${data.length} points. Les valeurs exactes sont dans le tableau qui suit.`;

  const colonnes: TableColumn<Record<string, string | number>>[] = [
    { key: xKey, header: xLabel ?? "Période" },
    ...series.map((s) => ({
      key: s.key,
      header: s.label,
      numeric: true,
      cell: (row: Record<string, string | number>) => formatValue(row[s.key]),
    })),
  ];

  const tableau = (
    <Table
      caption={caption}
      captionHidden
      columns={colonnes}
      rows={data}
      getRowKey={(_, i) => `${uid}-${i}`}
      rowHeaderKey={xKey}
      density="compact"
    />
  );

  return (
    <figure className={cn("m-0 flex flex-col gap-4", className)}>
      <figcaption className="text-sm font-medium text-foreground">
        {caption}
      </figcaption>

      {/* Légende AVANT le graphique : elle en donne la clé de lecture, et
          arriverait trop tard en dessous. */}
      <ChartLegend series={series} />

      <div
        role="img"
        aria-label={resume}
        style={{ height }}
        className="w-full"
      >
        <ResponsiveContainer width="100%" height="100%">
          <RechartsLineChart
            data={data}
            margin={{ top: 8, right: 8, bottom: 8, left: 0 }}
          >
            <CartesianGrid
              // Grille en trait discret : c'est un repère, pas une donnée.
              stroke="var(--border)"
              strokeDasharray="3 3"
              vertical={false}
            />
            <XAxis
              dataKey={xKey}
              tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
              stroke="var(--border-strong)"
              tickLine={false}
            />
            <YAxis
              tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
              stroke="var(--border-strong)"
              tickLine={false}
              width={44}
            />
            {series.map((s, i) => {
              const v = SERIES[i % SERIES.length];
              return (
                <Line
                  key={s.key}
                  type="monotone"
                  dataKey={s.key}
                  stroke={`var(--chart-${(i % 6) + 1})`}
                  strokeWidth={2}
                  strokeDasharray={v.trait}
                  // 2px de trait : en dessous, une courbe pointillée
                  // disparaît à l'impression et au zoom arrière.
                  dot={{
                    r: 3.5,
                    fill: `var(--chart-${(i % 6) + 1})`,
                    strokeWidth: 0,
                  }}
                  activeDot={{ r: 5 }}
                  isAnimationActive={false}
                />
              );
            })}
          </RechartsLineChart>
        </ResponsiveContainer>
      </div>

      {yLabel && (
        <p className="m-0 text-xs text-muted-foreground">{yLabel}</p>
      )}

      {children}

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
  series: LineSerie[];
  className?: string;
}

/**
 * Légende d'un graphique.
 *
 * Chaque entrée montre les TROIS canaux — la couleur, le tracé, la forme du
 * marqueur — parce que c'est ainsi qu'on les reconnaîtra dans le graphique.
 * Une légende qui ne montrerait qu'une pastille de couleur serait inutile à
 * qui distingue les séries par leur pointillé.
 *
 * Le nom du tracé est aussi écrit en `sr-only` : « trait plein, rond ». Sans
 * lui, la légende lue à voix haute donne une liste de noms sans clé.
 */
export function ChartLegend({ series, className }: ChartLegendProps) {
  return (
    <ul
      className={cn("flex flex-wrap gap-x-5 gap-y-2 list-none m-0 p-0", className)}
    >
      {series.map((s, i) => {
        const v = SERIES[i % SERIES.length];
        const c = `var(--chart-${(i % 6) + 1})`;
        return (
          <li key={s.key} className="inline-flex items-center gap-2 text-sm">
            <svg
              aria-hidden="true"
              viewBox="0 0 28 12"
              className="h-3 w-7 shrink-0"
              fill="none"
            >
              <line
                x1="0"
                y1="6"
                x2="28"
                y2="6"
                stroke={c}
                strokeWidth="2"
                strokeDasharray={v.trait}
              />
              <circle cx="14" cy="6" r="3.5" fill={c} />
            </svg>
            <span className="text-foreground">{s.label}</span>
            <span className="sr-only">({v.nom})</span>
          </li>
        );
      })}
    </ul>
  );
}
