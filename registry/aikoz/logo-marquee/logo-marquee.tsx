import { cn } from "@registry/aikoz/lib/utils";
import { BrandLogo } from "@registry/aikoz/brand-logo/brand-logo";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface LogoMarqueeProps {
  /** Identifiants du registre `BrandLogo`. */
  brands: string[];
  /**
   * Ce que le bandeau démontre — **obligatoire**. « Assureurs analysés par
   * Aikoz », pas « Logos ». C'est le nom de la région, et c'est ce qu'un
   * lecteur d'écran annonce avant d'énumérer les marques.
   */
  label: string;
  /** Affiche le libellé au-dessus du bandeau. */
  showLabel?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

// ─── Composant ────────────────────────────────────────────────────────────────

/**
 * Bandeau de preuve client.
 *
 * **Il ne défile pas, et c'est une décision.** Un bandeau de logos qui glisse
 * en boucle est joli deux secondes et coûte cher ensuite : WCAG **2.2.2
 * (Pause, Stop, Hide)** impose un moyen de mettre en pause tout mouvement
 * automatique qui dure plus de cinq secondes — donc un bouton, donc un état,
 * donc un arrêt de tabulation de plus, pour une décoration. Et le mouvement
 * perpétuel gêne réellement les personnes sensibles au mouvement et celles
 * qui ont un trouble de l'attention, sans rien apporter à la démonstration :
 * la preuve, ce sont les marques, pas leur déplacement.
 *
 * Le bandeau passe donc à la ligne, ce qui règle aussi le reflow
 * (WCAG 1.4.10) sans effort.
 *
 * **C'est une liste, pas une suite d'images.** `<ul>` dans une `<section>`
 * nommée : un lecteur d'écran annonce « Assureurs analysés par Aikoz, liste
 * de 12 éléments », puis les marques. Une rangée de `<img>` ne dirait ni
 * combien il y en a, ni ce qu'elles font là.
 */
export function LogoMarquee({
  brands,
  label,
  showLabel = false,
  size = "md",
  className,
}: LogoMarqueeProps) {
  return (
    <section aria-label={label} className={cn("flex flex-col gap-3", className)}>
      {showLabel && (
        <p className="m-0 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {label}
        </p>
      )}
      <ul className="flex flex-wrap items-center gap-3 list-none m-0 p-0">
        {brands.map((b) => (
          <li key={b}>
            {/* Chaque logo garde son nom accessible : la marque EST
                l'information ici, elle n'est pas décorative. */}
            <BrandLogo brand={b} shape="plate" size={size} />
          </li>
        ))}
      </ul>
    </section>
  );
}
