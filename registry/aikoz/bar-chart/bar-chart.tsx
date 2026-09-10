import {
  Bar,
  CartesianGrid,
  BarChart as RechartsBarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import {
  ChartFrame,
  TramesSeries,
  couleurSerie,
  remplissageSerie,
  type ChartSerie,
} from "@registry/aikoz/chart-frame/chart-frame";
import { type TableColumn } from "@registry/aikoz/table/table";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface BarChartProps {
  caption: string;
  data: Array<Record<string, string | number>>;
  xKey: string;
  series: ChartSerie[];
  /**
   * `stacked` empile les séries — pour une composition dont le TOTAL compte.
   * `grouped` les juxtapose — pour comparer les séries entre elles.
   *
   * Ce n'est pas un réglage d'apparence : empilé, on lit bien le total mais
   * mal chaque part, sauf la première qui seule part de zéro. Groupé, on
   * compare les parts mais on perd le total. Le choix dépend de la question
   * posée, pas de la place disponible.
   */
  layout?: "stacked" | "grouped";
  /** Barres horizontales — indispensable quand les libellés sont longs. */
  orientation?: "vertical" | "horizontal";
  xLabel?: string;
  formatValue?: (v: string | number) => string;
  height?: number;
  className?: string;
}

// ─── Composant ────────────────────────────────────────────────────────────────

/**
 * Barres empilées ou groupées.
 *
 * **Le second canal d'une barre n'est pas un pointillé mais une TRAME** :
 * un aplat n'a pas de tracé où poser des tirets. Hachures, points,
 * quadrillage — même rôle, même ordre fixe que les tracés des courbes, de
 * sorte qu'une série garde son identité d'un type de graphique à l'autre.
 *
 * **Un séparateur clair entre les segments empilés.** Deux séries adjacentes
 * dont les teintes se ressemblent — et la palette garantit qu'il y en aura —
 * fusionneraient en un seul bloc. Le trait de 2 px à la couleur de la carte
 * les sépare sans ajouter de couleur.
 *
 * Le reste du contrat — graphique masqué, tableau comme contenu, légende en
 * tête, aucune animation — vient de `ChartFrame`.
 */
export function BarChart({
  caption,
  data,
  xKey,
  series,
  layout = "stacked",
  orientation = "vertical",
  xLabel,
  formatValue = (v) => String(v),
  height = 300,
  className,
}: BarChartProps) {
  const horizontal = orientation === "horizontal";

  const columns: TableColumn<Record<string, string | number>>[] = [
    { key: xKey, header: xLabel ?? "Catégorie" },
    ...series.map((s) => ({
      key: s.key,
      header: s.label,
      numeric: true,
      cell: (row: Record<string, string | number>) => formatValue(row[s.key]),
    })),
  ];

  // En empilé, le total est l'information principale : il a sa colonne.
  if (layout === "stacked" && series.length > 1) {
    columns.push({
      key: "__total",
      header: "Total",
      numeric: true,
      cell: (row) =>
        formatValue(series.reduce((t, s) => t + Number(row[s.key] ?? 0), 0)),
    });
  }

  // L'accord suit le nombre de séries : « 1 série groupée », pas « groupées ».
  const pluriel = series.length > 1 ? "s" : "";
  const resume =
    `${caption}. ${series.length} série${pluriel} ` +
    `${layout === "stacked" ? "empilée" : "groupée"}${pluriel} ` +
    `sur ${data.length} catégorie${data.length > 1 ? "s" : ""}.`;

  return (
    <ChartFrame
      caption={caption}
      summary={resume}
      series={series}
      data={data}
      columns={columns}
      getRowKey={(row) => String(row[xKey])}
      rowHeaderKey={xKey}
      height={height}
      legendStyle="aplat"
      className={className}
    >
      {(idTrames) => (
        <ResponsiveContainer width="100%" height="100%">
          <RechartsBarChart
            data={data}
            layout={horizontal ? "vertical" : "horizontal"}
            margin={{ top: 8, right: 8, bottom: 8, left: 0 }}
          >
            <TramesSeries id={idTrames} />
            <CartesianGrid
              stroke="var(--border)"
              strokeDasharray="3 3"
              vertical={horizontal}
              horizontal={!horizontal}
            />
            {horizontal ? (
              <>
                <XAxis type="number" tick={{ fill: "var(--muted-foreground)", fontSize: 12 }} stroke="var(--border-strong)" tickLine={false} />
                <YAxis type="category" dataKey={xKey} width={120} tick={{ fill: "var(--muted-foreground)", fontSize: 12 }} stroke="var(--border-strong)" tickLine={false} />
              </>
            ) : (
              <>
                <XAxis dataKey={xKey} tick={{ fill: "var(--muted-foreground)", fontSize: 12 }} stroke="var(--border-strong)" tickLine={false} />
                <YAxis width={44} tick={{ fill: "var(--muted-foreground)", fontSize: 12 }} stroke="var(--border-strong)" tickLine={false} />
              </>
            )}
            {series.map((s, i) => (
              <Bar
                key={s.key}
                dataKey={s.key}
                stackId={layout === "stacked" ? "pile" : undefined}
                fill={couleurSerie(i)}
                // Trame par-dessus l'aplat : c'est le second canal.
                // Rendue en superposant un rectangle rempli du motif.
                stroke="var(--card)"
                strokeWidth={layout === "stacked" ? 2 : 0}
                isAnimationActive={false}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                shape={((props: any) => (
                  <g>
                    <rect
                      x={props.x}
                      y={props.y}
                      width={props.width}
                      height={props.height}
                      fill={couleurSerie(i)}
                    />
                    {i % 6 !== 0 && (
                      <rect
                        x={props.x}
                        y={props.y}
                        width={props.width}
                        height={props.height}
                        fill={remplissageSerie(i, idTrames)}
                      />
                    )}
                    {layout === "stacked" && (
                      // Le séparateur : sans lui, deux segments de teintes
                      // voisines fusionnent en un seul bloc.
                      <rect
                        x={props.x}
                        y={props.y}
                        width={props.width}
                        height={props.height}
                        fill="none"
                        stroke="var(--card)"
                        strokeWidth={2}
                      />
                    )}
                  </g>
                )) as never}
              />
            ))}
          </RechartsBarChart>
        </ResponsiveContainer>
      )}
    </ChartFrame>
  );
}
