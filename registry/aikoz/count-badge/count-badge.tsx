import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@registry/aikoz/lib/utils";

// ─── Variants ────────────────────────────────────────────────────────────────

const countBadgeVariants = cva(
  [
    "inline-flex items-center justify-center shrink-0",
    // `min-w` + `px` plutôt qu'une largeur fixe : un "9" reste un cercle, un
    // "12" ou "99" élargit la pastille en pilule au lieu de se faire couper —
    // même mécanique que le compteur de `NavItem`.
    "min-w-5 h-5 px-1 text-2xs font-semibold tabular-nums leading-none",
  ],
  {
    variants: {
      variant: {
        // Cercle plein — attire l'œil, pour un compte à traiter (colonne
        // Kanban). La couleur du remplissage est fixée par `tone`.
        count: ["rounded-full"],
        // Marqueur discret — un rang dans une liste, pas une alerte. Contour
        // fin plutôt qu'aplat, poids visuel volontairement plus bas ; carré
        // (coins arrondis) et non cercle, pour qu'on ne confonde jamais les
        // deux variantes au premier coup d'œil. Reprend l'état "à venir" du
        // `Stepper` : `--border-strong` / `--muted-foreground`. `tone` est
        // ignoré ici — un marqueur de rang reste sobre dans tous les cas.
        rank: [
          "rounded-[var(--radius)] border border-[var(--border-strong)]",
          "bg-transparent text-muted-foreground",
        ],
      },
      // N'affecte que `variant="count"` (cf. `compoundVariants`) — mesuré,
      // pas choisi à l'œil.
      //
      // `info` et `warning` passent du PLEIN au VOILÉ, et ce n'est pas une
      // question de goût. Ils posaient du blanc sur `--info` / `--warning`,
      // qui sont les rôles TEXTE. Ça tenait tant que ces rôles restaient
      // sombres en thème sombre ; relevés au seuil perceptuel ils
      // s'éclaircissent, et du blanc dessus ne tient plus.
      //
      // Un aplat dédié a été essayé puis retiré : mesuré, `status.warning`
      // ne marche avec AUCUN texte dans les deux thèmes (blanc 2,18:1 en
      // clair, encre 45 en APCA sombre pour `info`). Un jaune vif est un
      // mauvais fond de pastille, point.
      //
      // Le voile, lui, tient partout : `--warning` sur `--warning-subtle`
      // vaut APCA 83 en clair comme en sombre, `--info` 75 et 83. Et il
      // range la hiérarchie — `primary` et `error` restent pleins, ce qui
      // les distingue enfin d'un simple compteur d'information.
      tone: {
        primary: "",
        info: "",
        warning: "",
        error: "",
        neutral: "",
      },
    },
    compoundVariants: [
      { variant: "count", tone: "primary", class: "bg-[var(--primary)] text-[var(--primary-foreground)]" },
      { variant: "count", tone: "info", class: "bg-[var(--info-subtle)] text-[var(--info)]" },
      { variant: "count", tone: "warning", class: "bg-[var(--warning-subtle)] text-[var(--warning)]" },
      { variant: "count", tone: "error", class: "bg-[var(--destructive)] text-[var(--destructive-foreground)]" },
      // ── `neutral` : ce qui attend sans que rien n'aille mal ──────────────
      //
      // Il manquait, et son absence poussait à écrire `warning` pour « en
      // cours » : sur un tableau de quatre colonnes, un rouge et deux jaunes
      // donnent l'impression que rien ne va, alors qu'une seule colonne
      // signale vraiment un problème.
      //
      // `--neutral-fill` existait et n'était demandé par personne — le même
      // défaut que les contours de statut : un rôle publié qu'aucun
      // composant ne pouvait atteindre.
      //
      // CERNÉ, et c'est la troisième tentative — les deux premières sont
      // instructives.
      //
      // Plein d'abord, comme `error` : `--on-inverse` sur `--neutral-fill`
      // ne donne que 4,11 à 4,27:1 selon la marque, sous le seuil de 4,5.
      // Je l'avais calculé à 4,70 avec du blanc PUR ; `--on-inverse` n'est
      // pas blanc, et c'est l'audit qui me l'a appris.
      //
      // Voilé ensuite, comme `info` et `warning` : `--neutral-text` sur
      // `--muted` tient 6,16:1 en WCAG mais retombe à APCA 74 pour un seuil
      // de 75. `info` et `warning` s'en tirent parce qu'ils sont voilés sur
      // LEUR propre teinte pâle — `--info-subtle`, `--warning-subtle` — et
      // la famille neutre n'en a pas.
      //
      // Cerné, donc : fond de carte explicite et non hérité, encre à 85 de
      // APCA dessus, et un contour qui lui donne sa présence. Un compteur
      // cerné plutôt que plein dit aussi la bonne chose — ce qui attend
      // n'a pas à peser autant que ce qui presse.
      {
        variant: "count",
        tone: "neutral",
        class:
          "bg-[var(--card)] border border-[var(--border-strong)] text-[var(--neutral-text)]",
      },
    ],
    defaultVariants: { variant: "count", tone: "primary" },
  }
);

