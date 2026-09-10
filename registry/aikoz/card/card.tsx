import { forwardRef, type ElementType, type HTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@registry/aikoz/lib/utils";

// ─── Variants ────────────────────────────────────────────────────────────────

const cardVariants = cva("flex flex-col bg-card text-card-foreground", {
  variants: {
    surface: {
      /** Carte standard, posée sur la page. */
      raised: "border border-border rounded-[var(--radius)] shadow-sm",
      /** Sans ombre — pour une grille dense où l'empilement d'ombres fatigue. */
      flat: "border border-border rounded-[var(--radius)]",
      /** Ni bord ni ombre : un simple regroupement, quand le conteneur cadre déjà. */
      bare: "rounded-[var(--radius)]",
    },
    density: {
      compact: "p-4 gap-2",
      default: "p-5 gap-3",
      large: "p-6 gap-4",
    },
  },
  defaultVariants: { surface: "raised", density: "default" },
});

export interface CardProps
  extends HTMLAttributes<HTMLElement>,
    VariantProps<typeof cardVariants> {
  /**
   * Élément rendu. `div` par défaut — mais une carte qui présente un contenu
   * autonome (un avis, un article) doit sortir en `article`, et une carte qui
   * regroupe une section nommée en `section`. Le choix est sémantique, pas
   * décoratif : il change les repères de navigation d'un lecteur d'écran.
   */
  as?: "div" | "article" | "section" | "li";
}

/**
 * Conteneur de carte.
 *
 * Volontairement sans sous-composants `Header` / `Title` / `Footer` : le
 * niveau de titre dépend du plan de la page, pas de la carte. Un `CardTitle`
 * qui figerait un `h3` casserait la hiérarchie dès qu'une carte est utilisée
 * ailleurs. C'est à l'appelant de poser le bon niveau.
 */
export const Card = forwardRef<HTMLElement, CardProps>(function Card(
  { as = "div", surface, density, className, ...props },
  ref
) {
  // `as` est polymorphe : les types d'événements diffèrent d'un élément à
  // l'autre (un HTMLLIElement n'est pas un HTMLDivElement). On type le
  // composant sur HTMLElement et on élargit ici, plutôt que d'imposer à
  // l'appelant des handlers spécifiques au div.
  const Tag = as as ElementType;
  return (
    <Tag
      ref={ref as never}
      className={cn(cardVariants({ surface, density }), className)}
      {...props}
    />
  );
});

export { cardVariants };
