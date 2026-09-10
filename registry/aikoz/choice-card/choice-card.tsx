import { useId, type ReactNode } from "react";
import { cn } from "@registry/aikoz/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ChoiceCardProps {
  /** Libellé de l'option. Visible, toujours. */
  label: string;
  value: string;
  /**
   * `radio` — un seul choix dans le groupe. `checkbox` — plusieurs.
   * Ce n'est pas cosmétique : les deux ne se parcourent pas pareil au
   * clavier, et un lecteur d'écran annonce « bouton radio, 2 sur 5 » d'un
   * côté, « case à cocher, cochée » de l'autre.
   */
  type?: "radio" | "checkbox";
  /** Nom du groupe. Obligatoire pour un `radio` : c'est lui qui les relie. */
  name?: string;
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (checked: boolean) => void;
  /** Précision sous le libellé. Reliée par `aria-describedby`. */
  description?: string;
  /** Logo, icône, illustration. Décoratif — le libellé porte le sens. */
  visual?: ReactNode;
  /** Élément de fin de ligne : un `Badge` de compte, en général. */
  meta?: ReactNode;
  disabled?: boolean;
  /** Disposition interne. `tile` empile le visuel au-dessus du libellé. */
  layout?: "row" | "tile";
  className?: string;
}

// ─── Composant ────────────────────────────────────────────────────────────────

/**
 * Option présentée en carte — la brique de `ChoiceGroup`.
 *
 * **Sous la carte, il y a un vrai `<input>`.** Il n'est pas supprimé, il est
 * mis en `sr-only` : il reste focusable, il garde son rôle, il se coche à la
 * barre d'espace, et les flèches parcourent les radios du groupe sans qu'on
 * écrive une ligne de clavier. La carte n'est que le vêtement. Refaire tout
 * ça avec `role="radio"` sur un `<div>` est un classique — et un classique
 * qui rate presque toujours le parcours aux flèches.
 *
 * `sr-only` et **non** `display: none` ni `visibility: hidden` : ces deux-là
 * retirent l'élément de la tabulation. L'anneau de focus est reporté sur la
 * carte par `has-[:focus-visible]`, sinon le focus deviendrait invisible.
 *
 * **C'est la coche qui porte l'état, pas le trait.** Mesuré : le trait
 * retenu (`--ring`) et le trait non retenu (`--border-strong`) ne se
 * distinguent que de **1,30:1 en clair** — leurs teintes diffèrent, leurs
 * clartés non. Les deux passent largement 3:1 contre la carte, donc un audit
 * texte/fond ne signale rien ; mais l'information utile ici n'est pas
 * « y a-t-il un trait », c'est « lequel des deux ». La coche est une
 * différence de FORME, elle survit aux niveaux de gris et à la plupart des
 * dyschromatopsies. Le trait ne fait que renforcer, pour qui perçoit la
 * teinte. Retirer la coche casserait le composant (WCAG 1.4.1).
 */
export function ChoiceCard({
  label,
  value,
  type = "radio",
  name,
  checked,
  defaultChecked,
  onChange,
  description,
  visual,
  meta,
  disabled,
  layout = "row",
  className,
}: ChoiceCardProps) {
  const uid = useId();
  const descId = description ? `${uid}-desc` : undefined;

  return (
    <label
      className={cn(
        "relative flex cursor-pointer rounded-[var(--radius)] border bg-[var(--card)]",
        "transition-colors",
        // 44px au minimum même pour une option d'une ligne (WCAG 2.5.8).
        "min-h-11 p-4",
        layout === "tile"
          ? "flex-col items-center justify-center gap-2 text-center"
          : "flex-row items-start gap-3",
        // L'anneau de focus est reporté ici : l'input est en sr-only, le
        // focus doit rester visible quelque part.
        "has-[:focus-visible]:outline-none has-[:focus-visible]:ring-2",
        "has-[:focus-visible]:ring-[var(--ring)] has-[:focus-visible]:ring-offset-2",
        "has-[:focus-visible]:ring-offset-[var(--background)]",
        // `border-2` en permanence, seule la TEINTE change : faire passer le
        // trait de 1 à 2px à la sélection décalerait la carte d'un pixel, et
        // toute la grille avec elle.
        "border-2 border-[var(--border-strong)]",
        "has-[:checked]:border-[var(--ring)] has-[:checked]:bg-[var(--surface-hover)]",
        "hover:bg-[var(--surface-hover)]",
        disabled && "cursor-not-allowed opacity-60 hover:bg-transparent",
        className
      )}
    >
      <input
        type={type}
        name={name}
        value={value}
        checked={checked}
        defaultChecked={defaultChecked}
        disabled={disabled}
        aria-describedby={descId}
        onChange={(e) => onChange?.(e.target.checked)}
        className="peer sr-only"
      />

      {visual && (
        <span
          aria-hidden="true"
          className={cn(
            "shrink-0 inline-flex items-center justify-center",
            layout === "tile" ? "h-10" : "size-6"
          )}
        >
          {visual}
        </span>
      )}

      <span className={cn("flex flex-col gap-0.5 min-w-0", layout === "row" && "flex-1")}>
        <span className="text-sm font-medium text-foreground">{label}</span>
        {description && (
          <span id={descId} className="text-xs text-muted-foreground">
            {description}
          </span>
        )}
      </span>

      {meta && <span className="shrink-0">{meta}</span>}

      {/* La coche — LE canal qui porte l'état, cf. la note du composant :
          les deux teintes de trait ne se séparent que de 1,30:1 en clair.
          Décorative pour les technologies d'assistance, qui lisent déjà
          « coché » sur l'input. */}
      <span
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute right-2 top-2",
          "inline-flex size-4 items-center justify-center rounded-full",
          "bg-[var(--ring)] text-[var(--primary-foreground)]",
          // `peer-checked` : l'input porte `peer` et précède cette pastille
          // dans le même parent, c'est la seule condition du sélecteur.
          "opacity-0 peer-checked:opacity-100"
        )}
      >
        <svg viewBox="0 0 12 12" className="size-2.5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M2 6.5 4.8 9.2 10 3.5" />
        </svg>
      </span>
    </label>
  );
}
