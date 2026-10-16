import { useId } from "react";
import { cn } from "@registry/aikoz/lib/utils";

// ─── Niveaux ─────────────────────────────────────────────────────────────────
//
// Les mêmes trois que `ProgressBar`, et les mêmes tokens : une note de 4,2/5
// et un taux de réponse de 84 % doivent se lire du même vert, sinon
// l'utilisateur apprend deux grammaires pour une seule idée.
export type ScoreLevel = "good" | "warning" | "critical";

const TRAIT: Record<ScoreLevel, { arc: string; bord: string }> = {
  good: { arc: "var(--success-fill)", bord: "var(--success-fill-edge)" },
  warning: { arc: "var(--warning-fill)", bord: "var(--warning-fill-edge)" },
  critical: { arc: "var(--error-fill)", bord: "var(--error-fill-edge)" },
};

// ─── Types ───────────────────────────────────────────────────────────────────

export interface ScoreRingProps {
  /** Ce que la note mesure. Porté par `aria-label` ; visible via `description`. */
  label: string;
  value: number;
  /** Borne haute de l'échelle. 5 pour une note, 100 pour un pourcentage. */
  max?: number;
  /**
   * Seuils de déduction du niveau, en FRACTION de `max` — comme
   * `ProgressBar`. Exprimés en fraction et non en valeur absolue : les mêmes
   * seuils servent alors une note sur 5 et un taux sur 100.
   */
  thresholds?: { good: number; warning: number };
  /**
   * Force le niveau. À n'employer que quand « moins » est un progrès — un
   * délai de réponse sous l'objectif est une bonne nouvelle, et la fraction
   * seule conclurait l'inverse.
   */
  level?: ScoreLevel;
  /** Mise en forme du nombre au centre. Par défaut, la valeur telle quelle. */
  formatValue?: (v: number) => string;
  /** Ligne de contexte sous l'anneau — « Votre note · Google ». Ce n'est PAS un
   * `description` : ce mot désigne dans ce système le nom accessible d'un jeu de
   * données, et `audit:conventions` le fait respecter. */
  description?: string;
  /** Diamètre en pixels. 96 par défaut. */
  size?: number;
  className?: string;
}

// ─── Composant ───────────────────────────────────────────────────────────────

/**
 * Une note unique sur son anneau — « 4,90 » dans un cercle qui se remplit.
 *
 * **Pourquoi ni `ProgressBar` ni `DonutChart`.** La barre rend la même mesure,
 * mais à plat : dans une carte de synthèse où la note EST le sujet, une barre
 * se lit comme un détail et un anneau comme un titre. Le donut, lui, répartit
 * un total entre plusieurs parts ; ici il n'y a qu'une valeur et son reste,
 * et lui passer deux parts dont une « vide » mentirait sur la nature de la
 * donnée.
 *
 * **Le niveau ne tient jamais à la seule couleur.** La longueur de l'arc porte
 * la même information, le nombre est écrit au centre, et `aria-valuetext` le
 * donne en toutes lettres. Un œil qui ne distingue pas le vert du rouge lit
 * la note.
 *
 * **`meter`, pas `progressbar`.** Une note est une mesure dans une échelle
 * connue, pas l'avancement d'une tâche — même raisonnement que `ProgressBar`,
 * dont il reprend le rôle par défaut.
 */
export function ScoreRing({
  label,
  value,
  max = 5,
  thresholds = { good: 0.8, warning: 0.5 },
  level,
  formatValue,
  description,
  size = 96,
  className,
}: ScoreRingProps) {
  const id = useId();
  const borne = Math.min(Math.max(value, 0), max);
  const part = max > 0 ? borne / max : 0;

  const niveau: ScoreLevel =
    level ??
    (part >= thresholds.good ? "good" : part >= thresholds.warning ? "warning" : "critical");

  // L'épaisseur suit le diamètre : un anneau de 48 px avec un trait de 8 px
  // n'a plus de centre pour son nombre, un anneau de 160 px avec le même
  // trait devient un filet.
  const trait = Math.max(4, Math.round(size * 0.085));
  const rayon = (size - trait) / 2;
  const perimetre = 2 * Math.PI * rayon;
  const affiche = formatValue ? formatValue(borne) : String(borne);

  return (
    <div className={cn("inline-flex flex-col items-center gap-2", className)}>
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          role="meter"
          aria-label={label}
          aria-valuenow={borne}
          aria-valuemin={0}
          aria-valuemax={max}
          aria-valuetext={`${affiche} sur ${max}`}
          aria-describedby={description ? id : undefined}
          // L'arc part du haut, comme une horloge : un anneau qui commence à
          // droite se lit comme s'il était déjà entamé.
          className="-rotate-90"
        >
          <circle
            cx={size / 2}
            cy={size / 2}
            r={rayon}
            fill="none"
            stroke="var(--muted)"
            strokeWidth={trait}
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={rayon}
            fill="none"
            stroke={TRAIT[niveau].arc}
            strokeWidth={trait}
            strokeLinecap="round"
            strokeDasharray={perimetre}
            strokeDashoffset={perimetre * (1 - part)}
          />
          {/* Le contour porte le 3:1 là où l'aplat ne peut pas — même dette
              que la jauge de `ProgressBar`, et même solution. */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={rayon + trait / 2}
            fill="none"
            stroke={TRAIT[niveau].bord}
            strokeWidth={1}
          />
        </svg>
        <span
          aria-hidden="true"
          className="absolute inset-0 grid place-items-center font-sans font-bold tabular-nums leading-none text-foreground"
          style={{ fontSize: Math.round(size * 0.26) }}
        >
          {affiche}
        </span>
      </div>
      {description && (
        <span id={id} className="text-xs text-muted-foreground">
          {description}
        </span>
      )}
    </div>
  );
}
