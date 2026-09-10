import { forwardRef, useId, type InputHTMLAttributes, type ReactNode } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@registry/aikoz/lib/utils";

// ─── Variants ────────────────────────────────────────────────────────────────

const fieldVariants = cva(
  [
    "w-full rounded-[var(--radius)] bg-[var(--card)] text-foreground",
    "border border-[var(--input)]",
    "placeholder:text-[var(--muted-foreground)]",
    "transition-colors",
    "focus-visible:outline-none focus-visible:border-[var(--ring)]",
    "focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-1",
    "focus-visible:ring-offset-[var(--background)]",
    // `disabled` retire du parcours clavier ET de la soumission. Quand la
    // valeur doit rester lisible et envoyée, c'est `readOnly` qu'il faut —
    // il garde le champ focusable, donc découvrable.
    "disabled:cursor-not-allowed disabled:opacity-60",
    // L'état lecture seule est porté par un TRAIT TIRETÉ, pas par le fond :
    // --muted ne se détache pas de --card (1,00 à 1,19:1 selon la combinaison
    // registre × thème, strictement identique en produit sombre). Un état
    // signalé par un fond invisible n'est pas signalé du tout. Le tireté tient
    // sans dépendre d'un contraste, et le lecteur d'écran annonce readonly
    // nativement.
    "read-only:border-dashed read-only:bg-[var(--muted)] read-only:cursor-default",
  ],
  {
    variants: {
      size: {
        sm: "min-h-9 px-3 py-2 text-sm",
        md: "min-h-11 px-3.5 py-2.5 text-sm",
        lg: "min-h-12 px-4 py-3 text-base",
      },
      invalid: {
        true: "border-[var(--destructive-text)] focus-visible:border-[var(--destructive-text)] focus-visible:ring-[var(--destructive-text)]",
        false: "",
      },
    },
    defaultVariants: { size: "md", invalid: false },
  }
);

// ─── Types ────────────────────────────────────────────────────────────────────

export interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "size">,
    Pick<VariantProps<typeof fieldVariants>, "size"> {
  /**
   * Libellé visible et persistant. **Obligatoire** : un `placeholder` n'est pas
   * un libellé — il disparaît à la saisie, laissant l'utilisateur sans repère
   * sur ce qu'il est en train de remplir.
   */
  label: string;
  /**
   * Rend le libellé en `sr-only`. Réservé au champ de recherche, où la loupe et
   * le placeholder portent l'affordance visuelle. Partout ailleurs, un libellé
   * invisible prive les voyants d'un repère que les autres ont.
   */
  labelHidden?: boolean;
  /**
   * Consigne affichée AVANT le champ — format attendu, contrainte. Placée après,
   * elle arrive trop tard : l'utilisateur a déjà saisi.
   */
  description?: string;
  /**
   * Message d'erreur. Doit nommer le problème ET dire comment le corriger :
   * « Le nom doit faire au moins 2 caractères », pas « Champ invalide ».
   * Sa présence bascule le champ en `aria-invalid`.
   */
  error?: string;
  /** Icône décorative en tête de champ — la loupe d'une recherche. */
  leadingIcon?: ReactNode;
  /** Élément de fin de champ : unité, bouton d'effacement. */
  trailingSlot?: ReactNode;
  className?: string;
  /** Classe du conteneur, pour la mise en page. */
  wrapperClassName?: string;
}

// ─── Composant ────────────────────────────────────────────────────────────────

/**
 * Champ de saisie — les 4 états du composant Figma : défaut, focus, erreur,
 * désactivé.
 *
 * Ne valide rien de lui-même : c'est l'appelant qui décide quand. La règle à
 * suivre est de valider **à la sortie du champ**, jamais à la frappe — corriger
 * quelqu'un pendant qu'il écrit produit une erreur affichée dès le premier
 * caractère.
 *
 * Rappel des attributs à passer selon l'usage, ils changent le clavier affiché
 * sur mobile et débloquent le remplissage automatique (WCAG 1.3.5) :
 *
 *   nom d'agence   type="text"   autoComplete="organization"
 *   recherche      type="search" autoComplete="off"
 *   e-mail         type="email"  autoComplete="email"
 *   téléphone      type="tel"    autoComplete="tel"  inputMode="tel"
 *   code postal    type="text"   autoComplete="postal-code" inputMode="numeric"
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  {
    label,
    labelHidden = false,
    description,
    error,
    leadingIcon,
    trailingSlot,
    size = "md",
    required,
    id,
    className,
    wrapperClassName,
    ...props
  },
  ref
) {
  const generated = useId();
  const fieldId = id ?? `input-${generated}`;
  const descId = `${fieldId}-desc`;
  const errId = `${fieldId}-err`;

  const describedBy =
    [description ? descId : null, error ? errId : null].filter(Boolean).join(" ") ||
    undefined;

  return (
    <div className={cn("flex flex-col gap-1.5", wrapperClassName)}>
      <label
        htmlFor={fieldId}
        className={cn(
          "text-sm font-medium text-foreground",
          labelHidden && "sr-only"
        )}
      >
        {label}
        {required && (
          <>
            {/* L'astérisque est décoratif ; l'obligation est dite en toutes
                lettres, jamais portée par le seul symbole. */}
            <span aria-hidden="true" className="text-[var(--destructive-text)]">
              {" "}
              *
            </span>
            <span className="sr-only"> (obligatoire)</span>
          </>
        )}
      </label>

      {/* La consigne précède le champ — elle sert à le remplir, pas à le relire. */}
      {description && (
        <p id={descId} className="text-xs text-muted-foreground m-0">
          {description}
        </p>
      )}

      <div className="relative flex items-center">
        {leadingIcon && (
          <span
            className="absolute left-3 flex items-center text-muted-foreground pointer-events-none"
            aria-hidden="true"
          >
            {leadingIcon}
          </span>
        )}
        <input
          ref={ref}
          id={fieldId}
          required={required}
          aria-required={required || undefined}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          className={cn(
            fieldVariants({ size, invalid: !!error }),
            leadingIcon && "pl-9",
            trailingSlot && "pr-10",
            className
          )}
          {...props}
        />
        {trailingSlot && (
          <span className="absolute right-3 flex items-center">{trailingSlot}</span>
        )}
      </div>

      {/* role="alert" : l'erreur apparaît après coup, elle doit être annoncée
          sans que l'utilisateur ait à retourner la chercher. */}
      {error && (
        <p
          id={errId}
          role="alert"
          className="text-xs text-[var(--destructive-text)] m-0"
        >
          {error}
        </p>
      )}
    </div>
  );
});

export { fieldVariants as inputVariants };
