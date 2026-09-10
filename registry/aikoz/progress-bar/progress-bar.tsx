import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@registry/aikoz/lib/utils";

// ─── Variants ────────────────────────────────────────────────────────────────

const trackVariants = cva(
  // --track, pas --muted : en dark ce dernier vaut exactement --card (1,00:1),
  // la piste y serait strictement invisible.
  ["w-full overflow-hidden rounded-full", "bg-[var(--track)]"],
  {
    variants: {
      size: {
        sm: "h-1.5",
        md: "h-2",
        lg: "h-3",
      },
    },
    defaultVariants: { size: "md" },
  }
);

// Rôles de REMPLISSAGE, pas rôles de texte : un aplat porteur s'audite contre
// la piste au seuil 3:1 (WCAG 1.4.11), là où un texte s'audite à 4,5:1 contre
// la surface. Le jaune l'a montré — warning-text (600) ne donnait que 2,73:1
// sur la piste, d'où un warning-fill un cran plus foncé.
const FILL: Record<ProgressLevel, string> = {
  good: "var(--success-fill)",
  warning: "var(--warning-fill)",
  critical: "var(--error-fill)",
};

// ─── Types ────────────────────────────────────────────────────────────────────

export type ProgressLevel = "good" | "warning" | "critical";

/**
 * `meter` — une MESURE dans une échelle connue : taux de réponse, note, jauge.
 * `progressbar` — l'avancement d'une TÂCHE : téléversement, import, calcul.
 *
 * ARIA distingue les deux et les lecteurs d'écran ne les annoncent pas pareil.
 * Le défaut est `meter` : dans ce design system la barre sert des indicateurs,
 * pas des traitements en cours.
 */
export type ProgressRole = "meter" | "progressbar";

export interface ProgressBarProps extends VariantProps<typeof trackVariants> {
  /** Valeur atteinte. Bornée à [0, max]. */
  value: number;
  /** Borne haute de l'échelle. */
  max?: number;
  /**
   * Niveau, qui porte la couleur. Omis, il est déduit de `thresholds` — et la
   * couleur est alors redondante avec la longueur, aucune information n'est
   * portée par la seule couleur.
   *
   * À forcer quand « moins » est un progrès (un délai de réponse bas est bon).
   * Attention : un niveau forcé porte une information que la longueur ne double
   * PAS — passer alors un `valueText` qui l'énonce, sous peine de tomber sous
   * le coup de WCAG 1.4.1.
   */
  level?: ProgressLevel;
  /**
   * Seuils de déduction du niveau, en fraction de `max`.
   * Au-dessus de `good` → good ; au-dessus de `warning` → warning ; sinon critical.
   */
  thresholds?: { good: number; warning: number };
  /**
   * Libellé accessible. Par défaut « 87 sur 100 ».
   * `null` si un parent annonce déjà la valeur — la barre devient alors
   * décorative et n'est plus exposée deux fois aux lecteurs d'écran.
   */
  label?: string | null;
  /** Texte substitué à la valeur brute dans l'annonce (« 87 %, objectif 90 % »). */
  valueText?: string;
  /** Rôle ARIA — cf. `ProgressRole`. `meter` par défaut. */
  role?: ProgressRole;
  className?: string;
}

// ─── Composant ────────────────────────────────────────────────────────────────

/**
 * Barre de progression.
 *
 * Transposée du composant Figma `ProgressBar` (atome, niveaux Good / Warning /
 * Critical). Brique d'appui de la variante `target` de `KpiCard` : les quatre
 * cartes des maquettes en portent une.
 *
 * Le niveau ne se lit jamais à la seule couleur : la longueur du remplissage
 * porte la même information, et `aria-valuetext` la donne en toutes lettres.
 */
export function ProgressBar({
  value,
  max = 100,
  level,
  thresholds = { good: 0.9, warning: 0.6 },
  size = "md",
  label,
  valueText,
  role = "meter",
  className,
}: ProgressBarProps) {
  const clamped = Math.min(Math.max(value, 0), max);
  const fraction = max > 0 ? clamped / max : 0;

  const resolved: ProgressLevel =
    level ??
    (fraction >= thresholds.good
      ? "good"
      : fraction >= thresholds.warning
      ? "warning"
      : "critical");

  const formatted = clamped.toLocaleString("fr-FR", { maximumFractionDigits: 1 });
  const decorative = label === null;
  const accessibleLabel = decorative ? undefined : label ?? `${formatted} sur ${max}`;

  return (
    <div
      className={cn(trackVariants({ size }), className)}
      role={decorative ? undefined : role}
      aria-hidden={decorative ? true : undefined}
      aria-label={accessibleLabel}
      aria-valuenow={decorative ? undefined : clamped}
      aria-valuemin={decorative ? undefined : 0}
      aria-valuemax={decorative ? undefined : max}
      aria-valuetext={decorative ? undefined : valueText}
    >
      <div
        className="h-full rounded-full transition-[width] duration-300 motion-reduce:transition-none"
        style={{ width: `${fraction * 100}%`, background: FILL[resolved] }}
      />
    </div>
  );
}

export { trackVariants as progressBarVariants };
