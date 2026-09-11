import { type ReactNode } from "react";
import { SmartToy, Person } from "@material-symbols-svg/react/rounded";
import { cn } from "@registry/aikoz/lib/utils";
import { Badge } from "@registry/aikoz/badge/badge";
import { SkeletonText } from "@registry/aikoz/skeleton/skeleton";

// ─── Types ────────────────────────────────────────────────────────────────────

/** Origine de la réponse : générée par l'IA, ou rédigée par un opérateur humain. */
export type ReplyOrigin = "ai" | "operator";

export interface ReplyBubbleProps {
  /** Origine de la réponse — détermine le pictogramme et l'étiquette. */
  origin: ReplyOrigin;
  /** Texte de la réponse. Ignoré si `loading`. */
  children?: ReactNode;
  /**
   * Réponse en cours de génération : le texte est remplacé par un squelette.
   * « À confirmer » dans la spec de Louis — traitement volontairement simple,
   * réutilisant `SkeletonText` plutôt qu'un habillage dédié.
   */
  loading?: boolean;
  /** Nom de l'opérateur, affiché à côté de l'étiquette « Opérateur » si fourni. */
  operatorName?: string;
  className?: string;
}

const ORIGIN_LABEL: Record<ReplyOrigin, string> = {
  ai: "IA",
  operator: "Opérateur",
};

// Un seul canal distingue vraiment l'origine : le pictogramme + le libellé.
// Même ton de Badge, même fond — la variante « opérateur » existe (la spec de
// Louis demande confirmation, pas une esquisse), mais reste sobre : ce
// composant identifie une origine, il ne rejoue pas de hiérarchie visuelle.
const ORIGIN_ICON = {
  ai: SmartToy,
  operator: Person,
} as const;

// ─── Composant ────────────────────────────────────────────────────────────────

/**
 * Bulle de réponse — affichée sous l'avis correspondant, à l'intérieur d'une
 * future carte d'avis (`VerbatimCard` + réponse). Se compose comme un ENFANT
 * de carte : pas de bordure ni d'ombre propres, un simple liseré gauche sur
 * fond `--muted` (traitement « citation en creux »), pour rester subordonnée
 * à la carte qui l'accueille plutôt que rivaliser avec elle.
 *
 * L'origine ne tient jamais à la seule couleur : le pictogramme, porté par
 * `Badge`, y est décoratif (`aria-hidden`) — c'est le libellé « IA » /
 * « Opérateur », écrit en toutes lettres, qui porte l'information.
 *
 * Non cliquable en elle-même : dans le Kanban, c'est l'appelant qui bascule
 * vers un `Textarea` en édition. Ce composant n'a pas d'affordance d'édition.
 *
 * `loading` réutilise `SkeletonText` (cf. `skeleton.tsx`) plutôt qu'un
 * habillage dédié : le squelette reste muet aux technologies d'assistance,
 * c'est donc CE conteneur qui porte `aria-busy`.
 */
export function ReplyBubble({
  origin,
  children,
  loading = false,
  operatorName,
  className,
}: ReplyBubbleProps) {
  const Icon = ORIGIN_ICON[origin];

  return (
    <div
      className={cn(
        "w-full rounded-md",
        "border-l-2 border-l-border-strong",
        "bg-muted px-4 py-3",
        "flex flex-col gap-2",
        className
      )}
      aria-busy={loading || undefined}
    >
      <div className="flex items-center gap-2 flex-wrap">
        <Badge tone={origin === "ai" ? "info" : "neutral"} size="sm" icon={<Icon className="w-3 h-3" />}>
          {ORIGIN_LABEL[origin]}
        </Badge>
        {origin === "operator" && operatorName && (
          <span className="text-xs text-muted-foreground">{operatorName}</span>
        )}
      </div>

      {loading ? (
        <SkeletonText lines={2} />
      ) : (
        <p className="text-sm text-foreground leading-relaxed m-0">{children}</p>
      )}
    </div>
  );
}
