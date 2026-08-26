import { type ElementType, ReactNode } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { LineChart, Line, ResponsiveContainer } from "recharts";
import { cn } from "@registry/aikoz/lib/utils";
import { ScoreStars } from "@registry/aikoz/score-stars/score-stars";
import { DeltaBadge } from "@registry/aikoz/delta-badge/delta-badge";

// ─── Variants ────────────────────────────────────────────────────────────────

const cardVariants = cva(
  [
    "relative flex flex-col",
    "bg-card border border-border",
    "rounded-[var(--radius)]",
    "shadow-sm",
  ],
  {
    variants: {
      size: {
        // sm : valeur + label uniquement — widget compact
        sm: "p-4 gap-1.5 min-w-[150px]",
        // md : + étoiles + badge tendance — carte standard
        md: "p-5 gap-2 min-w-[210px]",
        // lg : + sparkline + sous-texte muted — carte enrichie
        lg: "p-6 gap-3 min-w-[270px]",
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
);

const valueVariants = cva(
  "font-sans font-bold leading-none tracking-tight text-foreground",
  {
    variants: {
      size: {
        sm: "text-3xl",
        md: "text-4xl",
        lg: "text-5xl",
      },
    },
  }
);

// ─── Types ────────────────────────────────────────────────────────────────────

export interface KpiCardProps extends VariantProps<typeof cardVariants> {
  label: string;
  value: number;
  max?: number;
  trend?: number;
  sparklineData?: number[];
  icon?: ReactNode;
  className?: string;
  onClick?: () => void;
  href?: string;
}

// ─── Main component ───────────────────────────────────────────────────────────

export function KpiCard({
  label,
  value,
  max = 5,
  trend,
  sparklineData,
  icon,
  size = "md",
  className,
  onClick,
  href,
}: KpiCardProps) {
  const chartData = (sparklineData ?? []).map((v) => ({ v }));
  const formatted = value.toLocaleString("fr-FR", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  });

  // Rendu sémantique selon l'interactivité
  const isInteractive = !!(onClick || href);
  const Comp = (href ? "a" : onClick ? "button" : "div") as ElementType;

  const compProps = href
    ? { href }
    : onClick
    ? { onClick, type: "button" as const }
    : {};

  // États visuels uniquement si interactive — aucun sur le div décoratif
  const interactiveClasses = isInteractive
    ? cn(
        "transition-all cursor-pointer",
        "hover:shadow-lg hover:border-[var(--ring)]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]",
        "focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]",
        "active:scale-[0.99]",
        href && "no-underline",
        onClick && "text-left w-full",
      )
    : "";

  const ariaLabel = isInteractive
    ? `${label} : ${formatted} sur ${max}`
    : undefined;

  return (
    <Comp
      className={cn(cardVariants({ size }), interactiveClasses, className)}
      aria-label={ariaLabel}
      {...compProps}
    >

      {/* Label + icône optionnelle */}
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          {label}
        </span>
        {icon && (
          <span className="text-muted-foreground" aria-hidden="true">
            {icon}
          </span>
        )}
      </div>

      {/* Valeur principale */}
      <div className="flex items-baseline gap-1.5">
        <span
          className={valueVariants({ size })}
          aria-label={`${formatted} sur ${max}`}
        >
          {formatted}
        </span>
        <span className="text-base font-medium text-muted-foreground">
          /{max}
        </span>
      </div>

      {/* md + lg : étoiles + badge tendance */}
      {(size === "md" || size === "lg") && (
        <div className="flex items-center gap-2 flex-wrap">
          {/* label={null} : la carte porte déjà la note dans son aria-label,
              les étoiles ne doivent pas l'annoncer une seconde fois. */}
          <ScoreStars value={value} max={max} label={null} />
          {trend !== undefined && <DeltaBadge value={trend} />}
        </div>
      )}

      {/* lg uniquement : sparkline recharts + sous-texte */}
      {size === "lg" && chartData.length > 0 && (
        <div className="flex flex-col gap-1 pt-1">
          <ResponsiveContainer width="100%" height={56}>
            <LineChart data={chartData} margin={{ top: 4, right: 4, left: 4, bottom: 4 }}>
              <Line
                type="monotone"
                dataKey="v"
                stroke="var(--chart-1)"
                strokeWidth={2}
                dot={false}
                isAnimationActive={false}
              />
            </LineChart>
          </ResponsiveContainer>
          <span className="text-xs text-muted-foreground">vs. mois dernier</span>
        </div>
      )}

    </Comp>
  );
}
