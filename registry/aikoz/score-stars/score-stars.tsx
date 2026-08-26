import { Star, StarFill, StarHalf } from "@material-symbols-svg/react/rounded";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@registry/aikoz/lib/utils";

// ─── Variants ────────────────────────────────────────────────────────────────

const starVariants = cva("shrink-0", {
  variants: {
    size: {
      sm: "w-3.5 h-3.5",
      md: "w-4 h-4",
      lg: "w-5 h-5",
    },
  },
  defaultVariants: { size: "md" },
});

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ScoreStarsProps extends VariantProps<typeof starVariants> {
  /** Note à représenter. Bornée à [0, max]. */
  value: number;
  /** Nombre d'étoiles de l'échelle. */
  max?: number;
  /**
   * Arrondi visuel. `half` (défaut) affiche une demi-étoile au plus proche 0,5 ;
   * `full` arrondit à l'entier. La valeur annoncée reste la valeur exacte.
   */
  rounding?: "half" | "full";
  /**
   * Libellé accessible. Par défaut « 4,2 sur 5 étoiles ».
   * Passer `null` si un parent porte déjà le libellé — les étoiles deviennent
   * alors purement décoratives, pour ne pas annoncer deux fois la même note.
   */
  label?: string | null;
  className?: string;
}

// ─── Composant ────────────────────────────────────────────────────────────────

/**
 * Notation en étoiles.
 *
 * Extrait de `kpi-card.tsx`, où il vivait inliné sous le nom `StarRating` et
 * codait sa couleur en `text-amber-400` — une couleur Tailwind brute, seule
 * entorse aux tokens du code livré. Il consomme désormais le rôle dédié
 * `--rating`. Audité contre les trois surfaces où un consommateur peut le
 * poser — carte, page, fond muted — et non contre la seule carte : ce
 * composant est publié au registry, rien ne garantit son contexte.
 * Light 5,13 / 4,70 / 4,30:1 · dark 5,35 / 5,99 / 5,35:1, seuil 3:1
 * (WCAG 1.4.11, l'étoile porte l'information).
 *
 * L'information n'est jamais portée par la seule couleur : le nombre
 * d'étoiles pleines la véhicule, et `aria-label` la donne en toutes lettres.
 */
export function ScoreStars({
  value,
  max = 5,
  size = "md",
  rounding = "half",
  label,
  className,
}: ScoreStarsProps) {
  const clamped = Math.min(Math.max(value, 0), max);
  const step = rounding === "half" ? 0.5 : 1;
  const rounded = Math.round(clamped / step) * step;

  const formatted = clamped.toLocaleString("fr-FR", {
    maximumFractionDigits: 1,
  });
  const accessibleLabel =
    label === null ? undefined : label ?? `${formatted} sur ${max} étoiles`;

  return (
    <div
      className={cn("flex gap-0.5", className)}
      role={accessibleLabel ? "img" : undefined}
      aria-label={accessibleLabel}
      aria-hidden={accessibleLabel ? undefined : true}
    >
      {Array.from({ length: max }).map((_, i) => {
        const filled = rounded >= i + 1;
        const half = !filled && rounded >= i + 0.5;
        const Icon = filled ? StarFill : half ? StarHalf : Star;
        return (
          <Icon
            key={i}
            className={starVariants({ size })}
            style={{ color: filled || half ? "var(--rating)" : "var(--rating-empty)" }}
            aria-hidden="true"
          />
        );
      })}
    </div>
  );
}

export { starVariants };
