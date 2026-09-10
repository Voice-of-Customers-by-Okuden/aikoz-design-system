import { forwardRef, type ButtonHTMLAttributes } from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@registry/aikoz/lib/utils";

// ─── Variants ────────────────────────────────────────────────────────────────

const buttonVariants = cva(
  [
    "inline-flex items-center justify-center gap-2",
    "rounded-full font-medium",
    // Pas de `whitespace-nowrap` : avec lui, un libellé long sortait du
    // conteneur et se faisait rogner — un bouton qui découpe son propre
    // libellé est cassé, et sur mobile le texte disparaissait purement.
    // Le repli gracieux est le retour à la ligne : la pastille s'allonge,
    // ce qui signale au passage qu'il faut raccourcir l'intitulé.
    "max-w-full text-center text-balance",
    "transition-colors duration-150",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]",
    "focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]",
    "disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed",
  ],
  {
    variants: {
      variant: {
        default: [
          "bg-[var(--primary)] text-[var(--primary-foreground)]",
          "hover:bg-[color-mix(in_oklch,var(--primary),transparent_10%)] active:bg-[color-mix(in_oklch,var(--primary),transparent_20%)]",
        ],
        secondary: [
          "bg-[var(--secondary)] text-[var(--secondary-foreground)]",
          "hover:bg-[color-mix(in_oklch,var(--secondary),transparent_10%)] active:bg-[color-mix(in_oklch,var(--secondary),transparent_20%)]",
        ],
        outline: [
          "border border-[var(--border)] bg-transparent text-[var(--foreground)]",
          "hover:bg-[color-mix(in_oklch,var(--accent),transparent_88%)] active:bg-[color-mix(in_oklch,var(--accent),transparent_80%)]",
        ],
        ghost: [
          "bg-transparent text-[var(--foreground)]",
          "hover:bg-[color-mix(in_oklch,var(--accent),transparent_88%)] active:bg-[color-mix(in_oklch,var(--accent),transparent_80%)]",
        ],
      },
      size: {
        sm: "min-h-9 px-4 py-2 text-sm",
        md: "min-h-11 px-6 py-2.5 text-sm",
        lg: "min-h-12 px-8 py-3 text-base",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
);

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

// ─── Component ────────────────────────────────────────────────────────────────

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, type, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        ref={ref}
        className={cn(buttonVariants({ variant, size }), className)}
        /* Sans type explicite, un <button> dans un <form> vaut type="submit"
           et soumet le formulaire au moindre clic. Le défaut sûr est "button" ;
           un bouton de soumission le déclare. Ne s'applique pas à asChild, où
           l'élément rendu n'est pas forcément un bouton. */
        {...(asChild ? {} : { type: type ?? "button" })}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { buttonVariants };
