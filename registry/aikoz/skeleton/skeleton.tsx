import { type HTMLAttributes } from "react";
import { cn } from "@registry/aikoz/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  /** Forme du bloc. `text` prend la hauteur d'une ligne, `circle` un rond. */
  shape?: "block" | "text" | "circle";
}

// ─── Composant ────────────────────────────────────────────────────────────────

/**
 * Bloc d'attente.
 *
 * **Il est intégralement invisible aux technologies d'assistance**, et ce
 * n'est pas un oubli : annoncer « rectangle gris » quatorze fois ne renseigne
 * personne. C'est au CONTENEUR de dire qu'un chargement est en cours, une
 * fois, par `aria-busy="true"` — et de dire ce qui a chargé une fois fini,
 * par une région live. Un squelette qui parle est un squelette qui bavarde.
 *
 * L'animation est coupée par `motion-reduce` : une pulsation permanente sur
 * toute une page déclenche des malaises chez les personnes sensibles au
 * mouvement (WCAG 2.3.3). Sans elle le bloc reste parfaitement lisible — il
 * n'a jamais porté d'information dans son mouvement.
 *
 * `--track` et non `--muted` : en thème sombre ce dernier vaut exactement
 * `--card`, le squelette y serait strictement invisible. C'est le même piège
 * que la piste de `ProgressBar`.
 */
export function Skeleton({ shape = "block", className, ...props }: SkeletonProps) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "bg-[var(--track)] motion-safe:animate-pulse",
        shape === "circle" && "rounded-full aspect-square",
        shape === "text" && "h-4 rounded-[calc(var(--radius)/2)]",
        shape === "block" && "rounded-[var(--radius)]",
        className
      )}
      {...props}
    />
  );
}

export interface SkeletonTextProps {
  /** Nombre de lignes. */
  lines?: number;
  className?: string;
}

/**
 * Paragraphe d'attente. La dernière ligne est plus courte — un bloc de
 * lignes toutes égales ne ressemble à aucun texte réel, et l'œil met plus
 * longtemps à comprendre qu'il regarde une attente.
 */
export function SkeletonText({ lines = 3, className }: SkeletonTextProps) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {Array.from({ length: lines }, (_, i) => (
        <Skeleton key={i} shape="text" className={i === lines - 1 ? "w-3/5" : "w-full"} />
      ))}
    </div>
  );
}