// ─── Types ────────────────────────────────────────────────────────────────────

export interface CountBadgeProps extends VariantProps<typeof countBadgeVariants> {
  /** Chiffre ou nombre court affiché, centré (1 à 2 caractères visés). */
  value: number | string;
  className?: string;
  /**
   * Précision lue par les lecteurs d'écran, **en plus** du contenu visible.
   * Même convention que `label` sur `Badge` : utile quand la pastille se
   * retrouve isolée (sans le titre de colonne ou la ligne de liste qui,
   * normalement, porte déjà le sens) — ex. `label="en attente"` pour que "7"
   * s'annonce "7 en attente" plutôt que "7" tout court.
   *
   * `null` quand un parent annonce déjà le nombre ET son sens (cas courant :
   * un en-tête de colonne qui dit "7 avis en attente", une ligne de liste qui
   * énonce son propre rang) — la pastille devient alors purement décorative,
   * comme le fait déjà la pastille inline de `NavItem`.
   */
  label?: string | null;
}

/**
 * `primary` — un compte qui ne dit rien de plus que son nombre.
 * `info`    — ce qui attend une lecture.
 * `warning` — ce qui cloche.
 * `error`   — ce qui presse.
 * `neutral` — ce qui est en cours, sans que rien n'aille mal.
 */
export type CountBadgeTone = "primary" | "info" | "warning" | "error" | "neutral";

// ─── Composant ────────────────────────────────────────────────────────────────

/**
 * Badge / pastille numérique — affiche un nombre court dans un repère visuel
 * compact : compte d'éléments en attente (`count`, cercle plein) ou indicateur
 * de rang (`rank`, marqueur discret). Cousin générique de la pastille inline
 * de `NavItem` (même idée de cercle rempli avec un chiffre), mais construit
 * sur les tokens `--primary` / `--border-strong` plutôt que sur les tokens de
 * navigation — utilisable partout : en-tête de colonne Kanban, liste numérotée.
 *
 * Purement informatif : ni cliquable, ni focusable, un seul état.
 *
 * Ne porte jamais seul l'information : `value` est toujours accompagné, dans
 * son contexte d'usage, d'un texte qui dit ce qui est compté ou classé — la
 * pastille n'a donc pas à dupliquer ce sens elle-même. Voir `label` pour le
 * cas où elle se retrouve isolée.
 */
export function CountBadge({
  value,
  variant = "count",
  tone = "primary",
  label,
  className,
}: CountBadgeProps) {
  const decorative = label === null;
  return (
    <span
      className={cn(countBadgeVariants({ variant, tone }), className)}
      aria-hidden={decorative ? true : undefined}
    >
      {value}
      {!decorative && label && <span className="sr-only"> {label}</span>}
    </span>
  );
}

export { countBadgeVariants };
