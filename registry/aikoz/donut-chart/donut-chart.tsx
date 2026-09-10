import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";
import { cn } from "@registry/aikoz/lib/utils";
import {
  ChartFrame,
  TramesSeries,
  couleurSerie,
  remplissageSerie,
} from "@registry/aikoz/chart-frame/chart-frame";
import { type TableColumn } from "@registry/aikoz/table/table";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface DonutPart {
  key: string;
  label: string;
  value: number;
}

export interface DonutChartProps {
  caption: string;
  parts: DonutPart[];
  /** Chiffre au centre — un total, une part dominante. */
  centerValue?: string;
  centerLabel?: string;
  formatValue?: (v: number) => string;
  height?: number;
  className?: string;
}

// ─── Composant ────────────────────────────────────────────────────────────────

/**
 * Anneau de répartition — transposé du `SourcesDonut` des maquettes.
 *
 * **Un anneau se lit mal, et il faut le savoir avant d'en poser un.** L'œil
 * compare des longueurs bien mieux que des angles : au-delà de quatre ou
 * cinq parts, ou dès que deux parts sont proches, une barre horizontale
 * renseigne davantage. L'anneau garde un avantage réel — il montre qu'on
 * regarde un TOUT — d'où le chiffre au centre, qui est souvent la seule
 * information que le lecteur retiendra.
 *
 * Chaque part porte donc **son pourcentage écrit**, en plus de la trame et
 * de la couleur. C'est le seul moyen de comparer deux parts voisines sans
 * les mesurer à l'œil.
 *
 * Le reste du contrat vient de `ChartFrame` : anneau masqué, tableau comme
 * contenu, aucune animation.
 */
export function DonutChart({
  caption,
  parts,
  centerValue,
  centerLabel,
  formatValue = (v) => String(v),
  height = 260,
  className,
}: DonutChartProps) {
  const total = parts.reduce((t, p) => t + p.value, 0);
  const pct = (v: number) => (total ? Math.round((v / total) * 100) : 0);

  const columns: TableColumn<DonutPart>[] = [
    { key: "label", header: "Source" },
    { key: "value", header: "Volume", numeric: true, cell: (p) => formatValue(p.value) },
    { key: "part", header: "Part", numeric: true, cell: (p) => `${pct(p.value)} %` },
  ];

  const resume =
    `${caption}. ${parts.length} parts, total ${formatValue(total)}. ` +
    parts.map((p) => `${p.label} ${pct(p.value)} %`).join(", ") + ".";

  return (
    <ChartFrame
      caption={caption}
      summary={resume}
      series={parts.map((p) => ({ key: p.key, label: `${p.label} · ${pct(p.value)} %` }))}
      data={parts}
      columns={columns}
      getRowKey={(p) => p.key}
      rowHeaderKey="label"
      height={height}
      legendStyle="aplat"
      className={className}
    >
      {(idTrames) => (
        <div className="relative h-full w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <TramesSeries id={idTrames} />
              <Pie
                data={parts}
                dataKey="value"
                nameKey="label"
                innerRadius="58%"
                outerRadius="88%"
                // Le trait à la couleur de la carte sépare deux parts de
                // teintes voisines, que la palette produira forcément.
                stroke="var(--card)"
                strokeWidth={2}
                isAnimationActive={false}
              >
                {parts.map((p, i) => (
                  <Cell key={p.key} fill={couleurSerie(i)} />
                ))}
              </Pie>
              <Pie
                data={parts}
                dataKey="value"
                innerRadius="58%"
                outerRadius="88%"
                stroke="none"
                isAnimationActive={false}
              >
                {parts.map((p, i) => (
                  <Cell
                    key={p.key}
                    fill={i % 6 === 0 ? "transparent" : remplissageSerie(i, idTrames)}
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>

          {(centerValue || centerLabel) && (
            <div
              aria-hidden="true"
              className={cn(
                "pointer-events-none absolute inset-0",
                "flex flex-col items-center justify-center text-center"
              )}
            >
              {centerValue && (
                <span className="text-2xl font-bold tabular-nums text-foreground">
                  {centerValue}
                </span>
              )}
              {centerLabel && (
                <span className="text-xs text-muted-foreground">{centerLabel}</span>
              )}
            </div>
          )}
        </div>
      )}
    </ChartFrame>
  );
}
