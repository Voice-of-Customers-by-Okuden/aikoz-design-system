import { type ElementType, ReactNode } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { LineChart, Line, ResponsiveContainer } from "recharts";
import { cn } from "@registry/aikoz/lib/utils";
import { Star, StarFill, ArrowUpward, ArrowDownward } from "@material-symbols-svg/react/rounded";

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

// ─── Sub-components ───────────────────────────────────────────────────────────

function StarRating({ value, max }: { value: number; max: number }) {
  const rounded = Math.round(value);
  return (
    <div
      className="flex gap-0.5"
      aria-label={`${value} sur ${max} étoiles`}
      role="img"
    >
      {Array.from({ length: max }).map((_, i) =>
        i < rounded ? (
          <StarFill
            key={i}
            className="w-4 h-4 text-amber-400"
            aria-hidden="true"
          />
        ) : (
          <Star
            key={i}
            className="w-4 h-4 text-muted-foreground/30"
            aria-hidden="true"
          />
        )
      )}
    </div>
  );
}

function TrendBadge({ trend }: { trend: number }) {
  const positive = trend >= 0;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-0.5 text-xs font-semibold rounded-full px-2 py-0.5 border",
        positive
          ? "border-[var(--success)] bg-[color-mix(in_oklch,var(--success),transparent_92%)] text-[var(--success)]"
          : "border-[var(--destructive-text)] bg-[color-mix(in_oklch,var(--destructive-text),transparent_92%)] text-[var(--destructive-text)]"
      )}
      aria-label={positive ? `en hausse de ${trend}%` : `en baisse de ${Math.abs(trend)}%`}
    >
      {positive
        ? <ArrowUpward   className="w-3 h-3" aria-hidden="true" />
        : <ArrowDownward className="w-3 h-3" aria-hidden="true" />
      }
      {positive ? "+" : ""}{trend}%
    </span>
  );
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
          <StarRating value={value} max={max} />
          {trend !== undefined && <TrendBadge trend={trend} />}
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
