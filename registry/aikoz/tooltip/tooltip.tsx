import { type ReactNode } from "react";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { cn } from "@registry/aikoz/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface TooltipProps {
  /**
   * Élément déclencheur. Il doit être **focusable au clavier** — un `button`,
   * un `a`, un champ. Une infobulle posée sur un `span` ou une icône inerte
   * n'existe que pour la souris.
   */
  children: ReactNode;
  /**
   * Contenu de l'infobulle. Court, et jamais indispensable — cf. la note du
   * composant. Du texte : pas de lien, pas de bouton (le contenu n'est pas
   * atteignable au clavier).
   */
  content: ReactNode;
  side?: "top" | "right" | "bottom" | "left";
  align?: "start" | "center" | "end";
  /** Délai avant apparition au survol. 300 ms par défaut. */
  delayDuration?: number;
  /** Contrôle externe, pour une démonstration ou un test. */
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  className?: string;
}

// ─── Composant ────────────────────────────────────────────────────────────────

/**
 * Infobulle.
 *
 * **La règle qui prime sur toutes les autres : une infobulle ne porte jamais
 * une information nécessaire.** Elle n'existe ni au tactile — où il n'y a pas
 * de survol —, ni à l'impression, ni pour qui navigue en zoom fort. Tout ce
 * dont l'utilisateur a besoin pour agir doit être lisible sans elle. Ce qu'elle
 * sert bien : une précision de confort — l'intitulé complet d'une colonne
 * abrégée, la définition d'un indicateur, la date exacte derrière « il y a 3 j ».
 *
 * Bâtie sur Radix, qui fournit les trois obligations de WCAG **1.4.13
 * (Content on Hover or Focus)** : l'infobulle se ferme sur **Échap** sans
 * déplacer le pointeur, elle reste ouverte quand le pointeur **passe dessus**,
 * et elle **persiste** tant que le survol ou le focus dure.
 *
 * Deux pièges que le composant ne peut pas rattraper à votre place :
 *
 * 1. **Un déclencheur désactivé n'émet aucun événement de pointeur** — sur un
 *    `<button disabled>`, l'infobulle ne s'ouvrira jamais. Or c'est précisément
 *    là qu'on veut expliquer pourquoi. Utiliser `aria-disabled` + un
 *    gestionnaire qui ne fait rien, plutôt que `disabled`.
 * 2. **Radix relie le contenu par `aria-describedby`, pas par `aria-label`.**
 *    Une infobulle ne NOMME donc pas son déclencheur : un bouton en icône seule
 *    a besoin de son propre `aria-label` en plus. Sans lui, il s'annonce
 *    « bouton », l'infobulle n'arrivant qu'après.
 *
 * **Attention au registre.** La bulle est rendu dans un `Portal`, donc à la
 * racine du document. Il hérite du registre et du thème posés sur `<html>` —
 * ce que fait l'architecture des tokens — mais **pas** d'un
 * `data-register="marketing"` posé sur un sous-arbre. Une comparaison
 * côte à côte des deux registres dans une même page verra donc sa bulle
 * rendu dans le registre de la page, pas dans celui de sa colonne.
 */
export function Tooltip({
  children,
  content,
  side = "top",
  align = "center",
  delayDuration = 300,
  open,
  defaultOpen,
  onOpenChange,
  className,
}: TooltipProps) {
  return (
    // Un Provider local rend le composant utilisable seul. En monter UN au
    // sommet de l'application reste préférable : c'est lui qui accorde le
    // « saut de délai » — la deuxième infobulle d'une même barre d'outils
    // s'ouvre alors sans attendre. Les Providers s'imbriquent sans conflit.
    <TooltipPrimitive.Provider delayDuration={delayDuration}>
      <TooltipPrimitive.Root
        open={open}
        defaultOpen={defaultOpen}
        onOpenChange={onOpenChange}
      >
        <TooltipPrimitive.Trigger asChild>{children}</TooltipPrimitive.Trigger>
        <TooltipPrimitive.Portal>
          <TooltipPrimitive.Content
            side={side}
            align={align}
            sideOffset={6}
            // `--popover` et non une inversion de `--foreground` : l'infobulle
            // est une surface flottante comme la modale, elle suit le même
            // rôle. L'inverser en sombre donnerait une pastille claire sur
            // fond sombre, seule de son espèce dans l'interface.
            className={cn(
              "z-50 max-w-xs rounded-[var(--radius)] px-3 py-2",
              "bg-[var(--popover)] text-[var(--popover-foreground)]",
              // Même raison que le panneau de `Select` : rien ne voile la page
              // derrière une infobulle, et `--popover` ne s'en détache que de
              // 1,09:1. Sans trait fort, la bulle est du texte posé dans le
              // vide. `--border-strong` : 4,44:1.
              "border border-[var(--border-strong)] shadow-lg",
              "text-xs leading-snug text-balance",
              "motion-safe:data-[state=delayed-open]:animate-in",
              "motion-safe:data-[state=closed]:animate-out",
              className
            )}
          >
            {content}
            <TooltipPrimitive.Arrow
              // `fill` sur la surface, `stroke` sur la bordure : sans le
              // second, la flèche apparaît comme une tache détachée du cadre.
              className="fill-[var(--popover)] stroke-[var(--border-strong)]"
              strokeWidth={1}
              width={10}
              height={5}
            />
          </TooltipPrimitive.Content>
        </TooltipPrimitive.Portal>
      </TooltipPrimitive.Root>
    </TooltipPrimitive.Provider>
  );
}

/**
 * À monter une fois au sommet de l'application. Il fait partager le délai
 * d'ouverture entre toutes les infobulles : une fois la première ouverte, les
 * suivantes n'attendent plus. Sans lui, chaque infobulle repart de zéro et
 * survoler une barre d'icônes devient une succession d'attentes.
 */
export const TooltipProvider = TooltipPrimitive.Provider;

export { TooltipPrimitive };
